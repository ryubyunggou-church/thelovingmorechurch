import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react'
import type { HeroSlide } from '../../types/content'
import { Button } from '../../components/ui/button'
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
          className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-medium text-cream opacity-100 shadow transition sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Settings className="h-3.5 w-3.5" />
          관리로 이동
        </button>
      ) : null}

      <section className="relative h-[min(92vh,900px)] min-h-[520px] w-full overflow-hidden bg-[#2a211c]">
        <HeroMediaBackground slide={current} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/15" />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-20 pt-28 sm:px-6 sm:pb-28">
          <span
            className={cn(
              'mb-4 inline-flex w-fit rounded-full bg-cream/15 px-3 py-1 text-xs font-semibold tracking-wide text-cream backdrop-blur',
              copyClass(),
            )}
            style={reducedMotion ? undefined : { transitionDelay: entered ? '0ms' : '0ms' }}
          >
            {current.tag}
          </span>
          <h1
            className={cn(
              'max-w-3xl font-serif text-3xl font-semibold leading-tight text-cream sm:text-5xl',
              copyClass(),
            )}
            style={reducedMotion ? undefined : { transitionDelay: entered ? '80ms' : '0ms' }}
          >
            {current.title}
          </h1>
          <p
            className={cn('mt-4 max-w-2xl text-sm text-cream/90 sm:text-lg', copyClass())}
            style={reducedMotion ? undefined : { transitionDelay: entered ? '140ms' : '0ms' }}
          >
            {current.subtitle}
          </p>
          {current.linkUrl ? (
            <a
              href={current.linkUrl}
              className={cn(
                'mt-6 inline-flex w-fit rounded-md bg-terracotta px-5 py-2.5 text-sm font-medium text-cream hover:bg-terracotta-dark',
                copyClass(),
              )}
              style={reducedMotion ? undefined : { transitionDelay: entered ? '200ms' : '0ms' }}
            >
              자세히 보기
            </a>
          ) : null}
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full bg-cream/90"
            onClick={() => go(-1)}
            aria-label="이전 슬라이드"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-1.5">
            {list.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`슬라이드 ${i + 1}`}
                className={cn(
                  'h-2 w-2 rounded-full transition',
                  i === index ? 'bg-cream' : 'bg-cream/40',
                )}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full bg-cream/90"
            onClick={() => go(1)}
            aria-label="다음 슬라이드"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
