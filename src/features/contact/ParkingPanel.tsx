import { useEffect, useState } from 'react'
import { Car } from 'lucide-react'
import type { ContactInfo } from '../../types/content'
import { EditableBlock } from '../../components/shared/EditableBlock'
import { FormField } from '../../components/ui/form-field'
import { MediaInputField } from '../../components/shared/MediaInputField'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { linesToList, listToLines, saveDocument } from '../../lib/content-service'
import { useAdminStore } from '../../store/admin-store'

interface Props {
  contact: ContactInfo
  onUpdated?: () => void
}

export function ParkingPanel({ contact, onUpdated }: Props) {
  const pushToast = useAdminStore((s) => s.pushToast)
  const photos = contact.parkingPhotos.filter(Boolean)

  return (
    <EditableBlock
      label="주차안내"
      renderEditor={(close) => (
        <ParkingEditor
          contact={contact}
          onError={(m) => pushToast({ title: '저장 실패', description: m, variant: 'error' })}
          onSaved={() => {
            pushToast({ title: '주차안내 저장됨', variant: 'success' })
            onUpdated?.()
            close()
          }}
        />
      )}
    >
      <div className="space-y-6">
        <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-ink">
          <Car className="h-5 w-5 text-terracotta" />
          교회 주차장 이용 시 주차 요령
        </h2>

        {photos.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {photos.slice(0, 2).map((url) => (
              <div
                key={url}
                className="group overflow-hidden rounded-2xl border border-stone shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-12px_rgba(196,107,62,0.4)]"
              >
                <img
                  src={url}
                  alt=""
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : null}

        {contact.parkingNotices.length > 0 ? (
          <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-ink-muted sm:columns-2 sm:gap-8">
            {contact.parkingNotices.map((notice) => (
              <li key={notice} className="break-keep">
                {notice}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-muted">등록된 주차 안내가 없습니다.</p>
        )}
      </div>
    </EditableBlock>
  )
}

function ParkingEditor({
  contact,
  onSaved,
  onError,
}: {
  contact: ContactInfo
  onSaved: () => void
  onError: (m: string) => void
}) {
  const [photo1, setPhoto1] = useState(contact.parkingPhotos[0] ?? '')
  const [photo2, setPhoto2] = useState(contact.parkingPhotos[1] ?? '')
  const [notices, setNotices] = useState(listToLines(contact.parkingNotices))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setPhoto1(contact.parkingPhotos[0] ?? '')
    setPhoto2(contact.parkingPhotos[1] ?? '')
    setNotices(listToLines(contact.parkingNotices))
  }, [contact])

  const save = async () => {
    setSaving(true)
    try {
      await saveDocument('contactInfo', 'main', {
        parkingPhotos: [photo1.trim(), photo2.trim()].filter(Boolean),
        parkingNotices: linesToList(notices),
      })
      onSaved()
    } catch (err) {
      onError(err instanceof Error ? err.message : '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <MediaInputField
        label="주차장 사진 1"
        imageOnly
        folder="contact/parking"
        value={{ mediaUrl: photo1, mediaType: 'image' }}
        defaultUrl={contact.parkingPhotos[0] ?? ''}
        hint="비우면 표시하지 않음"
        onChange={(m) => setPhoto1(m.mediaUrl)}
        onError={onError}
      />
      <MediaInputField
        label="주차장 사진 2"
        imageOnly
        folder="contact/parking"
        value={{ mediaUrl: photo2, mediaType: 'image' }}
        defaultUrl={contact.parkingPhotos[1] ?? ''}
        hint="비우면 표시하지 않음"
        onChange={(m) => setPhoto2(m.mediaUrl)}
        onError={onError}
      />
      <FormField label="주차 요령" htmlFor="parking-notices" hint="한 줄에 한 항목">
        <Textarea
          id="parking-notices"
          className="min-h-[140px]"
          value={notices}
          onChange={(e) => setNotices(e.target.value)}
        />
      </FormField>
      <div className="flex justify-end">
        <Button disabled={saving} onClick={() => void save()}>
          저장 후 게시
        </Button>
      </div>
    </div>
  )
}
