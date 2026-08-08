import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'

export function Navbar() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)

  const handleLogout = () => {
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <span className="text-lg font-bold text-purple-600">PedBox</span>

        <nav className="flex items-center gap-6">
          {[
            { to: '/subreddits', label: 'Ver Reddit' },
            { to: '/characters', label: 'Rick & Morty' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `font-medium transition-colors hover:text-purple-600 ${
                  isActive ? 'text-purple-600' : 'text-gray-700'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user?.email && (
            <span className="text-sm text-gray-600">{user.email}</span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
