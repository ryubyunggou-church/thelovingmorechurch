import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils'

export const Tabs = TabsPrimitive.Root

export function TabsList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'flex w-full flex-wrap items-stretch gap-x-6 gap-y-1 border-b border-paper-line',
        className,
      )}
      {...props}
    />
  )
}

export function TabsTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'group relative inline-flex items-center whitespace-nowrap py-3 text-sm font-medium text-paper-muted transition-colors',
        'hover:text-paper-text',
        'data-[state=active]:text-paper-text',
        className,
      )}
      {...props}
    >
      {children}
      {/* 밑줄: 헤더 Topbar 메뉴와 동일한 바운스 애니메이션 — 활성 탭은 골드로 고정, 호버 시 0.5초에
          걸쳐 살짝 튕기며 #fa8a52로 펼쳐진다 */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 -bottom-px h-[2px] origin-center scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          'group-hover:scale-x-100 group-hover:bg-[#fa8a52]',
          'group-data-[state=active]:scale-x-100',
        )}
      />
    </TabsPrimitive.Trigger>
  )
}

export function TabsContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn('mt-8 focus-visible:outline-none', className)} {...props} />
}
