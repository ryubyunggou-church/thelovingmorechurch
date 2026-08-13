import { create } from 'zustand'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../lib/firebase'
import type { AdminDoc, AdminRole } from '../types/content'

interface ToastItem {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'success' | 'error'
}

interface AdminState {
  user: User | null
  admin: AdminDoc | null
  isAdminMode: boolean
  loading: boolean
  loginOpen: boolean
  adminManageOpen: boolean
  toasts: ToastItem[]
  setLoginOpen: (open: boolean) => void
  setAdminManageOpen: (open: boolean) => void
  initAuth: () => () => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  pushToast: (toast: Omit<ToastItem, 'id'>) => void
  dismissToast: (id: string) => void
  listAdmins: () => Promise<AdminDoc[]>
  addSubAdminLocal: (email: string) => Promise<void>
  removeSubAdminLocal: (uid: string) => Promise<void>
}

function mapAuthError(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = String((err as { code: string }).code)
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
      return '이메일 또는 비밀번호가 올바르지 않습니다. Authentication에 등록된 이메일/비밀번호인지 확인해 주세요.'
    }
    if (code === 'auth/too-many-requests') {
      return '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.'
    }
    if (code === 'auth/network-request-failed') {
      return '네트워크 오류입니다. 연결을 확인해 주세요.'
    }
    if (code === 'auth/operation-not-allowed') {
      return '이메일/비밀번호 로그인이 Firebase Authentication에서 비활성화되어 있습니다.'
    }
    if (code === 'permission-denied' || code === 'firestore/permission-denied') {
      return 'Firestore 권한 오류입니다. firestore.rules 배포와 admins/{uid} 문서를 확인해 주세요.'
    }
  }
  if (err instanceof Error) return err.message
  return '로그인에 실패했습니다.'
}

/**
 * admins/{authUid} 문서로 관리자 여부 확인.
 * 문서 ID 는 반드시 Firebase Auth UID 여야 함 (invite_… 같은 임시 ID는 로그인에 사용 불가).
 */
async function resolveAdmin(user: User): Promise<AdminDoc | null> {
  if (!db) {
    throw new Error('Firestore가 초기화되지 않았습니다. .env Firebase 설정을 확인해 주세요.')
  }
  try {
    const snap = await getDoc(doc(db, 'admins', user.uid))
    if (!snap.exists()) return null
    const data = snap.data()
    return {
      uid: user.uid,
      email: String(data.email ?? user.email ?? ''),
      role: (data.role as AdminRole) ?? 'sub',
      invitedBy: data.invitedBy ? String(data.invitedBy) : undefined,
      createdAt: String(data.createdAt ?? ''),
    }
  } catch (err: unknown) {
    // 권한 오류를 null 과 구분 — 로그인 실패 원인을 정확히 안내
    const code =
      err && typeof err === 'object' && 'code' in err ? String((err as { code: string }).code) : ''
    if (code === 'permission-denied' || code === 'firestore/permission-denied') {
      throw new Error(
        'admins 컬렉션 읽기 권한이 없습니다. Firestore 규칙에 admins 읽기(isSignedIn)가 배포됐는지 확인해 주세요.',
      )
    }
    throw err
  }
}

