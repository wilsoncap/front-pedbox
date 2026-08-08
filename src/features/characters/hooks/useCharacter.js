// HOOK (capa de presentación).
// Envuelve useQuery para el detalle de un personaje por id.
// Devuelve { data, isLoading, isError, error }. Solo hace la petición si hay id.
import { useQuery } from '@tanstack/react-query'
import { getCharacterById } from '../usecases/getCharacterById'

export function useCharacter(id) {
  return useQuery({
    queryKey: ['character', id],
    queryFn: () => getCharacterById(id),
    enabled: Boolean(id),
  })
}
