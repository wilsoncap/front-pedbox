import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import { useAuthStore } from '../store/authStore'
import { getErrorMessage } from '@/shared/lib/errors'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate({ email, password }) {
  const errors = {}

  if (!email) {
    errors.email = 'El email es requerido'
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Ingresa un email válido'
  }

  if (!password) {
    errors.password = 'La contraseña es requerida'
  }

  return errors
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500'

export function LoginForm() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const loginMutation = useLogin()

  const [values, setValues] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const validationErrors = validate(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    loginMutation.mutate(
      { email: values.email, password: values.password },
      {
        onSuccess: ({ token, user }) => {
          setSession({ token, user })
          navigate('/home', { replace: true })
        },
      },
    )
  }

  const errorMessage = loginMutation.isError
    ? getErrorMessage(loginMutation.error, 'No se pudo iniciar sesión')
    : null

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {errorMessage && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange('email')}
          placeholder="tu@email.com"
          className={inputClass}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange('password')}
          placeholder="Tu contraseña"
          className={inputClass}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loginMutation.isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  )
}
