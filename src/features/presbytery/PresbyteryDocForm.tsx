import { useState } from 'react'
import { FormField } from '../../components/ui/form-field'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { cn } from '../../lib/utils'
import { saveDocument } from '../../lib/content-service'
import { uploadPresbyteryDocument } from '../../lib/storage-upload'
import { useAdminStore } from '../../store/admin-store'
import type { PresbyteryDocDirection } from '../../types/content'

const ACCEPT =
  '.pdf,.hwp,.hwpx,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/*'

interface Props {
  onSaved: () => void
  onError: (message: string) => void
}

export function PresbyteryDocForm({ onSaved, onError }: Props) {
  const user = useAdminStore((s) => s.user)
  const admin = useAdminStore((s) => s.admin)
  const [direction, setDirection] = useState<PresbyteryDocDirection>('inbound')
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    if (!title.trim()) {
      onError('제목을 입력해 주세요.')
      return
    }
    if (!file) {
      onError('첨부할 파일을 선택해 주세요.')
      return
    }
    setSaving(true)
    try {
      const { url, fileName } = await uploadPresbyteryDocument(file, direction)
      const id = `pdoc_${Date.now()}`
      await saveDocument('presbyteryDocuments', id, {
        title: title.trim(),
        direction,
        fileType: file.type === 'application/pdf' ? 'pdf' : 'other',
        fileUrl: url,
        fileName,
        uploadedBy: user?.email ?? admin?.email ?? 'admin',
        uploadedAt: new Date().toISOString(),
        isRead: false,
        note: note.trim(),
      })
      onSaved()
    } catch (err) {
      onError(err instanceof Error ? err.message : '등록 실패')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <FormField label="구분" required>
        <div className="flex gap-2">
          {(
            [
              { value: 'inbound' as const, label: '수신 (노회 → 교회)' },
              { value: 'outbound' as const, label: '발신 (교회 → 노회)' },
            ]
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDirection(opt.value)}
              className={cn(
                'flex-1 rounded-sm border px-3 py-2 text-sm font-medium transition-colors',
                direction === opt.value
                  ? 'border-gold-deep bg-gold/15 text-paper-text'
                  : 'border-paper-line text-paper-muted hover:bg-paper-dim',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FormField>

      <FormField label="제목" htmlFor="pdoc-title" required>
        <Input
          id="pdoc-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 2026년 3월 정기 공문"
        />
      </FormField>

      <FormField
        label="첨부파일"
        htmlFor="pdoc-file"
        required
        hint="PDF만 인앱 뷰 가능 · 그 외(HWP/Word/Excel/이미지)는 다운로드만 · 최대 20MB"
      >
        <input
          id="pdoc-file"
          type="file"
          accept={ACCEPT}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-paper-text file:mr-3 file:rounded-sm file:border-0 file:bg-ink file:px-3 file:py-2 file:text-xs file:font-medium file:text-paper hover:file:bg-ink-soft"
        />
      </FormField>

      <FormField label="비고" htmlFor="pdoc-note" hint="선택">
        <Textarea id="pdoc-note" value={note} onChange={(e) => setNote(e.target.value)} />
      </FormField>

      <div className="flex justify-end">
        <Button disabled={saving} onClick={() => void submit()}>
          등록
        </Button>
      </div>
    </div>
  )
}
