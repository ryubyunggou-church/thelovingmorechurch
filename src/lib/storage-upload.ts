import { app, auth } from './firebase'
import { compressImage } from './image-compress'
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
  if (!app) {
    throw new Error('Firebase Storage가 설정되지 않았습니다. .env 및 Storage 활성화를 확인해 주세요.')
  }
  if (!auth?.currentUser) {
    throw new Error('관리자로 로그인한 뒤에 파일을 업로드할 수 있습니다.')
  }
  if (!isAllowedHeroMedia(file)) {
    throw new Error('허용 형식: 이미지(jpg/png/webp 등) 또는 영상(mp4/webm)')
  }

  // 이미지는 업로드 전에 리사이즈 + WebP로 재인코딩해 용량을 줄인다.
  // 영상은 그대로 둔다.
  const uploadFile = file.type.startsWith('image/') ? await compressImage(file) : file

  // 15MB limit (matches storage.rules) — 압축된 결과 기준으로 검사한다.
  if (uploadFile.size > 15 * 1024 * 1024) {
    throw new Error('파일 용량은 15MB 이하여야 합니다.')
  }

  // Lazy-load the Storage SDK so it's excluded from the eagerly-loaded
  // firebase chunk that every visitor downloads — only admins uploading
  // media pull this in.
  const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
  const storage = getStorage(app)

  const safeName = uploadFile.name.replace(/[^\w.\-가-힣]/g, '_')
  const path = `uploads/${folder}/${Date.now()}_${safeName}`
  const storageRef = ref(storage, path)
  try {
    await uploadBytes(storageRef, uploadFile, {
      contentType: uploadFile.type || undefined,
    })
    return await getDownloadURL(storageRef)
  } catch (err) {
    throw new Error(mapUploadError(err))
  }
}

const PRESBYTERY_DOC_EXT = /\.(pdf|hwp|hwpx|docx?|xlsx?|jpe?g|png)$/i

function isAllowedPresbyteryDoc(file: File): boolean {
  const type = file.type
  if (
    type === 'application/pdf' ||
    type.startsWith('image/') ||
    type === 'application/msword' ||
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    type === 'application/vnd.ms-excel' ||
    type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return true
  }
  // hwp/hwpx는 브라우저가 종종 빈 문자열이나 application/octet-stream으로 잡는다 — 확장자로 보완 판별
  return PRESBYTERY_DOC_EXT.test(file.name)
}

/**
 * 남경기노회 문서함 전용 업로드 — 공개 `uploads/**`와 분리된 비공개 경로
 * `presbytery-docs/{direction}/...`에 저장한다. 이미지 압축 없이 원본 그대로 올린다
 * (공문 스캔본 화질 보존 목적).
 */
export async function uploadPresbyteryDocument(
  file: File,
  direction: 'inbound' | 'outbound',
): Promise<{ url: string; fileName: string }> {
  if (!app) {
    throw new Error('Firebase Storage가 설정되지 않았습니다. .env 및 Storage 활성화를 확인해 주세요.')
  }
  if (!auth?.currentUser) {
    throw new Error('관리자로 로그인한 뒤에 파일을 업로드할 수 있습니다.')
  }
  if (!isAllowedPresbyteryDoc(file)) {
    throw new Error('허용 형식: PDF, HWP, Word(doc/docx), Excel(xls/xlsx), 이미지')
  }
  if (file.size > 20 * 1024 * 1024) {
    throw new Error('파일 용량은 20MB 이하여야 합니다.')
  }

  const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
  const storage = getStorage(app)

  const safeName = file.name.replace(/[^\w.\-가-힣]/g, '_')
  const path = `presbytery-docs/${direction}/${Date.now()}_${safeName}`
  const storageRef = ref(storage, path)
  try {
    await uploadBytes(storageRef, file, { contentType: file.type || undefined })
    const url = await getDownloadURL(storageRef)
    return { url, fileName: file.name }
  } catch (err) {
    throw new Error(mapUploadError(err))
  }
}
