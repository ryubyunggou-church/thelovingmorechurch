import { useCallback, useEffect, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { Seo } from '../components/shared/Seo'
import { TabbedPage } from '../components/shared/TabbedPage'
import { MissionListPanel } from '../features/missions/MissionListPanel'
import { getMissions } from '../lib/content-service'
import type { MissionItem } from '../types/content'
import { seedMissions } from '../data/seed'

export function MissionsPage() {
  const [items, setItems] = useState<MissionItem[]>(seedMissions)

  const reload = useCallback(async () => {
    setItems(await getMissions())
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

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
            {
              key: 'domestic',
              label: '국내선교',
              content: (
                <MissionListPanel
                  items={items}
                  type="domestic"
                  heading="국내선교"
                  description="이웃과 동역 교회를 섬기는 국내 사역을 소개합니다."
                  onUpdated={() => void reload()}
                />
              ),
            },
            {
              key: 'overseas',
              label: '국외선교',
              content: (
                <MissionListPanel
                  items={items}
                  type="overseas"
                  heading="국외선교"
                  description="열방을 향해 이어지는 파송·후원·중보 사역을 소개합니다."
                  onUpdated={() => void reload()}
                />
              ),
            },
          ]}
        />
      </PageShell>
    </>
  )
}
