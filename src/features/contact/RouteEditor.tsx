import { useEffect, useState } from 'react'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import type { ContactRoute } from '../../types/content'
import { FormField } from '../../components/ui/form-field'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { ROUTE_ICON_LABELS, ROUTE_ICON_TYPES, createBlankRoute } from '../../lib/contact-route'
import { cn } from '../../lib/utils'
import { RouteIcon } from './RouteIcon'

interface Props {
  routes: ContactRoute[]
  onSave: (routes: ContactRoute[]) => Promise<void>
}

/** 경로 안내(지하철/버스/도보) 추가·삭제·순서변경 편집기 — MissionEditor와 동일한 DnD 패턴 재사용 */
export function RouteEditor({ routes, onSave }: Props) {
  const [draft, setDraft] = useState(() => [...routes].sort((a, b) => a.order - b.order))
  const [saving, setSaving] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  useEffect(() => {
    setDraft([...routes].sort((a, b) => a.order - b.order))
  }, [routes])

  const updateAt = (idx: number, patch: Partial<ContactRoute>) => {
    setDraft((prev) => {
      const next = [...prev]
      const cur = next[idx]
      if (!cur) return prev
      next[idx] = { ...cur, ...patch }
      return next
    })
  }

  const addItem = () => {
    setDraft((prev) => [...prev, createBlankRoute('subway', prev.length + 1)])
  }

  const removeAt = (idx: number) => {
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
        왼쪽 핸들을 드래그해 순서를 바꾸거나, 추가·삭제한 뒤 저장하세요. 아이콘은 지하철/버스/도보
        중 하나를 고르면 방문자 화면에서 해당 그룹으로 묶여 표시됩니다.
      </p>

      <div className="space-y-3">
        {draft.map((route, idx) => (
          <div
            key={route.id}
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
                <p className="text-xs font-semibold text-terracotta">경로 #{idx + 1}</p>
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

            <FormField label="아이콘" htmlFor={`route-icon-${route.id}`} required>
              <div className="flex gap-2" role="radiogroup" id={`route-icon-${route.id}`}>
                {ROUTE_ICON_TYPES.map((iconType) => (
                  <button
                    key={iconType}
                    type="button"
                    role="radio"
                    aria-checked={route.iconType === iconType}
                    onClick={() => updateAt(idx, { iconType })}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition',
                      route.iconType === iconType
                        ? 'border-terracotta bg-terracotta text-cream'
                        : 'border-stone bg-cream text-ink-muted hover:bg-cream-dark',
                    )}
                  >
                    <RouteIcon iconType={iconType} className="h-3.5 w-3.5" />
                    {ROUTE_ICON_LABELS[iconType]}
                  </button>
                ))}
              </div>
            </FormField>

            <FormField
              label="제목"
              htmlFor={`route-title-${route.id}`}
              required
              hint="예: 분당선·신분당선, 1303 (안양방면)"
            >
              <Input
                id={`route-title-${route.id}`}
                value={route.title}
                onChange={(e) => updateAt(idx, { title: e.target.value })}
                placeholder="제목"
                className="bg-cream"
              />
            </FormField>
            <FormField label="경로 설명" htmlFor={`route-desc-${route.id}`} required>
              <Textarea
                id={`route-desc-${route.id}`}
                className="min-h-[72px] bg-cream"
                value={route.description}
                onChange={(e) => updateAt(idx, { description: e.target.value })}
                placeholder="예: 정자역(2번 출구) → 220번 버스 환승 → ○○ 정류장 하차"
              />
            </FormField>
          </div>
        ))}
      </div>

      {draft.length === 0 ? (
        <p className="rounded-lg border border-dashed border-[#c4ae8e] bg-[#e4d5be]/50 px-3 py-6 text-center text-sm text-ink-muted">
          등록된 경로 안내가 없습니다. 아래 「경로 추가」를 눌러 주세요.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone/60 pt-3">
        <Button type="button" variant="outline" onClick={addItem}>
          <Plus className="h-4 w-4" />
          경로 추가
        </Button>
        <Button
          disabled={saving || draft.some((r) => !r.title.trim() || !r.description.trim())}
          onClick={() => {
            setSaving(true)
            void onSave(draft.map((r, i) => ({ ...r, order: i + 1 }))).finally(() =>
              setSaving(false),
            )
          }}
        >
          저장 후 게시
        </Button>
      </div>
    </div>
  )
}
