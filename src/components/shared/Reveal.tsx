import type { CSSProperties, ReactNode } from 'react'
import { useInViewOnce } from '../../hooks/useInViewOnce'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { cn } from '../../lib/utils'

interface RevealProps {
  children: ReactNode
  className?: string
  /** stagger delay ms */
  delay?: number
  as?: 'div' | 'section' | 'article' | 'li'
}

/** 스크롤 인뷰 시 한 번 fade-up (절제형) */
export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const reduced = usePrefersReducedMotion()
  const { ref, visible } = useInViewOnce<HTMLElement>({ disabled: reduced })
  const Comp = as

  const style: CSSProperties | undefined = reduced
    ? undefined
    : {
        transitionDelay: visible ? `${delay}ms` : '0ms',
      }

  return (
    <Comp
      ref={ref as never}
      style={style}
      className={cn(
        !reduced && 'transition-[opacity,transform] duration-700 ease-out will-change-[opacity,transform]',
        !reduced && (visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'),
        className,
      )}
    >
      {children}
    </Comp>
  )
}
