import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { Seo } from '../components/shared/Seo'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { FormField } from '../components/ui/form-field'
import { MediaInputField } from '../components/shared/MediaInputField'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog'
import { getNewsPosts, saveDocument } from '../lib/content-service'
import { sanitizeHtml } from '../lib/sanitize'
import { formatDate } from '../lib/utils'
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((post) => (
            <Link
              key={post.id}
              to={`/news/${post.id}`}
              className="group overflow-hidden rounded-2xl border border-stone bg-cream shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="aspect-[16/10] overflow-hidden bg-stone">
                {post.thumbnail ? (
                  <img
                    src={post.thumbnail}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : null}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-ink-muted">{formatDate(post.createdAt)}</p>
                  {!post.isPublished ? (
                    <span className="rounded bg-stone px-2 py-0.5 text-[10px] font-semibold text-ink-muted">
                      임시저장
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-2 line-clamp-2 font-medium text-ink group-hover:text-terracotta">
                  {post.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 ? (
          <div className="mt-10 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              이전
            </Button>
            <span className="text-sm text-ink-muted">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              다음
            </Button>
          </div>
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
              onSubmit={async (payload, publish) => {
                try {
                  const id = `news_${Date.now()}`
                  await saveDocument('newsPosts', id, {
                    title: payload.title,
                    contentHtml: sanitizeHtml(payload.contentHtml),
                    thumbnail: payload.thumbnail,
                    authorUid: user?.uid ?? 'admin',
                    createdAt: new Date().toISOString(),
                    isPublished: publish,
                    viewCount: 0,
                  })
                  pushToast({
                    title: publish ? '게시 완료' : '임시 저장됨',
                    variant: 'success',
                  })
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

function NewsEditorForm({
  onSubmit,
  onError,
}: {
  onSubmit: (
    payload: { title: string; contentHtml: string; thumbnail: string },
    publish: boolean,
  ) => Promise<void>
  onError: (m: string) => void
}) {
  const [title, setTitle] = useState('')
  const [contentHtml, setContentHtml] = useState('<p></p>')
  const [thumbnail, setThumbnail] = useState('')
  const [saving, setSaving] = useState(false)

  return (
    <div className="space-y-4">
      <FormField label="제목" htmlFor="news-title" required hint="목록·상세에 표시되는 글 제목">
        <Input
          id="news-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          required
        />
      </FormField>

      <MediaInputField
        label="썸네일 이미지"
        imageOnly
        folder="news"
        value={{ mediaUrl: thumbnail, mediaType: 'image' }}
        defaultUrl=""
        hint="목록 카드에 쓰입니다. 없으면 빈 썸네일로 표시됩니다."
        onChange={(m) => setThumbnail(m.mediaUrl)}
        onError={onError}
      />

      <FormField
        label="본문 (HTML)"
        htmlFor="news-body"
        required
        hint="p, h1~h6, strong 등. 저장 시 서버/클라이언트 sanitize 적용"
      >
        <Textarea
          id="news-body"
          className="min-h-[180px] font-mono text-xs"
          value={contentHtml}
          onChange={(e) => setContentHtml(e.target.value)}
          placeholder="<p>본문…</p>"
        />
      </FormField>

      <div className="flex justify-end gap-2">
        <Button
          variant="secondary"
          disabled={saving || !title.trim()}
          onClick={() => {
            setSaving(true)
            void onSubmit({ title: title.trim(), contentHtml, thumbnail }, false).finally(() =>
              setSaving(false),
            )
          }}
        >
          저장 후 미리보기
        </Button>
        <Button
          disabled={saving || !title.trim()}
          onClick={() => {
            setSaving(true)
            void onSubmit({ title: title.trim(), contentHtml, thumbnail }, true).finally(() =>
              setSaving(false),
            )
          }}
        >
          게시
        </Button>
      </div>
    </div>
  )
}
