import { useState } from 'react'
import { useAdminStore } from '../../store/admin-store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { FormField } from '../../components/ui/form-field'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'

export function LoginModal() {
  const open = useAdminStore((s) => s.loginOpen)
  const setLoginOpen = useAdminStore((s) => s.setLoginOpen)
  const login = useAdminStore((s) => s.login)
  const pushToast = useAdminStore((s) => s.pushToast)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await login(email.trim(), password)
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그인에 실패했습니다.'
      pushToast({ title: '로그인 실패', description: message, variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setLoginOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>관리자 로그인</DialogTitle>
          <DialogDescription>
            Firebase Authentication 이메일/비밀번호. Firestore admins 컬렉션에 등록된 계정만 관리자
            모드가 활성화됩니다.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
          <FormField
            label="이메일"
            htmlFor="admin-email"
            required
            hint="Authentication에 등록된 관리자 이메일"
          >
            <Input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormField>
          <FormField
            label="비밀번호"
            htmlFor="admin-password"
            required
            hint="Google 계정 비밀번호가 아닌, Auth에 설정한 비밀번호"
          >
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormField>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? '로그인 중…' : '로그인'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
