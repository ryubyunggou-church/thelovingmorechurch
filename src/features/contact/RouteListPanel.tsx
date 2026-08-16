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
              <h3 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold text-paper-text">
                <RouteIcon iconType={iconType} className="h-5 w-5 text-gold-deep" />
                {GROUP_TITLES[iconType]}
              </h3>
              <ul className="divide-y divide-paper-line border-y border-paper-line">
                {group.map((route) => (
                  <li key={route.id} className="flex items-start gap-3 py-4">
                    <RouteIcon iconType={iconType} className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
                    <div className="min-w-0">
                      <p className="font-medium text-paper-text">{route.title}</p>
                      <p className="mt-0.5 whitespace-pre-line text-sm text-paper-muted">
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
          <p className="text-sm text-paper-muted">등록된 경로 안내가 없습니다.</p>
        ) : null}
      </div>
    </EditableBlock>
  )
}
