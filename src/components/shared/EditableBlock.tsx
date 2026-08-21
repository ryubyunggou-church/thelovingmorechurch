import { useState, type ReactNode } from 'react'
import { Pencil } from 'lucide-react'
import { useAdminStore } from '../../store/admin-store'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { cn } from '../../lib/utils'

interface EditableBlockProps {
  label: string
  children: ReactNode
  className?: string
  renderEditor: (close: () => void) => ReactNode
}

export function EditableBlock({ label, children, className, renderEditor }: EditableBlockProps) {
  const isAdminMode = useAdminStore((s) => s.isAdminMode)
  const [open, setOpen] = useState(false)
  const [revealed, setRevealed] = useState(false)

  return (
    <div
      className={cn('group relative', className)}
      onClick={() => {
        if (isAdminMode) setRevealed((r) => !r)
      }}
    >
      {children}
      {isAdminMode ? (
        <>
          <div
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-0 z-[5] flex items-center justify-center rounded-[20px] border-2 border-gold bg-paper/70 px-6 text-center opacity-0 transition-opacity duration-200 ease-out sm:group-hover:opacity-100',
              revealed && 'opacity-100'
            )}
          >
            <p className="text-sm font-medium text-ink">
              '편집'을 클릭하시면 내용을 수정할 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(true)
            }}
            className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-sm bg-ink/85 px-2.5 py-1 text-xs font-medium text-gold opacity-100 shadow transition sm:opacity-0 sm:group-hover:opacity-100"
            aria-label={`${label} 편집`}
          >
            <Pencil className="h-3.5 w-3.5" />
            편집
          </button>
        </>
      ) : null}

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) setRevealed(false)
        }}
      >
        <DialogContent className="w-[min(92vw,36rem)]">
          <DialogHeader>
            <DialogTitle>{label} 편집</DialogTitle>
            <DialogDescription>
              저장 후 미리보기 → 게시 흐름으로 Firestore에 반영됩니다. 내용이 길면 모달 안에서 스크롤됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0">{renderEditor(() => setOpen(false))}</div>
          <div className="mt-4 flex justify-end border-t border-paper-line/60 pt-3">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
