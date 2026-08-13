import { SITE_NAME } from '../../types/content'
import { useAdminStore } from '../../store/admin-store'

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
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <img
            src="/logo-image/Logo-01-ko-투명.png"
            alt={SITE_NAME}
            className="mb-5 h-12 w-auto opacity-90 sm:h-14"
          />

          <address className="not-italic max-w-2xl space-y-1.5 text-sm leading-relaxed text-ink-muted">
            <p className="text-ink">
              <span className="tabular-nums">{FOOTER_CONTACT.postal}</span>{' '}
              {FOOTER_CONTACT.addressKo}
            </p>
            <p className="text-xs sm:text-sm">{FOOTER_CONTACT.addressEn}</p>
            <p className="pt-1">
              <span className="font-medium text-ink">Tel</span> : {FOOTER_CONTACT.tel}
              <span className="mx-2 text-stone" aria-hidden>
                |
              </span>
              <span className="font-medium text-ink">Fax</span> : {FOOTER_CONTACT.fax}
            </p>
          </address>
        </div>

        <div className="site-footer__rule mx-auto mt-10 max-w-3xl pt-6">
          <p className="text-center text-xs leading-relaxed text-ink-muted sm:text-[13px]">
            © {FOUNDED_YEAR}-{currentYear} {SITE_NAME}. All rights reserved.
            <span className="mx-1.5 text-[#c4ae8e]" aria-hidden>
              |
            </span>
            Email :{' '}
            <a
              href={`mailto:${FOOTER_CONTACT.email}`}
              className="text-ink underline-offset-2 transition hover:text-terracotta hover:underline"
            >
              {FOOTER_CONTACT.email}
            </a>
            {!isAdminMode ? (
              <>
                <span className="mx-1.5 text-[#c4ae8e]" aria-hidden>
                  |
                </span>
                <button
                  type="button"
                  onClick={() => setLoginOpen(true)}
                  aria-label="관리자 로그인"
                  className="text-ink-muted underline-offset-2 transition hover:text-terracotta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40"
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
