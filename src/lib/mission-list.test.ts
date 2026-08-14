import { describe, expect, it } from 'vitest'
import { createBlankMission, missionsByType } from './mission-list'
import { missionPlaceholderImages } from '../data/seed'
import type { MissionItem } from '../types/content'

const item = (partial: Partial<MissionItem> & Pick<MissionItem, 'id' | 'type' | 'order'>): MissionItem => ({
  name: partial.name ?? partial.id,
  description: partial.description ?? '',
  region: partial.region,
  image: partial.image,
  ...partial,
})

describe('missionsByType', () => {
  it('filters by type and sorts by order', () => {
    const items: MissionItem[] = [
      item({ id: 'o2', type: 'overseas', order: 2, name: 'B' }),
      item({ id: 'd1', type: 'domestic', order: 2, name: '국내2' }),
      item({ id: 'o1', type: 'overseas', order: 1, name: 'A' }),
      item({ id: 'd0', type: 'domestic', order: 1, name: '국내1' }),
    ]
    expect(missionsByType(items, 'overseas').map((m) => m.id)).toEqual(['o1', 'o2'])
    expect(missionsByType(items, 'domestic').map((m) => m.name)).toEqual(['국내1', '국내2'])
  })

  it('returns an empty list when none match', () => {
    expect(missionsByType([item({ id: 'd', type: 'domestic', order: 1 })], 'overseas')).toEqual([])
  })
})

describe('createBlankMission', () => {
  it('assigns type-specific default names and a stable id prefix', () => {
    const domestic = createBlankMission('domestic', 3, 1700000000000)
    const overseas = createBlankMission('overseas', 1, 1700000000001)
    expect(domestic).toMatchObject({
      id: 'm_1700000000000',
      type: 'domestic',
      name: '새 국내 사역',
      order: 3,
      region: '',
    })
    expect(overseas.name).toBe('새 선교지')
    expect(overseas.type).toBe('overseas')
  })

  it('auto-assigns a placeholder image from the type-specific pool instead of leaving it blank', () => {
    const domestic = createBlankMission('domestic', 1)
    const overseas = createBlankMission('overseas', 1)
    expect(missionPlaceholderImages.domestic).toContain(domestic.image)
    expect(missionPlaceholderImages.overseas).toContain(overseas.image)
    expect(domestic.image).not.toBe(overseas.image)
  })

  it('cycles within its own type pool and never crosses into the other type', () => {
    const domesticPoolSize = missionPlaceholderImages.domestic.length
    const first = createBlankMission('domestic', 1)
    const wrapped = createBlankMission('domestic', 1 + domesticPoolSize)
    expect(wrapped.image).toBe(first.image)
    expect(missionPlaceholderImages.overseas).not.toContain(first.image)
  })
})
