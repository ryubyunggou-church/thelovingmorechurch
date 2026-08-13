import { useEffect, useState } from 'react'
import type { PastorGreeting } from '../../types/content'
import { EditableBlock } from '../../components/shared/EditableBlock'
import { Reveal } from '../../components/shared/Reveal'
import { FormField } from '../../components/ui/form-field'
import { MediaInputField } from '../../components/shared/MediaInputField'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { extractFirstSentence, saveDocument } from '../../lib/content-service'
import { useAdminStore } from '../../store/admin-store'
import { useMicroParallax } from '../../hooks/useMicroParallax'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

interface Props {
  greeting: PastorGreeting
  onUpdated?: () => void
  /** 밴드 안 축소 레이아웃 (기본 true) */
  compact?: boolean
}

export function PastorGreetingSection({ greeting, onUpdated, compact = true }: Props) {
  const pushToast = useAdminStore((s) => s.pushToast)
  const reduced = usePrefersReducedMotion()
  const photoParallaxRef = useMicroParallax<HTMLImageElement>({
    strength: 8,
    disabled: reduced,
  })

  const quote =
    greeting.quote?.trim() ||
    extractFirstSentence(greeting.message) ||
    greeting.message.slice(0, 80)

  return (
    <EditableBlock
      label="담임목사 인사말"
      className="h-full"
      renderEditor={(close) => (
        <GreetingEditor
          greeting={greeting}
          onSaved={() => {
            pushToast({ title: '인사말 저장됨', variant: 'success' })
            onUpdated?.()
            close()
          }}
          onError={(m) => pushToast({ title: '저장 실패', description: m, variant: 'error' })}
        />
      )}
    >
      <Reveal className="h-full">
        <article
          className={
            compact
              ? 'flex h-full flex-col gap-5 sm:gap-6'
              : 'grid items-center gap-10 md:grid-cols-[240px_1fr]'
          }
        >
          {/* Pull-quote */}
          <blockquote className="relative border-l-[3px] border-terracotta pl-4 sm:pl-5">
            <span
              aria-hidden
              className="pointer-events-none absolute -left-1 -top-3 font-serif text-5xl leading-none text-terracotta/25 sm:text-6xl"
            >
              “
            </span>
            <p className="font-serif text-lg font-medium leading-snug text-ink sm:text-xl">
              {quote}
            </p>
          </blockquote>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <div className="mx-auto w-36 shrink-0 overflow-hidden rounded-xl shadow-md sm:mx-0 sm:w-40">
              <img
                ref={photoParallaxRef}
                src={greeting.photoUrl}
                alt={greeting.pastorName}
                className="aspect-[3/4] w-full object-cover will-change-transform"
                loading="lazy"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-wide text-terracotta">담임목사 인사말</p>
              <h2 className="mt-1 font-serif text-xl font-semibold text-ink sm:text-2xl">
                {greeting.pastorName}
              </h2>
              <p className="mt-3 line-clamp-6 text-sm leading-relaxed text-ink-muted sm:line-clamp-8 sm:text-[15px]">
                {greeting.message}
              </p>
            </div>
          </div>
        </article>
      </Reveal>
    </EditableBlock>
  )
}

function GreetingEditor({
  greeting,
  onSaved,
  onError,
}: {
  greeting: PastorGreeting
  onSaved: () => void
  onError: (m: string) => void
}) {
  const [form, setForm] = useState(greeting)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(greeting)
  }, [greeting])

  const save = async () => {
    setSaving(true)
    try {
      const photoUrl = form.photoUrl.trim() || greeting.photoUrl
      await saveDocument('pastorGreeting', 'main', {
        pastorName: form.pastorName.trim() || greeting.pastorName,
        photoUrl,
        message: form.message.trim() || greeting.message,
        quote: form.quote?.trim() || null,
        updatedAt: new Date().toISOString(),
      })
      setForm((p) => ({ ...p, photoUrl }))
      onSaved()
    } catch (err) {
      onError(err instanceof Error ? err.message : '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <FormField label="성함" htmlFor="pastor-name" required hint="화면에 표시되는 담임목사 성함·호칭">
        <Input
          id="pastor-name"
          value={form.pastorName}
          onChange={(e) => setForm({ ...form, pastorName: e.target.value })}
          placeholder="예: 유병구 목사"
        />
      </FormField>

      <MediaInputField
        label="사진"
        imageOnly
        folder="pastor"
        required
        value={{ mediaUrl: form.photoUrl, mediaType: 'image' }}
        defaultUrl={greeting.photoUrl}
        hint="세로 비율(3:4) 권장 · 비우면 현재 사진 유지"
        onChange={(m) => setForm({ ...form, photoUrl: m.mediaUrl })}
        onError={onError}
      />

      <FormField
        label="인용구 (Pull-quote)"
        htmlFor="pastor-quote"
        hint="크게 강조할 한 문장. 비우면 본문 첫 문장을 사용합니다"
      >
        <Textarea
          id="pastor-quote"
          value={form.quote ?? ''}
          onChange={(e) => setForm({ ...form, quote: e.target.value })}
          placeholder="강조 문장"
          className="min-h-[72px]"
        />
      </FormField>

      <FormField label="인사말 본문" htmlFor="pastor-message" required hint="전체 인사 문구">
        <Textarea
          id="pastor-message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="인사말 본문"
          className="min-h-[140px]"
        />
      </FormField>

      <div className="flex justify-end gap-2">
        <Button disabled={saving} onClick={() => void save()}>
          저장 후 게시
        </Button>
      </div>
    </div>
  )
}
