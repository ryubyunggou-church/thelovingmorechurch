import { useEffect, useState } from 'react'
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
import { Button } from '../../components/ui/button'

export function AdminManageModal() {
  const open = useAdminStore((s) => s.adminManageOpen)
  const setOpen = useAdminStore((s) => s.setAdminManageOpen)
  const listAdmins = useAdminStore((s) => s.listAdmins)
  const addSubAdminLocal = useAdminStore((s) => s.addSubAdminLocal)
  const removeSubAdminLocal = useAdminStore((s) => s.removeSubAdminLocal)
  const pushToast = useAdminStore((s) => s.pushToast)
  const [admins, setAdmins] = useState<AdminDoc[]>([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const refresh = async () => {
    try {
      setAdmins(await listAdmins())
    } catch {
      setAdmins([])
    }
  }

  useEffect(() => {
    if (open) void refresh()
  }, [open])

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addSubAdminLocal(email.trim())
      setEmail('')
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
            최고관리자 전용 · 부관리자 최대 3명 (현재 {subCount}/3). 운영 환경에서는 Cloud Functions로
            총원 제한을 강제합니다.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={(e) => void onAdd(e)}>
          <FormField
            label="부관리자 이메일"
            htmlFor="sub-admin-email"
            hint="초대할 계정의 이메일. Auth 계정이 있어야 최종 로그인 가능 (운영 시 Cloud Function 권장)"
          >
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="sub-admin-email"
                type="email"
                placeholder="sub@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={loading || subCount >= 3} className="shrink-0">
                초대 등록
              </Button>
            </div>
          </FormField>
        </form>

        <div className="mt-2">
          <p className="mb-2 text-sm font-medium text-ink">등록된 관리자</p>
          <ul className="divide-y divide-stone rounded-lg border border-stone">
            {admins.length === 0 ? (
              <li className="px-4 py-3 text-sm text-ink-muted">
                등록된 관리자가 없거나 조회에 실패했습니다.
              </li>
            ) : (
              admins.map((a) => (
                <li key={a.uid} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{a.email || a.uid}</p>
                    <p className="text-xs text-ink-muted">
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
