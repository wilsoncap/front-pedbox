// CAPA DE DATOS — API de subreddits.
// Define las peticiones HTTP al backend (GET /subreddits y GET /subreddits/:id).
// Solo arma la URL y hace la llamada; no tiene lógica de negocio.
import { apiClient } from '@/shared/api/client'
import { buildQueryString } from '../models/Filters'

export function getSubredditsRequest(filters) {
  const query = buildQueryString(filters)
  return apiClient.get(`/subreddits${query ? `?${query}` : ''}`)
}

export function getSubredditByIdRequest(id) {
  return apiClient.get(`/subreddits/${id}`)
}
