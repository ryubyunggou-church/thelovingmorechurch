import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { Seo } from '../components/shared/Seo'
import { Button } from '../components/ui/button'
import { getNewsPost } from '../lib/content-service'
import { formatDate } from '../lib/utils'
import type { NewsPost } from '../types/content'

export function NewsDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState<NewsPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    void getNewsPost(id).then((p) => {
      setPost(p)
      setLoading(false)
    })
  }, [id])

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
          <div className="mt-10">
            <Button asChild variant="outline">
              <Link to="/news">목록으로</Link>
            </Button>
          </div>
        </article>
      </PageShell>
    </>
  )
}
