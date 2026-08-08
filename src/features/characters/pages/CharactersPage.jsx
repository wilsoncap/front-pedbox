// PÁGINA (capa de presentación) — ruta /characters.
// Orquesta todo el feature de lista: mantiene los filtros en estado local,
// consume useCharacters (React Query), renderiza FiltersBar + lista de
// tarjetas + paginación + estados de carga/error/vacío, y permite
// sincronizar personajes desde la API con un botón (POST /characters/sync).
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { DEFAULT_FILTERS } from '../models/Filters'
import { useCharacters } from '../hooks/useCharacters'
import { useSyncCharacters } from '../hooks/useSyncCharacters'
import { FiltersBar } from '../components/FiltersBar'
import { CharacterList } from '../components/CharacterList'
import { Pagination } from '@/shared/components/Pagination'
import { Loading } from '@/shared/components/Loading'
import { getErrorMessage } from '@/shared/lib/errors'

export default function CharactersPage() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS })
  const { data, isLoading, isError, error } = useCharacters(filters)
  const syncMutation = useSyncCharacters()

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters)
  }

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handleSync = () => {
    syncMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['characters'] })
      },
    })
  }

  const syncResult = syncMutation.data
  const syncMessage = syncResult
    ? syncResult.inserted > 0 || syncResult.updated > 0
      ? `Sincronizados: ${syncResult.inserted} nuevos, ${syncResult.updated} actualizados`
      : 'Sin novedades: todos los personajes ya están sincronizados.'
    : null

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rick & Morty</h1>
          <p className="mt-1 text-gray-600">Lista de personajes</p>
        </div>

        <button
          type="button"
          onClick={handleSync}
          disabled={syncMutation.isPending}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {syncMutation.isPending ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Sincronizando...
            </>
          ) : (
            'Sincronizar personajes'
          )}
        </button>
      </div>

      {syncMessage && (
        <div className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          {syncMessage}
        </div>
      )}

      {syncMutation.isError && (
        <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {getErrorMessage(syncMutation.error, 'No se pudo sincronizar')}
        </div>
      )}

      <FiltersBar filters={filters} onChange={handleFiltersChange} />

      {isLoading && <Loading label="Cargando personajes..." />}

      {isError && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {getErrorMessage(error, 'No se pudo cargar la lista de personajes')}
        </div>
      )}

      {!isLoading && !isError && data?.items.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-gray-600">
            No se encontraron personajes con los filtros actuales.
          </p>
        </div>
      )}

      {!isLoading && !isError && data?.items.length > 0 && (
        <>
          <CharacterList items={data.items} />
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
