import { useEffect, useRef, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import type { SitePopup } from '../../types/content'
import { useAdminStore } from '../../store/admin-store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { cn } from '../../lib/utils'
import { getSitePopups, removeDocument, saveDocument } from '../../lib/content-service'
import { createBlankSitePopup } from '../../lib/popup-list'
import { PopupEditor } from './PopupEditor'

const CONFIRM_TIMEOUT_MS = 4000

const CONTENT_TYPE_LABEL: Record<SitePopup['contentType'], string> = {
  image: '이미지',
  pdf: 'PDF',
  richtext: '텍스트',
}

const POSITION_LABEL: Record<SitePopup['position'], string> = {
  center: '중앙',
  top: '상단',
  'bottom-sheet': '하단 시트',
  'corner-br': '우하단',
  'corner-bl': '좌하단',
}

/** 관리자 전역 — Header의 「팝업 관리」 버튼으로 열리는 사이트 팝업 CRUD 모달. 표 형태 목록. */
export function PopupManageModal() {
  const open = useAdminStore((s) => s.popupManageOpen)
  const setOpen = useAdminStore((s) => s.setPopupManageOpen)
  const pushToast = useAdminStore((s) => s.pushToast)

  const [popups, setPopups] = useState<SitePopup[]>([])
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [editingPopup, setEditingPopup] = useState<SitePopup | null>(null)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const refresh = async () => {
    setLoading(true)
    try {
      setPopups(await getSitePopups())
    } catch {
      setPopups([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) void refresh()
  }, [open])

  useEffect(() => {
    return () => {
      if (confirmTimer.current) clearTimeout(confirmTimer.current)
    }
  }, [])

  const addPopup = async () => {
    setAdding(true)
    try {
      const blank = createBlankSitePopup()
      await saveDocument('sitePopups', blank.id, {
        label: blank.label,
        enabled: blank.enabled,
        startDate: blank.startDate,
        endDate: blank.endDate,
        contentType: blank.contentType,
        mediaUrl: blank.mediaUrl,
        contentHtml: blank.contentHtml,
        title: blank.title,
        linkUrl: blank.linkUrl,
        position: blank.position,
        priority: blank.priority,
        hideForHours: blank.hideForHours,
        createdAt: blank.createdAt,
        updatedAt: blank.updatedAt,
      })
      pushToast({
        title: '새 팝업이 추가되었습니다',
        description: '목록에서 「편집」을 눌러 내용을 입력해 주세요.',
        variant: 'success',
      })
      await refresh()
    } catch (err) {
      pushToast({
        title: '팝업 추가 실패',
        description: err instanceof Error ? err.message : '',
        variant: 'error',
      })
    } finally {
      setAdding(false)
    }
  }

  const requestDelete = (id: string) => {
    if (confirmingId === id) {
      void doDelete(id)
      return
    }
    setConfirmingId(id)
    if (confirmTimer.current) clearTimeout(confirmTimer.current)
    confirmTimer.current = setTimeout(() => setConfirmingId(null), CONFIRM_TIMEOUT_MS)
  }

  const doDelete = async (id: string) => {
    if (confirmTimer.current) clearTimeout(confirmTimer.current)
    setDeletingId(id)
    try {
      await removeDocument('sitePopups', id)
      pushToast({ title: '팝업이 삭제되었습니다', variant: 'success' })
      await refresh()
    } catch (err) {
      pushToast({
        title: '삭제 실패',
        description: err instanceof Error ? err.message : '',
        variant: 'error',
      })
    } finally {
      setDeletingId(null)
      setConfirmingId(null)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[min(94vw,56rem)]">
          <DialogHeader>
            <DialogTitle>팝업 관리</DialogTitle>
            <DialogDescription>
              날짜 범위 안에서 활성화된 팝업만 방문자에게 노출됩니다. 여러 개가 동시에 활성이면
              우선순위 순으로 하나씩 이어서 노출됩니다(순차 노출). 모바일에서는 팝업이 표시되지
              않습니다.
            </DialogDescription>
          </DialogHeader>

          <Button type="button" onClick={() => void addPopup()} disabled={adding}>
            <Plus className="h-4 w-4" />
            {adding ? '추가 중…' : '새 팝업 추가'}
          </Button>

          <div className="mt-3 overflow-x-auto rounded-lg border border-stone">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-cream-dark text-xs text-ink-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">이름</th>
                  <th className="px-3 py-2 font-medium">기간</th>
                  <th className="px-3 py-2 font-medium">타입</th>
                  <th className="px-3 py-2 font-medium">위치</th>
                  <th className="px-3 py-2 font-medium">우선순위</th>
                  <th className="px-3 py-2 font-medium">활성</th>
                  <th className="px-3 py-2 font-medium">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone">
                {popups.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-ink-muted">
                      {loading ? '불러오는 중…' : '등록된 팝업이 없습니다.'}
                    </td>
                  </tr>
                ) : (
                  popups.map((popup) => {
                    const isConfirming = confirmingId === popup.id
                    return (
                      <tr key={popup.id}>
                        <td className="max-w-[10rem] truncate px-3 py-2 font-medium text-ink">
                          {popup.label || '(이름 없음)'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-ink-muted">
                          {popup.startDate} ~ {popup.endDate}
                        </td>
                        <td className="px-3 py-2 text-ink-muted">
                          {CONTENT_TYPE_LABEL[popup.contentType]}
                        </td>
                        <td className="px-3 py-2 text-ink-muted">
                          {POSITION_LABEL[popup.position]}
                        </td>
                        <td className="px-3 py-2 text-ink-muted">{popup.priority}</td>
                        <td className="px-3 py-2">
                          {popup.enabled ? (
                            <span className="rounded-full bg-terracotta/10 px-2 py-0.5 text-xs font-medium text-terracotta-dark">
                              켜짐
                            </span>
                          ) : (
                            <span className="rounded-full bg-stone/40 px-2 py-0.5 text-xs font-medium text-ink-muted">
                              꺼짐
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingPopup(popup)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              편집
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={deletingId === popup.id}
                              onClick={() => requestDelete(popup.id)}
                              className={cn(
                                'border-red-200 bg-cream/80 text-red-800 hover:bg-red-50',
                                isConfirming && 'bg-red-50',
                              )}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              {isConfirming ? '한 번 더 클릭' : '삭제'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingPopup !== null}
        onOpenChange={(o) => {
          if (!o) setEditingPopup(null)
        }}
      >
        <DialogContent className="w-[min(92vw,36rem)]">
          <DialogHeader>
            <DialogTitle>{editingPopup?.label || '팝업'} 편집</DialogTitle>
            <DialogDescription>저장 즉시 Firestore에 반영됩니다.</DialogDescription>
          </DialogHeader>
          {editingPopup ? (
            <PopupEditor
              popup={editingPopup}
              onSaved={() => {
                pushToast({ title: '팝업 저장됨', variant: 'success' })
                setEditingPopup(null)
                void refresh()
              }}
              onError={(msg) =>
                pushToast({ title: '저장 실패', description: msg, variant: 'error' })
              }
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
