import { loginRequest } from '../api/authApi'
import { mapUserFromApi } from '../mappers/userMapper'

export async function login({ email, password }) {
  const response = await loginRequest({ email, password })
  const data = response.data?.data

  return {
    token: data?.accessToken,
    user: mapUserFromApi(data?.user),
  }
}
