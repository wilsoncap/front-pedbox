// HOOK (capa de presentación).
// Envuelve useQuery de TanStack Query para la lista de personajes.
// Recibe los filtros y devuelve { data, isLoading, isError, error }.
// Cada combinación de filtros es su propia caché (queryKey ['characters', filters]):
// al cambiar un filtro, la petición se vuelve a disparar sola.
import { useQuery } from '@tanstack/react-query'
import { getCharacters } from '../usecases/getCharacters'

export function useCharacters(filters) {
  return useQuery({
    queryKey: ['characters', filters],
    queryFn: () => getCharacters(filters),
  })
}
