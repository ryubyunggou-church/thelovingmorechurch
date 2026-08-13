import { useCallback, useEffect, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { Seo } from '../components/shared/Seo'
import { TabbedPage } from '../components/shared/TabbedPage'
import { AboutChurchPanel } from '../features/about/AboutChurchPanel'
import { AboutPastorPanel } from '../features/about/AboutPastorPanel'
import { AboutStaffPanel } from '../features/about/AboutStaffPanel'
import {
  getAboutChurch,
  getAboutPastor,
  getStaffMembers,
} from '../lib/content-service'
import type { AboutChurch, AboutPastor, StaffMember } from '../types/content'
import { seedAboutChurch, seedAboutPastor, seedStaff } from '../data/seed'

export function AboutPage() {
  const [church, setChurch] = useState<AboutChurch>(seedAboutChurch)
  const [pastor, setPastor] = useState<AboutPastor>(seedAboutPastor)
  const [staff, setStaff] = useState<StaffMember[]>(seedStaff)

  const reload = useCallback(async () => {
    const [c, p, s] = await Promise.all([
      getAboutChurch(),
      getAboutPastor(),
      getStaffMembers(),
    ])
    setChurch(c)
    setPastor(p)
    setStaff(s)
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

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
              content: <AboutChurchPanel data={church} onUpdated={() => void reload()} />,
            },
            {
              key: 'pastor',
              label: '담임목사소개',
              content: <AboutPastorPanel data={pastor} onUpdated={() => void reload()} />,
            },
            {
              key: 'staff',
              label: '사역자소개',
              content: <AboutStaffPanel members={staff} onUpdated={() => void reload()} />,
            },
          ]}
        />
      </PageShell>
    </>
  )
}
