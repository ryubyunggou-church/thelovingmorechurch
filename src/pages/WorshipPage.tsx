import { useEffect, useState } from 'react'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { Seo } from '../components/shared/Seo'
import { EditableBlock } from '../components/shared/EditableBlock'
import { WorshipScheduleList } from '../features/worship/WorshipScheduleList'
import { FormField } from '../components/ui/form-field'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { getWorshipSchedule, removeDocument, saveDocument } from '../lib/content-service'
import type { WorshipScheduleItem } from '../types/content'
import { seedWorship } from '../data/seed'
import { useAdminStore } from '../store/admin-store'
import { cn } from '../lib/utils'

export function WorshipPage() {
  const [items, setItems] = useState<WorshipScheduleItem[]>(seedWorship)
  const pushToast = useAdminStore((s) => s.pushToast)

  const reload = async () => setItems(await getWorshipSchedule())

  useEffect(() => {
    void reload()
  }, [])

  return (
    <>
      <Seo title="예배안내" path="/worship" />
      <PageShell
        title="예배안내"
        description="함께 예배하는 시간과 장소를 안내합니다."
        current="예배안내"
      >
        <EditableBlock
          label="예배안내 목록"
          renderEditor={(close) => (
            <WorshipEditor
              items={items}
              onSave={async (next, removedIds) => {
                try {
                  await Promise.all([
                    ...removedIds.map((id) => removeDocument('worshipSchedule', id)),
                    ...next.map((item, index) =>
                      saveDocument('worshipSchedule', item.id, {
                        name: item.name,
                        time: item.time,
                        note: item.note,
                        order: index + 1,
                      }),
                    ),
                  ])
                  pushToast({ title: '예배안내 저장됨', variant: 'success' })
                  await reload()
                  close()
                } catch (err) {
                  pushToast({
                    title: '저장 실패',
                    description: err instanceof Error ? err.message : '',
                    variant: 'error',
                  })
                }
              }}
            />
          )}
        >
          <WorshipScheduleList items={items} />
        </EditableBlock>
      </PageShell>
    </>
  )
}

function WorshipEditor({
  items,
  onSave,
}: {
  items: WorshipScheduleItem[]
  onSave: (items: WorshipScheduleItem[], removedIds: string[]) => Promise<void>
}) {
  const [draft, setDraft] = useState(() => [...items].sort((a, b) => a.order - b.order))
  const [removedIds, setRemovedIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  useEffect(() => {
    setDraft([...items].sort((a, b) => a.order - b.order))
    setRemovedIds([])
  }, [items])

  const updateAt = (idx: number, patch: Partial<WorshipScheduleItem>) => {
    setDraft((prev) => {
      const next = [...prev]
      const cur = next[idx]
      if (!cur) return prev
      next[idx] = { ...cur, ...patch }
      return next
    })
  }

  const addItem = () => {
    const id = `w_${Date.now()}`
    setDraft((prev) => [
      ...prev,
      {
        id,
        name: '새 예배',
        time: '',
        note: '',
        order: prev.length + 1,
      },
    ])
  }

  const removeAt = (idx: number) => {
    const target = draft[idx]
    if (!target) return
    const existed = items.some((i) => i.id === target.id)
    if (existed) {
      setRemovedIds((r) => (r.includes(target.id) ? r : [...r, target.id]))
    }
    setDraft((prev) => prev.filter((_, i) => i !== idx))
  }

  const onDragStart = (e: React.DragEvent, idx: number) => {
    setDragIndex(idx)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(idx))
  }

  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (overIndex !== idx) setOverIndex(idx)
  }

  const onDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    const from = dragIndex
    if (from === null || from === idx) {
      setDragIndex(null)
      setOverIndex(null)
      return
    }
    setDraft((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      if (!moved) return prev
      next.splice(idx, 0, moved)
      return next
    })
    setDragIndex(null)
    setOverIndex(null)
  }

  const onDragEnd = () => {
    setDragIndex(null)
    setOverIndex(null)
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-paper-muted">
        왼쪽 핸들을 드래그해 순서를 바꾸거나, 추가·삭제한 뒤 저장하세요. 목록이 길면 모달 안에서
        스크롤됩니다.
      </p>

      <div className="space-y-3">
        {draft.map((item, idx) => (
          <div
            key={item.id}
            onDragOver={(e) => onDragOver(e, idx)}
            onDrop={(e) => onDrop(e, idx)}
            className={cn(
              'space-y-3 rounded-sm border p-3 transition-colors',
              'border-paper-line bg-paper-dim',
              dragIndex === idx && 'opacity-60',
              overIndex === idx && dragIndex !== idx && 'ring-2 ring-gold/50',
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  draggable
                  onDragStart={(e) => onDragStart(e, idx)}
                  onDragEnd={onDragEnd}
                  className="inline-flex cursor-grab touch-none rounded-sm p-1 text-paper-muted hover:bg-paper/60 active:cursor-grabbing"
                  aria-label="드래그하여 순서 변경"
                  role="button"
                  tabIndex={0}
                >
                  <GripVertical className="h-5 w-5" />
                </span>
                <p className="text-xs font-semibold text-gold-deep">예배 #{idx + 1}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 border-wine/30 bg-paper/80 text-wine-deep hover:bg-wine/10"
                onClick={() => removeAt(idx)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                삭제
              </Button>
            </div>

            <FormField label="예배명" htmlFor={`w-name-${item.id}`} hint="예: 주일 오전예배, 수요예배">
              <Input
                id={`w-name-${item.id}`}
                value={item.name}
                onChange={(e) => updateAt(idx, { name: e.target.value })}
                placeholder="예배명"
                className="bg-paper"
              />
            </FormField>
            <FormField label="시간" htmlFor={`w-time-${item.id}`} hint="예: 오전 11:00">
              <Input
                id={`w-time-${item.id}`}
                value={item.time}
                onChange={(e) => updateAt(idx, { time: e.target.value })}
                placeholder="시간"
                className="bg-paper"
              />
            </FormField>
            <FormField label="비고" htmlFor={`w-note-${item.id}`} hint="장소·요일 등 부가 정보">
              <Input
                id={`w-note-${item.id}`}
                value={item.note}
                onChange={(e) => updateAt(idx, { note: e.target.value })}
                placeholder="비고"
                className="bg-paper"
              />
            </FormField>
          </div>
        ))}
      </div>

      {draft.length === 0 ? (
        <p className="rounded-sm border border-dashed border-paper-line bg-paper-dim/50 px-3 py-6 text-center text-sm text-paper-muted">
          등록된 예배가 없습니다. 아래 「예배 추가」를 눌러 주세요.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-paper-line pt-3">
        <Button type="button" variant="outline" onClick={addItem}>
          <Plus className="h-4 w-4" />
          예배 추가
        </Button>
        <Button
          disabled={saving}
          onClick={() => {
            setSaving(true)
            void onSave(draft, removedIds).finally(() => setSaving(false))
          }}
        >
          저장 후 게시
        </Button>
      </div>
    </div>
  )
}
