/**
 * 지도 서비스(카카오맵 등) 공유 코드를 그대로 붙여넣어도 안전하게 동작하도록 정규화한다.
 * 실제로 관리자가 받는 공유 코드는 두 형태 모두 있을 수 있다:
 *  - <iframe src="..."> 통짜 코드 → src 값만 추출해 iframe으로 렌더링
 *  - <a><img>...</a> 정적 지도 이미지+링크 위젯 (카카오맵 "지도 공유"의 기본 형태) → HTML 그대로 sanitize 후 삽입
 * 순수 URL을 붙여넣은 경우는 그대로 통과시켜 iframe src로 사용한다.
 */
export function normalizeMapEmbed(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ''
  const iframeSrcMatch = trimmed.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i)
  if (iframeSrcMatch) return iframeSrcMatch[1]?.trim() ?? ''
  return trimmed
}

/** 순수 URL(iframe src로 쓸 수 있는 값)인지, HTML 위젯(그대로 삽입해야 하는 값)인지 판별 */
export function isMapEmbedUrl(value: string): boolean {
  const trimmed = value.trim()
  return /^https?:\/\//i.test(trimmed) && !/<[a-z]/i.test(trimmed)
}
