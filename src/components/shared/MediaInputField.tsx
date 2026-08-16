import { useId, useRef, useState } from 'react'
import { Input } from '../ui/input'
import { FormField } from '../ui/form-field'
import { cn } from '../../lib/utils'
import { uploadMediaFile } from '../../lib/storage-upload'
import { detectMediaType, resolveMediaKind, type MediaKind } from '../../lib/media'

export type MediaInputValue = {
  mediaUrl: string
  mediaType: MediaKind
}

interface MediaInputFieldProps {
  label?: string
  value: MediaInputValue
  /** 입력이 비어 있을 때 표시·유지용 기존 경로 (게시 시 부모에서 기본값으로 사용) */
  defaultUrl?: string
  onChange: (next: MediaInputValue) => void
  onError?: (message: string) => void
  folder?: string
  accept?: string
  hint?: string
  required?: boolean
  className?: string
  /** 이미지 전용 (인사말·썸네일 등) */
  imageOnly?: boolean
  /** PDF 전용 (팝업 등). mediaType은 의미 없는 값('image')으로 고정해 넘긴다 — 호출측에서 무시. */
  pdfOnly?: boolean
}

type Mode = 'url' | 'file'

/**
 * Dual media input: local file picker (explorer) + URL paste.
 * Header is a single line: [URL icon] title* · hint
 */
export function MediaInputField({
  label = '미디어 (이미지 / 영상)',
  value,
  defaultUrl = '',
  onChange,
  onError,
  folder = 'hero',
  accept,
  hint,
  required,
  className,
  imageOnly = false,
  pdfOnly = false,
}: MediaInputFieldProps) {
  const resolvedAccept =
    accept ??
    (pdfOnly
      ? 'application/pdf'
      : imageOnly
        ? 'image/*'
        : 'image/*,video/mp4,video/webm,.mp4,.webm')
  const resolvedHint =
    hint ??
    (pdfOnly
      ? '폴더=로컬 PDF 업로드 · URL=PDF 경로 직접 입력 · 비우면 현재 파일 유지 · 최대 15MB'
      : imageOnly
        ? '폴더=로컬 이미지 업로드 · URL=이미지 경로 직접 입력 · 비우면 현재 이미지 유지 · 최대 15MB'
        : '이미지·mp4/webm(파일/URL) 또는 유튜브 URL. 파일 업로드 최대 15MB. 비우면 현재 경로 유지.')

  const inputId = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<Mode>('url')
  const [uploading, setUploading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const effectiveUrl = value.mediaUrl.trim() || defaultUrl

  const pickFile = () => {
    setMode('file')
    fileRef.current?.click()
  }

  const switchToUrl = () => {
    setMode('url')
    setFileName(null)
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (imageOnly && !file.type.startsWith('image/')) {
      onError?.('이미지 파일만 업로드할 수 있습니다.')
      return
    }
    if (pdfOnly && file.type !== 'application/pdf') {
      onError?.('PDF 파일만 업로드할 수 있습니다.')
      return
    }

    setMode('file')
    setFileName(file.name)
    setUploading(true)
    try {
      const url = await uploadMediaFile(file, folder)
      onChange({
        mediaUrl: url,
        mediaType:
          imageOnly || pdfOnly ? 'image' : resolveMediaKind(url, detectMediaType(file.name)),
      })
    } catch (err) {
      setFileName(null)
      onError?.(err instanceof Error ? err.message : '업로드에 실패했습니다.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <FormField
      label={label}
      htmlFor={inputId}
      hint={resolvedHint}
      required={required}
      className={className}
      leading={
        <button
          type="button"
          title="URL 직접 입력"
          aria-label="URL 직접 입력"
          disabled={uploading}
          onClick={switchToUrl}
          className={cn(
            'inline-flex h-6 w-6 items-center justify-center rounded transition',
            mode === 'url' ? 'opacity-100 ring-1 ring-terracotta/40' : 'opacity-70 hover:opacity-100',
            'disabled:cursor-not-allowed disabled:opacity-40',
          )}
        >
          <img src="/icons/URL.png" alt="" className="h-5 w-5 object-contain" />
        </button>
      }
    >
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          title="로컬 파일 선택"
          aria-label="로컬 파일 선택"
          disabled={uploading}
          onClick={pickFile}
          className={cn(
            'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border transition',
            mode === 'file'
              ? 'border-terracotta bg-cream-dark ring-1 ring-terracotta/30'
              : 'border-stone bg-cream hover:bg-cream-dark',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          <img src="/icons/explorer.png" alt="" className="h-7 w-7 object-contain" />
        </button>

        <div className="min-w-0 flex-1">
          {mode === 'url' ? (
            <Input
              id={inputId}
              type="url"
              value={value.mediaUrl}
              disabled={uploading}
              placeholder={
                defaultUrl
                  ? `비우면 현재 경로 유지 · ${defaultUrl}`
                  : 'https://… 또는 Storage 다운로드 URL'
              }
              onChange={(e) => {
                const mediaUrl = e.target.value
                onChange({
                  mediaUrl,
                  mediaType:
                    imageOnly || pdfOnly ? 'image' : detectMediaType(mediaUrl || defaultUrl),
                })
              }}
            />
          ) : (
            <div
              className={cn(
                'flex h-10 items-center rounded-md border border-stone bg-cream px-3 text-sm',
                uploading ? 'text-ink-muted' : 'text-ink',
              )}
            >
              {uploading
                ? '업로드 중…'
                : fileName
                  ? `선택됨: ${fileName}`
                  : '폴더 아이콘을 눌러 파일을 선택하세요'}
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        className="sr-only"
        accept={resolvedAccept}
        onChange={(e) => void onFileChange(e)}
      />

      {effectiveUrl && !uploading ? (
        <p className="mt-1 truncate text-[11px] text-ink-muted" title={effectiveUrl}>
          {value.mediaUrl.trim() ? '현재 경로: ' : '유지될 기본 경로: '}
          {effectiveUrl}
        </p>
      ) : null}
    </FormField>
  )
}
