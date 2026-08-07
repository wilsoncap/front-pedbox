// MODELO / ENTIDAD del dominio (capa de dominio).
// Define la "forma" que tiene un subreddit en la app (qué campos existen).
// createSubreddit() es una FACTORY: se usa para construir un objeto Subreddit
// con esa forma. No hace llamadas HTTP ni tiene lógica; solo arma el objeto.
export function createSubreddit({
  id,
  name,
  title,
  publicDescription,
  description,
  subscribers,
  url,
  over18,
  createdUtc,
  iconImg,
  bannerImg,
  fetchedAt,
}) {
  return {
    id,
    name,
    title,
    publicDescription,
    description,
    subscribers,
    url,
    over18,
    createdUtc,
    iconImg,
    bannerImg,
    fetchedAt,
  }
}
