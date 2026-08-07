import axios from 'axios'
import { env } from '@/app/config/env'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useLoadingStore } from '@/shared/store/loadingStore'

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
})

const isAuthEndpoint = (url = '') => /^\/auth\/(login|register)/.test(url)

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (!config.skipLoader) {
    useLoadingStore.getState().start()
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => {
    if (!response.config.skipLoader) {
      useLoadingStore.getState().stop()
    }
    return response
  },
  (error) => {
    if (!error.config?.skipLoader) {
      useLoadingStore.getState().stop()
    }
    if (error.response?.status === 401 && !isAuthEndpoint(error.config?.url)) {
      useAuthStore.getState().clearSession()
    }
    return Promise.reject(error)
  },
)
