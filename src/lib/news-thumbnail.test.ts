import { describe, expect, it } from 'vitest'
import { newsPlaceholderImages } from '../data/seed'
import { pickNewsPlaceholderImage } from './news-thumbnail'

describe('pickNewsPlaceholderImage', () => {
  it('cycles through the pool deterministically by timestamp', () => {
    const pool = newsPlaceholderImages
    expect(pickNewsPlaceholderImage(0)).toBe(pool[0])
    expect(pickNewsPlaceholderImage(1)).toBe(pool[1])
    expect(pickNewsPlaceholderImage(pool.length)).toBe(pool[0])
    expect(pickNewsPlaceholderImage(pool.length + 1)).toBe(pool[1])
  })

  it('always returns a value from the pool for any real timestamp', () => {
    expect(newsPlaceholderImages).toContain(pickNewsPlaceholderImage(Date.now()))
  })

  it('returns an empty string for an empty pool', () => {
    expect(pickNewsPlaceholderImage(123, [])).toBe('')
  })
})