export const useAdminStore = create<AdminState>((set, get) => ({
  user: null,
  admin: null,
  isAdminMode: false,
  loading: true,
  loginOpen: false,
  adminManageOpen: false,
  toasts: [],

  setLoginOpen: (open) => set({ loginOpen: open }),
  setAdminManageOpen: (open) => set({ adminManageOpen: open }),

  initAuth: () => {
    if (!auth || !isFirebaseConfigured) {
      set({ loading: false, user: null, admin: null, isAdminMode: false })
      return () => undefined
    }
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        set({ user: null, admin: null, isAdminMode: false, loading: false })
        return
      }
      try {
        const admin = await resolveAdmin(user)
        set({
          user,
          admin,
          isAdminMode: Boolean(admin),
          loading: false,
        })
        // Auth 는 됐지만 admins 문서가 없으면 세션 정리 (유령 로그인 방지)
        if (!admin && auth) {
          await signOut(auth)
          set({ user: null, admin: null, isAdminMode: false, loading: false })
        }
      } catch {
        // 권한/네트워크 오류 시 강제 로그아웃아웃하지 않고 로딩만 종료
        // (일시적 rules 오류로 세션이 날아가는 것 방지)
        set({ user, admin: null, isAdminMode: false, loading: false })
      }
    })
    return unsub
  },

  login: async (email, password) => {
    if (!auth) throw new Error('Firebase Auth가 설정되지 않았습니다. .env 를 확인해 주세요.')
    if (!isFirebaseConfigured) {
      throw new Error('Firebase 설정이 없습니다. VITE_FIREBASE_* 환경변수를 확인해 주세요.')
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password)
      let admin: AdminDoc | null
      try {
        admin = await resolveAdmin(cred.user)
      } catch (err) {
        await signOut(auth)
        throw err instanceof Error ? err : new Error(mapAuthError(err))
      }
      if (!admin) {
        await signOut(auth)
        throw new Error(
          `관리자 권한이 없습니다. Firestore admins/${cred.user.uid} 문서가 있는지 확인하세요. (문서 ID = Auth UID, role: super)`,
        )
      }
      set({ user: cred.user, admin, isAdminMode: true, loginOpen: false, loading: false })
      get().pushToast({ title: '관리자 로그인 완료', variant: 'success' })
    } catch (err) {
      // 이미 우리가 throw 한 메시지 유지
      if (err instanceof Error && (
        err.message.includes('관리자')
        || err.message.includes('admins')
        || err.message.includes('Firestore')
        || err.message.includes('Firebase')
      )) {
        throw err
      }
      throw new Error(mapAuthError(err))
    }
  },

  logout: async () => {
    if (auth) await signOut(auth)
    set({ user: null, admin: null, isAdminMode: false })
    get().pushToast({ title: '로그아웃되었습니다', variant: 'default' })
  },

  pushToast: (toast) => {
    const id = crypto.randomUUID()
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }))
    window.setTimeout(() => get().dismissToast(id), 3500)
  },

  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  listAdmins: async () => {
    if (!db) return []
    const snap = await getDocs(collection(db, 'admins'))
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        uid: d.id,
        email: String(data.email ?? ''),
        role: (data.role as AdminRole) ?? 'sub',
        invitedBy: data.invitedBy ? String(data.invitedBy) : undefined,
        createdAt: String(data.createdAt ?? ''),
      }
    })
  },

  addSubAdminLocal: async (email) => {
    const { admin, listAdmins, pushToast } = get()
    if (!db || !admin || admin.role !== 'super') {
      throw new Error('최고관리자만 부관리자를 등록할 수 있습니다.')
    }
    const admins = await listAdmins()
    const subCount = admins.filter((a) => a.role === 'sub').length
    if (subCount >= 3) {
      throw new Error('부관리자는 최대 3명까지 등록 가능합니다')
    }
    const id = `invite_${btoa(email).replace(/=+/g, '')}`
    const { setDoc, doc: fsDoc } = await import('firebase/firestore')
    await setDoc(fsDoc(db, 'admins', id), {
      email,
      role: 'sub',
      invitedBy: admin.uid,
      createdAt: new Date().toISOString(),
      pending: true,
    })
    pushToast({ title: '부관리자 초대 등록', description: email, variant: 'success' })
  },

  removeSubAdminLocal: async (uid) => {
    const { admin, pushToast } = get()
    if (!db || !admin || admin.role !== 'super') {
      throw new Error('최고관리자만 부관리자를 해제할 수 있습니다.')
    }
    if (uid === admin.uid) throw new Error('최고관리자 본인 계정은 삭제할 수 없습니다.')
    const { deleteDoc, doc: fsDoc } = await import('firebase/firestore')
    await deleteDoc(fsDoc(db, 'admins', uid))
    pushToast({ title: '부관리자가 해제되었습니다', variant: 'success' })
  },
}))
