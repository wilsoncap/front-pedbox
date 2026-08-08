// MODELO / ENTIDAD del dominio (capa de dominio).
// Define la "forma" que tiene un personaje (Rick & Morty) en la app.
// createCharacter() es una FACTORY: construye un objeto Character con esa forma.
// No hace llamadas HTTP ni tiene lógica; solo arma el objeto.
export function createCharacter({
  id,
  name,
  status,
  species,
  type,
  gender,
  originName,
  locationName,
  image,
  url,
  created,
  fetchedAt,
}) {
  return {
    id,
    name,
    status,
    species,
    type,
    gender,
    originName,
    locationName,
    image,
    url,
    created,
    fetchedAt,
  }
}
