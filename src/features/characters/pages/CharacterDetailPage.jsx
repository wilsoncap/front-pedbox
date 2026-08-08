// PÁGINA (capa de presentación) — ruta /characters/:id.
// Muestra el detalle de un personaje. Lee el id de la URL con useParams(),
// consume useCharacter (React Query) y pinta imagen, datos personales,
// origen, ubicación y metadatos + botón para volver a la lista.
import { Link, useParams } from 'react-router-dom'
import { useCharacter } from '../hooks/useCharacter'
import { Loading } from '@/shared/components/Loading'
import { getErrorMessage } from '@/shared/lib/errors'

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

function formatCreated(created) {
  if (!created) return '—'
  return new Date(created).toLocaleDateString('es')
}

function formatFetchedAt(fetchedAt) {
  if (!fetchedAt) return '—'
  return new Date(fetchedAt).toLocaleString('es')
}

export default function CharacterDetailPage() {
  const { id } = useParams()
  const { data: character, isLoading, isError, error } = useCharacter(id)

  return (
    <div>
      <Link
        to="/characters"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:underline"
      >
        <span aria-hidden="true">&larr;</span> Volver a la lista
      </Link>

      {isLoading && <Loading label="Cargando detalle..." />}

      {isError && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {getErrorMessage(error, 'No se pudo cargar el personaje')}
        </div>
      )}

      {!isLoading && !isError && !character && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-gray-600">Personaje no encontrado.</p>
        </div>
      )}

      {!isLoading && !isError && character && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="grid md:grid-cols-[280px_1fr]">
            {character.image && (
              <img
                src={character.image}
                alt={character.name}
                className="h-full w-full object-cover"
              />
            )}

            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900">{character.name}</h1>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    STATUS_STYLES[character.status] ?? STATUS_STYLES.unknown
                  }`}
                >
                  {STATUS_LABELS[character.status] ?? character.status}
                </span>
                <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                  {character.species || 'Especie desconocida'}
                </span>
                {character.type && (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {character.type}
                  </span>
                )}
              </div>

              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium uppercase text-gray-500">Género</dt>
                  <dd className="mt-1 text-gray-900">{character.gender || '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-gray-500">Origen</dt>
                  <dd className="mt-1 text-gray-900">{character.originName || '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-gray-500">Ubicación</dt>
                  <dd className="mt-1 text-gray-900">{character.locationName || '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-gray-500">URL</dt>
                  <dd className="mt-1 text-gray-900">{character.url || '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-gray-500">Creado</dt>
                  <dd className="mt-1 text-gray-900">{formatCreated(character.created)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-gray-500">ID</dt>
                  <dd className="mt-1 text-gray-900">{character.id}</dd>
                </div>
              </dl>

              <dl className="mt-6 border-t border-gray-100 pt-4">
                <div>
                  <dt className="text-xs font-medium uppercase text-gray-500">Sincronizado</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatFetchedAt(character.fetchedAt)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
