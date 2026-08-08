// HOOK (capa de presentación).
// Envuelve useMutation para sincronizar personajes (POST /characters/sync).
// Devuelve la mutación: { mutate, isPending, isError, error, data }.
import { useMutation } from '@tanstack/react-query'
import { syncCharacters } from '../usecases/syncCharacters'

export function useSyncCharacters() {
  return useMutation({
    mutationFn: syncCharacters,
  })
}
