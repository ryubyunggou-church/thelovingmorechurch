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
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'relative -mb-px inline-flex items-center whitespace-nowrap border-b-2 border-transparent py-3 text-sm font-medium text-paper-muted transition-colors',
        'hover:text-paper-text',
        'data-[state=active]:border-gold data-[state=active]:text-paper-text',
        className,
      )}
      {...props}
    />
  )
}

export function TabsContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn('mt-8 focus-visible:outline-none', className)} {...props} />
}
