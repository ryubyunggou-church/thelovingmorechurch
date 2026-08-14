import { useEffect, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { Seo } from '../components/shared/Seo'
import { TabbedPage } from '../components/shared/TabbedPage'
import { EditableBlock } from '../components/shared/EditableBlock'
import { FormField } from '../components/ui/form-field'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Button } from '../components/ui/button'
import { RouteListPanel } from '../features/contact/RouteListPanel'
import { ParkingPanel } from '../features/contact/ParkingPanel'
import { getContactInfo, saveDocument } from '../lib/content-service'
import { isMapEmbedUrl, normalizeMapEmbed } from '../lib/map-embed'
import { sanitizeHtml } from '../lib/sanitize'
import type { ContactInfo } from '../types/content'
import { seedContact } from '../data/seed'
import { useAdminStore } from '../store/admin-store'
import { Mail, MapPin, Phone, Printer } from 'lucide-react'

export function ContactPage() {
  const [contact, setContact] = useState<ContactInfo>(seedContact)
  const pushToast = useAdminStore((s) => s.pushToast)

  const reload = async () => {
    setContact(await getContactInfo())
  }

  useEffect(() => {
    void reload()
  }, [])

  return (
    <>
      <Seo title="오시는길" path="/contact" />
      <PageShell
        title="오시는길"
        description="예배 장소와 연락처, 지도 안내입니다."
        current="오시는길"
      >
        <TabbedPage
          tabs={[
            {
              key: 'directions',
              label: '오시는 방법',
              content: (
                <div className="space-y-10 py-2">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div>
                      <h2 className="mb-4 font-serif text-xl font-semibold text-ink">
                        교회 연락처
                      </h2>
                      <EditableBlock
                        label="연락처 정보"
                        renderEditor={(close) => (
                          <ContactEditor
                            contact={contact}
                            onSave={async (next) => {
                              try {
                                await saveDocument('contactInfo', 'main', {
                                  address: next.address,
                                  phone: next.phone,
                                  fax: next.fax,
                                  email: next.email,
                                  naverMapEmbedUrl: next.naverMapEmbedUrl,
                                })
                                pushToast({ title: '연락처 저장됨', variant: 'success' })
                                await reload()
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
                        <div className="space-y-4 rounded-2xl border border-stone bg-white p-6 shadow-sm">
                          <InfoRow icon={MapPin} label="주소" value={contact.address} />
                          <InfoRow icon={Phone} label="전화" value={contact.phone} />
                          <InfoRow icon={Printer} label="팩스" value={contact.fax} />
                          <InfoRow icon={Mail} label="이메일" value={contact.email} />
                        </div>
                      </EditableBlock>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-stone bg-cream-dark">
                      {contact.naverMapEmbedUrl ? (
                        isMapEmbedUrl(contact.naverMapEmbedUrl) ? (
                          <iframe
                            title="찾아오시는 길 지도"
                            src={contact.naverMapEmbedUrl}
                            className="h-[280px] w-full border-0 lg:h-full lg:min-h-[280px]"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        ) : (
                          <div
                            className="flex h-full min-h-[280px] w-full items-center justify-center overflow-hidden p-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg"
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHtml(contact.naverMapEmbedUrl),
                            }}
                          />
                        )
                      ) : (
                        <div className="flex h-[280px] items-center justify-center text-sm text-ink-muted">
                          지도 embed URL을 관리자 모드에서 설정해 주세요.
                        </div>
                      )}
                    </div>
                  </div>

                  <RouteListPanel routes={contact.routes} onUpdated={() => void reload()} />
                </div>
              ),
            },
            {
              key: 'parking',
              label: '주차안내',
              content: (
                <div className="py-2">
                  <ParkingPanel contact={contact} onUpdated={() => void reload()} />
                </div>
              ),
            },
          ]}
        />
      </PageShell>
    </>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-terracotta" />
      <div>
        <p className="text-xs font-semibold tracking-wide text-ink-muted">{label}</p>
        <p className="whitespace-pre-line text-sm text-ink">{value}</p>
      </div>
    </div>
  )
}

const CONTACT_FIELDS = [
  {
    key: 'address' as const,
    label: '주소',
    hint: '예배당 도로명 주소 · 여러 줄 입력 가능',
    placeholder: '경기도 …',
    multiline: true,
  },
  {
    key: 'phone' as const,
    label: '전화',
    hint: '대표 전화번호',
    placeholder: '031-000-0000',
  },
  {
    key: 'fax' as const,
    label: '팩스',
    hint: '없으면 비워 두어도 됩니다',
    placeholder: '031-000-0001',
  },
  {
    key: 'email' as const,
    label: '이메일',
    hint: '문의용 공개 이메일',
    placeholder: 'info@…',
  },
  {
    key: 'naverMapEmbedUrl' as const,
    label: '지도 embed 코드',
    hint: '네이버 지도는 iframe 임베드를 지원하지 않습니다 · 카카오맵 "공유하기"에서 복사한 코드를 통짜로 붙여넣으세요 (iframe/이미지+링크 위젯 모두 지원)',
    placeholder: '카카오맵 공유 코드 또는 https://map.kakao.com/…',
    multiline: true,
  },
]

function ContactEditor({
  contact,
  onSave,
}: {
  contact: ContactInfo
  onSave: (c: Pick<ContactInfo, 'address' | 'phone' | 'fax' | 'email' | 'naverMapEmbedUrl'>) => Promise<void>
}) {
  const [form, setForm] = useState(contact)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(contact)
  }, [contact])

  return (
    <div className="space-y-4">
      {CONTACT_FIELDS.map((f) =>
        f.multiline ? (
          <FormField key={f.key} label={f.label} htmlFor={`contact-${f.key}`} hint={f.hint}>
            <Textarea
              id={`contact-${f.key}`}
              className="min-h-[80px]"
              value={form[f.key]}
              placeholder={f.placeholder}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            />
          </FormField>
        ) : (
          <FormField key={f.key} label={f.label} htmlFor={`contact-${f.key}`} hint={f.hint}>
            <Input
              id={`contact-${f.key}`}
              value={form[f.key]}
              placeholder={f.placeholder}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            />
          </FormField>
        ),
      )}
      <div className="flex justify-end">
        <Button
          disabled={saving}
          onClick={() => {
            setSaving(true)
            void onSave({
              // 비운 필드는 기존 값 유지 (미디어와 동일 정책)
              address: form.address.trim() || contact.address,
              phone: form.phone.trim() || contact.phone,
              fax: form.fax.trim() || contact.fax,
              email: form.email.trim() || contact.email,
              naverMapEmbedUrl:
                normalizeMapEmbed(form.naverMapEmbedUrl) || contact.naverMapEmbedUrl,
            }).finally(() => setSaving(false))
          }}
        >
          저장 후 게시
        </Button>
      </div>
    </div>
  )
}
