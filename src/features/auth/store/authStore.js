import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialSession = {
  token: null,
  user: null,
}

export const useAuthStore = create(
  persist(
    (set) => ({
      ...initialSession,
      setSession: ({ token, user }) => set({ token, user }),
      clearSession: () => set(initialSession),
    }),
    {
      name: 'pedbox-auth',
    },
  ),
)
