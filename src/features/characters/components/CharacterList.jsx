// COMPONENTE (capa de presentación).
// Lista de personajes en tarjetas con imagen, nombre, badge de estado,
// especie y género. Recibe la lista por props (items) y cada tarjeta enlaza
// al detalle del personaje. No hace fetch.
import { Link } from 'react-router-dom'

const STATUS_STYLES = {
  Alive: 'bg-green-100 text-green-700',
  Dead: 'bg-red-100 text-red-700',
  unknown: 'bg-gray-100 text-gray-600',
}

const STATUS_LABELS = {
  Alive: 'Vivo',
  Dead: 'Muerto',
  unknown: 'Desconocido',
}

export function CharacterList({ items }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((character) => (
        <div
          key={character.id}
          className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          <Link to={`/characters/${character.id}`} className="block">
            <img
              src={character.image}
              alt={character.name}
              className="h-48 w-full object-cover"
            />
          </Link>

          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold text-gray-900">
                <Link to={`/characters/${character.id}`} className="hover:text-purple-600">
                  {character.name}
                </Link>
              </h2>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                  STATUS_STYLES[character.status] ?? STATUS_STYLES.unknown
                }`}
              >
                {STATUS_LABELS[character.status] ?? character.status}
              </span>
            </div>

            <dl className="mt-3 space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <dt className="text-gray-500">Especie</dt>
                <dd className="text-gray-900">{character.species || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Género</dt>
                <dd className="text-gray-900">{character.gender || '—'}</dd>
              </div>
            </dl>

            <Link
              to={`/characters/${character.id}`}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-purple-200 px-3 py-2 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-50"
            >
              Ver detalle
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
