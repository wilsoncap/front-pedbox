// HOOK (capa de presentación).
// Envuelve useQuery de TanStack Query para la lista de subreddits.
// Recibe los filtros y devuelve { data, isLoading, isError, error }.
// Cada combinación de filtros es su propia caché (queryKey ['subreddits', filters]):
// al cambiar un filtro, la petición se vuelve a disparar sola.
import { useQuery } from '@tanstack/react-query'
import { getSubreddits } from '../usecases/getSubreddits'

export function useSubreddits(filters) {
  return useQuery({
    queryKey: ['subreddits', filters],
    queryFn: () => getSubreddits(filters),
  })
}
