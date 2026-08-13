/** Pure index cycling helpers (unit-tested). */
export function nextSlideIndex(current: number, length: number) {
  if (length <= 0) return 0
  return (current + 1) % length
}

export function prevSlideIndex(current: number, length: number) {
  if (length <= 0) return 0
  return (current - 1 + length) % length
}
