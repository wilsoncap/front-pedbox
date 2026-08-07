export function Loading({ label = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-gray-500">
      <div className="size-8 animate-spin rounded-full border-2 border-gray-300 border-t-purple-600" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
