import { useEffect, useState } from 'react'
import { CalendarDays, MapPin, Users } from 'lucide-react'
import type { EducationDepartment } from '../../types/content'
import { EditableBlock } from '../../components/shared/EditableBlock'
import { FormField } from '../../components/ui/form-field'
import { MediaInputField } from '../../components/shared/MediaInputField'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { Reveal } from '../../components/shared/Reveal'
import { saveDocument } from '../../lib/content-service'
import { useAdminStore } from '../../store/admin-store'

interface Props {
  dept: EducationDepartment
  onUpdated?: () => void
}

export function EducationDeptPanel({ dept, onUpdated }: Props) {
  const pushToast = useAdminStore((s) => s.pushToast)
  const age = dept.targetAge?.trim()
  const place = dept.place?.trim()

  return (
    <EditableBlock
      label={dept.name}
      className="relative"
      renderEditor={(close) => (
        <DeptEditor
          dept={dept}
          onSaved={() => {
            pushToast({ title: `${dept.name} 저장됨`, variant: 'success' })
            onUpdated?.()
            close()
          }}
          onError={(m) => pushToast({ title: '저장 실패', description: m, variant: 'error' })}
        />
      )}
    >
      <div className="py-4 sm:py-6">
        <div className="mx-auto w-full max-w-6xl px-1 sm:px-0">
          <div className="grid items-start gap-6 md:grid-cols-3 md:gap-8 lg:gap-10">
            <Reveal className="md:col-span-2">
              <div className="overflow-hidden">
                <img
                  src={dept.image}
                  alt={dept.name}
                  className="aspect-[16/10] w-full object-cover"
                  loading="lazy"
                />
              </div>
            </Reveal>
            <Reveal delay={80} className="md:col-span-1">
              <div className="flex h-full flex-col justify-center border-l border-paper-line pl-6 md:py-2 md:pl-8">
                <p className="index-num text-xs font-semibold tracking-[0.14em] text-gold-deep">교육부서</p>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-paper-text sm:text-3xl">
                  {dept.name}
                </h2>

                {age || place ? (
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-paper-muted">
                    {age ? (
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-gold-deep" aria-hidden />
                        {age}
                      </span>
                    ) : null}
                    {age && place ? <span aria-hidden>·</span> : null}
                    {place ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-gold-deep" aria-hidden />
                        {place}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-paper-muted sm:text-[15px]">
                  {dept.missionText}
                </div>

                {dept.scheduleInfo.trim() ? (
                  <p className="mt-6 inline-flex items-center gap-1.5 border-t border-paper-line pt-4 text-sm font-semibold text-gold-deep">
                    <CalendarDays className="h-4 w-4" aria-hidden />
                    모임 {dept.scheduleInfo}
                  </p>
                ) : null}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </EditableBlock>
  )
}

function DeptEditor({
  dept,
  onSaved,
  onError,
}: {
  dept: EducationDepartment
  onSaved: () => void
  onError: (m: string) => void
}) {
  const [form, setForm] = useState(dept)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(dept)
  }, [dept])

  const save = async () => {
    setSaving(true)
    try {
      await saveDocument('educationDepartments', dept.id, {
        deptKey: dept.deptKey,
        name: form.name.trim() || dept.name,
        missionText: form.missionText.trim() || dept.missionText,
        image: form.image.trim() || dept.image,
        scheduleInfo: form.scheduleInfo.trim(),
        targetAge: (form.targetAge ?? '').trim(),
        place: (form.place ?? '').trim(),
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
        label="대표 사진"
        imageOnly
        folder={`education/${dept.deptKey}`}
        required
        value={{ mediaUrl: form.image, mediaType: 'image' }}
        defaultUrl={dept.image}
        hint="부서 활동·가로 사진 권장 · 비우면 현재 이미지 유지"
        onChange={(m) => setForm({ ...form, image: m.mediaUrl })}
        onError={onError}
      />
      <FormField label="부서명" htmlFor={`edu-name-${dept.id}`} required hint="탭 제목으로도 표시">
        <Input
          id={`edu-name-${dept.id}`}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </FormField>
      <FormField label="대상" htmlFor={`edu-age-${dept.id}`} hint="예: 만 3~7세, 초등 1~6학년">
        <Input
          id={`edu-age-${dept.id}`}
          value={form.targetAge ?? ''}
          onChange={(e) => setForm({ ...form, targetAge: e.target.value })}
          placeholder="대상"
        />
      </FormField>
      <FormField label="장소" htmlFor={`edu-place-${dept.id}`} hint="예: 유치부실">
        <Input
          id={`edu-place-${dept.id}`}
          value={form.place ?? ''}
          onChange={(e) => setForm({ ...form, place: e.target.value })}
          placeholder="장소"
        />
      </FormField>
      <FormField
        label="모임 일정"
        htmlFor={`edu-schedule-${dept.id}`}
        hint="예: 주일 오전 11:00 · 금요 모임"
      >
        <Input
          id={`edu-schedule-${dept.id}`}
          value={form.scheduleInfo}
          onChange={(e) => setForm({ ...form, scheduleInfo: e.target.value })}
          placeholder="모임 일정"
        />
      </FormField>
      <FormField
        label="비전 / 소개"
        htmlFor={`edu-mission-${dept.id}`}
        required
        hint="여러 줄 입력 가능"
      >
        <Textarea
          id={`edu-mission-${dept.id}`}
          className="min-h-[140px]"
          value={form.missionText}
          onChange={(e) => setForm({ ...form, missionText: e.target.value })}
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
