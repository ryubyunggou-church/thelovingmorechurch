import { useCallback, useEffect, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { Seo } from '../components/shared/Seo'
import { TabbedPage } from '../components/shared/TabbedPage'
import { EducationDeptPanel } from '../features/education/EducationDeptPanel'
import { getEducationDepartments } from '../lib/content-service'
import type { EducationDepartment } from '../types/content'
import { seedEducation } from '../data/seed'

export function EducationPage() {
  const [depts, setDepts] = useState<EducationDepartment[]>(seedEducation)

  const reload = useCallback(async () => {
    setDepts(await getEducationDepartments())
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  return (
    <>
      <Seo title="교육부서" path="/education" />
      <PageShell
        title="교육부서"
        description="다음세대를 말씀으로 양육하는 교육 사역을 소개합니다."
        current="교육부서"
      >
        <TabbedPage
          tabs={depts.map((dept) => ({
            key: dept.deptKey,
            label: dept.name,
            content: <EducationDeptPanel dept={dept} onUpdated={() => void reload()} />,
          }))}
        />
      </PageShell>
    </>
  )
}
