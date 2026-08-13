import * as React from 'react'
import { cn } from '../../lib/utils'

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        'flex min-h-[100px] w-full rounded-md border border-stone bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'
