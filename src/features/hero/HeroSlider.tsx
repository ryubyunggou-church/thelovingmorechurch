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
  const [paused, setPaused] = useState(false)
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
    // 관리자 모드·호버/포커스·reduced-motion에서는 자동 회전을 멈춘다.
    // (편집 중 슬라이드 전환으로 입력값이 덮이는 문제 + 캐러셀 a11y)
    if (count <= 1 || isAdminMode || paused || reducedMotion) return
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [count, isAdminMode, paused, reducedMotion])

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
      'transition-[opacity,transform] duration-500 ease-out will-change-[opacity,transform]',
      entered ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
    )

  return (
    <div
      className="group relative"
      /**
       * 홈 헤더가 투명 오버레이인 동안 Hero가 그 뒤로 파고들도록 헤더 높이만큼
       * 끌어올린다 — Header.tsx가 실측해 퍼블리시하는 --header-h를 그대로 쓴다.
       */
      style={{ marginTop: 'calc(var(--header-h, 0px) * -1)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false)
        }
      }}
    >
      {isAdminMode ? (
        <button
          type="button"
          onClick={goToManagePanel}
          aria-label="Hero 슬라이드 관리로 이동"
          /**
           * 부모가 --header-h만큼 끌어올려져 있어(위 style 참고), top을 그만큼 되돌려
           * sticky Header(z-40) 행 안이 아니라 그 아래 Hero 영역에 실제로 놓이게 한다.
           */
          style={{ top: 'calc(var(--header-h, 0px) + 0.5rem)' }}
          className="absolute right-2 z-50 inline-flex min-h-11 items-center gap-1 rounded-sm bg-ink/85 px-3 py-2 text-xs font-medium text-gold opacity-100 shadow transition duration-200 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Settings className="h-3.5 w-3.5" />
          관리로 이동
        </button>
      ) : null}

      <section
        className="relative h-[min(92vh,900px)] min-h-[560px] w-full overflow-hidden bg-ink"
        aria-roledescription="carousel"
        aria-label="메인 슬라이드"
      >
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
            className={cn(
              'mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg',
              copyClass(),
            )}
            style={reducedMotion ? undefined : { transitionDelay: entered ? '140ms' : '0ms' }}
          >
            {current.subtitle}
          </p>
          {current.linkUrl ? (
            <a
              href={current.linkUrl}
              className={cn(
                'mt-8 inline-flex min-h-11 w-fit cursor-pointer items-center gap-2 border-b border-gold pb-1 text-sm font-medium tracking-wide text-paper transition-[color,gap] duration-200 hover:gap-3 hover:text-gold',
                copyClass(),
              )}
              style={reducedMotion ? undefined : { transitionDelay: entered ? '200ms' : '0ms' }}
            >
              자세히 보기
              <ChevronRight className="h-4 w-4" />
            </a>
          ) : null}
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 sm:bottom-10 sm:gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="이전 슬라이드"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center text-ink-muted transition-colors duration-200 hover:text-gold"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1" role="tablist" aria-label="슬라이드 선택">
            {list.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`슬라이드 ${i + 1} / ${count}`}
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center"
                onClick={() => setIndex(i)}
              >
                <span
                  className={cn(
                    'block h-[3px] rounded-full transition-all duration-200',
                    i === index ? 'w-6 bg-gold' : 'w-3 bg-paper/30 group-hover:bg-paper/50',
                  )}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="다음 슬라이드"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center text-ink-muted transition-colors duration-200 hover:text-gold"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <p className="sr-only" aria-live="polite">
          슬라이드 {index + 1} / {count}: {current.title}
        </p>
      </section>
    </div>
  )
}
