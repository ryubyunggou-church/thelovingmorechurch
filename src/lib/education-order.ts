import type { EducationDepartment } from '../types/content'
import { educationPlaceholderImages, seedEducation } from '../data/seed'

/** 기본 4부서 고정 순서 — 삭제 불가 판별 기준으로도 재사용 */
export const EDUCATION_DEPT_ORDER = [
  'kindergarten',
  'elementary',
  'youth',
  'youngadult',
] as const

/** 기본 4부서 여부 (기본 부서는 삭제 불가) */
export function isDefaultEducationDept(deptKey: string): boolean {
  return (EDUCATION_DEPT_ORDER as readonly string[]).includes(deptKey)
}

function requiredField(remote: string | undefined, fallback: string): string {
  const value = remote?.trim()
  return value || fallback
}

/** 원격에 키가 있으면(빈 문자열 포함) 유지. 키가 없을 때만 시드. */
function optionalField(remote: string | undefined, fallback: string | undefined): string {
  if (remote === undefined) return fallback ?? ''
  return remote
}

/**
 * 기본 4부서는 고정 순서로 시드와 병합해 항상 노출하고,
 * 관리자가 추가한 부서(기본 4개 외 deptKey)는 그 뒤에 order 오름차순으로 이어붙인다.
 */
export function orderEducationDepartments(
  remote: EducationDepartment[],
  seeds: EducationDepartment[] = seedEducation,
): EducationDepartment[] {
  const defaults = EDUCATION_DEPT_ORDER.flatMap((key) => {
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
        scheduleInfo: requiredField(fromRemote.scheduleInfo, fromSeed.scheduleInfo),
        targetAge: optionalField(fromRemote.targetAge, fromSeed.targetAge),
        place: optionalField(fromRemote.place, fromSeed.place),
      },
    ]
  })

  const customs = remote
    .filter((d) => !isDefaultEducationDept(d.deptKey))
    .sort((a, b) => a.order - b.order)

  return [...defaults, ...customs]
}

/** order 기준으로 대표사진 후보군을 순환 배정 (음수/0도 항상 유효한 인덱스로 감싼다). */
function pickPlaceholderImage(order: number, pool: string[] = educationPlaceholderImages): string {
  if (pool.length === 0) return ''
  const index = ((order - 1) % pool.length + pool.length) % pool.length
  return pool[index]!
}

/**
 * 관리자 "부서 추가"로 생성되는 빈 부서 — 저장 후 해당 탭에서 개별 수정한다.
 * 대표사진은 비워두지 않고 풀에서 하나를 자동 배정해, 기존 4부서처럼 placeholder가 채워진 채로 시작한다.
 */
export function createBlankEducationDept(order: number, now = Date.now()): EducationDepartment {
  return {
    id: `edu_${now}`,
    deptKey: `custom_${now}`,
    name: '새 부서',
    missionText: '',
    image: pickPlaceholderImage(order),
    scheduleInfo: '',
    targetAge: '',
    place: '',
    order,
  }
}
