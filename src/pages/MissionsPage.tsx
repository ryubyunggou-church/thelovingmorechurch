import { useEffect, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { Seo } from '../components/shared/Seo'
import { TabbedPage } from '../components/shared/TabbedPage'
import { EditableBlock } from '../components/shared/EditableBlock'
import { FormField } from '../components/ui/form-field'
import { Textarea } from '../components/ui/textarea'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { getMissions, saveDocument } from '../lib/content-service'
import type { MissionItem } from '../types/content'
import { seedMissions } from '../data/seed'
import { useAdminStore } from '../store/admin-store'

export function MissionsPage() {
  const [items, setItems] = useState<MissionItem[]>(seedMissions)
  const pushToast = useAdminStore((s) => s.pushToast)

  const reload = async () => setItems(await getMissions())

  useEffect(() => {
    void reload()
  }, [])

  const domestic = items.filter((m) => m.type === 'domestic')
  const overseas = items.filter((m) => m.type === 'overseas')

  const renderList = (list: MissionItem[]) => (
    <div className="grid gap-4">
      {list.map((m) => (
        <EditableBlock
          key={m.id}
          label={m.name}
          renderEditor={(close) => (
            <MissionEditor
              item={m}
              onSave={async (next) => {
                try {
                  await saveDocument('missions', next.id, next as unknown as Record<string, unknown>)
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
            />
          )}
        >
          <article className="rounded-2xl border border-stone bg-cream p-6">
            <h3 className="text-lg font-semibold text-ink">{m.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{m.description}</p>
          </article>
        </EditableBlock>
      ))}
    </div>
  )

  return (
    <>
      <Seo title="선교사역" path="/missions" />
      <PageShell
        title="선교사역"
        description="국내와 국외에서 이어지는 복음 전파와 섬김을 소개합니다."
        current="선교사역"
      >
        <TabbedPage
          tabs={[
            { key: 'domestic', label: '국내선교', content: renderList(domestic) },
            { key: 'overseas', label: '국외선교', content: renderList(overseas) },
          ]}
        />
      </PageShell>
    </>
  )
}

function MissionEditor({
  item,
  onSave,
}: {
  item: MissionItem
  onSave: (m: MissionItem) => Promise<void>
}) {
  const [form, setForm] = useState(item)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(item)
  }, [item])

  return (
    <div className="space-y-4">
      <FormField
        label="사역 / 선교지 이름"
        htmlFor={`mission-name-${item.id}`}
        required
        hint="카드 제목으로 표시됩니다"
      >
        <Input
          id={`mission-name-${item.id}`}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="이름"
        />
      </FormField>
      <FormField
        label="설명"
        htmlFor={`mission-desc-${item.id}`}
        hint="사역 소개·기도 제목 등 본문"
      >
        <Textarea
          id={`mission-desc-${item.id}`}
          className="min-h-[120px]"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="설명"
        />
      </FormField>
      <div className="flex justify-end">
        <Button
          disabled={saving}
          onClick={() => {
            setSaving(true)
            void onSave({
              ...form,
              name: form.name.trim() || item.name,
              description: form.description.trim() || item.description,
            }).finally(() => setSaving(false))
          }}
        >
          저장 후 게시
        </Button>
      </div>
    </div>
  )
}
