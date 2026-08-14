import { describe, expect, it } from 'vitest'
import { isMapEmbedUrl, normalizeMapEmbed } from './map-embed'

describe('normalizeMapEmbed', () => {
  it('returns a plain URL unchanged', () => {
    expect(normalizeMapEmbed('https://map.kakao.com/embed/1234')).toBe(
      'https://map.kakao.com/embed/1234',
    )
  })

  it('extracts the src attribute from a pasted <iframe> tag (double quotes)', () => {
    const pasted =
      '<iframe src="https://map.kakao.com/embed/1234" width="640" height="360"></iframe>'
    expect(normalizeMapEmbed(pasted)).toBe('https://map.kakao.com/embed/1234')
  })

  it('extracts the src attribute from a pasted <iframe> tag (single quotes)', () => {
    const pasted = "<iframe src='https://map.kakao.com/embed/5678'></iframe>"
    expect(normalizeMapEmbed(pasted)).toBe('https://map.kakao.com/embed/5678')
  })

  it('passes through non-iframe HTML (kakao static image+link share widget) as-is', () => {
    const widget =
      '<a href="https://map.kakao.com/?urlX=1" target="_blank"><img src="https://staticmap.kakao.com/map"></a>'
    expect(normalizeMapEmbed(widget)).toBe(widget)
  })

  it('trims surrounding whitespace', () => {
    expect(normalizeMapEmbed('  https://map.kakao.com/embed/1234  ')).toBe(
      'https://map.kakao.com/embed/1234',
    )
  })

  it('returns an empty string for blank input', () => {
    expect(normalizeMapEmbed('   ')).toBe('')
  })
})

describe('isMapEmbedUrl', () => {
  it('treats a plain http(s) URL as an iframe-able URL', () => {
    expect(isMapEmbedUrl('https://map.kakao.com/embed/1234')).toBe(true)
  })

  it('treats HTML content as not a plain URL', () => {
    expect(isMapEmbedUrl('<a href="https://map.kakao.com"><img src="x"></a>')).toBe(false)
  })

  it('treats an empty string as not a plain URL', () => {
    expect(isMapEmbedUrl('')).toBe(false)
  })
})
