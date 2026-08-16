import { useEffect, useState } from 'react'
import { Megaphone } from 'lucide-react'
import type { SitePopup } from '../../types/content'
import { getSitePopups } from '../../lib/content-service'
import { getActivePopupQueue, hidePopupFor, isPopupHiddenNow } from '../../lib/popup-visibility'
import { useIsMobileViewport } from '../../hooks/useIsMobileViewport'
import { Dialog, DialogContent, DialogTitle } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { cn } from '../../lib/utils'
import { popupPeekPositionClass, popupPositionClass } from './popup-position'

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * 사이트 전역 방문자용 팝업 렌더러. App.tsx에 라우트와 무관하게 한 번 마운트된다.
 * 모바일에서는 렌더링하지 않는다(§0-5, §5-A). 활성 팝업이 여러 개면 우선순위가
 * 가장 높은 것만 상호작용 가능하게 앞에 보여주고, 그 다음 순번은 살짝 겹쳐진
 * 블러 카드로 뒤에서 "대기 중"임을 미리 보여준다. 앞 카드를 닫으면 큐에서
 * 제거되고 다음 카드가 앞으로 나온다.
 */
export function PopupRenderer() {
  const isMobile = useIsMobileViewport()
  const [queue, setQueue] = useState<SitePopup[]>([])

  useEffect(() => {
    if (isMobile) return
    let cancelled = false
    void getSitePopups().then((popups) => {
      if (cancelled) return
      const active = getActivePopupQueue(popups, todayStr()).filter(
        (p) => !isPopupHiddenNow(p.id),
      )
      setQueue(active)
    })
    return () => {
      cancelled = true
    }
  }, [isMobile])

  if (isMobile) return null

  const [current, next] = queue
  if (!current) return null

  const close = () => {
    hidePopupFor(current.id, current.hideForHours)
    setQueue((q) => q.slice(1))
  }

  return (
    <>
      {next ? (
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none fixed z-40 h-[min(70vh,32rem)] w-[min(92vw,32rem)] scale-[0.97] border border-paper-line bg-paper opacity-90 shadow-xl',
            popupPeekPositionClass(current.position),
          )}
        />
      ) : null}

      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) close()
        }}
      >
        <DialogContent className={cn('z-50', popupPositionClass(current.position))}>
          <div className="mb-1 inline-flex w-fit items-center gap-1.5 text-xs font-semibold tracking-wide text-gold-deep">
            <Megaphone className="h-3.5 w-3.5" />
            공지
          </div>
          <DialogTitle
            className={cn(
              'font-serif text-xl font-semibold text-paper-text',
              !current.title && 'sr-only',
            )}
          >
            {current.title || current.label}
          </DialogTitle>

          <div className="mt-3">
            {current.contentType === 'image' && current.mediaUrl ? (
              <PopupImageBody popup={current} />
            ) : null}
            {current.contentType === 'pdf' && current.mediaUrl ? (
              <PopupPdfBody url={current.mediaUrl} linkUrl={current.linkUrl} />
            ) : null}
            {current.contentType === 'richtext' && current.contentHtml ? (
              <div
                className={cn(
                  'text-sm leading-relaxed text-paper-text',
                  '[&_a]:text-gold-deep [&_a]:underline',
                  '[&_blockquote]:border-l-2 [&_blockquote]:border-gold/40 [&_blockquote]:pl-3 [&_blockquote]:text-paper-muted',
                  '[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-paper-text',
                  '[&_ol]:list-decimal [&_ol]:pl-5',
                  '[&_p]:mt-2 [&_p:first-child]:mt-0',
                  '[&_ul]:list-disc [&_ul]:pl-5',
                )}
                // eslint-disable-next-line react/no-danger -- SitePopup.contentHtml은 저장·조회 시 DOMPurify로 sanitize 됨 (News와 동일 파이프라인)
                dangerouslySetInnerHTML={{ __html: current.contentHtml }}
              />
            ) : null}
          </div>

          {next ? (
            <p className="mt-3 text-xs text-paper-muted">다음 공지가 이어서 표시됩니다.</p>
          ) : null}

          <div className="mt-5 flex justify-end border-t border-paper-line pt-4">
            <Button size="sm" onClick={close}>
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function PopupImageBody({ popup }: { popup: SitePopup }) {
  const img = (
    <img
      src={popup.mediaUrl}
      alt={popup.title || popup.label}
      className="w-full border border-paper-line"
    />
  )
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
        className="h-[65vh] w-full border border-paper-line"
      >
        <p className="p-4 text-sm text-paper-muted">
          이 브라우저에서는 PDF 미리보기를 지원하지 않습니다.{' '}
          <a href={url} target="_blank" rel="noreferrer" className="text-gold-deep underline">
            새 탭에서 PDF 열기
          </a>
        </p>
      </object>
      {linkUrl ? (
        <a href={linkUrl} className="inline-block text-sm font-medium text-gold-deep underline">
          자세히 보기
        </a>
      ) : null}
    </div>
  )
}
