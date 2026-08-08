// MAPPER (capa de dominio).
// Traduce la respuesta del backend (JSON) al modelo Character que usa la UI.
// - mapCharacterFromApi: convierte UN personaje de la API → entidad Character.
// - mapCharacterListFromApi: convierte la lista paginada → { items, meta }.
// Si el backend cambia de formato, solo se ajusta este archivo; la UI no se entera.
import { createCharacter } from '../models/Character'

export function mapCharacterFromApi(data) {
  if (!data) return null

  return createCharacter({
    id: data.id,
    name: data.name,
    status: data.status,
    species: data.species,
    type: data.type,
    gender: data.gender,
    originName: data.originName,
    locationName: data.locationName,
    image: data.image,
    url: data.url,
    created: data.created,
    fetchedAt: data.fetchedAt,
  })
}

export function mapCharacterListFromApi(responseData) {
  const items = Array.isArray(responseData?.data)
    ? responseData.data.map(mapCharacterFromApi).filter(Boolean)
    : []

  return {
    items,
    meta: responseData?.meta ?? null,
  }
}
