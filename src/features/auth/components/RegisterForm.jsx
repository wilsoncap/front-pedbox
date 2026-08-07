import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRegister } from '../hooks/useRegister'
import { getErrorMessage } from '@/shared/lib/errors'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate({ email, password, confirmPassword }) {
  const errors = {}

  if (!email) {
    errors.email = 'El email es requerido'
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Ingresa un email válido'
  }

  if (!password) {
    errors.password = 'La contraseña es requerida'
  } else if (password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
  }

  if (confirmPassword !== password) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
  }

  return errors
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500'

export function RegisterForm() {
  const navigate = useNavigate()
  const registerMutation = useRegister()

  const [values, setValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
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

    registerMutation.mutate(
      { email: values.email, password: values.password },
      {
        onSuccess: () => {
          navigate('/login', {
            state: { message: 'Cuenta creada correctamente. Ya puedes iniciar sesión.' },
          })
        },
      },
    )
  }

  const errorMessage = registerMutation.isError
    ? getErrorMessage(registerMutation.error, 'No se pudo crear la cuenta')
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
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange('password')}
          placeholder="Mínimo 6 caracteres"
          className={inputClass}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Confirmar contraseña
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={handleChange('confirmPassword')}
          placeholder="Repite tu contraseña"
          className={inputClass}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {registerMutation.isPending ? 'Creando cuenta...' : 'Registrarse'}
      </button>
    </form>
  )
}
