import { describe, expect, it } from 'vitest'
import { seedEducation } from '../data/seed'
import { orderEducationDepartments } from './education-order'
import type { EducationDepartment } from '../types/content'

const sample = (partial: Partial<EducationDepartment> & Pick<EducationDepartment, 'deptKey'>): EducationDepartment => ({
  id: partial.id ?? partial.deptKey,
  name: partial.name ?? '',
  missionText: partial.missionText ?? '',
  image: partial.image ?? '',
  scheduleInfo: partial.scheduleInfo ?? '',
  targetAge: partial.targetAge,
  place: partial.place,
  deptKey: partial.deptKey,
})

describe('orderEducationDepartments', () => {
  it('returns four tabs in fixed order from seed when remote is empty', () => {
    const result = orderEducationDepartments([])
    expect(result.map((d) => d.deptKey)).toEqual([
      'kindergarten',
      'elementary',
      'youth',
      'youngadult',
    ])
    expect(result[0]?.name).toBe('유치부')
    expect(result[3]?.name).toBe('청년가족부')
  })

  it('fills a missing remote department from seed', () => {
    const remote = [
      sample({
        deptKey: 'kindergarten',
        name: '유치부(원격)',
        missionText: '원격 본문',
        image: 'https://example.com/k.jpg',
        scheduleInfo: '주일 9:00',
      }),
    ]
    const result = orderEducationDepartments(remote)
    expect(result).toHaveLength(4)
    expect(result[0]?.name).toBe('유치부(원격)')
    expect(result[1]?.name).toBe(seedEducation[1]?.name)
    expect(result[1]?.deptKey).toBe('elementary')
  })

  it('falls back to seed for required fields when remote values are blank', () => {
    const remote = [
      sample({
        deptKey: 'youth',
        name: '   ',
        missionText: '',
        image: '',
      }),
    ]
    const result = orderEducationDepartments(remote)
    const youth = result.find((d) => d.deptKey === 'youth')
    const seedYouth = seedEducation.find((d) => d.deptKey === 'youth')
    expect(youth?.name).toBe(seedYouth?.name)
    expect(youth?.missionText).toBe(seedYouth?.missionText)
    expect(youth?.image).toBe(seedYouth?.image)
  })

  it('keeps empty optional fields instead of refilling seed', () => {
    const remote = [
      sample({
        deptKey: 'youth',
        name: '중고등부',
        missionText: '본문',
        image: 'https://example.com/y.jpg',
        scheduleInfo: '',
        targetAge: '',
        place: '',
      }),
    ]
    const result = orderEducationDepartments(remote)
    const youth = result.find((d) => d.deptKey === 'youth')
    expect(youth?.scheduleInfo).toBe('')
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
      }),
    ]
    delete remote[0]!.targetAge
    delete remote[0]!.place
    delete remote[0]!.scheduleInfo
    const result = orderEducationDepartments(remote)
    const elem = result.find((d) => d.deptKey === 'elementary')
    const seedElem = seedEducation.find((d) => d.deptKey === 'elementary')
    expect(elem?.targetAge).toBe(seedElem?.targetAge)
    expect(elem?.place).toBe(seedElem?.place)
    expect(elem?.scheduleInfo).toBe(seedElem?.scheduleInfo)
  })

  it('ignores unknown department keys', () => {
    const remote = [
      sample({
        deptKey: 'youth',
        name: '중고등부',
        missionText: '본문',
        image: 'x',
        scheduleInfo: 'y',
      }),
      {
        ...sample({
          deptKey: 'youth',
          name: '무시됨',
          missionText: '',
          image: '',
          scheduleInfo: '',
        }),
        deptKey: 'unknown' as EducationDepartment['deptKey'],
      },
    ]
    const result = orderEducationDepartments(remote)
    expect(result.map((d) => d.deptKey)).toEqual([
      'kindergarten',
      'elementary',
      'youth',
      'youngadult',
    ])
    expect(result.find((d) => d.deptKey === 'youth')?.name).toBe('중고등부')
  })
})
