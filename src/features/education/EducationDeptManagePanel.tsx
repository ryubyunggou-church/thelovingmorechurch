import { useEffect, useRef, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { EducationDepartment } from '../../types/content'
import { Button } from '../../components/ui/button'
import { removeDocument, saveDocument } from '../../lib/content-service'
import { createBlankEducationDept, isDefaultEducationDept } from '../../lib/education-order'
import { cn } from '../../lib/utils'
import { useAdminStore } from '../../store/admin-store'

interface Props {
  depts: EducationDepartment[]
  onUpdated: () => void
}

const CONFIRM_TIMEOUT_MS = 4000

/** 관리자 전용 마지막 탭 — 부서 추가(빈 부서 생성 후 해당 탭에서 개별 편집) / 부서 삭제(추가된 부서만). */
export function EducationDeptManagePanel({ depts, onUpdated }: Props) {
  const pushToast = useAdminStore((s) => s.pushToast)
  const [adding, setAdding] = useState(false)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (confirmTimer.current) clearTimeout(confirmTimer.current)
    }
  }, [])

  const addDept = async () => {
    setAdding(true)
    try {
      const nextOrder = depts.length > 0 ? Math.max(...depts.map((d) => d.order)) + 1 : 1
      const blank = createBlankEducationDept(nextOrder)
      await saveDocument('educationDepartments', blank.id, {
        deptKey: blank.deptKey,
        name: blank.name,
        missionText: blank.missionText,
        image: blank.image,
        scheduleInfo: blank.scheduleInfo,
        targetAge: blank.targetAge,
        place: blank.place,
        order: blank.order,
      })
      pushToast({
        title: '새 부서가 추가되었습니다',
        description: '새로 생긴 탭에서 내용을 입력해 주세요.',
        variant: 'success',
      })
      onUpdated()
    } catch (err) {
      pushToast({
        title: '부서 추가 실패',
        description: err instanceof Error ? err.message : '',
        variant: 'error',
      })
    } finally {
      setAdding(false)
    }
  }

  const requestDelete = (id: string) => {
    if (confirmingId === id) {
      void doDelete(id)
      return
    }
    setConfirmingId(id)
    if (confirmTimer.current) clearTimeout(confirmTimer.current)
    confirmTimer.current = setTimeout(() => setConfirmingId(null), CONFIRM_TIMEOUT_MS)
  }

  const doDelete = async (id: string) => {
    if (confirmTimer.current) clearTimeout(confirmTimer.current)
    setDeletingId(id)
    try {
      await removeDocument('educationDepartments', id)
      pushToast({ title: '부서가 삭제되었습니다', variant: 'success' })
      onUpdated()
    } catch (err) {
      pushToast({
        title: '삭제 실패',
        description: err instanceof Error ? err.message : '',
        variant: 'error',
      })
    } finally {
      setDeletingId(null)
      setConfirmingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-6">
      <div>
        <p className="text-sm font-semibold text-terracotta">부서 관리</p>
        <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">부서추가/삭제</h2>
        <p className="mt-2 text-sm text-ink-muted">
          기본 4개 부서(유치부·유초등부·중고등부·청년가족부)는 삭제할 수 없습니다. 새로 추가한
          부서만 삭제할 수 있습니다.
        </p>
      </div>

      <Button type="button" onClick={() => void addDept()} disabled={adding}>
        <Plus className="h-4 w-4" />
        {adding ? '추가 중…' : '새 부서 추가'}
      </Button>

      <ul className="space-y-2">
        {depts.map((dept) => {
          const isDefault = isDefaultEducationDept(dept.deptKey)
          const isConfirming = confirmingId === dept.id
          return (
            <li
              key={dept.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-stone/60 bg-white/60 px-4 py-3"
            >
              <span className="min-w-0 truncate text-sm font-medium text-ink">
                {dept.name || '(제목 없음)'}
                {isDefault ? (
                  <span className="ml-2 text-xs font-normal text-ink-muted">기본 부서</span>
                ) : null}
              </span>
              {isDefault ? (
                <span className="shrink-0 text-xs text-ink-muted">삭제 불가</span>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={deletingId === dept.id}
                  onClick={() => requestDelete(dept.id)}
                  className={cn(
                    'shrink-0 border-red-200 bg-cream/80 text-red-800 hover:bg-red-50',
                    isConfirming && 'bg-red-50',
                  )}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {isConfirming ? '한 번 더 클릭하면 삭제됩니다' : '삭제'}
                </Button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
