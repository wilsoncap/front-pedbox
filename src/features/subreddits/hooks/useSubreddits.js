import { useQuery } from '@tanstack/react-query'
import { getSubreddits } from '../usecases/getSubreddits'

export function useSubreddits(filters) {
  return useQuery({
    queryKey: ['subreddits', filters],
    queryFn: () => getSubreddits(filters),
  })
}
