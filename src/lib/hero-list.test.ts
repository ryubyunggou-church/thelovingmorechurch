import { describe, expect, it } from 'vitest'
import { createBlankHeroSlide, nextHeroSlideId } from './hero-list'

describe('nextHeroSlideId', () => {
  it('prefixes the timestamp with hero_', () => {
    expect(nextHeroSlideId(12345)).toBe('hero_12345')
  })
})

describe('createBlankHeroSlide', () => {
  it('creates an active image slide with the given order', () => {
    const slide = createBlankHeroSlide(4, 999)
    expect(slide).toEqual({
      id: 'hero_999',
      mediaUrl: '',
      mediaType: 'image',
      tag: '',
      title: '새 슬라이드',
      subtitle: '',
      linkUrl: '',
      order: 4,
      isActive: true,
    })
  })
})
