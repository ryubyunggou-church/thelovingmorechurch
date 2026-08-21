import { useCallback, useEffect, useState } from 'react'
import { useAdminStore } from '../../store/admin-store'
import type { AdminDoc } from '../../types/content'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { FormField } from '../../components/ui/form-field'
import { Input } from '../../components/ui/input'
import { PasswordInput } from '../../components/ui/password-input'
import { Button } from '../../components/ui/button'

const MIN_PASSWORD_LENGTH = 6

export function AdminManageModal() {
  const open = useAdminStore((s) => s.adminManageOpen)
  const setOpen = useAdminStore((s) => s.setAdminManageOpen)
  const listAdmins = useAdminStore((s) => s.listAdmins)
  const addSubAdmin = useAdminStore((s) => s.addSubAdmin)
  const removeSubAdminLocal = useAdminStore((s) => s.removeSubAdminLocal)
  const pushToast = useAdminStore((s) => s.pushToast)
  const [admins, setAdmins] = useState<AdminDoc[]>([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    try {
      setAdmins(await listAdmins())
    } catch {
      setAdmins([])
    }
  }, [listAdmins])

  useEffect(() => {
    if (open) void refresh()
  }, [open, refresh])

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.trim().length < MIN_PASSWORD_LENGTH) {
      pushToast({
        title: '부관리자 등록 실패',
        description: `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`,
        variant: 'error',
      })
      return
    }
    setLoading(true)
    try {
      await addSubAdmin(email.trim(), password.trim())
      setEmail('')
      setPassword('')
      await refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : '등록 실패'
      pushToast({ title: '부관리자 등록 실패', description: message, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const onRemove = async (uid: string) => {
    setLoading(true)
    try {
      await removeSubAdminLocal(uid)
      await refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : '해제 실패'
      pushToast({ title: '부관리자 해제 실패', description: message, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const subCount = admins.filter((a) => a.role === 'sub').length

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[min(92vw,36rem)]">
        <DialogHeader>
          <DialogTitle>관리자 관리</DialogTitle>
          <DialogDescription>
            최고관리자 전용 · 부관리자 최대 3명 (현재 {subCount}/3). Cloud Function(addSubAdmin)이
            이메일의 Auth 계정을 찾아 연결하고, 없으면 입력한 비밀번호로 새 계정을 만듭니다.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={(e) => void onAdd(e)}>
          <FormField
            label="부관리자 이메일"
            htmlFor="sub-admin-email"
            hint="이미 Auth 계정이 있으면 비밀번호는 무시하고 그대로 연결합니다"
          >
            <Input
              id="sub-admin-email"
              type="email"
              autoComplete="off"
              placeholder="sub@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormField>
          <FormField
            label="비밀번호"
            htmlFor="sub-admin-password"
            hint={`신규 계정 생성 시에만 사용 · ${MIN_PASSWORD_LENGTH}자 이상`}
          >
            <PasswordInput
              id="sub-admin-password"
              autoComplete="new-password"
              placeholder={`${MIN_PASSWORD_LENGTH}자 이상`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormField>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading || subCount >= 3}>
              초대 등록
            </Button>
          </div>
        </form>

        <div className="mt-2">
          <p className="mb-2 text-sm font-medium text-paper-text">등록된 관리자</p>
          <ul className="divide-y divide-paper-line rounded-lg border border-paper-line">
            {admins.length === 0 ? (
              <li className="px-4 py-3 text-sm text-paper-muted">
                등록된 관리자가 없거나 조회에 실패했습니다.
              </li>
            ) : (
              admins.map((a) => (
                <li key={a.uid} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-paper-text">{a.email || a.uid}</p>
                    <p className="text-xs text-paper-muted">
                      {a.role === 'super' ? '최고관리자' : '부관리자'}
                    </p>
                  </div>
                  {a.role === 'sub' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={loading}
                      onClick={() => void onRemove(a.uid)}
                    >
                      해제
                    </Button>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
