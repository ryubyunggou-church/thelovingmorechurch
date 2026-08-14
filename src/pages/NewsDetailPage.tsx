import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
import { getNewsPost, removeDocument, saveDocument } from '../lib/content-service'
import { sanitizeHtml } from '../lib/sanitize'
import { cn, formatDate } from '../lib/utils'
import type { NewsPost } from '../types/content'
import { useAdminStore } from '../store/admin-store'

const DELETE_CONFIRM_TIMEOUT_MS = 4000

export function NewsDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<NewsPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isAdminMode = useAdminStore((s) => s.isAdminMode)
  const pushToast = useAdminStore((s) => s.pushToast)

  const reload = async (postId: string) => {
    setLoading(true)
    const p = await getNewsPost(postId)
    setPost(p)
    setLoading(false)
  }

  useEffect(() => {
    if (!id) return
    void reload(id)
  }, [id])

  useEffect(() => {
    return () => {
      if (confirmTimer.current) clearTimeout(confirmTimer.current)
    }
  }, [])

  const requestDelete = () => {
    if (!post) return
    if (confirmingDelete) {
      void doDelete()
      return
    }
    setConfirmingDelete(true)
    if (confirmTimer.current) clearTimeout(confirmTimer.current)
    confirmTimer.current = setTimeout(() => setConfirmingDelete(false), DELETE_CONFIRM_TIMEOUT_MS)
  }

  const doDelete = async () => {
    if (!post) return
    if (confirmTimer.current) clearTimeout(confirmTimer.current)
    setDeleting(true)
    try {
      await removeDocument('newsPosts', post.id)
      pushToast({ title: '삭제되었습니다', variant: 'success' })
      navigate('/news')
    } catch (err) {
      pushToast({
        title: '삭제 실패',
        description: err instanceof Error ? err.message : '',
        variant: 'error',
      })
      setDeleting(false)
      setConfirmingDelete(false)
    }
  }

  if (loading) {
    return (
      <PageShell title="교회소식" current="교회소식">
        <p className="text-sm text-ink-muted">불러오는 중…</p>
      </PageShell>
    )
  }

  if (!post) {
    return (
      <PageShell title="교회소식" current="교회소식">
        <p className="text-sm text-ink-muted">게시글을 찾을 수 없습니다.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/news">목록으로</Link>
        </Button>
      </PageShell>
    )
  }

  return (
    <>
      <Seo title={post.title} path={`/news/${post.id}`} description={post.title} />
      <PageShell title="교회소식" description={formatDate(post.createdAt)} current="교회소식">
        <article className="mx-auto max-w-3xl">
          {post.thumbnail ? (
            <img
              src={post.thumbnail}
              alt=""
              className="mb-8 aspect-[16/9] w-full rounded-2xl object-cover"
            />
          ) : null}
          <h1 className="font-serif text-3xl font-semibold text-ink">{post.title}</h1>
          <p className="mt-2 text-sm text-ink-muted">{formatDate(post.createdAt)}</p>
          <div
            className="prose prose-stone mt-8 max-w-none text-ink-muted"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
          <div className="mt-10 flex flex-wrap items-center gap-2">
            <Button asChild variant="outline">
              <Link to="/news">목록으로</Link>
            </Button>
            {isAdminMode ? (
              <>
                <Button type="button" variant="outline" onClick={() => setEditOpen(true)}>
                  수정
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={deleting}
                  onClick={requestDelete}
                  className={cn(
                    'border-red-200 bg-cream/80 text-red-800 hover:bg-red-50',
                    confirmingDelete && 'bg-red-50',
                  )}
                >
                  {confirmingDelete ? '한 번 더 클릭하면 삭제됩니다' : '삭제'}
                </Button>
              </>
            ) : null}
          </div>
        </article>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="w-[min(92vw,40rem)]">
            <DialogHeader>
              <DialogTitle>교회소식 수정</DialogTitle>
              <DialogDescription>
                리치텍스트는 HTML로 저장되며 DOMPurify로 sanitize 됩니다.
              </DialogDescription>
            </DialogHeader>
            <NewsEditorForm
              post={post}
              submitLabel="저장"
              onSubmit={async (payload) => {
                try {
                  await saveDocument('newsPosts', post.id, {
                    title: payload.title,
                    contentHtml: sanitizeHtml(payload.contentHtml),
                    thumbnail: payload.thumbnail.trim() || post.thumbnail,
                    isPublished: true,
                  })
                  pushToast({ title: '수정되었습니다', variant: 'success' })
                  setEditOpen(false)
                  await reload(post.id)
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
