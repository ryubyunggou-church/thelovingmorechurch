import { lazy, Suspense, useEffect, useState } from 'react'
import type { SitePopup, PopupContentType, PopupPosition } from '../../types/content'
import { FormField } from '../../components/ui/form-field'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { MediaInputField } from '../../components/shared/MediaInputField'
import { saveDocument } from '../../lib/content-service'

const MDEditor = lazy(async () => {
  await import('@uiw/react-md-editor/markdown-editor.css')
  return import('@uiw/react-md-editor')
})

const CONTENT_TYPE_LABEL: Record<PopupContentType, string> = {
  image: '이미지',
  pdf: 'PDF',
  markdown: '텍스트(Markdown)',
}

const POSITION_LABEL: Record<PopupPosition, string> = {
  center: '중앙',
  top: '상단',
  'bottom-sheet': '하단 시트',
  'corner-br': '우하단 코너',
  'corner-bl': '좌하단 코너',
}

export function PopupEditor({
  popup,
  onSaved,
  onError,
}: {
  popup: SitePopup
  onSaved: () => void
  onError: (msg: string) => void
}) {
  const [form, setForm] = useState(popup)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(popup)
  }, [popup])

  const save = async () => {
    if (!form.label.trim()) {
      onError('팝업 이름을 입력해 주세요.')
      return
    }
    if (form.startDate > form.endDate) {
      onError('시작일이 종료일보다 늦을 수 없습니다.')
      return
    }
    setSaving(true)
    try {
      await saveDocument('sitePopups', form.id, {
        label: form.label.trim(),
        enabled: form.enabled,
        startDate: form.startDate,
        endDate: form.endDate,
        contentType: form.contentType,
        mediaUrl: form.mediaUrl ?? '',
        markdownBody: form.markdownBody ?? '',
        title: (form.title ?? '').trim(),
        linkUrl: (form.linkUrl ?? '').trim(),
        position: form.position,
        priority: Number(form.priority) || 0,
        hideForHours: Number(form.hideForHours) || 0,
        updatedAt: new Date().toISOString(),
      })
      onSaved()
    } catch (err) {
      onError(err instanceof Error ? err.message : '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <FormField label="팝업 이름" htmlFor="popup-label" required hint="관리자 목록에만 표시">
        <Input
          id="popup-label"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />
      </FormField>

      <label className="flex items-center gap-2 text-sm font-medium text-ink">
        <input
          type="checkbox"
          checked={form.enabled}
          onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
          className="h-4 w-4 rounded border-stone accent-terracotta"
        />
        노출 활성화
      </label>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="시작일" htmlFor="popup-start">
          <Input
            id="popup-start"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />
        </FormField>
        <FormField label="종료일" htmlFor="popup-end">
          <Input
            id="popup-end"
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />
        </FormField>
      </div>

      <FormField label="콘텐츠 타입" htmlFor="popup-content-type">
        <select
          id="popup-content-type"
          value={form.contentType}
          onChange={(e) =>
            setForm({ ...form, contentType: e.target.value as PopupContentType })
          }
          className="flex h-10 w-full rounded-md border border-stone bg-cream px-3 text-sm text-ink"
        >
          {(Object.keys(CONTENT_TYPE_LABEL) as PopupContentType[]).map((key) => (
            <option key={key} value={key}>
              {CONTENT_TYPE_LABEL[key]}
            </option>
          ))}
        </select>
      </FormField>

      {form.contentType === 'image' ? (
        <MediaInputField
          label="이미지"
          imageOnly
          folder="popups"
          value={{ mediaUrl: form.mediaUrl ?? '', mediaType: 'image' }}
          defaultUrl={popup.mediaUrl ?? ''}
          onChange={(m) => setForm({ ...form, mediaUrl: m.mediaUrl })}
          onError={onError}
        />
      ) : null}

      {form.contentType === 'pdf' ? (
        <MediaInputField
          label="PDF 파일"
          pdfOnly
          folder="popups"
          value={{ mediaUrl: form.mediaUrl ?? '', mediaType: 'image' }}
          defaultUrl={popup.mediaUrl ?? ''}
          onChange={(m) => setForm({ ...form, mediaUrl: m.mediaUrl })}
          onError={onError}
        />
      ) : null}

      {form.contentType === 'markdown' ? (
        <FormField label="내용" htmlFor="popup-markdown" hint="제목 6~10단어, 본문 2줄 이내 권장">
          <div data-color-mode="light">
            <Suspense fallback={<div className="h-40 rounded-md border border-stone bg-cream" />}>
              <MDEditor
                value={form.markdownBody ?? ''}
                onChange={(v) => setForm({ ...form, markdownBody: v ?? '' })}
                height={220}
              />
            </Suspense>
          </div>
        </FormField>
      ) : null}

      <FormField label="제목 (선택)" htmlFor="popup-title" hint="비우면 팝업 이름으로 대체">
        <Input
          id="popup-title"
          value={form.title ?? ''}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </FormField>

      <FormField
        label="링크 URL (선택)"
        htmlFor="popup-link"
        hint="이미지 클릭 시 이동 · PDF는 하단에 「자세히 보기」로 표시"
      >
        <Input
          id="popup-link"
          value={form.linkUrl ?? ''}
          onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
          placeholder="/news 또는 https://…"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="위치" htmlFor="popup-position">
          <select
            id="popup-position"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value as PopupPosition })}
            className="flex h-10 w-full rounded-md border border-stone bg-cream px-3 text-sm text-ink"
          >
            {(Object.keys(POSITION_LABEL) as PopupPosition[]).map((key) => (
              <option key={key} value={key}>
                {POSITION_LABEL[key]}
              </option>
            ))}
          </select>
        </FormField>
        <FormField
          label="우선순위"
          htmlFor="popup-priority"
          hint="숫자가 클수록 먼저 노출"
        >
          <Input
            id="popup-priority"
            type="number"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
          />
        </FormField>
      </div>

      <FormField
        label="재노출 억제 시간(시간)"
        htmlFor="popup-hide-hours"
        hint="닫은 뒤 이 시간 동안 다시 안 뜸 · 0이면 매 방문마다 노출"
      >
        <Input
          id="popup-hide-hours"
          type="number"
          min={0}
          value={form.hideForHours}
          onChange={(e) => setForm({ ...form, hideForHours: Number(e.target.value) })}
        />
      </FormField>

      <div className="flex justify-end pt-1">
        <Button disabled={saving} onClick={() => void save()}>
          저장
        </Button>
      </div>
    </div>
  )
}
