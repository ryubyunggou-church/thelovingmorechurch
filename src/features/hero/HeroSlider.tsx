import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react'
import type { HeroSlide } from '../../types/content'
import { useAdminStore } from '../../store/admin-store'
import { seedHeroSlides } from '../../data/seed'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { cn } from '../../lib/utils'
import { HeroMediaBackground } from './HeroMediaBackground'
import { HERO_MANAGE_PANEL_ID } from './hero-manage-panel-id'

export { nextSlideIndex, prevSlideIndex } from './hero-slide-index'

interface HeroSliderProps {
  slides: HeroSlide[]
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const [index, setIndex] = useState(0)
  const [entered, setEntered] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const isAdminMode = useAdminStore((s) => s.isAdminMode)
  const list = slides.length > 0 ? slides : seedHeroSlides
  const count = list.length

  useEffect(() => {
    if (reducedMotion) {
      setEntered(true)
      return
    }
    const t = window.setTimeout(() => setEntered(true), 40)
    return () => window.clearTimeout(t)
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion) return
    setEntered(false)
    const t = window.setTimeout(() => setEntered(true), 30)
    return () => window.clearTimeout(t)
  }, [index, reducedMotion])

  useEffect(() => {
    // 관리자 모드에서는 자동 회전을 멈춘다 — 편집 모달이 열려 있는 동안
    // 배경에서 슬라이드가 넘어가면 편집 중이던 입력값이 다른 슬라이드
    // 내용으로 덮어써지는 문제가 있었다.
    if (count <= 1 || isAdminMode) return
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [count, isAdminMode])

  useEffect(() => {
    if (index >= count) setIndex(0)
  }, [count, index])

  const current = list[index] ?? seedHeroSlides[0]!
  const go = (dir: -1 | 1) => setIndex((i) => (i + dir + count) % count)

  const goToManagePanel = () => {
    document.getElementById(HERO_MANAGE_PANEL_ID)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const copyClass = () =>
    cn(
      'transition-[opacity,transform] duration-700 ease-out will-change-[opacity,transform]',
      entered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
    )

  return (
    <div className="group relative">
      {isAdminMode ? (
        <button
          type="button"
          onClick={goToManagePanel}
          aria-label="Hero 슬라이드 관리로 이동"
          className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-sm bg-ink/85 px-2.5 py-1 text-xs font-medium text-gold opacity-100 shadow transition sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Settings className="h-3.5 w-3.5" />
          관리로 이동
        </button>
      ) : null}

      <section className="relative h-[min(92vh,900px)] min-h-[560px] w-full overflow-hidden bg-ink">
        <HeroMediaBackground slide={current} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink from-10% via-ink/55 via-45% to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-20 pt-28 sm:px-6 sm:pb-24">
          <span
            className={cn(
              'mb-5 flex w-fit items-center gap-2.5 text-xs font-semibold tracking-[0.16em] text-gold',
              copyClass(),
            )}
          >
            <span aria-hidden className="h-px w-8 bg-gold" />
            {current.tag}
          </span>
          <h1
            className={cn(
              'max-w-3xl font-serif text-4xl font-semibold leading-[1.15] text-paper sm:text-6xl',
              copyClass(),
            )}
            style={reducedMotion ? undefined : { transitionDelay: entered ? '80ms' : '0ms' }}
          >
            {current.title}
          </h1>
          <p
            className={cn('mt-5 max-w-xl text-sm text-ink-muted sm:text-lg', copyClass())}
            style={reducedMotion ? undefined : { transitionDelay: entered ? '140ms' : '0ms' }}
          >
            {current.subtitle}
          </p>
          {current.linkUrl ? (
            <a
              href={current.linkUrl}
              className={cn(
                'mt-8 inline-flex w-fit items-center gap-2 border-b border-gold pb-1 text-sm font-medium tracking-wide text-paper transition hover:gap-3 hover:text-gold',
                copyClass(),
              )}
              style={reducedMotion ? undefined : { transitionDelay: entered ? '200ms' : '0ms' }}
            >
              자세히 보기
              <ChevronRight className="h-4 w-4" />
            </a>
          ) : null}
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-4 sm:bottom-10">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="이전 슬라이드"
            className="text-ink-muted transition hover:text-gold"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            {list.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`슬라이드 ${i + 1}`}
                className={cn(
                  'h-[3px] rounded-full transition-all',
                  i === index ? 'w-6 bg-gold' : 'w-3 bg-paper/30 hover:bg-paper/50',
                )}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="다음 슬라이드"
            className="text-ink-muted transition hover:text-gold"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  )
}
