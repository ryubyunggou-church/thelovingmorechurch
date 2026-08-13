import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage, auth } from './firebase'
import { detectMediaType as detectMediaKind } from './media'

export { detectMediaKind as detectMediaType }

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif)$/i
const VIDEO_EXT = /\.(mp4|webm|mov)$/i

export function isAllowedHeroMedia(file: File): boolean {
  const name = file.name
  const type = file.type
  if (type.startsWith('image/') || type.startsWith('video/mp4') || type === 'video/webm') return true
  return IMAGE_EXT.test(name) || VIDEO_EXT.test(name)
}

function mapUploadError(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = String((err as { code: string }).code)
    if (code === 'storage/unauthorized') {
      return 'Storage 업로드 권한이 없습니다. 관리자 로그인 여부와 Storage 규칙(admins) 배포를 확인해 주세요.'
    }
    if (code === 'storage/canceled') return '업로드가 취소되었습니다.'
    if (code === 'storage/retry-limit-exceeded') return '네트워크 오류로 업로드에 실패했습니다. 다시 시도해 주세요.'
    if (code === 'storage/quota-exceeded') return 'Storage 용량 한도를 초과했습니다.'
  }
  if (err instanceof Error) return err.message
  return '업로드에 실패했습니다.'
}

/** Upload to Firebase Storage `uploads/{folder}/...` and return public download URL. */
export async function uploadMediaFile(file: File, folder = 'hero'): Promise<string> {
  if (!storage) {
    throw new Error('Firebase Storage가 설정되지 않았습니다. .env 및 Storage 활성화를 확인해 주세요.')
  }
  if (!auth?.currentUser) {
    throw new Error('관리자로 로그인한 뒤에 파일을 업로드할 수 있습니다.')
  }
  if (!isAllowedHeroMedia(file)) {
    throw new Error('허용 형식: 이미지(jpg/png/webp 등) 또는 영상(mp4/webm)')
  }
  // 15MB limit (matches storage.rules)
  if (file.size > 15 * 1024 * 1024) {
    throw new Error('파일 용량은 15MB 이하여야 합니다.')
  }

  const safeName = file.name.replace(/[^\w.\-가-힣]/g, '_')
  const path = `uploads/${folder}/${Date.now()}_${safeName}`
  const storageRef = ref(storage, path)
  try {
    await uploadBytes(storageRef, file, {
      contentType: file.type || undefined,
    })
    return await getDownloadURL(storageRef)
  } catch (err) {
    throw new Error(mapUploadError(err))
  }
}
