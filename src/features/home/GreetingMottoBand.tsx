import type { AnnualMotto, PastorGreeting } from '../../types/content'
import { PastorGreetingSection } from './PastorGreetingSection'
import { AnnualMottoSection } from './AnnualMottoSection'

interface Props {
  greeting: PastorGreeting
  motto: AnnualMotto
  onUpdated?: () => void
}

/**
 * 홈 밴드: 축소 인사말(좌) + 연간 표어 타이포(우)
 * @see prd/인사말_표어_밴드_계획.md
 */
export function GreetingMottoBand({ greeting, motto, onUpdated }: Props) {
  return (
    <section className="bg-cream py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-stretch gap-8 md:grid-cols-[1.15fr_0.85fr] md:gap-10 lg:gap-12">
          <div className="min-w-0">
            <PastorGreetingSection greeting={greeting} onUpdated={onUpdated} compact />
          </div>
          <div className="min-w-0">
            <AnnualMottoSection motto={motto} onUpdated={onUpdated} />
          </div>
        </div>
      </div>
    </section>
  )
}
