import DOMPurify from 'dompurify'

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'u',
  's',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'a',
  'img',
  'blockquote',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'span',
  'div',
]

const ALLOWED_ATTR = [
  'href',
  'src',
  'alt',
  'title',
  'target',
  'rel',
  'class',
  'style',
  'colspan',
  'rowspan',
]

/** Client-side HTML sanitize (mirrors Cloud Functions server sanitize). */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  })
}
