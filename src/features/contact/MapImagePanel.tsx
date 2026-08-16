import { useEffect, useState } from 'react'
import type { ContactInfo } from '../../types/content'
import { EditableBlock } from '../../components/shared/EditableBlock'
import { FormField } from '../../components/ui/form-field'
import { MediaInputField } from '../../components/shared/MediaInputField'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { saveDocument } from '../../lib/content-service'
import { useAdminStore } from '../../store/admin-store'

interface Props {
  contact: ContactInfo
  onUpdated?: () => void
}

/**
 * 지도 캡처 이미지 업로드 (MVP). 카카오맵 등 API 지도 임베드는 무료 쿼터 제한으로
 * 이후 단계에서 붙이고, 지금은 관리자가 지도 스크린샷을 올려 보여준다.
 */
export function MapImagePanel({ contact, onUpdated }: Props) {
  const pushToast = useAdminStore((s) => s.pushToast)
  const image = contact.mapImageUrl.trim()
  const link = contact.mapLinkUrl?.trim()

  const body = image ? (
    <img
      src={image}
      alt="찾아오시는 길 지도"
      className="h-full w-full object-cover"
      loading="lazy"
    />
  ) : (
    <div className="flex h-[280px] items-center justify-center text-sm text-paper-muted">
      지도 이미지를 관리자 모드에서 업로드해 주세요.
    </div>
  )

  return (
    <EditableBlock
      label="지도 이미지"
      className="h-full"
      renderEditor={(close) => (
        <MapImageEditor
          contact={contact}
          onError={(m) => pushToast({ title: '저장 실패', description: m, variant: 'error' })}
          onSaved={() => {
            pushToast({ title: '지도 이미지 저장됨', variant: 'success' })
            onUpdated?.()
            close()
          }}
        />
      )}
    >
      <div className="h-full min-h-[280px] overflow-hidden border border-paper-line bg-paper-dim">
        {link && image ? (
          <a href={link} target="_blank" rel="noreferrer" className="block h-full">
            {body}
          </a>
        ) : (
          body
        )}
      </div>
    </EditableBlock>
  )
}

function MapImageEditor({
  contact,
  onSaved,
  onError,
}: {
  contact: ContactInfo
  onSaved: () => void
  onError: (m: string) => void
}) {
  const [mapImageUrl, setMapImageUrl] = useState(contact.mapImageUrl)
  const [mapLinkUrl, setMapLinkUrl] = useState(contact.mapLinkUrl ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setMapImageUrl(contact.mapImageUrl)
    setMapLinkUrl(contact.mapLinkUrl ?? '')
  }, [contact])

  const save = async () => {
    setSaving(true)
    try {
      await saveDocument('contactInfo', 'main', {
        mapImageUrl: mapImageUrl.trim() || contact.mapImageUrl,
        mapLinkUrl: mapLinkUrl.trim(),
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
        label="지도 이미지"
        imageOnly
        folder="contact/map"
        required
        value={{ mediaUrl: mapImageUrl, mediaType: 'image' }}
        defaultUrl={contact.mapImageUrl}
        hint="지도 캡처/스크린샷 · 가로 사진 권장 · 비우면 현재 이미지 유지"
        onChange={(m) => setMapImageUrl(m.mediaUrl)}
        onError={onError}
      />
      <FormField
        label="지도 링크"
        htmlFor="map-link-url"
        hint="이미지 클릭 시 이동할 지도 주소 · 선택"
      >
        <Input
          id="map-link-url"
          value={mapLinkUrl}
          placeholder="https://map.kakao.com/…"
          onChange={(e) => setMapLinkUrl(e.target.value)}
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
