import { newsPlaceholderImages } from '../data/seed'

/**
 * Date.now() 기준으로 뉴스 썸네일 후보군을 순환 배정.
 * 뉴스 글은 부서/사역과 달리 고정 카테고리가 없어 order 대신 현재 시각을 순환 기준으로 쓴다.
 */
export function pickNewsPlaceholderImage(
  now: number = Date.now(),
  pool: string[] = newsPlaceholderImages,
): string {
  if (pool.length === 0) return ''
  const index = ((now % pool.length) + pool.length) % pool.length
  return pool[index]!
}
