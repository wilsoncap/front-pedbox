// CASO DE USO (capa de dominio).
// Obtiene la lista de personajes con filtros. Orquesta: llama a la API
// (getCharactersRequest) y traduce la respuesta con el mapper.
// La UI lo invoca a través del hook useCharacters.
import { getCharactersRequest } from '../api/characterApi'
import { mapCharacterListFromApi } from '../mappers/characterMapper'

export async function getCharacters(filters) {
  const response = await getCharactersRequest(filters)
  return mapCharacterListFromApi(response.data)
}
