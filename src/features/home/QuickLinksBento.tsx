import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useInViewOnce } from '../../hooks/useInViewOnce'
import { useMicroParallax } from '../../hooks/useMicroParallax'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { cn } from '../../lib/utils'
import { bentoItems } from './quick-links-data'

function BentoBgImage({ src, strength = 14 }: { src: string; strength?: number }) {
  const reduced = usePrefersReducedMotion()
  const ref = useMicroParallax<HTMLImageElement>({ strength, disabled: reduced })
  return (
    <img
      ref={ref}
      src={src}
      alt=""
      className="absolute inset-0 h-[115%] w-full object-cover transition duration-700 will-change-transform group-hover:scale-[1.03]"
      loading="lazy"
      draggable={false}
    />
  )
}

export function QuickLinksBento() {
  const reduced = usePrefersReducedMotion()
  const bento = useInViewOnce<HTMLElement>({ disabled: reduced })

  return (
    <section ref={bento.ref} className="relative overflow-hidden bg-cream py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 10% 20%, rgba(196,107,62,0.08), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 80%, rgba(58,47,42,0.05), transparent 50%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={cn(
            'mb-8 flex flex-col gap-2 transition duration-700 sm:mb-10 sm:flex-row sm:items-end sm:justify-between',
            bento.visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
          )}
        >
          <div>
            <p className="text-sm font-semibold tracking-wide text-terracotta">자주 찾는 메뉴</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-ink sm:text-3xl">바로가기</h2>
          </div>
          <p className="max-w-sm text-sm text-ink-muted">
            예배·교육·선교·소식을 한곳에서. 카드를 눌러 이동하세요.
          </p>
        </div>

        <div className="grid auto-rows-fr grid-cols-1 gap-3 sm:gap-4 md:grid-cols-6 md:grid-rows-2">
          {bentoItems.map((item, i) => (
            <Link
              key={item.key}
              to={item.href}
              className={cn(
                'group relative min-h-[160px] overflow-hidden rounded-2xl border border-stone/60 bg-cream-dark shadow-sm transition-all duration-500',
                'hover:-translate-y-1 hover:border-terracotta/30 hover:shadow-lg',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40',
                item.span,
                item.featured && 'min-h-[280px] md:min-h-[320px]',
                bento.visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
              )}
              style={{ transitionDelay: bento.visible ? `${i * 70}ms` : '0ms' }}
            >
              <BentoBgImage src={item.image} strength={item.featured ? 16 : 12} />
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/10',
                  item.featured && 'via-ink/35',
                )}
              />
              <div
                className={cn(
                  'relative z-10 flex h-full flex-col justify-end p-5 sm:p-6',
                  item.featured && 'p-6 sm:p-8',
                )}
              >
                <div className="mb-auto flex items-start justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cream/15 text-cream backdrop-blur-sm ring-1 ring-cream/20">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-cream/70 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cream" />
                </div>
                <p className="mt-6 text-xs font-medium tracking-wide text-cream/75">{item.live()}</p>
                <h3
                  className={cn(
                    'mt-1 font-serif font-semibold text-cream',
                    item.featured ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl',
                  )}
                >
                  {item.label}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-cream/80">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
