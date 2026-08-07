import { registerRequest } from '../api/authApi'
import { mapUserFromApi } from '../mappers/userMapper'

export async function register({ email, password }) {
  const response = await registerRequest({ email, password })
  return { user: mapUserFromApi(response.data?.data) }
}
