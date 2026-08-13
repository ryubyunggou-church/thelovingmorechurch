import { describe, it, expect } from 'vitest'
import { nextSlideIndex, prevSlideIndex } from './hero-slide-index'

describe('Hero slider index cycling', () => {
  it('cycles forward last → first', () => {
    expect(nextSlideIndex(2, 3)).toBe(0)
    expect(nextSlideIndex(0, 3)).toBe(1)
  })

  it('cycles backward first → last', () => {
    expect(prevSlideIndex(0, 3)).toBe(2)
    expect(prevSlideIndex(1, 3)).toBe(0)
  })
})
