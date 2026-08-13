import { useEffect, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { Seo } from '../components/shared/Seo'
import { ListPage } from '../components/shared/ListPage'
import { EditableBlock } from '../components/shared/EditableBlock'
import { FormField } from '../components/ui/form-field'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { getWorshipSchedule, saveDocument } from '../lib/content-service'
import type { WorshipScheduleItem } from '../types/content'
import { seedWorship } from '../data/seed'
import { useAdminStore } from '../store/admin-store'

export function WorshipPage() {
  const [items, setItems] = useState<WorshipScheduleItem[]>(seedWorship)
  const pushToast = useAdminStore((s) => s.pushToast)

  const reload = async () => setItems(await getWorshipSchedule())

  useEffect(() => {
    void reload()
  }, [])

  return (
    <>
      <Seo title="예배안내" path="/worship" />
      <PageShell
        title="예배안내"
        description="함께 예배하는 시간과 장소를 안내합니다."
        current="예배안내"
      >
        <EditableBlock
          label="예배안내 목록"
          renderEditor={(close) => (
            <WorshipEditor
              items={items}
              onSave={async (next) => {
                try {
                  await Promise.all(
                    next.map((item) =>
                      saveDocument(
                        'worshipSchedule',
                        item.id,
                        item as unknown as Record<string, unknown>,
                      ),
                    ),
                  )
                  pushToast({ title: '예배안내 저장됨', variant: 'success' })
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
          <ListPage
            items={items.map((i) => ({
              id: i.id,
              title: i.name,
              meta: i.time,
              note: i.note,
            }))}
          />
        </EditableBlock>
      </PageShell>
    </>
  )
}

function WorshipEditor({
  items,
  onSave,
}: {
  items: WorshipScheduleItem[]
  onSave: (items: WorshipScheduleItem[]) => Promise<void>
}) {
  const [draft, setDraft] = useState(items)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraft(items)
  }, [items])

  return (
    <div className="space-y-5">
      <p className="text-xs text-ink-muted">
        각 예배 행의 예배명·시간·비고를 수정한 뒤 저장하세요. 내용이 많으면 모달 안에서 스크롤됩니다.
      </p>
      {draft.map((item, idx) => (
        <div key={item.id} className="space-y-3 rounded-lg border border-stone p-3">
          <p className="text-xs font-semibold text-terracotta">예배 #{idx + 1}</p>
          <FormField label="예배명" htmlFor={`w-name-${item.id}`} hint="예: 주일 오전예배, 수요예배">
            <Input
              id={`w-name-${item.id}`}
              value={item.name}
              onChange={(e) => {
                const next = [...draft]
                next[idx] = { ...item, name: e.target.value }
                setDraft(next)
              }}
              placeholder="예배명"
            />
          </FormField>
          <FormField label="시간" htmlFor={`w-time-${item.id}`} hint="예: 오전 11:00">
            <Input
              id={`w-time-${item.id}`}
              value={item.time}
              onChange={(e) => {
                const next = [...draft]
                next[idx] = { ...item, time: e.target.value }
                setDraft(next)
              }}
              placeholder="시간"
            />
          </FormField>
          <FormField label="비고" htmlFor={`w-note-${item.id}`} hint="장소·요일 등 부가 정보">
            <Input
              id={`w-note-${item.id}`}
              value={item.note}
              onChange={(e) => {
                const next = [...draft]
                next[idx] = { ...item, note: e.target.value }
                setDraft(next)
              }}
              placeholder="비고"
            />
          </FormField>
        </div>
      ))}
      <div className="flex justify-end">
        <Button
          disabled={saving}
          onClick={() => {
            setSaving(true)
            void onSave(draft).finally(() => setSaving(false))
          }}
        >
          저장 후 게시
        </Button>
      </div>
    </div>
  )
}
