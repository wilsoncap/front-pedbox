import { useLoadingStore, selectIsLoading } from '@/shared/store/loadingStore'

export function GlobalLoader() {
  const isLoading = useLoadingStore(selectIsLoading)

  if (!isLoading) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex cursor-wait items-center justify-center bg-white/60 backdrop-blur-sm"
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="size-10 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600" />
        <p className="text-sm font-medium text-gray-600">Cargando...</p>
      </div>
    </div>
  )
}
