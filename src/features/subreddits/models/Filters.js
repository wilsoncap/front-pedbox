// MODELO de filtros (capa de dominio).
// Define los filtros disponibles para la lista (search, sortBy, order, over18,
// page, limit), sus valores por defecto (DEFAULT_FILTERS) y qué valores son
// válidos (whitelist). buildQueryString() convierte los filtros a query string
// para GET /subreddits (ej: "page=1&limit=10&search=node").
export const SORT_BY_OPTIONS = ['name', 'subscribers', 'createdUtc']
export const ORDER_OPTIONS = ['asc', 'desc']
export const OVER_18_OPTIONS = ['', 'true', 'false']

export const DEFAULT_FILTERS = {
  page: 1,
  limit: 10,
  search: '',
  sortBy: 'subscribers',
  order: 'desc',
  over18: '',
}

export function buildQueryString(filters) {
  const params = new URLSearchParams()

  params.set('page', String(filters.page ?? DEFAULT_FILTERS.page))
  params.set('limit', String(filters.limit ?? DEFAULT_FILTERS.limit))

  if (filters.search) {
    params.set('search', filters.search)
  }
  if (SORT_BY_OPTIONS.includes(filters.sortBy)) {
    params.set('sortBy', filters.sortBy)
  }
  if (ORDER_OPTIONS.includes(filters.order)) {
    params.set('order', filters.order)
  }
  if (filters.over18 === 'true' || filters.over18 === 'false') {
    params.set('over18', filters.over18)
  }

  return params.toString()
}
