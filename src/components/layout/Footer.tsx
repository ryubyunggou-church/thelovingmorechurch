import { Link } from 'react-router-dom'
import { NAV_ITEMS, PARTNER_LINKS, SITE_NAME } from '../../types/content'
import { partners } from '../../features/home/quick-links-data'
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

/** 푸터 바로가기 — 헤더 대메뉴와 동일 (HOME 포함) */
const FOOTER_LINKS = NAV_ITEMS

export function Footer() {
  const currentYear = new Date().getFullYear()
  const isAdminMode = useAdminStore((s) => s.isAdminMode)
  const setLoginOpen = useAdminStore((s) => s.setLoginOpen)

  return (
    <footer className="site-footer mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.75fr)_auto] lg:items-start lg:gap-12">
          {/* 연락처 */}
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

          {/* 바로가기 — 빨간 점선 자리(마크업 없이 링크만) */}
          <nav aria-label="바로가기" className="min-w-0">
            <p className="index-num text-xs font-semibold tracking-[0.14em] text-gold">바로가기</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-1">
              {FOOTER_LINKS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="inline-flex min-h-9 cursor-pointer items-center text-sm text-ink-muted transition-colors duration-200 hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 협력기관 — 홈과 동일 3곳 */}
          <div className="min-w-0 lg:justify-self-end">
            <p className="index-num text-xs font-semibold tracking-[0.14em] text-gold">협력기관</p>
            <ul className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4">
              {partners.map((p, i) => (
                <li key={p.href}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    title={PARTNER_LINKS[i]?.label ?? p.label}
                    className="inline-flex h-12 cursor-pointer items-center rounded-2xl border border-paper-line/30 bg-paper px-3 py-2 transition-[transform,border-color] duration-200 hover:scale-105 hover:border-gold/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
                  >
                    <img
                      src={p.logo}
                      alt={p.label}
                      className="h-8 w-auto max-w-[4.75rem] object-contain sm:h-9 sm:max-w-[5.5rem]"
                      loading="lazy"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
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
