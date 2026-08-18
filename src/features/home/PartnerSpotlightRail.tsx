import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useInViewOnce } from '../../hooks/useInViewOnce'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { cn } from '../../lib/utils'
import { DEFAULT_PARTNER_FOCUS, partners } from './quick-links-data'

/**
 * 협력기관 스포트라이트.
 * 모든 카드는 동일한 고정 플레이트 크기를 유지하고, 선택/호버된 카드만
 * transform scale로 확대한다. inactive 축소·padding/max-height 애니메이션은
 * 쓰지 않아 호버 전환 시 이웃 카드가 동시에 꿈틀거리지 않게 한다.
 */
export function PartnerSpotlightRail() {
  const reduced = usePrefersReducedMotion()
  const strip = useInViewOnce<HTMLElement>({ disabled: reduced })
  const [focus, setFocus] = useState(DEFAULT_PARTNER_FOCUS)

  return (
    <section ref={strip.ref} className="relative overflow-hidden bg-ink py-16 sm:py-24">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={cn(
            'mb-12 border-t border-ink-line pt-6 text-center',
            !reduced && 'transition duration-700',
            !reduced && (strip.visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'),
          )}
        >
          <p className="index-num text-xs font-semibold tracking-[0.14em] text-gold">함께하는 기관</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-paper sm:text-3xl">협력기관</h2>
        </div>

        <div
          className={cn(
            'mx-auto grid max-w-4xl grid-cols-3 items-start gap-3 sm:gap-4 md:gap-6',
            !reduced && (strip.visible ? 'opacity-100' : 'opacity-0'),
            !reduced && 'transition-opacity duration-500 delay-100',
          )}
          onMouseLeave={() => setFocus(DEFAULT_PARTNER_FOCUS)}
        >
          {partners.map((p, i) => {
            const active = focus === i
            return (
              <a
                key={p.href}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setFocus(i)}
                onFocus={() => setFocus(i)}
                className={cn(
                  'group relative flex min-w-0 cursor-pointer flex-col items-center text-center outline-none',
                  'focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ink',
                  // 레이아웃은 고정, 활성 카드만 scale로 확대 (이웃 리플로우 없음)
                  active ? 'z-10' : 'z-0',
                  !reduced && 'transition-transform duration-300 ease-out will-change-transform',
                  !reduced && (active ? 'scale-[1.06]' : 'scale-100'),
                )}
              >
                <div
                  className={cn(
                    // 플레이트 크기 고정 — padding/높이 전환으로 그리드가 흔들리지 않게
                    'relative flex h-[7.5rem] w-full items-center justify-center overflow-hidden rounded-[30px] border px-4 sm:h-36 sm:px-6',
                    'transition-[background-color,border-color] duration-300 ease-out',
                    active ? 'border-gold/50' : 'border-paper-line/40 bg-paper',
                  )}
                  style={active ? { backgroundColor: p.hoverPlate } : undefined}
                >
                  <img
                    src={p.logo}
                    alt={p.label}
                    className="relative z-[1] max-h-16 w-auto max-w-full object-contain sm:max-h-24"
                    loading="lazy"
                    draggable={false}
                  />
                </div>

                <div className="mt-3 flex min-h-[4.5rem] flex-col items-center justify-start gap-1 sm:min-h-[5rem]">
                  <p className="font-serif text-sm font-semibold text-paper sm:text-base">{p.label}</p>
                  <p
                    className={cn(
                      'text-xs font-medium tracking-wide text-gold transition-opacity duration-300 ease-out',
                      active ? 'opacity-100' : 'opacity-0',
                    )}
                  >
                    {p.role}
                  </p>
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 text-xs text-ink-muted transition-opacity duration-300 ease-out',
                      active ? 'opacity-100' : 'opacity-0',
                    )}
                  >
                    사이트 방문
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </a>
            )
          })}
        </div>

        <div className="mt-8 flex justify-center gap-1" role="tablist" aria-label="협력기관 선택">
          {partners.map((p, i) => (
            <button
              key={p.href}
              type="button"
              role="tab"
              aria-selected={focus === i}
              aria-label={p.label}
              onClick={() => setFocus(i)}
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center"
            >
              <span
                className={cn(
                  'block h-1.5 rounded-full transition-all duration-300 ease-out',
                  focus === i ? 'w-6 bg-gold' : 'w-1.5 bg-ink-line hover:bg-paper-muted',
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
