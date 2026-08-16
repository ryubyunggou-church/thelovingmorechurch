import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { SitePopup } from '../types/content'
import {
  getActivePopupQueue,
  getPopupHiddenUntil,
  hidePopupFor,
  isPopupActiveOn,
  isPopupHiddenNow,
  sortPopupsByPriority,
} from './popup-visibility'

function makePopup(overrides: Partial<SitePopup> = {}): SitePopup {
  return {
    id: 'p1',
    label: '테스트 팝업',
    enabled: true,
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    contentType: 'richtext',
    contentHtml: '내용',
    position: 'center',
    priority: 0,
    hideForHours: 24,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('isPopupActiveOn', () => {
  it('is active within the date range when enabled', () => {
    expect(isPopupActiveOn(makePopup(), '2026-08-15')).toBe(true)
  })

  it('is inactive before start or after end', () => {
    expect(isPopupActiveOn(makePopup(), '2026-07-31')).toBe(false)
    expect(isPopupActiveOn(makePopup(), '2026-09-01')).toBe(false)
  })

  it('is inactive when disabled even within range', () => {
    expect(isPopupActiveOn(makePopup({ enabled: false }), '2026-08-15')).toBe(false)
  })
})

describe('sortPopupsByPriority', () => {
  it('sorts by priority descending, then updatedAt descending', () => {
    const a = makePopup({ id: 'a', priority: 1, updatedAt: '2026-08-01T00:00:00.000Z' })
    const b = makePopup({ id: 'b', priority: 5, updatedAt: '2026-08-01T00:00:00.000Z' })
    const c = makePopup({ id: 'c', priority: 5, updatedAt: '2026-08-02T00:00:00.000Z' })

    expect(sortPopupsByPriority([a, b, c]).map((p) => p.id)).toEqual(['c', 'b', 'a'])
  })
})

describe('getActivePopupQueue', () => {
  it('filters to active popups only, sorted by priority', () => {
    const active = makePopup({ id: 'active', priority: 1 })
    const expired = makePopup({ id: 'expired', endDate: '2026-07-01' })
    const highPriority = makePopup({ id: 'high', priority: 9 })

    const queue = getActivePopupQueue([active, expired, highPriority], '2026-08-15')
    expect(queue.map((p) => p.id)).toEqual(['high', 'active'])
  })
})

describe('localStorage hide/show', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('is not hidden by default', () => {
    expect(isPopupHiddenNow('p1')).toBe(false)
    expect(getPopupHiddenUntil('p1')).toBe(0)
  })

  it('hides for the given number of hours', () => {
    const now = new Date('2026-08-15T00:00:00.000Z').getTime()
    hidePopupFor('p1', 24, now)

    expect(isPopupHiddenNow('p1', now + 1000)).toBe(true)
    expect(isPopupHiddenNow('p1', now + 25 * 60 * 60 * 1000)).toBe(false)
  })

  it('does not persist anything when hideForHours is 0', () => {
    hidePopupFor('p1', 0)
    expect(getPopupHiddenUntil('p1')).toBe(0)
  })
})
