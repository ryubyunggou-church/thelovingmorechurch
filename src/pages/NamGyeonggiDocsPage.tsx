import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Check, Download, Eye, Pencil, Plus, Printer, Trash2, X } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { Seo } from '../components/shared/Seo'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { PresbyteryDocForm } from '../features/presbytery/PresbyteryDocForm'
import {
  getPresbyteryDocuments,
  markPresbyteryDocumentRead,
  removeDocument,
  saveDocument,
} from '../lib/content-service'
import { getPageNumbers } from '../lib/pagination'
import { cn, formatDate } from '../lib/utils'
import { useAdminStore } from '../store/admin-store'
import type { PresbyteryDocDirection, PresbyteryDocument } from '../types/content'

const PAGE_SIZE = 10

type DirectionFilter = 'all' | PresbyteryDocDirection

const DIRECTION_LABEL: Record<PresbyteryDocDirection, string> = {
  inbound: '수신',
  outbound: '발신',
}

export function NamGyeonggiDocsPage() {
  const isAdminMode = useAdminStore((s) => s.isAdminMode)
  const authLoading = useAdminStore((s) => s.loading)
  const pushToast = useAdminStore((s) => s.pushToast)

  const [docs, setDocs] = useState<PresbyteryDocument[]>([])
  const [directionFilter, setDirectionFilter] = useState<DirectionFilter>('all')
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [viewing, setViewing] = useState<PresbyteryDocument | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const reload = useCallback(async () => {
    setDocs(await getPresbyteryDocuments())
  }, [])

  useEffect(() => {
    if (isAdminMode) void reload()
  }, [isAdminMode, reload])

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    return docs.filter((d) => {
      if (directionFilter !== 'all' && d.direction !== directionFilter) return false
      if (kw && !d.title.toLowerCase().includes(kw)) return false
      return true
    })
  }, [docs, directionFilter, keyword])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  // 삭제·필터링으로 목록이 줄어들어 마지막 페이지가 사라진 경우, 상태 갱신 없이 즉시
  // 유효한 페이지로 맞춰서 렌더링한다 (빈 화면에 갇히는 것 방지).
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // Firebase 인증 확인이 끝나기 전(authLoading)에는 isAdminMode가 아직 기본값(false)일 수 있다 —
  // 이 시점에 바로 리다이렉트하면 실제 관리자가 새로고침/직접 접근 시 튕겨나간다. 확인이 끝난 뒤에만 판단한다.
  if (authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-paper-muted">
        확인 중…
      </div>
    )
  }
  if (!isAdminMode) {
    return <Navigate to="/" replace />
  }

  const markRead = async (target: PresbyteryDocument) => {
    if (target.direction !== 'inbound' || target.isRead) return
    try {
      await markPresbyteryDocumentRead(target.id)
      setDocs((prev) => prev.map((d) => (d.id === target.id ? { ...d, isRead: true } : d)))
    } catch (err) {
      pushToast({
        title: '읽음 처리 실패',
        description: err instanceof Error ? err.message : '',
        variant: 'error',
      })
    }
  }

  const openView = (target: PresbyteryDocument) => {
    setViewing(target)
    void markRead(target)
  }

  const downloadDoc = (target: PresbyteryDocument) => {
    void markRead(target)
  }

  const startEdit = (target: PresbyteryDocument) => {
    setEditingId(target.id)
    setEditTitle(target.title)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
  }

  const saveEdit = async (target: PresbyteryDocument) => {
    const title = editTitle.trim()
    if (!title) {
      pushToast({ title: '제목을 입력해 주세요.', variant: 'error' })
      return
    }
    try {
      await saveDocument('presbyteryDocuments', target.id, { title })
      setDocs((prev) => prev.map((d) => (d.id === target.id ? { ...d, title } : d)))
      pushToast({ title: '수정됨', variant: 'success' })
      cancelEdit()
    } catch (err) {
      pushToast({
        title: '수정 실패',
        description: err instanceof Error ? err.message : '',
        variant: 'error',
      })
    }
  }

  const deleteDoc = async (target: PresbyteryDocument) => {
    if (!window.confirm(`"${target.title}" 문서를 삭제할까요?`)) return
    try {
      await removeDocument('presbyteryDocuments', target.id)
      setDocs((prev) => prev.filter((d) => d.id !== target.id))
      pushToast({ title: '삭제됨', variant: 'success' })
    } catch (err) {
      pushToast({
        title: '삭제 실패',
        description: err instanceof Error ? err.message : '',
        variant: 'error',
      })
    }
  }

  return (
    <>
      <Seo title="남경기노회 문서함" path="/admin/nam-gyeonggi" />
      <PageShell
        title="남경기노회 문서함"
        description="노회-교회 간 공문서 수신·발신을 관리합니다. 관리자 전용 페이지입니다."
        current="남경기노회 문서함"
      >
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Input
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value)
              setPage(1)
            }}
            placeholder="제목 검색"
            className="max-w-xs"
          />
          <div className="flex gap-1.5">
            {(
              [
                { value: 'all' as const, label: '전체' },
                { value: 'inbound' as const, label: '수신' },
                { value: 'outbound' as const, label: '발신' },
              ]
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setDirectionFilter(opt.value)
                  setPage(1)
                }}
                className={cn(
                  'rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors',
                  directionFilter === opt.value
                    ? 'border-gold-deep bg-gold/15 text-paper-text'
                    : 'border-paper-line text-paper-muted hover:bg-paper-dim',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <Button size="sm" className="ml-auto" onClick={() => setUploadOpen(true)}>
            <Plus className="h-4 w-4" />
            문서 등록
          </Button>
        </div>

        <div className="overflow-x-auto rounded-sm border border-paper-line">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-paper-line bg-paper-dim text-left text-xs font-semibold text-paper-muted">
                <th className="px-4 py-3">구분</th>
                <th className="px-4 py-3">제목</th>
                <th className="px-4 py-3">등록일</th>
                <th className="px-4 py-3">등록자</th>
                <th className="px-4 py-3">읽음상태</th>
                <th className="px-4 py-3">액션</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-paper-muted">
                    등록된 문서가 없습니다.
                  </td>
                </tr>
              ) : (
                pageItems.map((d) => (
                  <tr key={d.id} className="border-b border-paper-line last:border-0">
                    <td className="px-4 py-3 text-xs font-medium text-paper-muted">
                      {DIRECTION_LABEL[d.direction]}
                    </td>
                    <td className="px-4 py-3 font-medium text-paper-text">
                      {editingId === d.id ? (
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="h-8"
                          autoFocus
                        />
                      ) : (
                        <span title={d.note || undefined}>{d.title}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-paper-muted">{formatDate(d.uploadedAt)}</td>
                    <td className="px-4 py-3 text-paper-muted">{d.uploadedBy}</td>
                    <td className="px-4 py-3">
                      {d.direction === 'inbound' ? (
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 text-xs font-medium',
                            d.isRead ? 'text-paper-muted' : 'text-wine',
                          )}
                        >
                          <span
                            className={cn(
                              'h-1.5 w-1.5 rounded-full',
                              d.isRead ? 'bg-paper-muted' : 'bg-wine',
                            )}
                          />
                          {d.isRead ? '읽음' : '안읽음'}
                        </span>
                      ) : (
                        <span className="text-paper-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === d.id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="저장"
                            aria-label="저장"
                            onClick={() => void saveEdit(d)}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="취소"
                            aria-label="취소"
                            onClick={cancelEdit}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          {d.fileType === 'pdf' ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="뷰"
                                aria-label="뷰"
                                onClick={() => openView(d)}
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <a href={d.fileUrl} target="_blank" rel="noreferrer">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  title="출력"
                                  aria-label="출력"
                                >
                                  <Printer className="h-3.5 w-3.5" />
                                </Button>
                              </a>
                            </>
                          ) : null}
                          <a
                            href={d.fileUrl}
                            download={d.fileName}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => downloadDoc(d)}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="다운로드"
                              aria-label="다운로드"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="수정"
                            aria-label="수정"
                            onClick={() => startEdit(d)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:text-wine"
                            title="삭제"
                            aria-label="삭제"
                            onClick={() => void deleteDoc(d)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 ? (
          <nav
            aria-label="문서함 페이지 이동"
            className="mt-6 flex items-center justify-center gap-1"
          >
            {getPageNumbers(currentPage, totalPages).map((token, i) =>
              token === 'ellipsis' ? (
                <span
                  key={`ellipsis-${i}`}
                  aria-hidden
                  className="inline-flex h-8 w-8 items-center justify-center text-sm text-paper-muted"
                >
                  …
                </span>
              ) : (
                <button
                  key={token}
                  type="button"
                  onClick={() => setPage(token)}
                  className={cn(
                    'inline-flex h-8 w-8 items-center justify-center rounded-sm text-sm transition',
                    token === currentPage
                      ? 'bg-gold text-ink font-semibold'
                      : 'text-paper-muted hover:bg-paper-dim',
                  )}
                >
                  {token}
                </button>
              ),
            )}
          </nav>
        ) : null}
      </PageShell>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="w-[min(92vw,32rem)]">
          <DialogHeader>
            <DialogTitle>문서 등록</DialogTitle>
            <DialogDescription>
              노회에서 받은 문서(수신) 또는 노회로 보낼 문서(발신)를 등록합니다.
            </DialogDescription>
          </DialogHeader>
          <PresbyteryDocForm
            onSaved={() => {
              pushToast({ title: '등록됨', variant: 'success' })
              setUploadOpen(false)
              void reload()
            }}
            onError={(m) => pushToast({ title: '등록 실패', description: m, variant: 'error' })}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={viewing !== null} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="w-[min(92vw,48rem)]">
          <DialogHeader>
            <DialogTitle>{viewing?.title}</DialogTitle>
            <DialogDescription>
              {viewing ? `등록일 ${formatDate(viewing.uploadedAt)} · ${viewing.uploadedBy}` : ''}
            </DialogDescription>
          </DialogHeader>
          {viewing?.note ? (
            <p className="rounded-sm bg-paper-dim px-3 py-2 text-sm text-paper-muted">
              {viewing.note}
            </p>
          ) : null}
          {viewing ? (
            <object
              data={viewing.fileUrl}
              type="application/pdf"
              className="h-[65vh] w-full border border-paper-line"
            >
              <p className="p-4 text-sm text-paper-muted">
                이 브라우저에서는 PDF 미리보기를 지원하지 않습니다.{' '}
                <a
                  href={viewing.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold-deep underline"
                >
                  새 탭에서 PDF 열기
                </a>
              </p>
            </object>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
