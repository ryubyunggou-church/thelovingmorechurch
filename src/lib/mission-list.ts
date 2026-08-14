import type { MissionItem } from '../types/content'
import { missionPlaceholderImages } from '../data/seed'

export type MissionType = MissionItem['type']

export function missionsByType(items: MissionItem[], type: MissionType): MissionItem[] {
  return items.filter((item) => item.type === type).sort((a, b) => a.order - b.order)
}

export function nextMissionId(now = Date.now()): string {
  return `m_${now}`
}

/** order 기준으로 타입별 대표사진 후보군을 순환 배정 (음수/0도 항상 유효한 인덱스로 감싼다). */
function pickPlaceholderImage(type: MissionType, order: number): string {
  const pool = missionPlaceholderImages[type]
  if (!pool || pool.length === 0) return ''
  const index = ((order - 1) % pool.length + pool.length) % pool.length
  return pool[index]!
}

/**
 * 관리자 "사역 추가"로 생성되는 빈 사역 — 국내/해외 타입에 맞는 대표사진을 자동 배정해
 * 이미지 없이 fallback 아이콘만 뜨는 카드로 남지 않도록 한다.
 */
export function createBlankMission(
  type: MissionType,
  order: number,
  now = Date.now(),
): MissionItem {
  return {
    id: nextMissionId(now),
    type,
    name: type === 'domestic' ? '새 국내 사역' : '새 선교지',
    description: '',
    region: '',
    image: pickPlaceholderImage(type, order),
    order,
  }
}
