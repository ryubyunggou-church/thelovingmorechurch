import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, LogOut, Users, Megaphone } from 'lucide-react'
import { NAV_ITEMS, SITE_NAME } from '../../types/content'
import { useAdminStore } from '../../store/admin-store'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

const FOUNDED_YEAR = 2005

export function Header() {
  const [open, setOpen] = useState(false)
  const isAdminMode = useAdminStore((s) => s.isAdminMode)
  const admin = useAdminStore((s) => s.admin)
  const setAdminManageOpen = useAdminStore((s) => s.setAdminManageOpen)
  const setPopupManageOpen = useAdminStore((s) => s.setPopupManageOpen)
  const logout = useAdminStore((s) => s.logout)

  const currentYear = new Date().getFullYear()
  const anniversary = Math.max(0, currentYear - FOUNDED_YEAR)

  return (
    <header className="sticky top-0 z-40 bg-ink">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.75rem] sm:px-6">
        <Link to="/" className="flex min-w-0 items-center">
          <img
            src="/logo-image/logo-full-color.png"
            alt={SITE_NAME}
            className="h-10 w-auto sm:h-12"
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
                  'group relative px-3 py-2 text-[13px] font-medium tracking-[0.06em] text-ink-muted transition-colors hover:text-paper',
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
            className="text-paper hover:bg-ink-soft lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="메뉴"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <>
          {/* 배경 스크림: 바깥을 탭하면 메뉴 닫힘 */}
          <div
            aria-hidden
            className="fixed inset-0 z-30 bg-ink/50 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              'absolute right-4 top-[calc(100%+0.5rem)] z-50 w-[min(62vw,280px)]',
              'origin-top-right overflow-hidden rounded-lg border border-ink-line bg-ink-soft shadow-2xl',
              'motion-safe:animate-[mobile-menu-in_180ms_cubic-bezier(0.16,1,0.3,1)_both] lg:hidden',
            )}
          >
            <nav className="flex flex-col py-2">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setOpen(false)}
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
                    setOpen(false)
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
                    setOpen(false)
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
                    setOpen(false)
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

      <div className="border-t border-ink-line bg-ink-soft px-4 py-1.5 text-center text-xs tracking-wide text-ink-muted sm:text-[13px]">
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
