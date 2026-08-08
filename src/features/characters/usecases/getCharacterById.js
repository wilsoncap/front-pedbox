// CASO DE USO (capa de dominio).
// Obtiene el detalle de un personaje por su id. Orquesta: llama a la API
// (getCharacterByIdRequest) y traduce la respuesta con el mapper.
// La UI lo invoca a través del hook useCharacter.
import { getCharacterByIdRequest } from '../api/characterApi'
import { mapCharacterFromApi } from '../mappers/characterMapper'

export async function getCharacterById(id) {
  const response = await getCharacterByIdRequest(id)
  return mapCharacterFromApi(response.data?.data)
}
