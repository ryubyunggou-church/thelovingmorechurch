import { describe, expect, it } from 'vitest'
import { getPageNumbers } from './pagination'

describe('getPageNumbers', () => {
  it('총 페이지가 적으면 전부 표시', () => {
    expect(getPageNumbers(1, 1)).toEqual([1])
    expect(getPageNumbers(3, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('현재 페이지가 앞쪽이면 오른쪽만 생략', () => {
    expect(getPageNumbers(1, 10)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 10])
    expect(getPageNumbers(2, 10)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 10])
  })

  it('현재 페이지가 뒤쪽이면 왼쪽만 생략', () => {
    expect(getPageNumbers(10, 10)).toEqual([1, 'ellipsis', 6, 7, 8, 9, 10])
    expect(getPageNumbers(9, 10)).toEqual([1, 'ellipsis', 6, 7, 8, 9, 10])
  })

  it('현재 페이지가 중간이면 양쪽 다 생략', () => {
    expect(getPageNumbers(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10])
  })

  it('페이지가 없으면 빈 배열', () => {
    expect(getPageNumbers(1, 0)).toEqual([])
  })
})
