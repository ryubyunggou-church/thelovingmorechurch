import type { HeroSlide } from '../types/content'

export function nextHeroSlideId(now = Date.now()): string {
  return `hero_${now}`
}

/**
 * 관리자 "슬라이드 추가"로 생성되는 빈 슬라이드 — 저장 후 배너의 편집(연필 아이콘)에서
 * 개별 수정한다. mediaUrl은 비워둬도 HeroMediaBackground가 시드 이미지로 폴백한다.
 */
export function createBlankHeroSlide(order: number, now = Date.now()): HeroSlide {
  return {
    id: nextHeroSlideId(now),
    mediaUrl: '',
    mediaType: 'image',
    tag: '',
    title: '새 슬라이드',
    subtitle: '',
    linkUrl: '',
    order,
    isActive: true,
  }
}
