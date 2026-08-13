interface ListItem {
  id: string
  title: string
  meta?: string
  note?: string
}

interface ListPageProps {
  items: ListItem[]
  emptyText?: string
}

export function ListPage({ items, emptyText = '등록된 항목이 없습니다.' }: ListPageProps) {
  if (!items.length) {
    return <p className="text-sm text-ink-muted">{emptyText}</p>
  }

  return (
    <ul className="divide-y divide-stone overflow-hidden rounded-xl border border-stone bg-cream">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-medium text-ink">{item.title}</p>
            {item.note ? <p className="text-sm text-ink-muted">{item.note}</p> : null}
          </div>
          {item.meta ? (
            <p className="shrink-0 text-sm font-semibold text-terracotta">{item.meta}</p>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
