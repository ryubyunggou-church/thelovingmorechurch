import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(value: Date | string | number | { seconds: number } | null | undefined) {
  if (!value) return ''
  let date: Date
  if (typeof value === 'object' && 'seconds' in value) {
    date = new Date(value.seconds * 1000)
  } else {
    date = new Date(value)
  }
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
