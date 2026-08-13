import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface FormFieldProps {
  label: string
  htmlFor?: string
  /** Shown on the same line as the title (never wraps under the label). */
  hint?: string
  required?: boolean
  className?: string
  children: ReactNode
  /** Optional leading content (e.g. URL icon) before the title — same single line. */
  leading?: ReactNode
}

/** Label + optional leading icon + hint on one line, then the control. */
export function FormField({
  label,
  htmlFor,
  hint,
  required,
  className,
  children,
  leading,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex min-w-0 items-center gap-1.5 overflow-hidden whitespace-nowrap">
        {leading ? <span className="inline-flex shrink-0 items-center">{leading}</span> : null}
        <label
          htmlFor={htmlFor}
          className="shrink-0 text-sm font-medium text-ink"
        >
          {label}
          {required ? <span className="ml-0.5 text-terracotta">*</span> : null}
        </label>
        {hint ? (
          <span
            className="min-w-0 flex-1 truncate text-xs text-ink-muted"
            title={hint}
          >
            <span className="mx-1 text-stone" aria-hidden>
              ·
            </span>
            {hint}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  )
}
