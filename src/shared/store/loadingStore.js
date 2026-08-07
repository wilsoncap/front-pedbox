import { create } from 'zustand'

export const useLoadingStore = create((set) => ({
  activeRequests: 0,
  start: () => set((state) => ({ activeRequests: state.activeRequests + 1 })),
  stop: () => set((state) => ({ activeRequests: Math.max(state.activeRequests - 1, 0) })),
}))

export const selectIsLoading = (state) => state.activeRequests > 0
