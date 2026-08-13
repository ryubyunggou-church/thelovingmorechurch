/**
 * Cloud Functions stubs for production hardening.
 * Deploy after enabling Blaze plan + Admin SDK service account.
 *
 * - sanitizeNewsHtml: server-side DOMPurify on news create/update
 * - addSubAdmin / removeSubAdmin: super-only, max 3 sub-admins
 * - rate limit helpers for future public forms
 */
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { onDocumentWritten } from 'firebase-functions/v2/firestore'
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import DOMPurify from 'isomorphic-dompurify'

initializeApp()
const db = getFirestore()

async function assertSuper(uid: string) {
  const snap = await db.collection('admins').doc(uid).get()
  if (!snap.exists || snap.data()?.role !== 'super') {
    throw new HttpsError('permission-denied', '최고관리자만 수행할 수 있습니다.')
  }
}

export const addSubAdmin = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', '로그인이 필요합니다.')
  await assertSuper(request.auth.uid)

  const email = String(request.data?.email ?? '')
    .trim()
    .toLowerCase()
  if (!email) throw new HttpsError('invalid-argument', '이메일이 필요합니다.')

  const subs = await db.collection('admins').where('role', '==', 'sub').get()
  if (subs.size >= 3) {
    throw new HttpsError('failed-precondition', '부관리자는 최대 3명까지 등록 가능합니다')
  }

  let user
  try {
    user = await getAuth().getUserByEmail(email)
  } catch {
    throw new HttpsError(
      'not-found',
      '해당 이메일로 Firebase Auth 계정이 없습니다. 먼저 계정을 생성한 뒤 초대해 주세요.',
    )
  }

  await db.collection('admins').doc(user.uid).set({
    email,
    role: 'sub',
    invitedBy: request.auth.uid,
    createdAt: new Date().toISOString(),
  })

  return { ok: true, uid: user.uid }
})

export const removeSubAdmin = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', '로그인이 필요합니다.')
  await assertSuper(request.auth.uid)

  const uid = String(request.data?.uid ?? '')
  if (!uid) throw new HttpsError('invalid-argument', 'uid가 필요합니다.')
  if (uid === request.auth.uid) {
    throw new HttpsError('failed-precondition', '최고관리자 본인 계정은 삭제할 수 없습니다.')
  }

  const snap = await db.collection('admins').doc(uid).get()
  if (!snap.exists) throw new HttpsError('not-found', '관리자 문서가 없습니다.')
  if (snap.data()?.role === 'super') {
    throw new HttpsError('failed-precondition', '최고관리자는 삭제할 수 없습니다.')
  }

  await db.collection('admins').doc(uid).delete()
  return { ok: true }
})

export const sanitizeNewsOnWrite = onDocumentWritten('newsPosts/{id}', async (event) => {
  const after = event.data?.after
  if (!after?.exists) return
  const data = after.data()
  if (!data) return
  const raw = String(data.contentHtml ?? '')
  const clean = DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      's',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'a',
      'img',
      'blockquote',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'span',
      'div',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class', 'style', 'colspan', 'rowspan'],
  })
  if (clean !== raw) {
    await after.ref.update({
      contentHtml: clean,
      sanitizedAt: FieldValue.serverTimestamp(),
    })
  }
})
