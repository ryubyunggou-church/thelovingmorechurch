import type { ContactRoute, RouteIconType } from '../types/content'

export const ROUTE_ICON_TYPES: RouteIconType[] = ['subway', 'bus', 'walk']

export const ROUTE_ICON_LABELS: Record<RouteIconType, string> = {
  subway: '지하철',
  bus: '버스',
  walk: '도보',
}

/** iconType별로 묶고, 그룹 내부는 order 오름차순 정렬 */
export function routesByIconType(routes: ContactRoute[], iconType: RouteIconType): ContactRoute[] {
  return routes.filter((r) => r.iconType === iconType).sort((a, b) => a.order - b.order)
}

export function nextRouteId(now = Date.now()): string {
  return `route_${now}`
}

export function createBlankRoute(iconType: RouteIconType, order: number, now = Date.now()): ContactRoute {
  return {
    id: nextRouteId(now),
    iconType,
    title: '',
    description: '',
    order,
  }
}
