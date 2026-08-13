import { useEffect, useRef } from 'react'

/**
 * 아주 약한 스크롤 패럴랙스 (translateY 수 px 수준).
 * reduced-motion / disabled 시 무동작.
 */
export function useMicroParallax<T extends HTMLElement>(options?: {
  strength?: number
  disabled?: boolean
}) {
  const ref = useRef<T | null>(null)
  const strength = options?.strength ?? 12

  useEffect(() => {
    if (options?.disabled) return
    const el = ref.current
    if (!el) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight || 1
        // 뷰포트 중앙 대비 -0.5 ~ 0.5
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh
        const y = Math.max(-strength, Math.min(strength, -progress * strength))
        el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [options?.disabled, strength])

  return ref
}
