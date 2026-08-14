import type { EducationDepartment } from '../types/content'
import { seedEducation } from '../data/seed'

export const EDUCATION_DEPT_ORDER = [
  'kindergarten',
  'elementary',
  'youth',
  'youngadult',
] as const

function requiredField(remote: string | undefined, fallback: string): string {
  const value = remote?.trim()
  return value || fallback
}

/** 원격에 키가 있으면(빈 문자열 포함) 유지. 키가 없을 때만 시드. */
function optionalField(remote: string | undefined, fallback: string | undefined): string {
  if (remote === undefined) return fallback ?? ''
  return remote
}

/** 고정 4탭 순서. 빠진 탭 키만 시드로 채운다. */
export function orderEducationDepartments(
  remote: EducationDepartment[],
  seeds: EducationDepartment[] = seedEducation,
): EducationDepartment[] {
  return EDUCATION_DEPT_ORDER.flatMap((key) => {
    const fromRemote = remote.find((d) => d.deptKey === key)
    const fromSeed = seeds.find((d) => d.deptKey === key)
    if (!fromSeed) return fromRemote ? [fromRemote] : []
    if (!fromRemote) return [fromSeed]
    return [
      {
        ...fromSeed,
        ...fromRemote,
        name: requiredField(fromRemote.name, fromSeed.name),
        missionText: requiredField(fromRemote.missionText, fromSeed.missionText),
        image: requiredField(fromRemote.image, fromSeed.image),
        scheduleInfo: optionalField(fromRemote.scheduleInfo, fromSeed.scheduleInfo),
        targetAge: optionalField(fromRemote.targetAge, fromSeed.targetAge),
        place: optionalField(fromRemote.place, fromSeed.place),
      },
    ]
  })
}
