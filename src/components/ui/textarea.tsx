import * as React from 'react'
import { cn } from '../../lib/utils'

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        'flex min-h-[100px] w-full rounded-sm border border-paper-line bg-paper px-3 py-2 text-sm text-paper-text placeholder:text-paper-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'
