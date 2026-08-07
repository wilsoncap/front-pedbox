export function Pagination({ page, totalPages, total, onChange }) {
  if (!totalPages || totalPages <= 1) {
    return null
  }

  const buttonClass =
    'rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50'

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-gray-600">
        {total > 0 ? `Mostrando ${total} subreddits en total` : ''}
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className={buttonClass}
        >
          Anterior
        </button>
        <span className="text-sm text-gray-700">
          Página {page} de {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className={buttonClass}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
