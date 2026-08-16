import { useEffect, useState } from 'react'
import type { AnnualMotto } from '../../types/content'
import { EditableBlock } from '../../components/shared/EditableBlock'
import { Reveal } from '../../components/shared/Reveal'
import { FormField } from '../../components/ui/form-field'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { saveDocument } from '../../lib/content-service'
import { useAdminStore } from '../../store/admin-store'

interface Props {
  motto: AnnualMotto
  onUpdated?: () => void
}

export function AnnualMottoSection({ motto, onUpdated }: Props) {
  const pushToast = useAdminStore((s) => s.pushToast)
  const displayYear = motto.year && motto.year > 0 ? motto.year : new Date().getFullYear()
  const practices = motto.practices.length
    ? motto.practices
    : ['', '', '']

  return (
    <EditableBlock
      label="연간 표어"
      className="h-full"
      renderEditor={(close) => (
        <MottoEditor
          motto={motto}
          onSaved={() => {
            pushToast({ title: '표어 저장됨', variant: 'success' })
            onUpdated?.()
            close()
          }}
          onError={(m) => pushToast({ title: '저장 실패', description: m, variant: 'error' })}
        />
      )}
    >
      <Reveal className="h-full">
        <article className="relative flex h-full min-h-[280px] flex-col border-l border-paper-line pl-6 sm:pl-8">
          <p className="index-num text-xs font-semibold tracking-[0.14em] text-gold-deep">
            {displayYear}년도 표어
          </p>
          <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug text-paper-text sm:text-[1.75rem]">
            {motto.motto}
          </h2>
          <p className="mt-2 text-sm font-medium text-paper-muted">{motto.scripture}</p>

          <ol className="mt-7 space-y-3 border-t border-paper-line pt-6">
            {practices.slice(0, 3).map((line, i) => (
              <li key={i} className="flex items-baseline gap-3 text-sm leading-relaxed text-paper-text">
                <span className="index-num shrink-0 font-serif text-xs text-gold-deep">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </article>
      </Reveal>
    </EditableBlock>
  )
}

function MottoEditor({
  motto,
  onSaved,
  onError,
}: {
  motto: AnnualMotto
  onSaved: () => void
  onError: (m: string) => void
}) {
  const [year, setYear] = useState(motto.year != null ? String(motto.year) : '')
  const [mottoText, setMottoText] = useState(motto.motto)
  const [scripture, setScripture] = useState(motto.scripture)
  const [p1, setP1] = useState(motto.practices[0] ?? '')
  const [p2, setP2] = useState(motto.practices[1] ?? '')
  const [p3, setP3] = useState(motto.practices[2] ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setYear(motto.year != null ? String(motto.year) : '')
    setMottoText(motto.motto)
    setScripture(motto.scripture)
    setP1(motto.practices[0] ?? '')
    setP2(motto.practices[1] ?? '')
    setP3(motto.practices[2] ?? '')
  }, [motto])

  const save = async () => {
    setSaving(true)
    try {
      const yearNum = year.trim() ? Number(year.trim()) : undefined
      await saveDocument('annualMotto', 'main', {
        year: yearNum && !Number.isNaN(yearNum) ? yearNum : null,
        motto: mottoText.trim() || motto.motto,
        scripture: scripture.trim() || motto.scripture,
        practices: [
          p1.trim() || motto.practices[0] || '',
          p2.trim() || motto.practices[1] || '',
          p3.trim() || motto.practices[2] || '',
        ],
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
      <FormField
        label="표시 연도"
        htmlFor="motto-year"
        hint="비우면 현재 연도가 자동 표시됩니다"
      >
        <Input
          id="motto-year"
          type="number"
          inputMode="numeric"
          placeholder={String(new Date().getFullYear())}
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </FormField>
      <FormField label="표어" htmlFor="motto-text" required hint="메인 표어 문구">
        <Textarea
          id="motto-text"
          className="min-h-[72px]"
          value={mottoText}
          onChange={(e) => setMottoText(e.target.value)}
        />
      </FormField>
      <FormField label="성경 구절" htmlFor="motto-scripture" hint="예: 에베소서 4:22-24">
        <Input
          id="motto-scripture"
          value={scripture}
          onChange={(e) => setScripture(e.target.value)}
        />
      </FormField>
      <FormField label="실천 1" htmlFor="motto-p1">
        <Input id="motto-p1" value={p1} onChange={(e) => setP1(e.target.value)} />
      </FormField>
      <FormField label="실천 2" htmlFor="motto-p2">
        <Input id="motto-p2" value={p2} onChange={(e) => setP2(e.target.value)} />
      </FormField>
      <FormField label="실천 3" htmlFor="motto-p3">
        <Input id="motto-p3" value={p3} onChange={(e) => setP3(e.target.value)} />
      </FormField>
      <div className="flex justify-end">
        <Button disabled={saving} onClick={() => void save()}>
          저장 후 게시
        </Button>
      </div>
    </div>
  )
}
