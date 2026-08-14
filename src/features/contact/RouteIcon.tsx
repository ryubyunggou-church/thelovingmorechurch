import { Bus, Footprints, TrainFront, type LucideProps } from 'lucide-react'
import type { RouteIconType } from '../../types/content'

const ICON_BY_TYPE: Record<RouteIconType, typeof TrainFront> = {
  subway: TrainFront,
  bus: Bus,
  walk: Footprints,
}

interface Props extends Omit<LucideProps, 'ref'> {
  iconType: RouteIconType
}

/** iconType → lucide-react 아이콘 매핑. 별도 이미지 에셋 없이 벡터 아이콘을 재사용한다. */
export function RouteIcon({ iconType, ...props }: Props) {
  const Icon = ICON_BY_TYPE[iconType]
  return <Icon {...props} />
}
