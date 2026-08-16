import { useAdminStore } from '../../store/admin-store'
import { cn } from '../../lib/utils'

export function ToastViewport() {
  const toasts = useAdminStore((s) => s.toasts)
  const dismissToast = useAdminStore((s) => s.dismissToast)

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(92vw,22rem)] flex-col gap-2">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismissToast(t.id)}
          className={cn(
            'pointer-events-auto rounded-sm border px-4 py-3 text-left shadow-xl transition',
            t.variant === 'success' && 'border-emerald-800/40 bg-ink text-emerald-300',
            t.variant === 'error' && 'border-wine/60 bg-ink text-[#e3a3ab]',
            (!t.variant || t.variant === 'default') && 'border-ink-line bg-ink text-paper',
          )}
        >
          <div className="text-sm font-semibold">{t.title}</div>
          {t.description ? <div className="mt-0.5 text-xs opacity-80">{t.description}</div> : null}
        </button>
      ))}
    </div>
  )
}
