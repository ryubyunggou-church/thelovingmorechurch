import { useCallback, useEffect, useMemo, useState } from 'react'
import { Clock, MapPin, CalendarDays } from 'lucide-react'
import type { WorshipScheduleItem } from '../../types/content'
import { formatWorshipSummary, isScheduleNote } from '../../lib/worship-summary'
import { cn } from '../../lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip'

interface WorshipScheduleListProps {
  items: WorshipScheduleItem[]
  emptyText?: string
}

export function WorshipScheduleList({
  items,
  emptyText = '등록된 예배가 없습니다.',
}: WorshipScheduleListProps) {
  const sorted = useMemo(
    () => [...items].sort((a, b) => a.order - b.order),
    [items],
  )
  const [expandedId, setExpandedId] = useState<string | null>(null)
  /** 호버 없는 터치 환경 — 탭 시 자연어 안내 펼침 */
  const [touchUi, setTouchUi] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(hover: none)')
    const apply = () => setTouchUi(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const onRowActivate = useCallback(
    (id: string) => {
      if (!touchUi) return
      setExpandedId((cur) => (cur === id ? null : id))
    },
    [touchUi],
  )

  if (!sorted.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#c4ae8e]/70 bg-white/70 px-6 py-14 text-center">
        <p className="text-sm text-ink-muted">{emptyText}</p>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={280} skipDelayDuration={120}>
      <section
        className={cn(
          'relative overflow-hidden rounded-2xl',
          'border border-[#c4ae8e]/55',
          // 페이지 cream(#faf6f0)과 분리: 따뜻한 화이트 패널 + 소프트 섀도
          'bg-[#fffdf9]',
          'shadow-[0_1px_0_rgba(59,47,42,0.04),0_10px_28px_-8px_rgba(59,47,42,0.10)]',
        )}
        aria-label="예배 시간표"
      >
        {/* 상단 악센트 라인 */}
        <div
          className="h-[3px] w-full bg-gradient-to-r from-terracotta via-[#d4a07a] to-transparent"
          aria-hidden
        />

        {/* 패널 헤더 */}
        <header className="flex items-end justify-between gap-3 border-b border-stone/80 bg-gradient-to-b from-[#f7efe4]/80 to-transparent px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-terracotta uppercase">
              Worship Schedule
            </p>
            <h2 className="mt-0.5 font-serif text-lg font-semibold tracking-tight text-ink sm:text-xl">
              예배 시간표
            </h2>
          </div>
          <p className="shrink-0 pb-0.5 text-xs tabular-nums text-ink-muted">
            총 <span className="font-semibold text-ink">{sorted.length}</span>개
          </p>
        </header>

        <ul className="divide-y divide-stone/70">
          {sorted.map((item, index) => {
            const summary = formatWorshipSummary(item)
            const scheduleNote = item.note ? isScheduleNote(item.note) : false
            const isExpanded = expandedId === item.id
            const isFeatured = index === 0
            const indexLabel = String(index + 1).padStart(2, '0')

            return (
              <li key={item.id} className="relative">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => onRowActivate(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onRowActivate(item.id)
                        }
                      }}
                      aria-label={summary}
                      aria-expanded={touchUi ? isExpanded : undefined}
                      className={cn(
                        'group relative flex cursor-default flex-col gap-2.5 px-5 py-4 outline-none transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-5',
                        // 파스텔 호버/포커스
                        'hover:bg-[rgba(196,107,62,0.06)]',
                        'focus-visible:bg-[rgba(196,107,62,0.08)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-terracotta/35',
                        isExpanded && 'bg-[rgba(196,107,62,0.07)]',
                        isFeatured && 'bg-[#fbf6ef]/80',
                      )}
                    >
                      {/* 좌측 악센트 바 */}
                      <span
                        aria-hidden
                        className={cn(
                          'absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full bg-transparent transition-all duration-200',
                          'group-hover:bg-terracotta group-focus-visible:bg-terracotta',
                          isExpanded && 'bg-terracotta',
                          isFeatured && 'bg-terracotta/35 group-hover:bg-terracotta',
                        )}
                      />

                      <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                        <span
                          className={cn(
                            'mt-0.5 shrink-0 font-serif text-sm tabular-nums tracking-wider text-stone sm:mt-0',
                            'transition-colors group-hover:text-terracotta/70 group-focus-visible:text-terracotta/70',
                          )}
                          aria-hidden
                        >
                          {indexLabel}
                        </span>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-serif text-base font-semibold tracking-tight text-ink sm:text-[1.05rem]">
                              {item.name}
                            </p>
                            {isFeatured ? (
                              <span className="rounded-full border border-terracotta/25 bg-terracotta/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-terracotta">
                                대표
                              </span>
                            ) : null}
                          </div>

                          {item.note ? (
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
                              {scheduleNote ? (
                                <CalendarDays
                                  className="h-3.5 w-3.5 shrink-0 text-terracotta/70"
                                  aria-hidden
                                />
                              ) : (
                                <MapPin
                                  className="h-3.5 w-3.5 shrink-0 text-terracotta/70"
                                  aria-hidden
                                />
                              )}
                              <span>{item.note}</span>
                            </p>
                          ) : null}
                        </div>
                      </div>

                      {item.time ? (
                        <div className="flex shrink-0 items-center sm:pl-2">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full border border-terracotta/20',
                              'bg-gradient-to-b from-[#fff8f3] to-[#f5e6d8] px-3 py-1.5',
                              'text-sm font-semibold tabular-nums text-terracotta-dark',
                              'shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]',
                              'transition-shadow duration-200',
                              'group-hover:border-terracotta/35 group-hover:shadow-sm',
                            )}
                          >
                            <Clock className="h-3.5 w-3.5 opacity-80" aria-hidden />
                            {item.time}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center" className="font-medium">
                    <span className="block text-[10px] font-semibold tracking-wider text-cream/60 uppercase">
                      안내
                    </span>
                    <span className="mt-0.5 block">{summary}</span>
                  </TooltipContent>
                </Tooltip>

                {/* 터치 기기: 탭 시 자연어 한 줄 펼침 */}
                <div
                  className={cn(
                    'grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none',
                    isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                  )}
                  aria-hidden={!isExpanded}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-stone/60 bg-[rgba(196,107,62,0.05)] px-5 py-2.5 pl-[3.25rem] text-sm leading-relaxed text-ink-muted sm:px-6 sm:pl-[4.25rem]">
                      {summary}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <footer className="border-t border-stone/70 bg-[#f7efe4]/40 px-5 py-3 sm:px-6">
          <p className="text-[11px] leading-relaxed text-ink-muted sm:text-xs">
            행에 마우스를 올리거나 포커스하면 안내 문구가 표시됩니다. 모바일에서는 행을 탭해
            주세요.
          </p>
        </footer>
      </section>
    </TooltipProvider>
  )
}
