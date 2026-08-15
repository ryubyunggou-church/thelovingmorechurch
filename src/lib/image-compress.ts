const DEFAULT_MAX_DIMENSION = 1600
const DEFAULT_QUALITY = 0.82

// GIF는 애니메이션이 깨지고, SVG는 벡터라 래스터화하면 손상되므로 원본 그대로 통과시킨다.
const SKIP_MIME_TYPES = new Set(['image/gif', 'image/svg+xml'])

interface CompressOptions {
  maxDimension?: number
  quality?: number
}

/**
 * 업로드 전 이미지를 긴 변 기준 maxDimension으로 리사이즈하고 WebP로 재인코딩한다.
 * 브라우저 미지원, 디코드 실패, 압축 결과가 원본보다 커지는 경우 등
 * 어떤 이유로든 실패하면 원본 File을 그대로 반환한다 — 업로드 자체를 막지 않는다.
 */
export async function compressImage(
  file: File,
  { maxDimension = DEFAULT_MAX_DIMENSION, quality = DEFAULT_QUALITY }: CompressOptions = {},
): Promise<File> {
  if (!file.type.startsWith('image/') || SKIP_MIME_TYPES.has(file.type)) {
    return file
  }
  if (typeof createImageBitmap !== 'function' || typeof document === 'undefined') {
    return file
  }

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      bitmap.close()
      return file
    }
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality),
    )
    // toBlob이 null을 반환하거나(미지원) webp 대신 다른 타입으로 조용히 폴백한 경우,
    // 또는 재인코딩 결과가 원본보다 큰 경우엔 원본을 유지한다.
    if (!blob || blob.type !== 'image/webp' || blob.size >= file.size) {
      return file
    }

    const newName = file.name.replace(/\.[^.]+$/, '') + '.webp'
    return new File([blob], newName, { type: 'image/webp', lastModified: Date.now() })
  } catch {
    return file
  }
}
