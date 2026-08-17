import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useInViewOnce } from '../../hooks/useInViewOnce'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { cn } from '../../lib/utils'
import { DEFAULT_PARTNER_FOCUS, partners } from './quick-links-data'

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
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
            로고에 마우스를 올리거나 탭하면 해당 기관 사이트로 이동합니다.
          </p>
        </div>

        <div
          className={cn(
            'mx-auto grid max-w-4xl grid-cols-3 items-end gap-2 sm:gap-4 md:gap-6',
            !reduced && (strip.visible ? 'opacity-100' : 'opacity-0'),
            !reduced && 'transition duration-700 delay-100',
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
                  'group relative flex min-w-0 flex-col items-center text-center outline-none',
                  'transition-transform duration-300 ease-out will-change-transform',
                  'focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ink',
                  active ? 'z-10 -translate-y-2 scale-105' : 'z-0 scale-90 opacity-55',
                )}
              >
                <div
                  className={cn(
                    'relative flex w-full items-center justify-center overflow-hidden rounded-[30px] border bg-paper transition-[box-shadow,border-color,padding] duration-300',
                    active
                      ? 'border-gold/40 px-4 py-7 shadow-xl shadow-black/30 sm:px-6 sm:py-9'
                      : 'border-paper-line/40 px-3 py-5 opacity-60 sm:py-6',
                  )}
                >
                  <img
                    src={p.logo}
                    alt={p.label}
                    className={cn(
                      'relative z-[1] w-auto max-w-full object-contain transition-[max-height] duration-300',
                      active ? 'max-h-20 sm:max-h-28 md:max-h-32' : 'max-h-12 sm:max-h-14',
                    )}
                    loading="lazy"
                    draggable={false}
                  />
                </div>

                <div className="mt-3 flex min-h-[4.5rem] flex-col items-center justify-start gap-1 sm:min-h-[5rem]">
                  <p
                    className={cn(
                      'font-serif font-semibold text-paper transition-opacity duration-300',
                      active ? 'text-sm opacity-100 sm:text-base' : 'text-xs opacity-40',
                    )}
                  >
                    {p.label}
                  </p>
                  <p
                    className={cn(
                      'text-xs font-medium tracking-wide text-gold transition-opacity duration-300',
                      active ? 'opacity-100' : 'opacity-0',
                    )}
                  >
                    {p.role}
                  </p>
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 text-[11px] text-ink-muted transition-opacity duration-300',
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

        <div className="mt-8 flex justify-center gap-2" role="tablist" aria-label="협력기관 선택">
          {partners.map((p, i) => (
            <button
              key={p.href}
              type="button"
              role="tab"
              aria-selected={focus === i}
              aria-label={p.label}
              onClick={() => setFocus(i)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                focus === i ? 'w-6 bg-gold' : 'w-1.5 bg-ink-line hover:bg-paper-muted',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
