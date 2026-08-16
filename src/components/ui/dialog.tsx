import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

export function DialogContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/70 data-[state=open]:animate-in" />
      <DialogPrimitive.Content
        className={cn(
          // 화면 밖으로 넘치지 않도록 높이 제한 + 세로 스크롤
          'fixed left-1/2 top-1/2 z-50 flex w-[min(92vw,32rem)] max-h-[min(90dvh,90vh)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-sm border border-paper-line bg-paper shadow-2xl',
          className,
        )}
        {...props}
      >
        <div aria-hidden className="h-[3px] w-full shrink-0 bg-gold" />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6 pr-12">
          {children}
        </div>
        <DialogPrimitive.Close className="absolute right-4 top-6 z-10 rounded-sm bg-paper/90 p-1 text-paper-text opacity-70 transition hover:opacity-100">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4 flex flex-col gap-1.5', className)} {...props} />
}

export function DialogTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('font-serif text-xl font-semibold text-paper-text', className)}
      {...props}
    />
  )
}

export function DialogDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('text-sm text-paper-muted', className)}
      {...props}
    />
  )
}
