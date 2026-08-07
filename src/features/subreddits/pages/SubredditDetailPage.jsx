// PÁGINA (capa de presentación) — ruta /subreddits/:id.
// Muestra el detalle de un subreddit. Lee el id de la URL con useParams(),
// consume useSubreddit (React Query) y pinta banner, icono, descripciones
// y metadatos + botón para volver a la lista.
import { Link, useParams } from 'react-router-dom'
import { useSubreddit } from '../hooks/useSubreddit'
import { Loading } from '@/shared/components/Loading'
import { getErrorMessage } from '@/shared/lib/errors'

const numberFormatter = new Intl.NumberFormat('es')

function formatCreatedUtc(createdUtc) {
  if (!createdUtc) return '—'
  return new Date(createdUtc * 1000).toLocaleDateString('es')
}

function formatFetchedAt(fetchedAt) {
  if (!fetchedAt) return '—'
  return new Date(fetchedAt).toLocaleString('es')
}

export default function SubredditDetailPage() {
  const { id } = useParams()
  const { data: subreddit, isLoading, isError, error } = useSubreddit(id)

  return (
    <div>
      <Link
        to="/subreddits"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:underline"
      >
        <span aria-hidden="true">&larr;</span> Volver a la lista
      </Link>

      {isLoading && <Loading label="Cargando detalle..." />}

      {isError && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {getErrorMessage(error, 'No se pudo cargar el subreddit')}
        </div>
      )}

      {!isLoading && !isError && !subreddit && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-gray-600">Subreddit no encontrado.</p>
        </div>
      )}

      {!isLoading && !isError && subreddit && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          {subreddit.bannerImg && (
            <img
              src={subreddit.bannerImg}
              alt={`Banner de ${subreddit.name}`}
              className="h-40 w-full object-cover"
            />
          )}

          <div className="p-6">
            <div className="flex items-start gap-4">
              {subreddit.iconImg && (
                <img
                  src={subreddit.iconImg}
                  alt={`Icono de ${subreddit.name}`}
                  className="size-16 rounded-full border border-gray-200 object-cover"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{subreddit.title}</h1>
                <p className="mt-1 text-sm text-gray-600">r/{subreddit.name}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                {numberFormatter.format(subreddit.subscribers ?? 0)} suscriptores
              </span>
              {subreddit.over18 && (
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                  Contenido +18
                </span>
              )}
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {subreddit.publicDescription && (
                <section>
                  <h2 className="mb-2 text-sm font-semibold uppercase text-gray-500">
                    Descripción pública
                  </h2>
                  <p className="text-gray-700">{subreddit.publicDescription}</p>
                </section>
              )}

              {subreddit.description && (
                <section>
                  <h2 className="mb-2 text-sm font-semibold uppercase text-gray-500">
                    Descripción
                  </h2>
                  <p className="text-gray-700">{subreddit.description}</p>
                </section>
              )}
            </div>

            <dl className="mt-6 grid gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-xs font-medium uppercase text-gray-500">URL</dt>
                <dd className="mt-1 text-sm text-gray-900">{subreddit.url}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-gray-500">Creado</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatCreatedUtc(subreddit.createdUtc)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-gray-500">ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{subreddit.id}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-gray-500">Sincronizado</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatFetchedAt(subreddit.fetchedAt)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}
