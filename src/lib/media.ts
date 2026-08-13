export type MediaKind = 'image' | 'video' | 'youtube'

/** youtube.com/watch?v=, youtu.be/, youtube.com/embed/, youtube.com/shorts/ */
export function extractYoutubeId(url: string): string | null {
  if (!url?.trim()) return null
  try {
    const u = new URL(url.trim())
    const host = u.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      const id = u.pathname.split('/').filter(Boolean)[0]
      return id && /^[\w-]{6,}$/.test(id) ? id : null
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      const v = u.searchParams.get('v')
      if (v && /^[\w-]{6,}$/.test(v)) return v

      const parts = u.pathname.split('/').filter(Boolean)
      const marker = parts.findIndex((p) => ['embed', 'shorts', 'live', 'v'].includes(p))
      if (marker >= 0 && parts[marker + 1] && /^[\w-]{6,}$/.test(parts[marker + 1]!)) {
        return parts[marker + 1]!
      }
    }
  } catch {
    return null
  }
  return null
}

export function isYoutubeUrl(url: string): boolean {
  return extractYoutubeId(url) != null
}

/** Privacy-enhanced embed URL with autoplay/mute/loop for hero background. */
export function toYoutubeEmbedUrl(urlOrId: string): string | null {
  const raw = urlOrId?.trim() ?? ''
  if (!raw) return null
  const id = extractYoutubeId(raw) ?? (/^[\w-]{6,}$/.test(raw) ? raw : null)
  if (!id) return null
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    controls: '0',
    playsinline: '1',
    loop: '1',
    playlist: id,
    rel: '0',
    modestbranding: '1',
  })
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`
}

const VIDEO_EXT = /\.(mp4|webm|mov)(\?|#|$)/i

/**
 * Infer media kind from URL/path. Always prefer URL contents over a stored label
 * (stored 'youtube' with an image URL was causing blank heroes).
 */
export function detectMediaType(fileNameOrUrl: string): MediaKind {
  const s = fileNameOrUrl?.trim() ?? ''
  if (!s) return 'image'
  if (isYoutubeUrl(s)) return 'youtube'
  if (VIDEO_EXT.test(s) || s.startsWith('blob:') && s.includes('video')) return 'video'
  // Firebase storage video content often has no extension in token URLs — check path segment
  if (/\/o\/uploads%2F.*\.(mp4|webm|mov)/i.test(s) || /\.(mp4|webm|mov)/i.test(decodeURIComponent(s))) {
    return 'video'
  }
  return 'image'
}

export function resolveMediaKind(
  mediaUrl: string,
  stored?: MediaKind | string | null,
): MediaKind {
  const url = mediaUrl?.trim() ?? ''
  if (!url) return 'image'

  // URL contents always win for youtube / video file detection
  if (isYoutubeUrl(url)) return 'youtube'
  const fromUrl = detectMediaType(url)
  if (fromUrl === 'video') return 'video'

  // Stored label only if it doesn't contradict the URL
  if (stored === 'youtube') return 'image' // non-youtube URL but labeled youtube → show as image
  if (stored === 'video') return 'video'
  return 'image'
}

export function hasUsableMediaUrl(url: string | undefined | null): boolean {
  return Boolean(url && url.trim().length > 0)
}
