import { Link } from 'react-router-dom'
import type { NewsPost } from '../../types/content'
import { formatDate } from '../../lib/utils'
import { Reveal } from '../../components/shared/Reveal'

interface Props {
  posts: NewsPost[]
}

export function NewsPreview({ posts }: Props) {
  return (
    <section className="bg-paper-dim py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-10 flex items-end justify-between gap-4 border-b border-paper-line pb-6">
            <h2 className="font-serif text-2xl font-semibold text-paper-text sm:text-3xl">
              교회소식
            </h2>
            <Link
              to="/news"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-deep hover:text-wine"
            >
              더보기
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post, i) => (
            <Reveal key={post.id} delay={80 + i * 70} as="div">
              <Link to={`/news/${post.id}`} className="group block">
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
                  <p className="index-num text-xs text-paper-muted">{formatDate(post.createdAt)}</p>
                  <h3 className="mt-1.5 line-clamp-2 font-serif text-lg font-medium text-paper-text group-hover:text-gold-deep">
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
