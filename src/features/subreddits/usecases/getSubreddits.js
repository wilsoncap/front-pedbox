// CASO DE USO (capa de dominio).
// Obtiene la lista de subreddits con filtros. Orquesta: llama a la API
// (getSubredditsRequest) y traduce la respuesta con el mapper. La UI lo invoca
// a través del hook useSubreddits.
import { getSubredditsRequest } from '../api/subredditApi'
import { mapSubredditListFromApi } from '../mappers/subredditMapper'

export async function getSubreddits(filters) {
  const response = await getSubredditsRequest(filters)
  return mapSubredditListFromApi(response.data)
}
