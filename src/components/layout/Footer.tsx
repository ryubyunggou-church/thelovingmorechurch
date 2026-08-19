import { NavLink } from 'react-router-dom'
import { SITE_NAME } from '../../types/content'
import { useAdminStore } from '../../store/admin-store'
import { cn, toTelHref } from '../../lib/utils'

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

/**
 * 푸터 바로가기 5개 — 첨부 레이아웃 기준(2열)
 * 좌: 예배안내 / 교육부서 / 선교사역
 * 우: 오시는길 / 교회소식
 */
const FOOTER_LINKS = [
  { label: '예배안내', path: '/worship' },
  { label: '교육부서', path: '/education' },
  { label: '선교사역', path: '/missions' },
  { label: '오시는길', path: '/contact' },
  { label: '교회소식', path: '/news' },
] as const

export function Footer() {
  const currentYear = new Date().getFullYear()
  const isAdminMode = useAdminStore((s) => s.isAdminMode)
  const setLoginOpen = useAdminStore((s) => s.setLoginOpen)

  return (
    <footer className="site-footer mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        {/* 2열: 연락처 | 바로가기 (첨부샷과 동일) */}
        <div className="grid gap-10 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-14 lg:gap-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
            <img
              src="/logo-image/logo-full-color.png"
              alt={SITE_NAME}
              className="h-12 w-auto shrink-0 sm:h-14"
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
                  className="underline-offset-2 transition-colors duration-200 hover:text-gold hover:underline"
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

          <nav aria-label="바로가기" className="min-w-0 sm:pt-1">
            <ul className="grid grid-flow-col grid-cols-2 grid-rows-3 gap-x-10 gap-y-1">
              {FOOTER_LINKS.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        'group relative inline-flex min-h-9 cursor-pointer items-center px-0.5 py-1.5 text-sm font-medium tracking-[0.04em] text-ink-muted transition-colors hover:text-paper',
                        isActive && 'text-paper',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {/* Topbar와 동일: 호버 시 scale-x 언더바 (금→민트) */}
                        <span
                          aria-hidden
                          className={cn(
                            'pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-center scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-x-100 group-hover:bg-[#84f5a2]',
                            isActive && 'scale-x-100',
                          )}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
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
              className="text-paper underline-offset-2 transition-colors duration-200 hover:text-gold hover:underline"
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
                  className="text-ink-muted underline-offset-2 transition-colors duration-200 hover:text-gold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
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
