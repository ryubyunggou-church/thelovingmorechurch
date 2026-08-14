import { MapPin } from 'lucide-react'
import type { MissionItem } from '../../types/content'
import { EditableBlock } from '../../components/shared/EditableBlock'
import { Reveal } from '../../components/shared/Reveal'
import { removeDocument, saveDocument } from '../../lib/content-service'
import { missionsByType, type MissionType } from '../../lib/mission-list'
import { useAdminStore } from '../../store/admin-store'
import { MissionEditor } from './MissionEditor'

interface Props {
  items: MissionItem[]
  type: MissionType
  heading: string
  description: string
  onUpdated?: () => void
}

export function MissionListPanel({ items, type, heading, description, onUpdated }: Props) {
  const pushToast = useAdminStore((s) => s.pushToast)
  const list = missionsByType(items, type)

  return (
    <EditableBlock
      label={heading}
      renderEditor={(close) => (
        <MissionEditor
          items={list}
          type={type}
          onError={(m) => pushToast({ title: '저장 실패', description: m, variant: 'error' })}
          onSave={async (next, removedIds) => {
            try {
              await Promise.all(
                next.map((item, index) => {
                  const previous = list.find((i) => i.id === item.id)
                  return saveDocument('missions', item.id, {
                    type,
                    name: item.name.trim() || (type === 'domestic' ? '국내 사역' : '선교지'),
                    description: item.description.trim(),
                    region: (item.region ?? '').trim(),
                    image: (item.image ?? '').trim() || (previous?.image ?? '').trim(),
                    order: index + 1,
                  })
                }),
              )
              await Promise.all(removedIds.map((id) => removeDocument('missions', id)))
              pushToast({ title: `${heading} 저장됨`, variant: 'success' })
              onUpdated?.()
              close()
            } catch (err) {
              pushToast({
                title: '저장 실패',
                description: err instanceof Error ? err.message : '',
                variant: 'error',
              })
            }
          }}
        />
      )}
    >
      <div className="mx-auto max-w-6xl px-1 py-2 sm:px-0 sm:py-4">
        <Reveal>
          <div className="mb-8">
            <p className="text-sm font-semibold text-terracotta">선교사역</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-ink sm:text-3xl">{heading}</h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-muted">{description}</p>
          </div>
        </Reveal>

        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#c4ae8e]/70 bg-white/70 px-6 py-14 text-center">
            <p className="text-sm text-ink-muted">등록된 사역이 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {list.map((m, i) => (
              <Reveal key={m.id} delay={i * 50}>
                <MissionCard item={m} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </EditableBlock>
  )
}

function MissionCard({ item }: { item: MissionItem }) {
  const image = item.image?.trim()
  const region = item.region?.trim()

  return (
    <article className="overflow-hidden rounded-2xl border border-stone bg-[#fffdf9] shadow-[0_8px_24px_-10px_rgba(59,47,42,0.12)]">
      {image ? (
        <img
          src={image}
          alt={item.name}
          className="aspect-[16/10] w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div
          className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-[#f7efe4] to-[#e4d5be] text-terracotta/50"
          aria-hidden
        >
          <MapPin className="h-8 w-8" />
        </div>
      )}
      <div className="p-5">
        {region ? (
          <p className="inline-flex items-center gap-1 text-xs font-semibold text-terracotta">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {region}
          </p>
        ) : null}
        <h3 className="mt-1 font-serif text-lg font-semibold text-ink">{item.name}</h3>
        {item.description.trim() ? (
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-muted">
            {item.description}
          </p>
        ) : null}
      </div>
    </article>
  )
}
