// MODELO de filtros (capa de dominio).
// Define los filtros disponibles para la lista de personajes (search, status,
// species, gender, sortBy, order, page, limit), sus valores por defecto
// (DEFAULT_FILTERS) y qué valores son válidos (whitelist).
// buildQueryString() convierte los filtros a query string para GET /characters.
export const STATUS_OPTIONS = ['Alive', 'Dead', 'unknown']
export const GENDER_OPTIONS = ['Male', 'Female', 'unknown']
export const SORT_BY_OPTIONS = ['id', 'name', 'created']
export const ORDER_OPTIONS = ['asc', 'desc']

export const DEFAULT_FILTERS = {
  page: 1,
  limit: 10,
  search: '',
  status: '',
  species: '',
  gender: '',
  sortBy: 'id',
  order: 'desc',
}

export function buildQueryString(filters) {
  const params = new URLSearchParams()

  params.set('page', String(filters.page ?? DEFAULT_FILTERS.page))
  params.set('limit', String(filters.limit ?? DEFAULT_FILTERS.limit))

  if (filters.search) {
    params.set('search', filters.search)
  }
  if (STATUS_OPTIONS.includes(filters.status)) {
    params.set('status', filters.status)
  }
  if (filters.species) {
    params.set('species', filters.species)
  }
  if (GENDER_OPTIONS.includes(filters.gender)) {
    params.set('gender', filters.gender)
  }
  if (SORT_BY_OPTIONS.includes(filters.sortBy)) {
    params.set('sortBy', filters.sortBy)
  }
  if (ORDER_OPTIONS.includes(filters.order)) {
    params.set('order', filters.order)
  }

  return params.toString()
}
