import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { FormField } from '../../components/ui/form-field'
import { MediaInputField } from '../../components/shared/MediaInputField'
import { pickNewsPlaceholderImage } from '../../lib/news-thumbnail'
import type { NewsPost } from '../../types/content'

export interface NewsEditorPayload {
  title: string
  contentHtml: string
  thumbnail: string
}

interface NewsEditorFormProps {
  /** 있으면 수정 모드(필드 프리필) · 없으면 새 글 작성 모드 */
  post?: NewsPost
  submitLabel?: string
  onSubmit: (payload: NewsEditorPayload) => Promise<void>
  onError: (m: string) => void
}

/** 새 글 작성/수정 공용 폼. 저장은 곧 게시 — 별도 임시저장 상태를 두지 않는다. */
export function NewsEditorForm({ post, submitLabel, onSubmit, onError }: NewsEditorFormProps) {
  const [title, setTitle] = useState(post?.title ?? '')
  const [contentHtml, setContentHtml] = useState(post?.contentHtml ?? '<p></p>')
  const [thumbnail, setThumbnail] = useState(() => post?.thumbnail ?? pickNewsPlaceholderImage())
  const [saving, setSaving] = useState(false)

  return (
    <div className="space-y-4">
      <FormField label="제목" htmlFor="news-title" required hint="목록·상세에 표시되는 글 제목">
        <Input
          id="news-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          required
        />
      </FormField>

      <MediaInputField
        label="썸네일 이미지"
        imageOnly
        folder="news"
        value={{ mediaUrl: thumbnail, mediaType: 'image' }}
        defaultUrl={post?.thumbnail ?? ''}
        hint={
          post
            ? '비우면 현재 썸네일을 유지합니다.'
            : '목록 카드에 쓰입니다. 기본 이미지가 자동 배정되며, 비우면 빈 썸네일로 표시됩니다.'
        }
        onChange={(m) => setThumbnail(m.mediaUrl)}
        onError={onError}
      />

      <FormField
        label="본문 (HTML)"
        htmlFor="news-body"
        required
        hint="p, h1~h6, strong 등. 저장 시 서버/클라이언트 sanitize 적용"
      >
        <Textarea
          id="news-body"
          className="min-h-[180px] font-mono text-xs"
          value={contentHtml}
          onChange={(e) => setContentHtml(e.target.value)}
          placeholder="<p>본문…</p>"
        />
      </FormField>

      <div className="flex justify-end">
        <Button
          disabled={saving || !title.trim()}
          onClick={() => {
            setSaving(true)
            void onSubmit({ title: title.trim(), contentHtml, thumbnail }).finally(() =>
              setSaving(false),
            )
          }}
        >
          {submitLabel ?? '게시'}
        </Button>
      </div>
    </div>
  )
}
