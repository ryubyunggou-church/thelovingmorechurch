import { describe, expect, it } from 'vitest'
import { createBlankSitePopup, nextSitePopupId } from './popup-list'

describe('nextSitePopupId', () => {
  it('prefixes the timestamp with popup_', () => {
    expect(nextSitePopupId(12345)).toBe('popup_12345')
  })
})

describe('createBlankSitePopup', () => {
  it('creates a disabled markdown popup defaulting to today', () => {
    const now = new Date('2026-08-16T03:00:00.000Z').getTime()
    const popup = createBlankSitePopup(now)

    expect(popup.id).toBe(`popup_${now}`)
    expect(popup.enabled).toBe(false)
    expect(popup.contentType).toBe('markdown')
    expect(popup.startDate).toBe('2026-08-16')
    expect(popup.endDate).toBe('2026-08-16')
    expect(popup.position).toBe('center')
    expect(popup.hideForHours).toBe(24)
  })
})
