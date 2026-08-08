// COMPONENTE (capa de presentación).
// Barra de filtros de la lista de personajes: búsqueda (debounce de 400ms),
// status, species (texto libre), gender, ordenar por y dirección.
// Recibe los filtros actuales y avisa al padre con onChange(nextFilters).
// No hace fetch.
import { useEffect, useRef, useState } from 'react'
import { DEFAULT_FILTERS } from '../models/Filters'

const STATUS_LABELS = {
  '': 'Todos',
  Alive: 'Vivo',
  Dead: 'Muerto',
  unknown: 'Desconocido',
}

const GENDER_LABELS = {
  '': 'Todos',
  Male: 'Masculino',
  Female: 'Femenino',
  unknown: 'Desconocido',
}

const SORT_BY_LABELS = {
  id: 'ID',
  name: 'Nombre',
  created: 'Fecha de creación',
}

const ORDER_LABELS = {
  asc: 'Ascendente',
  desc: 'Descendente',
}

const selectClass =
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500'

export function FiltersBar({ filters, onChange }) {
  const [search, setSearch] = useState(filters.search)
  const debounceRef = useRef(null)

  useEffect(() => {
    setSearch(filters.search)
  }, [filters.search])

  useEffect(() => () => clearTimeout(debounceRef.current), [])

  const handleSearchChange = (event) => {
    const value = event.target.value
    setSearch(value)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onChange({ ...filters, search: value, page: 1 })
    }, 400)
  }

  const handleSelectChange = (field) => (event) => {
    onChange({ ...filters, [field]: event.target.value, page: 1 })
  }

  const handleReset = () => {
    clearTimeout(debounceRef.current)
    setSearch('')
    onChange({ ...DEFAULT_FILTERS, page: 1 })
  }

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <label htmlFor="search" className="mb-1 block text-xs font-medium uppercase text-gray-500">
            Buscar
          </label>
          <input
            id="search"
            type="search"
            value={search}
            onChange={handleSearchChange}
            placeholder="Buscar por nombre..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="status" className="mb-1 block text-xs font-medium uppercase text-gray-500">
            Estado
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={handleSelectChange('status')}
            className={selectClass}
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="species" className="mb-1 block text-xs font-medium uppercase text-gray-500">
            Especie
          </label>
          <input
            id="species"
            type="text"
            value={filters.species}
            onChange={handleSelectChange('species')}
            placeholder="Human, Alien, Robot..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="gender" className="mb-1 block text-xs font-medium uppercase text-gray-500">
            Género
          </label>
          <select
            id="gender"
            value={filters.gender}
            onChange={handleSelectChange('gender')}
            className={selectClass}
          >
            {Object.entries(GENDER_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sortBy" className="mb-1 block text-xs font-medium uppercase text-gray-500">
            Ordenar por
          </label>
          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={handleSelectChange('sortBy')}
            className={selectClass}
          >
            {Object.entries(SORT_BY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="order" className="mb-1 block text-xs font-medium uppercase text-gray-500">
            Dirección
          </label>
          <select
            id="order"
            value={filters.order}
            onChange={handleSelectChange('order')}
            className={selectClass}
          >
            {Object.entries(ORDER_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  )
}
