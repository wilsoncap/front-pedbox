# Front-PedBox

Frontend del proyecto **PedBox** (React + Vite). App de autenticación (registro/login)
con un menú que lista subreddits de Reddit, con filtros y vista de detalle.

## Stack

- React 19 + Vite
- react-router-dom v7 (rutas + guards)
- @tanstack/react-query v5 (datos del servidor)
- zustand v5 (sesión con persistencia en localStorage)
- axios (interceptores: Bearer, 401, spinner global)
- Tailwind CSS v4
- oxlint

## Requisitos

- Node.js (Vite 8)
- Backend corriendo en `http://localhost:3000` (contrato en `API.md`)

## Comandos

| Comando | Qué hace |
|---|---|
| `npm install` | Instala dependencias |
| `npm run dev` | Dev server en `http://localhost:5173` (proxy a :3000) |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build localmente |
| `npm run lint` | Lint con oxlint |

## Documentación

- [`DOCUMENTACION.md`](./DOCUMENTACION.md) — arquitectura por features, estado del
  proyecto, flujos y roadmap.
- [`API.md`](./API.md) — contrato del backend (endpoints).
