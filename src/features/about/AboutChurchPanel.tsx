import { useEffect, useState } from 'react'
import type { AboutChurch } from '../../types/content'
import { EditableBlock } from '../../components/shared/EditableBlock'
import { FormField } from '../../components/ui/form-field'
import { MediaInputField } from '../../components/shared/MediaInputField'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { saveDocument } from '../../lib/content-service'
import { useAdminStore } from '../../store/admin-store'
import { Reveal } from '../../components/shared/Reveal'

interface Props {
  data: AboutChurch
  onUpdated?: () => void
}

/** 풀 뷰 체감 — 가로 2:1 (전경 : 소개글) */
export function AboutChurchPanel({ data, onUpdated }: Props) {
  const pushToast = useAdminStore((s) => s.pushToast)

  return (
    <EditableBlock
      label="교회소개"
      className="relative"
      renderEditor={(close) => (
        <ChurchEditor
          data={data}
          onSaved={() => {
            pushToast({ title: '교회소개 저장됨', variant: 'success' })
            onUpdated?.()
            close()
          }}
          onError={(m) => pushToast({ title: '저장 실패', description: m, variant: 'error' })}
        />
      )}
    >
      <div className="flex min-h-[calc(100dvh-11rem)] flex-col justify-center py-6 sm:py-10">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          {/* md+: 전경 2 / 글 1 · 모바일: 사진 위 → 글 아래 */}
          <div className="grid items-stretch gap-6 md:grid-cols-3 md:gap-8 lg:gap-10">
            <Reveal className="md:col-span-2">
              <div className="h-full overflow-hidden rounded-2xl border border-stone/60 shadow-md">
                <img
                  src={data.heroImageUrl}
                  alt="교회전경"
                  className="aspect-[16/10] h-full min-h-[220px] w-full object-cover md:aspect-auto md:min-h-[320px] lg:min-h-[380px]"
                  loading="lazy"
                />
              </div>
            </Reveal>
            <Reveal delay={80} className="md:col-span-1">
              <div className="flex h-full flex-col justify-center md:py-2">
                <h2 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
                  {data.title}
                </h2>
                <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-muted sm:text-[15px]">
                  {data.body}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </EditableBlock>
  )
}

function ChurchEditor({
  data,
  onSaved,
  onError,
}: {
  data: AboutChurch
  onSaved: () => void
  onError: (m: string) => void
}) {
  const [form, setForm] = useState(data)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(data)
  }, [data])

  const save = async () => {
    setSaving(true)
    try {
      await saveDocument('aboutChurch', 'main', {
        heroImageUrl: form.heroImageUrl.trim() || data.heroImageUrl,
        title: form.title.trim() || data.title,
        body: form.body.trim() || data.body,
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
      <MediaInputField
        label="교회전경 사진"
        imageOnly
        folder="about/church"
        required
        value={{ mediaUrl: form.heroImageUrl, mediaType: 'image' }}
        defaultUrl={data.heroImageUrl}
        hint="교회전경·가로 사진 권장 · 화면 좌측 2/3 영역 · 비우면 현재 이미지 유지"
        onChange={(m) => setForm({ ...form, heroImageUrl: m.mediaUrl })}
        onError={onError}
      />
      <FormField label="제목" htmlFor="church-title" required>
        <Input
          id="church-title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </FormField>
      <FormField label="소개 본문" htmlFor="church-body" required hint="여러 줄 입력 가능">
        <Textarea
          id="church-body"
          className="min-h-[160px]"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
        />
      </FormField>
      <div className="flex justify-end">
        <Button disabled={saving} onClick={() => void save()}>
          저장 후 게시
        </Button>
      </div>
    </div>
  )
}
