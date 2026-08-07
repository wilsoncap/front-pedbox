import { Link, useLocation } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'

export default function LoginPage() {
  const location = useLocation()
  const message = location.state?.message

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-1 text-2xl font-bold text-gray-900">Iniciar sesión</h1>
          <p className="mb-6 text-sm text-gray-600">
            Ingresa con tu usuario y contraseña
          </p>

          {message && (
            <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
              {message}
            </p>
          )}

          <LoginForm />

          <p className="mt-6 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              className="font-medium text-purple-600 hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
