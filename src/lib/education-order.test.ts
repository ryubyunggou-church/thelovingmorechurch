import { describe, expect, it } from 'vitest'
import { educationPlaceholderImages, seedEducation } from '../data/seed'
import {
  createBlankEducationDept,
  isDefaultEducationDept,
  orderEducationDepartments,
} from './education-order'
import type { EducationDepartment } from '../types/content'

const sample = (
  partial: Partial<EducationDepartment> & Pick<EducationDepartment, 'deptKey'>,
): EducationDepartment => ({
  id: partial.id ?? partial.deptKey,
  name: partial.name ?? '',
  missionText: partial.missionText ?? '',
  image: partial.image ?? '',
  scheduleInfo: partial.scheduleInfo ?? '',
  order: partial.order ?? 0,
  targetAge: partial.targetAge,
  place: partial.place,
  deptKey: partial.deptKey,
})

describe('orderEducationDepartments', () => {
  it('returns three tabs in fixed order from seed when remote is empty', () => {
    const result = orderEducationDepartments([])
    expect(result.map((d) => d.deptKey)).toEqual(['elementary', 'youth', 'youngadult'])
    expect(result[0]?.name).toBe('유초등부')
    expect(result[2]?.name).toBe('청년대학부')
  })

  it('fills a missing remote department from seed', () => {
    const remote = [
      sample({
        deptKey: 'elementary',
        name: '유초등부(원격)',
        missionText: '원격 본문',
        image: 'https://example.com/e.jpg',
        scheduleInfo: '주일 9:00',
        order: 1,
      }),
    ]
    const result = orderEducationDepartments(remote)
    expect(result).toHaveLength(3)
    expect(result[0]?.name).toBe('유초등부(원격)')
    expect(result[1]?.name).toBe(seedEducation[1]?.name)
    expect(result[1]?.deptKey).toBe('youth')
  })

  it('falls back to seed for required fields (including scheduleInfo) when remote values are blank', () => {
    const remote = [
      sample({
        deptKey: 'youth',
        name: '   ',
        missionText: '',
        image: '',
        scheduleInfo: '',
        order: 2,
      }),
    ]
    const result = orderEducationDepartments(remote)
    const youth = result.find((d) => d.deptKey === 'youth')
    const seedYouth = seedEducation.find((d) => d.deptKey === 'youth')
    expect(youth?.name).toBe(seedYouth?.name)
    expect(youth?.missionText).toBe(seedYouth?.missionText)
    expect(youth?.image).toBe(seedYouth?.image)
    expect(youth?.scheduleInfo).toBe(seedYouth?.scheduleInfo)
  })

  it('keeps empty optional fields instead of refilling seed', () => {
    const remote = [
      sample({
        deptKey: 'youth',
        name: '중고등부',
        missionText: '본문',
        image: 'https://example.com/y.jpg',
        scheduleInfo: '금요 모임',
        targetAge: '',
        place: '',
        order: 2,
      }),
    ]
    const result = orderEducationDepartments(remote)
    const youth = result.find((d) => d.deptKey === 'youth')
    expect(youth?.targetAge).toBe('')
    expect(youth?.place).toBe('')
  })

  it('fills optional fields from seed only when the remote key is missing', () => {
    const remote = [
      sample({
        deptKey: 'elementary',
        name: '유초등부',
        missionText: '본문',
        image: 'https://example.com/e.jpg',
        order: 1,
      }),
    ]
    delete remote[0]!.targetAge
    delete remote[0]!.place
    const result = orderEducationDepartments(remote)
    const elem = result.find((d) => d.deptKey === 'elementary')
    const seedElem = seedEducation.find((d) => d.deptKey === 'elementary')
    expect(elem?.targetAge).toBe(seedElem?.targetAge)
    expect(elem?.place).toBe(seedElem?.place)
  })

  it('appends custom (non-default) departments after the fixed three, sorted by order', () => {
    const remote = [
      ...seedEducation,
      sample({ deptKey: 'custom_2', name: '신규부서2', order: 6 }),
      sample({ deptKey: 'custom_1', name: '신규부서1', order: 5 }),
    ]
    const result = orderEducationDepartments(remote)
    expect(result.map((d) => d.deptKey)).toEqual([
      'elementary',
      'youth',
      'youngadult',
      'custom_1',
      'custom_2',
    ])
    expect(result[3]?.name).toBe('신규부서1')
    expect(result[4]?.name).toBe('신규부서2')
  })
})

describe('isDefaultEducationDept', () => {
  it('treats the fixed three keys as default (non-deletable)', () => {
    expect(isDefaultEducationDept('elementary')).toBe(true)
    expect(isDefaultEducationDept('youth')).toBe(true)
    expect(isDefaultEducationDept('youngadult')).toBe(true)
  })

  it('treats any other key as a custom (deletable) department', () => {
    expect(isDefaultEducationDept('kindergarten')).toBe(false)
    expect(isDefaultEducationDept('custom_123')).toBe(false)
    expect(isDefaultEducationDept('unknown')).toBe(false)
  })
})

describe('createBlankEducationDept', () => {
  it('creates a blank custom department with the given order', () => {
    const dept = createBlankEducationDept(5, 1700000000000)
    expect(dept).toMatchObject({
      id: 'edu_1700000000000',
      deptKey: 'custom_1700000000000',
      name: '새 부서',
      missionText: '',
      scheduleInfo: '',
      order: 5,
    })
    expect(isDefaultEducationDept(dept.deptKey)).toBe(false)
  })

  it('auto-assigns a placeholder image from the pool instead of leaving it blank', () => {
    const dept = createBlankEducationDept(5)
    expect(dept.image).toBeTruthy()
    expect(educationPlaceholderImages).toContain(dept.image)
  })

  it('cycles through the placeholder pool as order increases, wrapping around', () => {
    const poolSize = educationPlaceholderImages.length
    const first = createBlankEducationDept(1)
    const wrapped = createBlankEducationDept(1 + poolSize)
    expect(first.image).toBe(educationPlaceholderImages[0])
    expect(wrapped.image).toBe(first.image)
  })
})
