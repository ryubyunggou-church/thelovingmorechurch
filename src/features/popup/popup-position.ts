import type { PopupPosition } from '../../types/content'

/**
 * position → DialogContent(실제 노출되는 맨 앞 카드)에 덮어씌울 위치 클래스.
 * DialogContent 기본값은 `fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`
 * (중앙 고정)라서, center 이외에는 같은 유틸리티 그룹(left/top/translate-y)을
 * 다시 지정해 tailwind-merge가 기본값을 대체하도록 한다.
 */
export function popupPositionClass(position: PopupPosition): string {
  switch (position) {
    case 'top':
      return 'top-6 translate-y-0'
    case 'center-left':
      return 'left-[calc(50%-100px)]'
    case 'center-right':
      return 'left-[calc(50%+100px)]'
    case 'center':
    default:
      return ''
  }
}

/**
 * 뒤에 대기 중인 팝업을 살짝 오른쪽 아래로 겹쳐 보여주는 "peek" 카드 위치 클래스.
 * DialogContent 기본 클래스를 상속하지 않는 독립 요소용이라 left/top/translate를
 * 매번 전부 지정한다. 맨 앞 카드(popupPositionClass)의 기준 위치에서 14px만큼
 * 어긋나도록 값 자체에 미리 오프셋을 계산해 넣었다(같은 축의 translate 클래스는
 * 서로 대체되어 누적되지 않으므로, 오프셋은 반드시 left/top 값 쪽에 반영한다).
 */
export function popupPeekPositionClass(position: PopupPosition): string {
  switch (position) {
    case 'top':
      return 'left-1/2 top-10 -translate-x-1/2 translate-y-0'
    case 'center-left':
      return 'left-[calc(50%-86px)] top-[calc(50%+14px)] -translate-x-1/2 -translate-y-1/2'
    case 'center-right':
      return 'left-[calc(50%+114px)] top-[calc(50%+14px)] -translate-x-1/2 -translate-y-1/2'
    case 'center':
    default:
      return 'left-[calc(50%+14px)] top-[calc(50%+14px)] -translate-x-1/2 -translate-y-1/2'
  }
}
