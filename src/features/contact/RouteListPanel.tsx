import type { ContactRoute } from '../../types/content'
import { EditableBlock } from '../../components/shared/EditableBlock'
import { saveDocument } from '../../lib/content-service'
import { ROUTE_ICON_TYPES, routesByIconType } from '../../lib/contact-route'
import { useAdminStore } from '../../store/admin-store'
import { RouteIcon } from './RouteIcon'
import { RouteEditor } from './RouteEditor'

const GROUP_TITLES: Record<string, string> = {
  subway: '지하철로 오실 때',
  bus: '버스로 오실 때',
  walk: '도보로 오실 때',
}

interface Props {
  routes: ContactRoute[]
  onUpdated?: () => void
}

export function RouteListPanel({ routes, onUpdated }: Props) {
  const pushToast = useAdminStore((s) => s.pushToast)

  return (
    <EditableBlock
      label="오시는 방법 경로 안내"
      renderEditor={(close) => (
        <RouteEditor
          routes={routes}
          onSave={async (next) => {
            try {
              await saveDocument('contactInfo', 'main', { routes: next })
              pushToast({ title: '경로 안내 저장됨', variant: 'success' })
              onUpdated?.()
              close()
            } catch (err) {
              pushToast({
                title: '저장 실패',
                description: err instanceof Error ? err.message : '',
                variant: 'error',
              })
            }
          }}
        />
      )}
    >
      <div className="space-y-8">
        {ROUTE_ICON_TYPES.map((iconType) => {
          const group = routesByIconType(routes, iconType)
          if (group.length === 0) return null
          return (
            <div key={iconType}>
              <h3 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold text-ink">
                <RouteIcon iconType={iconType} className="h-5 w-5 text-terracotta" />
                {GROUP_TITLES[iconType]}
              </h3>
              <ul className="space-y-3">
                {group.map((route) => (
                  <li
                    key={route.id}
                    className="flex items-start gap-3 rounded-xl border border-stone bg-white p-4 shadow-sm"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
                      <RouteIcon iconType={iconType} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-ink">{route.title}</p>
                      <p className="mt-0.5 whitespace-pre-line text-sm text-ink-muted">
                        {route.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
        {routes.length === 0 ? (
          <p className="text-sm text-ink-muted">등록된 경로 안내가 없습니다.</p>
        ) : null}
      </div>
    </EditableBlock>
  )
}
