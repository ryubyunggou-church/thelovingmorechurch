import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbProps {
  current: string
}

export function Breadcrumb({ current }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center justify-end gap-1.5 text-xs text-paper-muted sm:text-sm">
      <Link to="/" className="hover:text-gold-deep">
        HOME
      </Link>
      <ChevronRight className="h-3 w-3 text-gold" />
      <span className="font-medium text-paper-text">{current}</span>
    </nav>
  )
}
