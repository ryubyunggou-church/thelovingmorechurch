import { useEffect, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { Seo } from '../components/shared/Seo'
import { TabbedPage } from '../components/shared/TabbedPage'
import { EditableBlock } from '../components/shared/EditableBlock'
import { FormField } from '../components/ui/form-field'
import { MediaInputField } from '../components/shared/MediaInputField'
import { Textarea } from '../components/ui/textarea'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { getEducationDepartments, saveDocument } from '../lib/content-service'
import type { EducationDepartment } from '../types/content'
import { seedEducation } from '../data/seed'
import { useAdminStore } from '../store/admin-store'

export function EducationPage() {
  const [depts, setDepts] = useState<EducationDepartment[]>(seedEducation)
  const pushToast = useAdminStore((s) => s.pushToast)

  const reload = async () => setDepts(await getEducationDepartments())

  useEffect(() => {
    void reload()
  }, [])

  const ordered = [
    depts.find((d) => d.deptKey === 'kindergarten'),
    depts.find((d) => d.deptKey === 'elementary'),
    depts.find((d) => d.deptKey === 'youth'),
    depts.find((d) => d.deptKey === 'youngadult'),
  ].filter(Boolean) as EducationDepartment[]

  return (
    <>
      <Seo title="교육부서" path="/education" />
      <PageShell
        title="교육부서"
        description="다음세대를 말씀으로 양육하는 교육 사역을 소개합니다."
        current="교육부서"
      >
        <TabbedPage
          tabs={ordered.map((dept) => ({
            key: dept.deptKey,
            label: dept.name,
            content: (
              <EditableBlock
                label={dept.name}
                renderEditor={(close) => (
                  <DeptEditor
                    dept={dept}
                    onSave={async (next) => {
                      try {
                        await saveDocument(
                          'educationDepartments',
                          next.id,
                          next as unknown as Record<string, unknown>,
                        )
                        pushToast({ title: '저장됨', variant: 'success' })
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
                    onError={(m) =>
                      pushToast({ title: '저장 실패', description: m, variant: 'error' })
                    }
                  />
                )}
              >
                <div className="grid gap-8 md:grid-cols-2">
                  <img
                    src={dept.image}
                    alt={dept.name}
                    className="aspect-[4/3] w-full rounded-2xl object-cover"
                    loading="lazy"
                  />
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-ink">{dept.name}</h2>
                    <p className="mt-4 leading-relaxed text-ink-muted">{dept.missionText}</p>
                    <p className="mt-6 text-sm font-semibold text-terracotta">
                      모임: {dept.scheduleInfo}
                    </p>
                  </div>
                </div>
              </EditableBlock>
            ),
          }))}
        />
      </PageShell>
    </>
  )
}

function DeptEditor({
  dept,
  onSave,
  onError,
}: {
  dept: EducationDepartment
  onSave: (d: EducationDepartment) => Promise<void>
  onError: (m: string) => void
}) {
  const [form, setForm] = useState(dept)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(dept)
  }, [dept])

  return (
    <div className="space-y-4">
      <FormField
        label="비전 / 소개"
        htmlFor={`edu-mission-${dept.id}`}
        required
        hint="부서의 사명·소개 문구"
      >
        <Textarea
          id={`edu-mission-${dept.id}`}
          value={form.missionText}
          onChange={(e) => setForm({ ...form, missionText: e.target.value })}
          className="min-h-[120px]"
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

      <MediaInputField
        label="대표 이미지"
        imageOnly
        folder="education"
        value={{ mediaUrl: form.image, mediaType: 'image' }}
        defaultUrl={dept.image}
        onChange={(m) => setForm({ ...form, image: m.mediaUrl })}
        onError={onError}
      />

      <div className="flex justify-end">
        <Button
          disabled={saving}
          onClick={() => {
            setSaving(true)
            void onSave({
              ...form,
              image: form.image.trim() || dept.image,
              missionText: form.missionText.trim() || dept.missionText,
              scheduleInfo: form.scheduleInfo.trim() || dept.scheduleInfo,
            }).finally(() => setSaving(false))
          }}
        >
          저장 후 게시
        </Button>
      </div>
    </div>
  )
}
