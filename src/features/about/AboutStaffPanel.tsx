import { useEffect, useState } from 'react'
import type { StaffMember } from '../../types/content'
import { EditableBlock } from '../../components/shared/EditableBlock'
import { FormField } from '../../components/ui/form-field'
import { MediaInputField } from '../../components/shared/MediaInputField'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { removeDocument, saveDocument } from '../../lib/content-service'
import { useAdminStore } from '../../store/admin-store'
import { Reveal } from '../../components/shared/Reveal'
import { Plus } from 'lucide-react'

interface Props {
  members: StaffMember[]
  onUpdated?: () => void
}

export function AboutStaffPanel({ members, onUpdated }: Props) {
  const isAdminMode = useAdminStore((s) => s.isAdminMode)
  const pushToast = useAdminStore((s) => s.pushToast)
  const sorted = [...members].sort((a, b) => a.order - b.order)

  const addMember = async () => {
    try {
      const id = `staff_${Date.now()}`
      const maxOrder = sorted.reduce((m, s) => Math.max(m, s.order), 0)
      await saveDocument('staffMembers', id, {
        name: '새 사역자',
        role: '직분',
        photoUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        order: maxOrder + 1,
      })
      pushToast({ title: '사역자가 추가되었습니다', variant: 'success' })
      onUpdated?.()
    } catch (err) {
      pushToast({
        title: '추가 실패',
        description: err instanceof Error ? err.message : '',
        variant: 'error',
      })
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Reveal>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-terracotta">함께 섬기는 이들</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-ink sm:text-3xl">
              사역자소개
            </h2>
          </div>
          {isAdminMode ? (
            <Button type="button" size="sm" onClick={() => void addMember()}>
              <Plus className="h-4 w-4" />
              사역자 추가
            </Button>
          ) : null}
        </div>
      </Reveal>

      {sorted.length === 0 ? (
        <p className="text-sm text-ink-muted">등록된 사역자가 없습니다.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((m, i) => (
            <Reveal key={m.id} delay={i * 50}>
              <StaffCard member={m} onUpdated={onUpdated} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}

function StaffCard({
  member,
  onUpdated,
}: {
  member: StaffMember
  onUpdated?: () => void
}) {
  const pushToast = useAdminStore((s) => s.pushToast)

  return (
    <EditableBlock
      label={`${member.name} 사역자`}
      renderEditor={(close) => (
        <StaffEditor
          member={member}
          onSaved={() => {
            pushToast({ title: '저장됨', variant: 'success' })
            onUpdated?.()
            close()
          }}
          onDeleted={() => {
            pushToast({ title: '삭제됨', variant: 'success' })
            onUpdated?.()
            close()
          }}
          onError={(m) => pushToast({ title: '실패', description: m, variant: 'error' })}
        />
      )}
    >
      <article className="overflow-hidden rounded-2xl border border-stone bg-cream shadow-sm transition hover:shadow-md">
        <img
          src={member.photoUrl}
          alt={member.name}
          className="aspect-[3/4] w-full object-cover"
          loading="lazy"
        />
        <div className="p-4">
          <p className="text-xs font-semibold text-terracotta">{member.role}</p>
          <h3 className="mt-1 font-medium text-ink">{member.name}</h3>
        </div>
      </article>
    </EditableBlock>
  )
}

function StaffEditor({
  member,
  onSaved,
  onDeleted,
  onError,
}: {
  member: StaffMember
  onSaved: () => void
  onDeleted: () => void
  onError: (m: string) => void
}) {
  const [form, setForm] = useState(member)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(member)
  }, [member])

  const save = async () => {
    setSaving(true)
    try {
      await saveDocument('staffMembers', member.id, {
        name: form.name.trim() || member.name,
        role: form.role.trim() || member.role,
        photoUrl: form.photoUrl.trim() || member.photoUrl,
        order: Number(form.order) || 0,
      })
      onSaved()
    } catch (err) {
      onError(err instanceof Error ? err.message : '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!window.confirm(`${member.name} 사역자 정보를 삭제할까요?`)) return
    setSaving(true)
    try {
      await removeDocument('staffMembers', member.id)
      onDeleted()
    } catch (err) {
      onError(err instanceof Error ? err.message : '삭제 실패')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <MediaInputField
        label="프로필 사진"
        imageOnly
        folder="about/staff"
        value={{ mediaUrl: form.photoUrl, mediaType: 'image' }}
        defaultUrl={member.photoUrl}
        hint="프로필 썸네일 · 3:4 세로 표시 · 비우면 현재 사진 유지"
        onChange={(m) => setForm({ ...form, photoUrl: m.mediaUrl })}
        onError={onError}
      />
      <FormField label="직분" htmlFor={`role-${member.id}`} required>
        <Input
          id={`role-${member.id}`}
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />
      </FormField>
      <FormField label="이름" htmlFor={`name-${member.id}`} required>
        <Input
          id={`name-${member.id}`}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </FormField>
      <FormField label="표시 순서" htmlFor={`order-${member.id}`} hint="숫자가 작을수록 앞">
        <Input
          id={`order-${member.id}`}
          type="number"
          value={form.order}
          onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
        />
      </FormField>
      <div className="flex flex-wrap justify-between gap-2">
        <Button type="button" variant="outline" disabled={saving} onClick={() => void remove()}>
          삭제
        </Button>
        <Button disabled={saving} onClick={() => void save()}>
          저장 후 게시
        </Button>
      </div>
    </div>
  )
}
