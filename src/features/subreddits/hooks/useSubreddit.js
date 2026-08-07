import { useQuery } from '@tanstack/react-query'
import { getSubredditById } from '../usecases/getSubredditById'

export function useSubreddit(id) {
  return useQuery({
    queryKey: ['subreddit', id],
    queryFn: () => getSubredditById(id),
    enabled: Boolean(id),
  })
}
