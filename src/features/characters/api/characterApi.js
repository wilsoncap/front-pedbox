// CAPA DE DATOS — API de personajes (Rick & Morty).
// Define las peticiones HTTP al backend (GET /characters, GET /characters/:id
// y POST /characters/sync). Solo arma la URL y hace la llamada; no tiene lógica.
import { apiClient } from '@/shared/api/client'
import { buildQueryString } from '../models/Filters'

export function getCharactersRequest(filters) {
  const query = buildQueryString(filters)
  return apiClient.get(`/characters${query ? `?${query}` : ''}`)
}

export function getCharacterByIdRequest(id) {
  return apiClient.get(`/characters/${id}`)
}

export function syncCharactersRequest() {
  return apiClient.post('/characters/sync')
}
