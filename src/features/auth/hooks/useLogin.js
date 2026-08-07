import { useMutation } from '@tanstack/react-query'
import { login } from '../usecases/login'

export function useLogin() {
  return useMutation({
    mutationFn: login,
  })
}
