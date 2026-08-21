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
        photoUrl: '/photos/placeholder.png',
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
        <div className="mb-10 flex flex-wrap items-end justify-between gap-3 border-b border-paper-line pb-6">
          <div>
            <p className="index-num text-xs font-semibold tracking-[0.14em] text-gold-deep">함께 섬기는 이들</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-paper-text sm:text-3xl">
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
        <p className="text-sm text-paper-muted">등록된 사역자가 없습니다.</p>
      ) : (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
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
      <article className="group relative aspect-[3/4] w-full overflow-hidden rounded-sm">
        <img
          src={member.photoUrl}
          alt={member.name}
          className="absolute inset-0 h-full w-full object-cover grayscale sepia-[.15] contrast-105 brightness-90 transition-[filter] duration-500 ease-out group-hover:grayscale-0 group-hover:sepia-0 group-hover:contrast-100 group-hover:brightness-100"
          loading="lazy"
        />
        {/* 촛불빛이 닿는 순간 — 호버 시 골드 헤어라인 프레임이 번져 나타난다 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-2 scale-[0.97] border border-gold opacity-0 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100"
        />
        <div className="absolute inset-x-0 bottom-0 border-t border-gold/40 bg-ink/85 px-3 py-2 transition-all duration-500 ease-out group-hover:-translate-y-0.5 group-hover:border-gold/90">
          <p className="text-xs font-semibold tracking-wide text-gold">{member.role}</p>
          <h3 className="mt-0.5 font-serif font-medium text-paper">{member.name}</h3>
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
