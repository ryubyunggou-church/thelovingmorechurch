import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from './sanitize'

describe('sanitizeHtml', () => {
  it('strips script tags', () => {
    const dirty = '<p>ok</p><script>alert(1)</script>'
    const clean = sanitizeHtml(dirty)
    expect(clean).toContain('ok')
    expect(clean.toLowerCase()).not.toContain('<script')
  })

  it('strips onerror attributes', () => {
    const dirty = '<img src=x onerror="alert(1)" />'
    const clean = sanitizeHtml(dirty)
    expect(clean.toLowerCase()).not.toContain('onerror')
  })
})
