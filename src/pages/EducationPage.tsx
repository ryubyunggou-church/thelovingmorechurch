import { useCallback, useEffect, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { Seo } from '../components/shared/Seo'
import { TabbedPage, type TabItem } from '../components/shared/TabbedPage'
import { EducationDeptPanel } from '../features/education/EducationDeptPanel'
import { EducationDeptManagePanel } from '../features/education/EducationDeptManagePanel'
import { getEducationDepartments } from '../lib/content-service'
import type { EducationDepartment } from '../types/content'
import { seedEducation } from '../data/seed'
import { useAdminStore } from '../store/admin-store'

export function EducationPage() {
  const [depts, setDepts] = useState<EducationDepartment[]>(seedEducation)
  const isAdminMode = useAdminStore((s) => s.isAdminMode)

  const reload = useCallback(async () => {
    setDepts(await getEducationDepartments())
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const tabs: TabItem[] = depts.map((dept) => ({
    key: dept.deptKey,
    label: dept.name,
    content: <EducationDeptPanel dept={dept} onUpdated={() => void reload()} />,
  }))

  if (isAdminMode) {
    tabs.push({
      key: '__manage__',
      label: '부서추가/삭제',
      content: <EducationDeptManagePanel depts={depts} onUpdated={() => void reload()} />,
    })
  }

  return (
    <>
      <Seo title="교육부서" path="/education" />
      <PageShell
        title="교육부서"
        description="다음세대를 말씀으로 양육하는 교육 사역을 소개합니다."
        current="교육부서"
      >
        <TabbedPage tabs={tabs} />
      </PageShell>
    </>
  )
}
