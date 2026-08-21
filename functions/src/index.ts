/**
 * Cloud Functions stubs for production hardening.
 * Deploy after enabling Blaze plan + Admin SDK service account.
 *
 * - sanitizeNewsHtml: server-side DOMPurify on news create/update
 * - addSubAdmin / removeSubAdmin: super-only, max 3 sub-admins
 * - rate limit helpers for future public forms
 */
import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https'
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
  const password = String(request.data?.password ?? '')
  if (!email) throw new HttpsError('invalid-argument', '이메일이 필요합니다.')

  const subs = await db.collection('admins').where('role', '==', 'sub').get()
  if (subs.size >= 3) {
    throw new HttpsError('failed-precondition', '부관리자는 최대 3명까지 등록 가능합니다')
  }

  // 해당 이메일의 Auth 계정이 이미 있으면 그대로 쓰고, 없으면 비밀번호로 새로 만든다
  // (클라이언트 SDK는 타인 명의 Auth 계정을 만들 수 없어 Admin SDK가 필요한 지점).
  let user
  try {
    user = await getAuth().getUserByEmail(email)
  } catch {
    if (password.length < 6) {
      throw new HttpsError(
        'invalid-argument',
        '해당 이메일의 계정이 없습니다. 6자 이상의 비밀번호를 입력해 새 계정을 만들어 주세요.',
      )
    }
    try {
      user = await getAuth().createUser({ email, password })
    } catch (err) {
      const code = err instanceof Object && 'code' in err ? String(err.code) : ''
      if (code === 'auth/email-already-exists') {
        user = await getAuth().getUserByEmail(email)
      } else {
        throw new HttpsError('internal', 'Auth 계정 생성에 실패했습니다.')
      }
    }
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

/**
 * 노회 관리자 포털(별도 Firebase 프로젝트) 연동용 신원 확인 엔드포인트.
 *
 * tlmchurch의 서비스 계정 키를 노회 프로젝트에 그대로 넘기지 않기 위한 브로커 —
 * 호출자가 진짜 tlmchurch 관리자인지 이 함수(=tlmchurch 소유 코드)만 판단하고,
 * 결과만 노회 쪽에 알려준다. tlmchurch의 Firestore/Storage 자체에는 노회 프로젝트가
 * 직접 접근하지 않는다.
 *
 * 사용법: `Authorization: Bearer <tlmchurch ID 토큰>` 헤더로 GET/POST 호출.
 * ID 토큰 검증이 실질적인 보안 경계라 CORS는 느슨하게(`*`) 열어둔다 — 노회 포털
 * 프론트엔드가 tlmchurch Firebase 설정(공개 값)으로 별도 로그인 후 이 엔드포인트를
 * 직접 호출하는 시나리오를 염두에 둠. 노회 프로젝트 도메인이 정해지면 필요시
 * ALLOWED_ORIGINS로 좁혀도 된다.
 */
export const verifyPresbyteryAdmin = onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  const match = /^Bearer (.+)$/.exec(String(req.headers.authorization ?? ''))
  if (!match) {
    res.status(401).json({ verified: false, error: 'Authorization: Bearer <idToken> 헤더가 필요합니다.' })
    return
  }

  // Firebase ID 토큰은 항상 "header.payload.signature" 형태의 JWT다 — 이 모양이 아닌
  // 값은 검증 없이 즉시 거부해 verifyIdToken()의 네트워크 왕복(Google 공개키 조회)이
  // 임의 문자열 남용에 낭비되는 걸 막는다. (본격적인 요청 제한은 아니지만 저비용 방어.)
  const token = match[1]
  if (!/^[\w-]+\.[\w-]+\.[\w-]+$/.test(token)) {
    res.status(401).json({ verified: false, error: '유효하지 않은 토큰 형식입니다.' })
    return
  }

  let decoded
  try {
    decoded = await getAuth().verifyIdToken(token)
  } catch (err) {
    console.warn('[verifyPresbyteryAdmin] verifyIdToken 실패:', err)
    res.status(401).json({ verified: false, error: '유효하지 않거나 만료된 토큰입니다.' })
    return
  }

  try {
    const snap = await db.collection('admins').doc(decoded.uid).get()
    if (!snap.exists) {
      res.status(403).json({ verified: false, error: '관리자 권한이 없습니다.' })
      return
    }
    const data = snap.data() ?? {}
    res.status(200).json({
      verified: true,
      uid: decoded.uid,
      email: String(data.email ?? decoded.email ?? ''),
      role: (data.role as string) ?? 'sub',
      churchId: 'tlmchurch',
      issuedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[verifyPresbyteryAdmin] admins 조회 실패:', err)
    res.status(500).json({ verified: false, error: '서버 내부 오류로 확인에 실패했습니다.' })
  }
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
