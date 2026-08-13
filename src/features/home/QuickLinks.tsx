import { QuickLinksBento } from './QuickLinksBento'
import { PartnerSpotlightRail } from './PartnerSpotlightRail'

/** 홈 하단: 바로가기(Bento) + 협력기관(Spotlight Rail) */
export function QuickLinks() {
  return (
    <>
      <QuickLinksBento />
      <PartnerSpotlightRail />
    </>
  )
}
