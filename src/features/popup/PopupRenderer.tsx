import { lazy, Suspense, useEffect, useState } from 'react'
import type { SitePopup } from '../../types/content'
import { getSitePopups } from '../../lib/content-service'
import {
  getActivePopupQueue,
  hidePopupFor,
  isPopupHiddenNow,
} from '../../lib/popup-visibility'
import { useIsMobileViewport } from '../../hooks/useIsMobileViewport'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { cn } from '../../lib/utils'
import { popupPositionClass } from './popup-position'

const PopupMarkdownBody = lazy(() => import('./PopupMarkdownBody'))

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * 사이트 전역 방문자용 팝업 렌더러. App.tsx에 라우트와 무관하게 한 번 마운트된다.
 * 모바일에서는 렌더링하지 않는다(§0-5, §5-A). 활성 팝업이 여러 개면 우선순위
 * 순으로 하나씩 순차 노출한다(§0-4) — 닫을 때마다 다음 팝업이 이어서 뜬다.
 */
export function PopupRenderer() {
  const isMobile = useIsMobileViewport()
  const [queue, setQueue] = useState<SitePopup[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (isMobile) return
    let cancelled = false
    void getSitePopups().then((popups) => {
      if (cancelled) return
      const active = getActivePopupQueue(popups, todayStr()).filter(
        (p) => !isPopupHiddenNow(p.id),
      )
      setQueue(active)
      setIndex(0)
    })
    return () => {
      cancelled = true
    }
  }, [isMobile])

  if (isMobile) return null

  const current = queue[index]
  if (!current) return null

  const close = () => {
    hidePopupFor(current.id, current.hideForHours)
    setIndex((i) => i + 1)
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) close()
      }}
    >
      <DialogContent className={popupPositionClass(current.position)}>
        <DialogHeader>
          <DialogTitle className={cn(!current.title && 'sr-only')}>
            {current.title || current.label}
          </DialogTitle>
        </DialogHeader>

        {current.contentType === 'image' && current.mediaUrl ? (
          <PopupImageBody popup={current} />
        ) : null}
        {current.contentType === 'pdf' && current.mediaUrl ? (
          <PopupPdfBody url={current.mediaUrl} linkUrl={current.linkUrl} />
        ) : null}
        {current.contentType === 'markdown' && current.markdownBody ? (
          <Suspense fallback={null}>
            <PopupMarkdownBody>{current.markdownBody}</PopupMarkdownBody>
          </Suspense>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function PopupImageBody({ popup }: { popup: SitePopup }) {
  const img = <img src={popup.mediaUrl} alt={popup.title || popup.label} className="w-full rounded-md" />
  if (!popup.linkUrl) return img
  return (
    <a href={popup.linkUrl} className="block">
      {img}
    </a>
  )
}

function PopupPdfBody({ url, linkUrl }: { url: string; linkUrl?: string }) {
  return (
    <div className="space-y-2">
      <object
        data={url}
        type="application/pdf"
        className="h-[65vh] w-full rounded-md border border-stone/60"
      >
        <p className="p-4 text-sm text-ink-muted">
          이 브라우저에서는 PDF 미리보기를 지원하지 않습니다.{' '}
          <a href={url} target="_blank" rel="noreferrer" className="text-terracotta underline">
            새 탭에서 PDF 열기
          </a>
        </p>
      </object>
      {linkUrl ? (
        <a href={linkUrl} className="inline-block text-sm font-medium text-terracotta underline">
          자세히 보기
        </a>
      ) : null}
    </div>
  )
}
