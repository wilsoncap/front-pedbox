import { Link } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'

export default function HomePage() {
  const user = useAuthStore((state) => state.user)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Hola, {user?.email ?? 'usuario'}
      </h1>
      <p className="mt-2 text-gray-600">¿Qué quieres hacer hoy?</p>

      <nav className="mt-8">
        <Link
          to="/subreddits"
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Ver Reddit</h2>
            <p className="mt-1 text-sm text-gray-600">
              Consulta la lista de subreddits
            </p>
          </div>
          <span className="text-2xl text-purple-600">&rarr;</span>
        </Link>
      </nav>
    </div>
  )
}
