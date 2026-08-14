import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 화면 표시용 전화번호("(02)453-7171" 등)를 tel: 링크용으로 정규화 — 숫자와 선행 +만 남긴다. */
export function toTelHref(phone: string): string {
  const digits = phone.trim().replace(/[^\d+]/g, '')
  return `tel:${digits}`
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
