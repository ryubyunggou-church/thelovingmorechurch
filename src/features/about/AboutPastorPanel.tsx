import { useEffect, useState } from 'react'
import type { AboutPastor } from '../../types/content'
import { EditableBlock } from '../../components/shared/EditableBlock'
import { FormField } from '../../components/ui/form-field'
import { MediaInputField } from '../../components/shared/MediaInputField'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { listToLines, linesToList, saveDocument } from '../../lib/content-service'
import { useAdminStore } from '../../store/admin-store'
import { Reveal } from '../../components/shared/Reveal'

interface Props {
  data: AboutPastor
  onUpdated?: () => void
}

export function AboutPastorPanel({ data, onUpdated }: Props) {
  const pushToast = useAdminStore((s) => s.pushToast)

  return (
    <EditableBlock
      label="담임목사소개"
      className="relative"
      renderEditor={(close) => (
        <PastorEditor
          data={data}
          onSaved={() => {
            pushToast({ title: '담임목사소개 저장됨', variant: 'success' })
            onUpdated?.()
            close()
          }}
          onError={(m) => pushToast({ title: '저장 실패', description: m, variant: 'error' })}
        />
      )}
    >
      <div className="flex min-h-[calc(100dvh-11rem)] flex-col justify-center py-6 sm:py-10">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="grid items-start gap-8 md:grid-cols-[minmax(200px,280px)_1fr] md:gap-12">
            <Reveal>
              <div className="mx-auto w-48 overflow-hidden sm:w-56 md:mx-0 md:w-full">
                <img
                  src={data.photoUrl}
                  alt={data.name}
                  className="aspect-[3/4] w-full object-cover"
                  loading="lazy"
                />
              </div>
            </Reveal>
            <Reveal delay={90}>
              <div>
                <p className="index-num text-xs font-semibold tracking-[0.14em] text-gold-deep">담임목사소개</p>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-paper-text sm:text-3xl">
                  {data.name}
                </h2>
                <p className="mt-1 text-sm text-paper-muted">{data.title}</p>

                <section className="mt-8 border-t border-paper-line pt-6">
                  <h3 className="text-sm font-semibold text-paper-text">학력</h3>
                  <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-paper-muted">
                    {data.education.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </section>

                <section className="mt-6">
                  <h3 className="text-sm font-semibold text-paper-text">경력</h3>
                  <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-paper-muted">
                    {data.career.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </section>

                {data.notes ? (
                  <section className="mt-6">
                    <h3 className="text-sm font-semibold text-paper-text">기타</h3>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-paper-muted">
                      {data.notes}
                    </p>
                  </section>
                ) : null}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </EditableBlock>
  )
}

function PastorEditor({
  data,
  onSaved,
  onError,
}: {
  data: AboutPastor
  onSaved: () => void
  onError: (m: string) => void
}) {
  const [photoUrl, setPhotoUrl] = useState(data.photoUrl)
  const [name, setName] = useState(data.name)
  const [title, setTitle] = useState(data.title)
  const [education, setEducation] = useState(listToLines(data.education))
  const [career, setCareer] = useState(listToLines(data.career))
  const [notes, setNotes] = useState(data.notes)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setPhotoUrl(data.photoUrl)
    setName(data.name)
    setTitle(data.title)
    setEducation(listToLines(data.education))
    setCareer(listToLines(data.career))
    setNotes(data.notes)
  }, [data])

  const save = async () => {
    setSaving(true)
    try {
      await saveDocument('aboutPastor', 'main', {
        photoUrl: photoUrl.trim() || data.photoUrl,
        name: name.trim() || data.name,
        title: title.trim() || data.title,
        education: linesToList(education),
        career: linesToList(career),
        notes: notes.trim(),
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
        label="인물 사진"
        imageOnly
        folder="about/pastor"
        required
        value={{ mediaUrl: photoUrl, mediaType: 'image' }}
        defaultUrl={data.photoUrl}
        hint="인물 초상 · 세로(3:4) 권장 · 비우면 현재 사진 유지"
        onChange={(m) => setPhotoUrl(m.mediaUrl)}
        onError={onError}
      />
      <FormField label="성함" htmlFor="ap-name" required>
        <Input id="ap-name" value={name} onChange={(e) => setName(e.target.value)} />
      </FormField>
      <FormField label="직함" htmlFor="ap-title" hint="예: 담임목사">
        <Input id="ap-title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormField>
      <FormField label="학력" htmlFor="ap-edu" hint="한 줄에 한 항목">
        <Textarea
          id="ap-edu"
          className="min-h-[100px]"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
        />
      </FormField>
      <FormField label="경력" htmlFor="ap-career" hint="한 줄에 한 항목">
        <Textarea
          id="ap-career"
          className="min-h-[100px]"
          value={career}
          onChange={(e) => setCareer(e.target.value)}
        />
      </FormField>
      <FormField label="기타" htmlFor="ap-notes" hint="선택">
        <Textarea
          id="ap-notes"
          className="min-h-[80px]"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
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
