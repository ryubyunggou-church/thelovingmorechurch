import { Link } from 'react-router-dom'
import type { NewsPost } from '../../types/content'
import { formatDate } from '../../lib/utils'
import { Reveal } from '../../components/shared/Reveal'

interface Props {
  posts: NewsPost[]
}

export function NewsPreview({ posts }: Props) {
  return (
    <section className="bg-cream-dark py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-terracotta">교회소식</p>
              <h2 className="mt-1 font-serif text-2xl font-semibold text-ink sm:text-3xl">
                최신 소식
              </h2>
            </div>
            <Link to="/news" className="text-sm font-medium text-terracotta hover:underline">
              더보기 →
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post, i) => (
            <Reveal key={post.id} delay={80 + i * 70} as="div">
              <Link
                to={`/news/${post.id}`}
                className="group block overflow-hidden rounded-2xl border border-stone bg-cream shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
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
                  <p className="text-xs text-ink-muted">{formatDate(post.createdAt)}</p>
                  <h3 className="mt-2 line-clamp-2 font-medium text-ink group-hover:text-terracotta">
                    {post.title}
                  </h3>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
