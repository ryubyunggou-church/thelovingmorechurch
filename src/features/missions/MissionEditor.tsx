import { useEffect, useState } from 'react'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import type { MissionItem } from '../../types/content'
import { FormField } from '../../components/ui/form-field'
import { MediaInputField } from '../../components/shared/MediaInputField'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { createBlankMission, type MissionType } from '../../lib/mission-list'
import { cn } from '../../lib/utils'

interface Props {
  items: MissionItem[]
  type: MissionType
  onSave: (items: MissionItem[], removedIds: string[]) => Promise<void>
  onError: (m: string) => void
}

export function MissionEditor({ items, type, onSave, onError }: Props) {
  const [draft, setDraft] = useState(() => [...items].sort((a, b) => a.order - b.order))
  const [removedIds, setRemovedIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  useEffect(() => {
    setDraft([...items].sort((a, b) => a.order - b.order))
    setRemovedIds([])
  }, [items])

  const updateAt = (idx: number, patch: Partial<MissionItem>) => {
    setDraft((prev) => {
      const next = [...prev]
      const cur = next[idx]
      if (!cur) return prev
      next[idx] = { ...cur, ...patch }
      return next
    })
  }

  const addItem = () => {
    setDraft((prev) => [...prev, createBlankMission(type, prev.length + 1)])
  }

  const removeAt = (idx: number) => {
    const target = draft[idx]
    if (!target) return
    if (items.some((i) => i.id === target.id)) {
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
      <p className="text-xs text-ink-muted">
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
              'space-y-3 rounded-xl border p-3 transition-colors',
              'border-[#c4ae8e]/70 bg-[#e4d5be]',
              dragIndex === idx && 'opacity-60',
              overIndex === idx && dragIndex !== idx && 'ring-2 ring-terracotta/50',
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  draggable
                  onDragStart={(e) => onDragStart(e, idx)}
                  onDragEnd={onDragEnd}
                  className="inline-flex cursor-grab touch-none rounded-md p-1 text-ink-muted hover:bg-cream/50 active:cursor-grabbing"
                  aria-label="드래그하여 순서 변경"
                  role="button"
                  tabIndex={0}
                >
                  <GripVertical className="h-5 w-5" />
                </span>
                <p className="text-xs font-semibold text-terracotta">사역 #{idx + 1}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 border-red-200 bg-cream/80 text-red-800 hover:bg-red-50"
                onClick={() => removeAt(idx)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                삭제
              </Button>
            </div>

            <MediaInputField
              label="대표 사진"
              imageOnly
              folder="missions"
              value={{ mediaUrl: item.image ?? '', mediaType: 'image' }}
              defaultUrl={item.image ?? ''}
              hint="가로 사진 권장 · 비우면 현재 이미지 유지"
              onChange={(m) => updateAt(idx, { image: m.mediaUrl })}
              onError={onError}
            />
            <FormField label="사역 / 선교지 이름" htmlFor={`ms-name-${item.id}`} required>
              <Input
                id={`ms-name-${item.id}`}
                value={item.name}
                onChange={(e) => updateAt(idx, { name: e.target.value })}
                placeholder="이름"
                className="bg-cream"
              />
            </FormField>
            <FormField label="지역" htmlFor={`ms-region-${item.id}`} hint="예: 서울 동대문구, 동남아시아">
              <Input
                id={`ms-region-${item.id}`}
                value={item.region ?? ''}
                onChange={(e) => updateAt(idx, { region: e.target.value })}
                placeholder="지역"
                className="bg-cream"
              />
            </FormField>
            <FormField label="설명" htmlFor={`ms-desc-${item.id}`} hint="사역 소개·기도 제목">
              <Textarea
                id={`ms-desc-${item.id}`}
                className="min-h-[88px] bg-cream"
                value={item.description}
                onChange={(e) => updateAt(idx, { description: e.target.value })}
                placeholder="설명"
              />
            </FormField>
          </div>
        ))}
      </div>

      {draft.length === 0 ? (
        <p className="rounded-lg border border-dashed border-[#c4ae8e] bg-[#e4d5be]/50 px-3 py-6 text-center text-sm text-ink-muted">
          등록된 사역이 없습니다. 아래 「사역 추가」를 눌러 주세요.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone/60 pt-3">
        <Button type="button" variant="outline" onClick={addItem}>
          <Plus className="h-4 w-4" />
          사역 추가
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
