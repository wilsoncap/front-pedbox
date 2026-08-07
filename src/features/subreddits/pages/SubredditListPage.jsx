// PÁGINA (capa de presentación) — ruta /subreddits.
// Orquesta todo el feature de lista: mantiene los filtros en estado local,
// consume useSubreddits (React Query) y renderiza FiltersBar + tabla +
// paginación + estados de carga/error/vacío.
import { useState } from 'react'
import { DEFAULT_FILTERS } from '../models/Filters'
import { useSubreddits } from '../hooks/useSubreddits'
import { FiltersBar } from '../components/FiltersBar'
import { SubredditTable } from '../components/SubredditTable'
import { Pagination } from '../components/Pagination'
import { Loading } from '@/shared/components/Loading'
import { getErrorMessage } from '@/shared/lib/errors'

export default function SubredditListPage() {
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS })
  const { data, isLoading, isError, error } = useSubreddits(filters)

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters)
  }

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reddit</h1>
        <p className="mt-1 text-gray-600">Lista de subreddits</p>
      </div>

      <FiltersBar filters={filters} onChange={handleFiltersChange} />

      {isLoading && <Loading label="Cargando subreddits..." />}

      {isError && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {getErrorMessage(error, 'No se pudo cargar la lista de subreddits')}
        </div>
      )}

      {!isLoading && !isError && data?.items.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-gray-600">No se encontraron subreddits con los filtros actuales.</p>
        </div>
      )}

      {!isLoading && !isError && data?.items.length > 0 && (
        <>
          <SubredditTable items={data.items} />
          <Pagination
            page={filters.page}
            totalPages={data.meta?.totalPages}
            total={data.meta?.total}
            onChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}
