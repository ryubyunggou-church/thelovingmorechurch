import { describe, it, expect } from 'vitest'
import { detectMediaType, extractYoutubeId, resolveMediaKind, toYoutubeEmbedUrl } from './media'

describe('YouTube media helpers', () => {
  it('parses watch / youtu.be / shorts URLs', () => {
    expect(extractYoutubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(extractYoutubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(extractYoutubeId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('detects youtube media type', () => {
    expect(detectMediaType('https://youtu.be/dQw4w9WgXcQ')).toBe('youtube')
    expect(detectMediaType('https://example.com/a.mp4')).toBe('video')
    expect(detectMediaType('https://example.com/a.jpg')).toBe('image')
  })

  it('builds embed url', () => {
    const embed = toYoutubeEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    expect(embed).toContain('youtube-nocookie.com/embed/dQw4w9WgXcQ')
    expect(embed).toContain('autoplay=1')
  })

  it('does not force youtube when stored type is wrong', () => {
    expect(
      resolveMediaKind('https://images.unsplash.com/photo-1.jpg', 'youtube'),
    ).toBe('image')
  })
})
