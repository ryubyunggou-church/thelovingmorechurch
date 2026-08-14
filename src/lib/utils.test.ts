import { describe, expect, it } from 'vitest'
import { toTelHref } from './utils'

describe('toTelHref', () => {
  it('strips parentheses, dashes, and spaces', () => {
    expect(toTelHref('(02)453-7171')).toBe('tel:024537171')
  })

  it('keeps a leading + for international format', () => {
    expect(toTelHref('+82 2-453-7171')).toBe('tel:+8224537171')
  })

  it('trims surrounding whitespace', () => {
    expect(toTelHref('  031-123-4567  ')).toBe('tel:0311234567')
  })
})
