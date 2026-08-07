// HOOK (capa de presentación).
// Envuelve useQuery para el detalle de un subreddit por id.
// Devuelve { data, isLoading, isError, error }. Solo hace la petición si hay id.
import { useQuery } from '@tanstack/react-query'
import { getSubredditById } from '../usecases/getSubredditById'

export function useSubreddit(id) {
  return useQuery({
    queryKey: ['subreddit', id],
    queryFn: () => getSubredditById(id),
    enabled: Boolean(id),
  })
}
