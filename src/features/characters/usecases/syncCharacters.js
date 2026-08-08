// CASO DE USO (capa de dominio).
// Sincroniza personajes desde la API de Rick & Morty (POST /characters/sync).
// Cada llamada inserta un lote nuevo (10 por defecto) hasta agotar los 826.
// Devuelve { inserted, updated }. La UI lo invoca con el hook useSyncCharacters.
import { syncCharactersRequest } from '../api/characterApi'

export async function syncCharacters() {
  const response = await syncCharactersRequest()
  return response.data?.data ?? null
}
