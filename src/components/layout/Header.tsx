import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, Users, Megaphone } from 'lucide-react'
import { NAV_ITEMS, SITE_NAME } from '../../types/content'
import { useAdminStore } from '../../store/admin-store'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

const FOUNDED_YEAR = 2005
/** 닫힘 애니메이션(mobile-menu-rollup) 길이와 반드시 맞춰야 한다 — index.css 참고 */
const MENU_CLOSE_ANIMATION_MS = 200
/** 이 지점을 넘어 스크롤하면 홈 히어로 위 투명 헤더가 원래 검정 헤더로 전환된다 */
const HOME_TRANSPARENT_SCROLL_THRESHOLD = 40

export function Header() {
  const [open, setOpen] = useState(false)
  /** true인 동안은 '말려 올라가는' 종료 애니메이션 재생 중 — 애니메이션이 끝나야 실제로 언마운트한다 */
  const [closing, setClosing] = useState(false)
  const closeTimerRef = useRef<number | null>(null)
  const headerRef = useRef<HTMLElement | null>(null)

  const isHome = useLocation().pathname === '/'
  /** 홈 진입 직후(스크롤 전)에만 투명 오버레이 상태 — 다른 페이지는 항상 원래 검정 헤더 */
  const [scrolled, setScrolled] = useState(!isHome)
  const isTransparent = isHome && !scrolled

  useEffect(() => {
    if (!isHome) {
      setScrolled(true)
      return
    }
    const onScroll = () => setScrolled(window.scrollY > HOME_TRANSPARENT_SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  /**
   * 헤더 실제 높이를 --header-h로 퍼블리시한다. HomePage의 Hero가 이 값만큼
   * 음수 top-margin을 적용해 투명 헤더 뒤로 파고들어야 하기 때문 — 헤더 높이가
   * 브레이크포인트마다 달라서 하드코딩 대신 ResizeObserver로 실측한다.
   */
  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el) return
    const publish = () => {
      document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`)
    }
    publish()
    const observer = new ResizeObserver(publish)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const closeMenu = useCallback(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setOpen(false)
      return
    }
    setClosing(true)
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, MENU_CLOSE_ANIMATION_MS)
  }, [])

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)
    }
  }, [])

  const isAdminMode = useAdminStore((s) => s.isAdminMode)
  const admin = useAdminStore((s) => s.admin)
  const setAdminManageOpen = useAdminStore((s) => s.setAdminManageOpen)
  const setPopupManageOpen = useAdminStore((s) => s.setPopupManageOpen)
  const logout = useAdminStore((s) => s.logout)

  const currentYear = new Date().getFullYear()
  const anniversary = Math.max(0, currentYear - FOUNDED_YEAR)

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 z-40 transition-colors duration-300',
        isTransparent ? 'bg-transparent' : 'bg-ink',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.75rem] sm:px-6">
        <Link to="/" className="flex min-w-0 items-center">
          <img
            src="/logo-image/logo-full-color.png"
            alt={SITE_NAME}
            className={cn(
              'h-10 w-auto transition-[filter] duration-300 sm:h-12',
              isTransparent && 'drop-shadow-[0_1px_6px_rgba(0,0,0,0.55)]',
            )}
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'group relative px-3 py-2 text-[13px] font-medium tracking-[0.06em] transition-colors',
                  isTransparent
                    ? 'text-paper/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] hover:text-paper'
                    : 'text-ink-muted hover:text-paper',
                  isActive && 'text-paper',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {/* 밑줄: 평소엔 접힌 채 대기하다가 호버 시 0.5초에 걸쳐 살짝 튕기며 펼쳐진다 */}
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
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* 일반 접속: 로그인 버튼 없음 — Footer Admin 링크 사용 */}
          {isAdminMode ? (
            <>
              {admin?.role === 'super' ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden border-ink-line text-paper hover:bg-ink-soft sm:inline-flex"
                  onClick={() => setAdminManageOpen(true)}
                >
                  <Users className="h-4 w-4" />
                  관리자 관리
                </Button>
              ) : null}
              <Button
                variant="outline"
                size="sm"
                className="hidden border-ink-line text-paper hover:bg-ink-soft sm:inline-flex"
                onClick={() => setPopupManageOpen(true)}
              >
                <Megaphone className="h-4 w-4" />
                팝업 관리
              </Button>
              <Button variant="default" size="sm" onClick={() => void logout()}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">로그아웃</span>
              </Button>
            </>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'relative z-50 text-paper hover:bg-ink-soft lg:hidden',
              isTransparent && 'drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]',
            )}
            onClick={() => (open ? closeMenu() : setOpen(true))}
            aria-label="메뉴"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open || closing ? (
        <>
          {/* 배경 스크림: 바깥을 탭하면 메뉴 닫힘 */}
          <div
            aria-hidden
            className={cn(
              'fixed inset-0 z-30 bg-ink/50 transition-opacity duration-200 lg:hidden',
              closing && 'opacity-0',
            )}
            onClick={closeMenu}
          />
          <div
            className={cn(
              'absolute right-4 top-[calc(100%+0.5rem)] z-50 w-[min(62vw,280px)]',
              'origin-top overflow-hidden rounded-lg border border-ink-line bg-ink-soft shadow-2xl lg:hidden',
              closing
                ? 'motion-safe:animate-[mobile-menu-rollup_200ms_cubic-bezier(0.4,0,1,1)_both]'
                : 'motion-safe:animate-[mobile-menu-unfurl_240ms_cubic-bezier(0.16,1,0.3,1)_both]',
            )}
          >
            <nav className="flex flex-col py-2">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center px-5 py-3 text-sm font-medium text-ink-muted transition-colors hover:bg-ink hover:text-paper',
                      isActive && 'bg-ink text-gold',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        aria-hidden
                        className={cn(
                          'absolute inset-y-2 left-0 w-[3px] origin-center scale-y-0 rounded-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-y-100 group-hover:bg-[#fa8a52]',
                          isActive && 'scale-y-100',
                        )}
                      />
                      {item.label}
                    </>
                  )}
                </NavLink>
              ))}
              {isAdminMode && admin?.role === 'super' ? (
                <button
                  type="button"
                  className="border-t border-ink-line px-5 py-3 text-left text-sm font-medium text-ink-muted transition-colors hover:bg-ink hover:text-paper"
                  onClick={() => {
                    closeMenu()
                    setAdminManageOpen(true)
                  }}
                >
                  관리자 관리
                </button>
              ) : null}
              {isAdminMode ? (
                <button
                  type="button"
                  className="px-5 py-3 text-left text-sm font-medium text-ink-muted transition-colors hover:bg-ink hover:text-paper"
                  onClick={() => {
                    closeMenu()
                    setPopupManageOpen(true)
                  }}
                >
                  팝업 관리
                </button>
              ) : null}
              {isAdminMode ? (
                <button
                  type="button"
                  className="px-5 py-3 text-left text-sm font-medium text-ink-muted transition-colors hover:bg-ink hover:text-paper"
                  onClick={() => {
                    closeMenu()
                    void logout()
                  }}
                >
                  로그아웃
                </button>
              ) : null}
            </nav>
          </div>
        </>
      ) : null}

      <div
        className={cn(
          'border-t px-4 py-1.5 text-center text-xs tracking-wide transition-colors duration-300 sm:text-[13px]',
          isTransparent
            ? 'border-paper/15 bg-transparent text-paper/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]'
            : 'border-ink-line bg-ink-soft text-ink-muted',
        )}
      >
        {isAdminMode ? (
          <span>
            관리자 모드 활성화 · 편집 가능 영역에 연필 아이콘이 표시됩니다
            {admin ? ` (${admin.role === 'super' ? '최고관리자' : '부관리자'})` : ''}
          </span>
        ) : (
          <span>
            교회설립 제 <span className="text-gold">{anniversary}</span>주년
            <span className="mx-2 text-ink-line" aria-hidden>·</span>
            Since {FOUNDED_YEAR} – {currentYear}
          </span>
        )}
      </div>
    </header>
  )
}
