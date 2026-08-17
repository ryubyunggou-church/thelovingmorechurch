import { SITE_NAME } from '../../types/content'
import { useAdminStore } from '../../store/admin-store'
import { toTelHref } from '../../lib/utils'

/** 푸터 고정 연락처 (공식 소재지) */
const FOOTER_CONTACT = {
  postal: '02621',
  addressKo: '서울특별시 동대문구 전농로 20 (답십리동) 스타클래스 지상1층, 지하1층',
  addressEn: '1st Floor & B1, STAR CLASS, 20 Jeonnong-ro, Dongdaemun-gu, Seoul',
  tel: '(02)453-7171',
  fax: '(02)453-7361',
  email: 'ryubyunggou@gmail.com',
} as const

const FOUNDED_YEAR = 2005

export function Footer() {
  const currentYear = new Date().getFullYear()
  const isAdminMode = useAdminStore((s) => s.isAdminMode)
  const setLoginOpen = useAdminStore((s) => s.setLoginOpen)

  return (
    <footer className="site-footer mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-14">
          <img
            src="/logo-image/logo-full-color.png"
            alt={SITE_NAME}
            className="h-12 w-auto sm:h-14"
          />

          <address className="not-italic max-w-xl space-y-1.5 text-sm leading-relaxed text-ink-muted">
            <p className="text-paper">
              <span className="index-num">{FOOTER_CONTACT.postal}</span>{' '}
              {FOOTER_CONTACT.addressKo}
            </p>
            <p className="text-xs sm:text-sm">{FOOTER_CONTACT.addressEn}</p>
            <p className="pt-1">
              <span className="font-medium text-paper">Tel</span> :{' '}
              <a
                href={toTelHref(FOOTER_CONTACT.tel)}
                className="underline-offset-2 transition hover:text-gold hover:underline"
              >
                {FOOTER_CONTACT.tel}
              </a>
              <span className="mx-2 text-ink-line" aria-hidden>
                |
              </span>
              <span className="font-medium text-paper">Fax</span> : {FOOTER_CONTACT.fax}
            </p>
          </address>
        </div>

        <div className="site-footer__rule mt-12 pt-6">
          <p className="text-right text-xs leading-relaxed text-ink-muted sm:text-[13px]">
            © {FOUNDED_YEAR}-{currentYear} {SITE_NAME}. All rights reserved.
            <span className="mx-1.5 text-ink-line" aria-hidden>
              |
            </span>
            Email :{' '}
            <a
              href={`mailto:${FOOTER_CONTACT.email}`}
              className="text-paper underline-offset-2 transition hover:text-gold hover:underline"
            >
              {FOOTER_CONTACT.email}
            </a>
            {!isAdminMode ? (
              <>
                <span className="mx-1.5 text-ink-line" aria-hidden>
                  |
                </span>
                <button
                  type="button"
                  onClick={() => setLoginOpen(true)}
                  aria-label="관리자 로그인"
                  className="text-ink-muted underline-offset-2 transition hover:text-gold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
                >
                  Admin
                </button>
              </>
            ) : null}
          </p>
        </div>
      </div>
    </footer>
  )
}
