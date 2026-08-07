// CASO DE USO (capa de dominio).
// Obtiene el detalle de un subreddit por su id. Orquesta: llama a la API
// (getSubredditByIdRequest) y traduce la respuesta con el mapper.
// La UI lo invoca a través del hook useSubreddit.
import { getSubredditByIdRequest } from '../api/subredditApi'
import { mapSubredditFromApi } from '../mappers/subredditMapper'

export async function getSubredditById(id) {
  const response = await getSubredditByIdRequest(id)
  return mapSubredditFromApi(response.data?.data)
}
