// COMPONENTE (capa de presentación).
// Tabla de subreddits. Recibe la lista por props (items) y la pinta.
// El icono de ojo navega al detalle de cada subreddit. No hace fetch.
import { Link } from 'react-router-dom'

const numberFormatter = new Intl.NumberFormat('es')

export function SubredditTable({ items }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
            <th className="px-4 py-3 font-medium">Nombre</th>
            <th className="px-4 py-3 font-medium">Título</th>
            <th className="px-4 py-3 text-right font-medium">Suscriptores</th>
            <th className="px-4 py-3 font-medium">+18</th>
            <th className="px-4 py-3 text-right font-medium">Acción</th>
          </tr>
        </thead>
        <tbody>
          {items.map((subreddit) => (
            <tr key={subreddit.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{subreddit.name}</td>
              <td className="px-4 py-3 text-gray-700">{subreddit.title}</td>
              <td className="px-4 py-3 text-right text-gray-700">
                {numberFormatter.format(subreddit.subscribers ?? 0)}
              </td>
              <td className="px-4 py-3">
                {subreddit.over18 ? (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                    Sí
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    No
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  to={`/subreddits/${subreddit.id}`}
                  title={`Ver detalle de ${subreddit.name}`}
                  className="inline-flex size-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-purple-100 hover:text-purple-700"
                >
                  <svg
                    className="size-5"
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
