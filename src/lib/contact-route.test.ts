import { describe, expect, it } from 'vitest'
import { createBlankRoute, routesByIconType } from './contact-route'
import type { ContactRoute } from '../types/content'

const route = (partial: Partial<ContactRoute> & Pick<ContactRoute, 'id' | 'iconType' | 'order'>): ContactRoute => ({
  title: partial.title ?? partial.id,
  description: partial.description ?? '',
  ...partial,
})

describe('routesByIconType', () => {
  it('filters by iconType and sorts by order', () => {
    const routes: ContactRoute[] = [
      route({ id: 'b2', iconType: 'bus', order: 2, title: 'B' }),
      route({ id: 's1', iconType: 'subway', order: 2, title: '지하철2' }),
      route({ id: 'b1', iconType: 'bus', order: 1, title: 'A' }),
      route({ id: 's0', iconType: 'subway', order: 1, title: '지하철1' }),
    ]
    expect(routesByIconType(routes, 'bus').map((r) => r.id)).toEqual(['b1', 'b2'])
    expect(routesByIconType(routes, 'subway').map((r) => r.title)).toEqual(['지하철1', '지하철2'])
  })

  it('returns an empty list when none match', () => {
    expect(routesByIconType([route({ id: 'w', iconType: 'walk', order: 1 })], 'bus')).toEqual([])
  })
})

describe('createBlankRoute', () => {
  it('creates a blank route with the given iconType and order', () => {
    const r = createBlankRoute('subway', 3, 1700000000000)
    expect(r).toMatchObject({
      id: 'route_1700000000000',
      iconType: 'subway',
      title: '',
      description: '',
      order: 3,
    })
  })
})
