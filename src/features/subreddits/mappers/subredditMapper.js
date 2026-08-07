// MAPPER (capa de dominio).
// Traduce la respuesta del backend (JSON) al modelo Subreddit que usa la UI.
// - mapSubredditFromApi: convierte UN subreddit de la API → entidad Subreddit.
// - mapSubredditListFromApi: convierte la lista paginada → { items, meta }.
// El backend cambia de formato → solo se ajusta este archivo, la UI no se entera.
import { createSubreddit } from '../models/Subreddit'

export function mapSubredditFromApi(data) {
  if (!data) return null

  return createSubreddit({
    id: data.id,
    name: data.name,
    title: data.title,
    publicDescription: data.publicDescription,
    description: data.description,
    subscribers: data.subscribers,
    url: data.url,
    over18: data.over18,
    createdUtc: data.createdUtc,
    iconImg: data.iconImg,
    bannerImg: data.bannerImg,
    fetchedAt: data.fetchedAt,
  })
}

export function mapSubredditListFromApi(responseData) {
  const items = Array.isArray(responseData?.data)
    ? responseData.data.map(mapSubredditFromApi).filter(Boolean)
    : []

  return {
    items,
    meta: responseData?.meta ?? null,
  }
}
