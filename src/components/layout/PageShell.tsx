import type { ReactNode } from 'react'
import { Breadcrumb } from './Breadcrumb'

interface PageShellProps {
  title: string
  description?: string
  current: string
  children: ReactNode
  hideHeader?: boolean
}

export function PageShell({ title, description, current, children, hideHeader }: PageShellProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {!hideHeader ? (
        <div className="mb-10 flex flex-col gap-4 border-b border-stone pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-2 max-w-2xl text-sm text-ink-muted sm:text-base">{description}</p>
            ) : null}
          </div>
          <Breadcrumb current={current} />
        </div>
      ) : null}
      {children}
    </div>
  )
}
