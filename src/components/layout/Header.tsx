import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, LogOut, Users } from 'lucide-react'
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
  const logout = useAdminStore((s) => s.logout)

  const currentYear = new Date().getFullYear()
  const anniversary = Math.max(0, currentYear - FOUNDED_YEAR)

  return (
    <header className="sticky top-0 z-40 border-b border-stone/70 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6">
        <Link to="/" className="flex min-w-0 items-center">
          <img
            src="/logo-image/Logo-01-ko-투명.png"
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
                  'rounded-md px-2.5 py-2 text-sm font-medium text-ink-muted transition hover:text-terracotta',
                  isActive && 'bg-cream-dark text-terracotta',
                )
              }
            >
              {item.label}
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
                  className="hidden sm:inline-flex"
                  onClick={() => setAdminManageOpen(true)}
                >
                  <Users className="h-4 w-4" />
                  관리자 관리
                </Button>
              ) : null}
              <Button variant="secondary" size="sm" onClick={() => void logout()}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">로그아웃</span>
              </Button>
            </>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="메뉴"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-stone/70 bg-cream lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-3 text-sm font-medium text-ink-muted',
                    isActive && 'bg-cream-dark text-terracotta',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            {isAdminMode && admin?.role === 'super' ? (
              <button
                type="button"
                className="rounded-md px-3 py-3 text-left text-sm font-medium text-ink-muted"
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
                className="rounded-md px-3 py-3 text-left text-sm font-medium text-ink-muted"
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
      ) : null}

      <div className="bg-terracotta px-4 py-1.5 text-center text-sm font-medium text-cream sm:text-sm">
        {isAdminMode ? (
          <span>
            관리자 모드 활성화 · 편집 가능 영역에 연필 아이콘이 표시됩니다
            {admin ? ` (${admin.role === 'super' ? '최고관리자' : '부관리자'})` : ''}
          </span>
        ) : (
          <span>
            교회설립 제 {anniversary}주년 &lsquo;Since {FOUNDED_YEAR} ~ {currentYear}&rsquo;
          </span>
        )}
      </div>
    </header>
  )
}
