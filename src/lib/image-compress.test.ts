import { afterEach, describe, expect, it, vi } from 'vitest'
import { compressImage } from './image-compress'

function makeFile(bytes: number, name: string, type: string): File {
  return new File([new Uint8Array(bytes)], name, { type })
}

function mockCanvasPipeline(resultBytes: number) {
  const bitmap = { width: 3200, height: 2000, close: vi.fn() }
  vi.stubGlobal(
    'createImageBitmap',
    vi.fn().mockResolvedValue(bitmap as unknown as ImageBitmap),
  )

  const ctx = { drawImage: vi.fn() }
  const canvas = {
    width: 0,
    height: 0,
    getContext: vi.fn().mockReturnValue(ctx),
    toBlob: vi.fn((cb: (b: Blob | null) => void) => {
      cb(new Blob([new Uint8Array(resultBytes)], { type: 'image/webp' }))
    }),
  }
  const realCreateElement = document.createElement.bind(document)
  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    if (tag === 'canvas') return canvas as unknown as HTMLCanvasElement
    return realCreateElement(tag)
  })

  return { bitmap, canvas }
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('compressImage', () => {
  it('passes GIFs through untouched (preserves animation)', async () => {
    const spy = vi.fn()
    vi.stubGlobal('createImageBitmap', spy)
    const file = makeFile(1000, 'a.gif', 'image/gif')

    const result = await compressImage(file)

    expect(result).toBe(file)
    expect(spy).not.toHaveBeenCalled()
  })

  it('passes SVGs through untouched (vector, not rasterizable)', async () => {
    const file = makeFile(1000, 'a.svg', 'image/svg+xml')
    const result = await compressImage(file)
    expect(result).toBe(file)
  })

  it('passes non-image files through untouched', async () => {
    const file = makeFile(1000, 'a.mp4', 'video/mp4')
    const result = await compressImage(file)
    expect(result).toBe(file)
  })

  it('falls back to the original file when createImageBitmap is unsupported', async () => {
    vi.stubGlobal('createImageBitmap', undefined)
    const file = makeFile(1000, 'a.jpg', 'image/jpeg')
    const result = await compressImage(file)
    expect(result).toBe(file)
  })

  it('re-encodes to a smaller WebP file when compression helps', async () => {
    const original = makeFile(5_000_000, 'photo.png', 'image/png')
    const { canvas } = mockCanvasPipeline(500_000)

    const result = await compressImage(original)

    expect(canvas.width).toBe(1600)
    expect(result.type).toBe('image/webp')
    expect(result.name).toBe('photo.webp')
    expect(result.size).toBe(500_000)
  })

  it('keeps the original when the re-encoded result would be larger', async () => {
    const original = makeFile(100_000, 'photo.png', 'image/png')
    mockCanvasPipeline(200_000)

    const result = await compressImage(original)

    expect(result).toBe(original)
  })

  it('falls back to the original file if any step throws', async () => {
    vi.stubGlobal('createImageBitmap', vi.fn().mockRejectedValue(new Error('decode failed')))
    const file = makeFile(1000, 'a.jpg', 'image/jpeg')

    const result = await compressImage(file)

    expect(result).toBe(file)
  })
})
