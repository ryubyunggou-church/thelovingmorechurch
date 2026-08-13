import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Button
      size="icon"
      variant="default"
      aria-label="위로가기"
      className={cn(
        'fixed bottom-6 right-6 z-40 shadow-lg transition-all',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}
