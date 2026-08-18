import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useInViewOnce } from '../../hooks/useInViewOnce'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { cn } from '../../lib/utils'
import { indexItems } from './quick-links-data'

/**
 * 홈 「찾아가기」 색인 — 주보 목차처럼 번호를 매긴 가로줄 리스트.
 * 아이콘 타일 그리드(bento) 대신, 실제 교회 사진 스와치 + 타이포 위계로 구성한다.
 */
export function QuickIndex() {
  const reduced = usePrefersReducedMotion()
  const section = useInViewOnce<HTMLElement>({ disabled: reduced })

  return (
    <section ref={section.ref} className="bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={cn(
            'mb-10 flex items-end justify-between gap-4 border-b border-paper-line pb-6 sm:mb-12',
            !reduced && 'transition duration-700',
            !reduced && (section.visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'),
          )}
        >
          <h2 className="font-serif text-2xl font-semibold text-paper-text sm:text-3xl">찾아가기</h2>
          <p className="hidden max-w-xs text-right text-sm text-paper-muted sm:block">
            예배·교육·선교·소식을 한곳에서
          </p>
        </div>

        <ol className="divide-y divide-paper-line border-t border-paper-line">
          {indexItems.map((item, i) => (
            <li
              key={item.key}
              className={cn(
                !reduced && 'transition duration-700',
                !reduced && (section.visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'),
              )}
              style={reduced ? undefined : { transitionDelay: section.visible ? `${i * 70}ms` : '0ms' }}
            >
              <Link
                to={item.href}
                className="group flex min-h-14 cursor-pointer items-center gap-5 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 sm:gap-8 sm:py-6"
              >
                <span
                  className="index-num shrink-0 font-serif text-lg text-paper-muted transition-colors duration-200 group-hover:text-gold sm:text-xl"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="h-16 w-16 shrink-0 overflow-hidden sm:h-20 sm:w-20">
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover grayscale-[0.25] transition-[filter] duration-200 group-hover:grayscale-0"
                    loading="lazy"
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <span className="font-serif text-lg font-semibold text-paper-text sm:text-xl">
                      {item.label}
                    </span>
                    <span className="hidden text-sm text-paper-muted sm:inline">{item.desc}</span>
                  </span>
                  <span className="mt-1 block text-sm text-gold-deep">{item.live()}</span>
                </span>

                <ArrowUpRight className="h-5 w-5 shrink-0 text-paper-muted transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
