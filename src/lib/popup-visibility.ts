import type { SitePopup } from '../types/content'

const STORAGE_PREFIX = 'popup-hidden-until:'

/** enabled + 오늘 날짜(YYYY-MM-DD, 로컬 타임존 기준)가 startDate~endDate 범위 안인지. */
export function isPopupActiveOn(popup: SitePopup, dateStr: string): boolean {
  if (!popup.enabled) return false
  if (!popup.startDate || !popup.endDate) return false
  return popup.startDate <= dateStr && dateStr <= popup.endDate
}

/** priority 내림차순, 동률이면 updatedAt 최신순. */
export function sortPopupsByPriority(popups: SitePopup[]): SitePopup[] {
  return [...popups].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority
    return b.updatedAt.localeCompare(a.updatedAt)
  })
}

/** 순차 노출용 활성 팝업 큐 — 우선순위 정렬까지 끝낸 상태로 반환. */
export function getActivePopupQueue(popups: SitePopup[], dateStr: string): SitePopup[] {
  return sortPopupsByPriority(popups.filter((p) => isPopupActiveOn(p, dateStr)))
}

export function getPopupHiddenUntil(id: string): number {
  if (typeof window === 'undefined') return 0
  const raw = window.localStorage.getItem(STORAGE_PREFIX + id)
  const n = raw ? Number(raw) : 0
  return Number.isFinite(n) ? n : 0
}

export function isPopupHiddenNow(id: string, now: number = Date.now()): boolean {
  return getPopupHiddenUntil(id) > now
}

/** hideForHours가 0 이하면 아무것도 기록하지 않는다 — 매 방문마다 다시 노출되어야 하므로. */
export function hidePopupFor(id: string, hours: number, now: number = Date.now()): void {
  if (typeof window === 'undefined' || hours <= 0) return
  window.localStorage.setItem(STORAGE_PREFIX + id, String(now + hours * 60 * 60 * 1000))
}
