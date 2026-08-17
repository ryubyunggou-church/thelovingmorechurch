import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { Seo } from '../components/shared/Seo'
import { Button } from '../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog'
import { NewsEditorForm } from '../features/news/NewsEditorForm'
import { getNewsPosts, saveDocument } from '../lib/content-service'
import { getPageNumbers } from '../lib/pagination'
import { sanitizeHtml } from '../lib/sanitize'
import { cn, formatDate } from '../lib/utils'
import type { NewsPost } from '../types/content'
import { seedNews } from '../data/seed'
import { useAdminStore } from '../store/admin-store'

const PAGE_SIZE = 6

export function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>(seedNews)
  const [page, setPage] = useState(1)
  const [editorOpen, setEditorOpen] = useState(false)
  const isAdminMode = useAdminStore((s) => s.isAdminMode)
  const user = useAdminStore((s) => s.user)
  const pushToast = useAdminStore((s) => s.pushToast)

  const reload = async () => {
    setPosts(await getNewsPosts({ publishedOnly: !isAdminMode, pageSize: 100 }))
  }

  useEffect(() => {
    void reload()
  }, [isAdminMode])

  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE))
  const pageItems = useMemo(
    () => posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [posts, page],
  )

  return (
    <>
      <Seo title="교회소식" path="/news" />
      <PageShell title="교회소식" description="교회의 소식과 안내를 전합니다." current="교회소식">
        {isAdminMode ? (
          <div className="mb-6 flex justify-end">
            <Button onClick={() => setEditorOpen(true)}>새 글 작성</Button>
          </div>
        ) : null}

        <div className="grid gap-x-6 gap-y-10 border-t border-paper-line pt-10 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((post) => (
            <Link key={post.id} to={`/news/${post.id}`} className="group block">
              <div className="aspect-[16/10] overflow-hidden bg-paper-line">
                {post.thumbnail ? (
                  <img
                    src={post.thumbnail}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                ) : null}
              </div>
              <div className="border-t border-paper-line pt-4 mt-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="index-num text-xs text-paper-muted">{formatDate(post.createdAt)}</p>
                  {!post.isPublished ? (
                    <span className="text-[10px] font-semibold tracking-wide text-wine">
                      임시저장
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-1.5 line-clamp-2 font-serif text-lg font-medium text-paper-text group-hover:text-gold-deep">
                  {post.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 ? (
          <nav
            aria-label="교회소식 페이지 이동"
            className="mt-12 flex items-center justify-center gap-1"
          >
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              aria-label="이전 페이지"
              className="inline-flex h-8 w-8 items-center justify-center text-paper-muted transition hover:text-gold-deep disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {getPageNumbers(page, totalPages).map((token, i) =>
              token === 'ellipsis' ? (
                <span
                  key={`ellipsis-${i}`}
                  aria-hidden
                  className="index-num inline-flex h-8 w-8 items-center justify-center text-sm text-paper-muted"
                >
                  …
                </span>
              ) : (
                <button
                  key={token}
                  type="button"
                  aria-current={token === page ? 'page' : undefined}
                  onClick={() => setPage(token)}
                  className={cn(
                    'index-num inline-flex h-8 w-8 items-center justify-center text-sm transition',
                    token === page
                      ? 'font-semibold text-gold-deep'
                      : 'text-paper-muted hover:text-paper-text',
                  )}
                >
                  {token}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              aria-label="다음 페이지"
              className="inline-flex h-8 w-8 items-center justify-center text-paper-muted transition hover:text-gold-deep disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        ) : null}

        <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
          <DialogContent className="w-[min(92vw,40rem)]">
            <DialogHeader>
              <DialogTitle>교회소식 작성</DialogTitle>
              <DialogDescription>
                리치텍스트는 HTML로 저장되며 DOMPurify로 sanitize 됩니다. 긴 본문은 모달 안에서
                스크롤하세요.
              </DialogDescription>
            </DialogHeader>
            <NewsEditorForm
              onSubmit={async (payload) => {
                try {
                  const id = `news_${Date.now()}`
                  await saveDocument('newsPosts', id, {
                    title: payload.title,
                    contentHtml: sanitizeHtml(payload.contentHtml),
                    thumbnail: payload.thumbnail,
                    authorUid: user?.uid ?? 'admin',
                    createdAt: new Date().toISOString(),
                    isPublished: true,
                    viewCount: 0,
                  })
                  pushToast({ title: '게시 완료', variant: 'success' })
                  setEditorOpen(false)
                  await reload()
                } catch (err) {
                  pushToast({
                    title: '저장 실패',
                    description: err instanceof Error ? err.message : '',
                    variant: 'error',
                  })
                }
              }}
              onError={(m) => pushToast({ title: '업로드 실패', description: m, variant: 'error' })}
            />
          </DialogContent>
        </Dialog>
      </PageShell>
    </>
  )
}
