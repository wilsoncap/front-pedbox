import { useMutation } from '@tanstack/react-query'
import { register } from '../usecases/register'

export function useRegister() {
  return useMutation({
    mutationFn: register,
  })
}
