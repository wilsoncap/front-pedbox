import { createUser } from '../models/User'

export function mapUserFromApi(data) {
  if (!data) return null

  return createUser({
    id: data.id,
    email: data.email,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  })
}
