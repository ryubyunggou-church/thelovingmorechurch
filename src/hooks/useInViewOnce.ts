import { useEffect, useRef, useState } from 'react'

/** 한 번 보이면 true 고정 (스크롤 리빌용) */
export function useInViewOnce<T extends HTMLElement>(options?: {
  threshold?: number
  rootMargin?: string
  disabled?: boolean
}) {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(Boolean(options?.disabled))

  useEffect(() => {
    if (options?.disabled) {
      setVisible(true)
      return
    }
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      {
        threshold: options?.threshold ?? 0.14,
        rootMargin: options?.rootMargin ?? '0px 0px -6% 0px',
      },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [options?.disabled, options?.threshold, options?.rootMargin])

  return { ref, visible }
}
