import { useEffect, useRef, useState, type DragEvent } from 'react'
import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import type { HeroSlide } from '../../types/content'
import { Button } from '../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { removeDocument, saveDocument } from '../../lib/content-service'
import { createBlankHeroSlide } from '../../lib/hero-list'
import { cn } from '../../lib/utils'
import { useAdminStore } from '../../store/admin-store'
import { HeroEditor } from './HeroEditor'
import { HERO_MANAGE_PANEL_ID } from './hero-manage-panel-id'

interface Props {
  slides: HeroSlide[]
  onUpdated: () => void
}

const CONFIRM_TIMEOUT_MS = 4000

/**
 * 관리자 전용 — Hero 슬라이드 CRUD를 한 목록에서 처리한다.
 * 추가(빈 슬라이드 생성) / 편집(슬라이드 id를 명시적으로 지정, 캐러셀이 지금
 * 보여주는 슬라이드와 무관하게 동작) / 삭제(최소 1개 유지) / 드래그 순서변경.
 */
export function HeroManagePanel({ slides, onUpdated }: Props) {
  const pushToast = useAdminStore((s) => s.pushToast)
  const [adding, setAdding] = useState(false)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [order, setOrder] = useState<HeroSlide[]>(() =>
    [...slides].sort((a, b) => a.order - b.order),
  )
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const [reordering, setReordering] = useState(false)
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setOrder([...slides].sort((a, b) => a.order - b.order))
  }, [slides])

  useEffect(() => {
    return () => {
      if (confirmTimer.current) clearTimeout(confirmTimer.current)
    }
  }, [])

  const addSlide = async () => {
    setAdding(true)
    try {
      const nextOrder = slides.length > 0 ? Math.max(...slides.map((s) => s.order)) + 1 : 1
      const blank = createBlankHeroSlide(nextOrder)
      await saveDocument('heroSlides', blank.id, {
        mediaUrl: blank.mediaUrl,
        mediaType: blank.mediaType,
        tag: blank.tag,
        title: blank.title,
        subtitle: blank.subtitle,
        linkUrl: blank.linkUrl,
        order: blank.order,
        isActive: blank.isActive,
      })
      pushToast({
        title: '새 슬라이드가 추가되었습니다',
        description: '목록에서 「편집」을 눌러 내용을 입력해 주세요.',
        variant: 'success',
      })
      onUpdated()
    } catch (err) {
      pushToast({
        title: '슬라이드 추가 실패',
        description: err instanceof Error ? err.message : '',
        variant: 'error',
      })
    } finally {
      setAdding(false)
    }
  }

  const requestDelete = (id: string) => {
    if (slides.length <= 1) {
      pushToast({ title: '최소 1개의 슬라이드는 있어야 합니다', variant: 'error' })
      return
    }
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
      await removeDocument('heroSlides', id)
      pushToast({ title: '슬라이드가 삭제되었습니다', variant: 'success' })
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

  const persistOrder = async (next: HeroSlide[]) => {
    setReordering(true)
    try {
      const changed = next
        .map((s, i) => ({ id: s.id, order: i + 1, changed: s.order !== i + 1 }))
        .filter((s) => s.changed)
      if (changed.length > 0) {
        await Promise.all(changed.map((c) => saveDocument('heroSlides', c.id, { order: c.order })))
        pushToast({ title: '슬라이드 순서가 변경되었습니다', variant: 'success' })
      }
      onUpdated()
    } catch (err) {
      pushToast({
        title: '순서 변경 실패',
        description: err instanceof Error ? err.message : '',
        variant: 'error',
      })
    } finally {
      setReordering(false)
    }
  }

  const onDragStart = (e: DragEvent, idx: number) => {
    setDragIndex(idx)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(idx))
  }

  const onDragOver = (e: DragEvent, idx: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (overIndex !== idx) setOverIndex(idx)
  }

  const onDrop = (e: DragEvent, idx: number) => {
    e.preventDefault()
    const from = dragIndex
    setDragIndex(null)
    setOverIndex(null)
    if (from === null || from === idx) return
    const next = [...order]
    const [moved] = next.splice(from, 1)
    if (!moved) return
    next.splice(idx, 0, moved)
    setOrder(next)
    void persistOrder(next)
  }

  const onDragEnd = () => {
    setDragIndex(null)
    setOverIndex(null)
  }

  return (
    <div id={HERO_MANAGE_PANEL_ID} className="mx-auto max-w-6xl space-y-4 px-4 pb-10 pt-6 sm:px-6">
      <div>
        <p className="text-sm font-semibold text-gold">Hero 슬라이드 관리</p>
        <h2 className="mt-1 font-serif text-xl font-semibold text-paper-text">슬라이드 추가/삭제</h2>
        <p className="mt-2 text-sm text-paper-muted">
          왼쪽 핸들을 드래그해 순서를 바꾸거나, 「편집」으로 내용을 수정하세요. 최소 1개의
          슬라이드는 유지되어야 합니다.
        </p>
      </div>

      <Button type="button" onClick={() => void addSlide()} disabled={adding}>
        <Plus className="h-4 w-4" />
        {adding ? '추가 중…' : '새 슬라이드 추가'}
      </Button>

      <ul className="space-y-2">
        {order.map((slide, idx) => {
          const isConfirming = confirmingId === slide.id
          return (
            <li
              key={slide.id}
              onDragOver={(e) => onDragOver(e, idx)}
              onDrop={(e) => onDrop(e, idx)}
              className={cn(
                'flex items-center justify-between gap-3 rounded-lg border border-paper-line/60 bg-paper/60 px-4 py-3 transition-colors',
                dragIndex === idx && 'opacity-60',
                overIndex === idx && dragIndex !== idx && 'ring-2 ring-gold/50',
              )}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  draggable
                  onDragStart={(e) => onDragStart(e, idx)}
                  onDragEnd={onDragEnd}
                  className="inline-flex shrink-0 cursor-grab touch-none rounded-md p-1 text-paper-muted hover:bg-paper/50 active:cursor-grabbing"
                  aria-label="드래그하여 순서 변경"
                  role="button"
                  tabIndex={0}
                >
                  <GripVertical className="h-5 w-5" />
                </span>
                <span className="min-w-0 truncate text-sm font-medium text-paper-text">
                  {slide.title || '(제목 없음)'}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={reordering}
                  onClick={() => setEditingSlide(slide)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  편집
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={deletingId === slide.id}
                  onClick={() => requestDelete(slide.id)}
                  className={cn(
                    'border-wine/30 bg-paper/80 text-wine-deep hover:bg-wine/10',
                    isConfirming && 'bg-red-50',
                  )}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {isConfirming ? '한 번 더 클릭하면 삭제됩니다' : '삭제'}
                </Button>
              </div>
            </li>
          )
        })}
      </ul>

      <Dialog
        open={editingSlide !== null}
        onOpenChange={(open) => {
          if (!open) setEditingSlide(null)
        }}
      >
        <DialogContent className="w-[min(92vw,36rem)]">
          <DialogHeader>
            <DialogTitle>{editingSlide?.title || '슬라이드'} 편집</DialogTitle>
            <DialogDescription>
              저장 후 미리보기 → 게시 흐름으로 Firestore에 반영됩니다.
            </DialogDescription>
          </DialogHeader>
          {editingSlide ? (
            <HeroEditor
              slide={editingSlide}
              onSaved={() => {
                pushToast({ title: '슬라이드 저장됨', variant: 'success' })
                setEditingSlide(null)
                onUpdated()
              }}
              onError={(msg) =>
                pushToast({ title: '저장 실패', description: msg, variant: 'error' })
              }
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
