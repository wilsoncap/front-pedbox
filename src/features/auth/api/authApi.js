import { apiClient } from '@/shared/api/client'

export function registerRequest({ email, password }) {
  return apiClient.post('/auth/register', { email, password })
}
