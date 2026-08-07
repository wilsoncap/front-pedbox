import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'

export function PublicOnlyRoute() {
  const token = useAuthStore((state) => state.token)

  if (token) {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}
