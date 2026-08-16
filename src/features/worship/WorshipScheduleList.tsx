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
      <div className="border border-dashed border-paper-line px-6 py-14 text-center">
        <p className="text-sm text-paper-muted">{emptyText}</p>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={280} skipDelayDuration={120}>
      <section className="relative border border-paper-line bg-paper" aria-label="예배 시간표">
        {/* 상단 악센트 라인 */}
        <div className="h-[3px] w-full bg-gold" aria-hidden />

        {/* 패널 헤더 */}
        <header className="flex items-end justify-between gap-3 border-b border-paper-line px-5 py-5 sm:px-7">
          <div>
            <p className="index-num text-[11px] font-semibold tracking-[0.16em] text-gold-deep uppercase">
              Worship Schedule
            </p>
            <h2 className="mt-1 font-serif text-lg font-semibold tracking-tight text-paper-text sm:text-xl">
              예배 시간표
            </h2>
          </div>
          <p className="index-num shrink-0 pb-0.5 text-xs text-paper-muted">
            총 <span className="font-semibold text-paper-text">{sorted.length}</span>개
          </p>
        </header>

        <ul className="divide-y divide-paper-line">
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
                        'group relative flex cursor-default flex-col gap-2.5 px-5 py-4 outline-none transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-7 sm:py-5',
                        'hover:bg-paper-dim/60',
                        'focus-visible:bg-paper-dim/80 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/35',
                        isExpanded && 'bg-paper-dim/70',
                      )}
                    >
                      {/* 좌측 악센트 바 */}
                      <span
                        aria-hidden
                        className={cn(
                          'absolute bottom-3 left-0 top-3 w-[3px] bg-transparent transition-all duration-200',
                          'group-hover:bg-gold group-focus-visible:bg-gold',
                          isExpanded && 'bg-gold',
                          isFeatured && 'bg-gold/40 group-hover:bg-gold',
                        )}
                      />

                      <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                        <span
                          className={cn(
                            'index-num mt-0.5 shrink-0 font-serif text-sm text-paper-line sm:mt-0',
                            'transition-colors group-hover:text-gold-deep group-focus-visible:text-gold-deep',
                          )}
                          aria-hidden
                        >
                          {indexLabel}
                        </span>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-serif text-base font-semibold tracking-tight text-paper-text sm:text-[1.05rem]">
                              {item.name}
                            </p>
                            {isFeatured ? (
                              <span className="text-[10px] font-semibold tracking-wide text-gold-deep">
                                · 대표
                              </span>
                            ) : null}
                          </div>

                          {item.note ? (
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-paper-muted">
                              {scheduleNote ? (
                                <CalendarDays
                                  className="h-3.5 w-3.5 shrink-0 text-gold-deep/70"
                                  aria-hidden
                                />
                              ) : (
                                <MapPin
                                  className="h-3.5 w-3.5 shrink-0 text-gold-deep/70"
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
                          <span className="index-num inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep">
                            <Clock className="h-3.5 w-3.5 opacity-80" aria-hidden />
                            {item.time}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center" className="font-medium">
                    <span className="block text-[10px] font-semibold tracking-wider text-paper/60 uppercase">
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
                    <p className="border-t border-paper-line bg-paper-dim/40 px-5 py-2.5 pl-[3.25rem] text-sm leading-relaxed text-paper-muted sm:px-7 sm:pl-[4.5rem]">
                      {summary}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </TooltipProvider>
  )
}
