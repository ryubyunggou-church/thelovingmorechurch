import type { SitePopup } from '../types/content'

export function nextSitePopupId(now = Date.now()): string {
  return `popup_${now}`
}

/**
 * 관리자 "새 팝업 추가"로 생성되는 빈 팝업. 빈 상태로 방문자에게 노출되지 않도록
 * enabled는 false로 시작한다 — 내용을 채우고 관리자가 명시적으로 켜야 한다.
 */
export function createBlankSitePopup(now = Date.now()): SitePopup {
  const today = new Date(now).toISOString().slice(0, 10)
  const nowIso = new Date(now).toISOString()
  return {
    id: nextSitePopupId(now),
    label: '새 팝업',
    enabled: false,
    startDate: today,
    endDate: today,
    contentType: 'markdown',
    mediaUrl: '',
    markdownBody: '',
    title: '',
    linkUrl: '',
    position: 'center',
    priority: 0,
    hideForHours: 24,
    createdAt: nowIso,
    updatedAt: nowIso,
  }
}
