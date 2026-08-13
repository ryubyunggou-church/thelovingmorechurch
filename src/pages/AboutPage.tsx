import { useEffect, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { Seo } from '../components/shared/Seo'
import { TabbedPage } from '../components/shared/TabbedPage'
import { EditableBlock } from '../components/shared/EditableBlock'
import { FormField } from '../components/ui/form-field'
import { Textarea } from '../components/ui/textarea'
import { Button } from '../components/ui/button'
import { getAboutTabs, getStaffMembers, saveDocument } from '../lib/content-service'
import type { AboutTab, StaffMember } from '../types/content'
import { seedAboutTabs, seedStaff } from '../data/seed'
import { useAdminStore } from '../store/admin-store'

export function AboutPage() {
  const [tabs, setTabs] = useState<AboutTab[]>(seedAboutTabs)
  const [staff, setStaff] = useState<StaffMember[]>(seedStaff)
  const pushToast = useAdminStore((s) => s.pushToast)

  const reload = async () => {
    setTabs(await getAboutTabs())
    setStaff(await getStaffMembers())
  }

  useEffect(() => {
    void reload()
  }, [])

  const saveTab = async (tab: AboutTab, content: string) => {
    try {
      await saveDocument('aboutTabs', tab.id, { ...tab, content })
      pushToast({ title: '저장됨', variant: 'success' })
      await reload()
    } catch (err) {
      pushToast({
        title: '저장 실패',
        description: err instanceof Error ? err.message : '',
        variant: 'error',
      })
    }
  }

  return (
    <>
      <Seo title="교회소개" path="/about" />
      <PageShell
        title="교회소개"
        description="교회의 비전과 사역, 섬기는 이들을 소개합니다."
        current="교회소개"
      >
        <TabbedPage
          tabs={[
            {
              key: 'church',
              label: '교회소개',
              content: (
                <AboutTabPanel
                  tab={tabs.find((t) => t.tabKey === 'church') ?? seedAboutTabs[0]!}
                  onSave={saveTab}
                />
              ),
            },
            {
              key: 'pastor',
              label: '담임목사소개',
              content: (
                <AboutTabPanel
                  tab={tabs.find((t) => t.tabKey === 'pastor') ?? seedAboutTabs[1]!}
                  onSave={saveTab}
                />
              ),
            },
            {
              key: 'staff',
              label: '사역자소개',
              content: (
                <div className="space-y-8">
                  <AboutTabPanel
                    tab={tabs.find((t) => t.tabKey === 'staff') ?? seedAboutTabs[2]!}
                    onSave={saveTab}
                  />
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {staff.map((m) => (
                      <article
                        key={m.id}
                        className="overflow-hidden rounded-2xl border border-stone bg-cream shadow-sm"
                      >
                        <img
                          src={m.photoUrl}
                          alt={m.name}
                          className="aspect-[4/3] w-full object-cover"
                          loading="lazy"
                        />
                        <div className="p-4">
                          <p className="text-xs font-semibold text-terracotta">{m.role}</p>
                          <h3 className="mt-1 font-medium text-ink">{m.name}</h3>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ),
            },
          ]}
        />
      </PageShell>
    </>
  )
}

function AboutTabPanel({
  tab,
  onSave,
}: {
  tab: AboutTab
  onSave: (tab: AboutTab, content: string) => Promise<void>
}) {
  const [draft, setDraft] = useState(tab.content)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraft(tab.content)
  }, [tab.id, tab.content])

  return (
    <EditableBlock
      label={tab.title}
      renderEditor={(close) => (
        <div className="space-y-4">
          <FormField
            label="본문 내용"
            htmlFor={`about-${tab.id}`}
            required
            hint={`${tab.title} 탭에 표시되는 소개 글입니다. 여러 줄 입력이 가능합니다.`}
          >
            <Textarea
              id={`about-${tab.id}`}
              className="min-h-[180px]"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="소개 본문"
            />
          </FormField>
          <div className="flex justify-end">
            <Button
              disabled={saving}
              onClick={() => {
                setSaving(true)
                void onSave(tab, draft.trim() || tab.content)
                  .then(close)
                  .finally(() => setSaving(false))
              }}
            >
              저장 후 게시
            </Button>
          </div>
        </div>
      )}
    >
      <div className="prose prose-stone max-w-none whitespace-pre-line text-ink-muted">
        {tab.content}
      </div>
    </EditableBlock>
  )
}
