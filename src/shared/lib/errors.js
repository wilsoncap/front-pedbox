export function getErrorMessage(
  error,
  fallback = 'Ocurrió un error inesperado',
) {
  const data = error?.response?.data
  const message = data?.message
  if (typeof message === 'string' && message) return message
  if (Array.isArray(message) && message.length) return message.join(', ')
  if (typeof error?.message === 'string' && error.message) return error.message
  return fallback
}
