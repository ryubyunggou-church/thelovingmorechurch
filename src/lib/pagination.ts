/** 번호형 페이지네이션에 표시할 토큰 — 숫자 페이지 또는 생략(…) 구간 */
export type PageToken = number | 'ellipsis'

/**
 * 현재 페이지 주변 siblingCount개 + 처음/끝 페이지를 보여주고 나머지는 '…'로 접는다.
 * 예: current=5, total=10, siblingCount=1 → [1, '…', 4, 5, 6, '…', 10]
 */
export function getPageNumbers(current: number, total: number, siblingCount = 1): PageToken[] {
  if (total <= 1) return total === 1 ? [1] : []

  const totalPageNumbers = siblingCount * 2 + 5
  if (totalPageNumbers >= total) return range(1, total)

  const leftSiblingIndex = Math.max(current - siblingCount, 1)
  const rightSiblingIndex = Math.min(current + siblingCount, total)

  const showLeftEllipsis = leftSiblingIndex > 2
  const showRightEllipsis = rightSiblingIndex < total - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = range(1, 3 + siblingCount * 2)
    return [...leftRange, 'ellipsis', total]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = range(total - (3 + siblingCount * 2) + 1, total)
    return [1, 'ellipsis', ...rightRange]
  }

  return [1, 'ellipsis', ...range(leftSiblingIndex, rightSiblingIndex), 'ellipsis', total]
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}
