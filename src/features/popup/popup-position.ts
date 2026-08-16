import type { PopupPosition } from '../../types/content'

/**
 * position → DialogContent에 덮어씌울 위치 클래스. DialogContent 기본값은
 * `fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`(중앙 고정)라서,
 * center 이외에는 같은 유틸리티 그룹(left/top/translate-x/translate-y)을
 * 다시 지정해 tailwind-merge가 기본값을 대체하도록 한다.
 */
export function popupPositionClass(position: PopupPosition): string {
  switch (position) {
    case 'top':
      return 'top-6 translate-y-0'
    case 'bottom-sheet':
      return 'left-1/2 top-auto bottom-0 -translate-x-1/2 translate-y-0 w-full sm:w-[min(92vw,32rem)] rounded-b-none'
    case 'corner-br':
      return 'left-auto top-auto right-4 bottom-4 translate-x-0 translate-y-0'
    case 'corner-bl':
      return 'left-4 top-auto bottom-4 translate-x-0 translate-y-0'
    case 'center':
    default:
      return ''
  }
}
