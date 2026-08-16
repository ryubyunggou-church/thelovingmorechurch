import { useEffect, useState } from 'react'

/** Tailwind md 브레이크포인트(768px) 미만이면 true. 팝업을 모바일에서 숨기는 데 사용. */
export function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return isMobile
}
