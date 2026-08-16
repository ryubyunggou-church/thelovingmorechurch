import { useEffect, useState } from 'react'
import type { HeroSlide } from '../../types/content'
import { resolveMediaKind, toYoutubeEmbedUrl } from '../../lib/media'
import { seedHeroSlides } from '../../data/seed'

const FALLBACK_IMAGE = seedHeroSlides[0]!.mediaUrl

export function HeroMediaBackground({ slide }: { slide: HeroSlide }) {
  const url = slide.mediaUrl?.trim() || FALLBACK_IMAGE
  const kind = resolveMediaKind(url, slide.mediaType)
  const [imgFailed, setImgFailed] = useState(false)

  useEffect(() => {
    setImgFailed(false)
  }, [url, slide.id])

  if (kind === 'youtube') {
    const embed = toYoutubeEmbedUrl(url)
    if (!embed) {
      return (
        <img
          src={FALLBACK_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )
    }
    return (
      <div className="absolute inset-0 overflow-hidden bg-ink">
        <iframe
          key={slide.id + embed}
          src={embed}
          title={slide.title || 'YouTube'}
          className="pointer-events-none absolute left-1/2 top-1/2 aspect-video h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    )
  }

  if (kind === 'video') {
    return (
      <video
        key={slide.id + url}
        className="absolute inset-0 h-full w-full object-cover"
        src={url}
        autoPlay
        muted
        loop
        playsInline
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
    )
  }

  const src = imgFailed ? FALLBACK_IMAGE : url
  return (
    <img
      key={slide.id + src}
      src={src}
      alt={slide.title}
      className="absolute inset-0 h-full w-full object-cover"
      fetchPriority="high"
      onError={() => setImgFailed(true)}
    />
  )
}

export { FALLBACK_IMAGE }
