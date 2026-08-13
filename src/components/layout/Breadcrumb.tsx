import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbProps {
  current: string
}

export function Breadcrumb({ current }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center justify-end gap-1 text-xs text-ink-muted sm:text-sm">
      <Link to="/" className="hover:text-terracotta">
        HOME
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <span className="font-medium text-ink">{current}</span>
    </nav>
  )
}
