import type { MissionItem } from '../types/content'

export type MissionType = MissionItem['type']

export function missionsByType(items: MissionItem[], type: MissionType): MissionItem[] {
  return items.filter((item) => item.type === type).sort((a, b) => a.order - b.order)
}

export function nextMissionId(now = Date.now()): string {
  return `m_${now}`
}

export const EMPTY_MISSION_IMAGE = ''

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
    image: EMPTY_MISSION_IMAGE,
    order,
  }
}
