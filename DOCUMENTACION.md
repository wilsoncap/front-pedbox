# Front-PedBox — Documentación del proyecto

Documentación de lo construido hasta ahora en el frontend de **PedBox**. Pensada para
retomar el proyecto después de tiempo sin tocar React: explica el stack moderno, la
estructura por features y cada pieza de infraestructura creada.

> 📘 **¿Vienes de poco JavaScript?** Lee primero
> [`JAVASCRIPT-GUIA.md`](./JAVASCRIPT-GUIA.md): explica todos los conceptos del lenguaje
> con ejemplos tomados de este mismo proyecto.

---

## 1. Estado actual (Fases 1-6 completadas)

Está construido todo el flujo: **infraestructura** (Fase 1), **registro** (Fase 2),
**login** (Fase 3), **Home con menú** (Fase 4a) y el feature de **subreddits con lista,
filtros y detalle** (Fases 5 y 6). Solo queda pendiente conectar el Logout a la API
(Fase 4b).

| Fase | Feature | Estado |
|---|---|---|
| 1 | Configuración e infraestructura | ✅ Hecha |
| 2 | Register (`/register`) | ✅ Hecha |
| 3 | Login (`/login`) | ✅ Hecha |
| 4a | Home con menú (`/home`) | ✅ Hecha |
| 4b | Logout por API (`POST /auth/logout`) | ⏳ Pendiente |
| 5 | Lista de subreddits + filtros (`/subreddits`) | ✅ Hecha |
| 6 | Detalle de subreddit (`/subreddits/:id`) | ✅ Hecha |

### Cómo levantar y recorrer el flujo

1. Levantar el backend en `http://localhost:3000` (su contrato está en `API.md`).
2. En el frontend: `npm run dev` → abrir `http://localhost:5173`.
3. Flujo completo: `/register` (crea cuenta) → redirige a `/login` con mensaje verde
   → al autenticarte guardas sesión y vas a `/home` → menú **"Ver Reddit"** → `/subreddits`
   (lista con filtros y paginación) → icono de ojo → `/subreddits/:id` (detalle).
4. Las rutas públicas son `/login` y `/register`; las privadas (`/home`, `/subreddits`,
   `/subreddits/:id`) exigen token y redirigen a `/login` si no lo hay.

---

## 1b. Feature Auth (lo que ya existe)

El feature `auth` tiene esta estructura (patrón de referencia para los siguientes features):

```
features/auth/
├── api/
│   └── authApi.js          # registerRequest() / loginRequest() → POST /auth/*
├── models/
│   └── User.js             # createUser() → entidad pura
├── mappers/
│   └── userMapper.js       # mapUserFromApi() → respuesta del back → modelo User
├── usecases/
│   ├── register.js         # register() → crea la cuenta
│   └── login.js            # login() → devuelve { token, user }
├── hooks/
│   ├── useRegister.js      # useRegister() → useMutation de register
│   └── useLogin.js         # useLogin() → useMutation de login
├── store/
│   └── authStore.js        # sesión (token/user) con zustand + persist
├── components/
│   ├── RegisterForm.jsx    # formulario de registro
│   └── LoginForm.jsx       # formulario de login
└── pages/
    ├── RegisterPage.jsx    # pantalla pública (sin Layout)
    └── LoginPage.jsx       # pantalla pública (sin Layout)
```

**Cómo fluye el registro (patrón de una mutación):**

1. `RegisterForm` valida (email válido, contraseña ≥ 6, confirmación igual).
2. Llama a `useRegister().mutate({ email, password })`.
3. `useRegister` → `useMutation` → usecase `register` → `authApi.registerRequest`
   → axios (interceptor agrega Bearer si hubiera token) → `POST /auth/register`.
4. La respuesta pasa por `mapUserFromApi` → objeto `User` limpio.
5. En `onSuccess` se navega a `/login` con `state.message`.
6. Si falla, `getErrorMessage()` normaliza el mensaje del back (400, 409) y se
   muestra en un banner rojo.

**Cómo fluye el login:**

1. `LoginForm` valida (email y contraseña requeridos).
2. `useLogin().mutate({ email, password })` → usecase `login` → `authApi.loginRequest`
   → `POST /auth/login`.
3. El usecase devuelve `{ token, user }` (user ya mapeado).
4. En `onSuccess`: `setSession({ token, user })` (persiste en localStorage) y
   `navigate('/home')`.
5. Si falla (401), `getErrorMessage()` muestra "credenciales incorrectas" del back.
6. `LoginPage` lee `location.state?.message` para mostrar el aviso verde que llega
   desde el registro ("Cuenta creada correctamente...").

> El Logout por ahora solo limpia la sesión local (`clearSession()`). La llamada a
> `POST /auth/logout` se agrega en la Fase 4b.

---

## 1c. Feature Subreddits (lista, filtros y detalle)

Estructura:

```
features/subreddits/
├── api/
│   └── subredditApi.js         # getSubredditsRequest(filters) / getSubredditByIdRequest(id)
├── models/
│   ├── Subreddit.js            # createSubreddit() → entidad
│   └── Filters.js              # DEFAULT_FILTERS + buildQueryString() + whitelist de sortBy
├── mappers/
│   └── subredditMapper.js      # API → Subreddit; lista → { items, meta }
├── usecases/
│   ├── getSubreddits.js        # getSubreddits(filters)
│   └── getSubredditById.js     # getSubredditById(id)
├── hooks/
│   ├── useSubreddits.js        # useQuery con queryKey ['subreddits', filters]
│   └── useSubreddit.js         # useQuery con queryKey ['subreddit', id]
├── components/
│   ├── FiltersBar.jsx          # search (debounce) + sortBy + order + over18 + limpiar
│   ├── SubredditTable.jsx      # tabla con icono de ojo → detalle
│   └── Pagination.jsx          # Anterior/Siguiente con el meta del back
└── pages/
    ├── SubredditListPage.jsx   # orquesta filtros + tabla + paginación
    └── SubredditDetailPage.jsx # detalle completo de un subreddit
```

**Cómo fluye la lista (patrón de una query):**

1. `SubredditListPage` mantiene el estado de **filtros** con `useState({ ...DEFAULT_FILTERS })`.
2. `FiltersBar` llama `onChange(nextFilters)` cada vez que cambia un filtro (la búsqueda
   con **debounce** de 400ms). Cambiar filtro resetea `page` a 1.
3. `useSubreddits(filters)` → `useQuery({ queryKey: ['subreddits', filters], ... })`.
   La **queryKey** es el identificador de la caché: cada combinación de filtros guarda su
   propio resultado y, al cambiar filtros, la query se dispara sola.
4. El usecase `getSubreddits` convierte los filtros a query string con `buildQueryString`
   (`page, limit, search, sortBy, order, over18`) y llama a `GET /subreddits`.
5. El mapper devuelve `{ items, meta }` (meta = `total, page, limit, totalPages`).
6. `SubredditTable` pinta las filas; el icono de ojo navega a `/subreddits/:id`.
7. `Pagination` usa `meta` para habilitar Anterior/Siguiente.

**Cómo fluye el detalle:**

1. `SubredditDetailPage` obtiene el `id` de la URL con `useParams()`.
2. `useSubreddit(id)` → `useQuery(['subreddit', id], ...)` → `GET /subreddits/:id`.
3. Renderiza banner, icono, título, suscriptores, badges, descripciones y metadatos.

---

## 2. Stack y dependencias

| Librería | Versión | Rol |
|---|---|---|
| React | 19 | UI |
| Vite | 8 | Bundler / dev server (reemplaza a CRA) |
| react-router-dom | 7 | Navegación y rutas |
| @tanstack/react-query | 5 | Estado del servidor (fetch, cache, mutaciones) |
| zustand | 5 | Estado global de sesión (token/user) |
| axios | 1 | Cliente HTTP con interceptores |
| tailwindcss | 4 | Estilos utilitarios (config sin `tailwind.config.js`) |
| oxlint | 1 | Linter (más rápido que ESLint, mismo estilo) |

---

## 3. Estructura por features

El proyecto usa arquitectura **por features**, no por capas globales. Cada feature
encierra sus propias capas (datos → dominio → presentación). Lo que comparten varias
features va en `shared/`.

```
src/
├── main.jsx                     # Punto de entrada: providers + GlobalLoader + router
├── index.css                    # Importa Tailwind v4
│
├── app/                         # Configuración global
│   ├── providers.jsx            # QueryClientProvider (TanStack Query)
│   ├── router.jsx               # Definición de todas las rutas + guards
│   └── config/env.js            # Variables de entorno (API base URL)
│
├── shared/                      # Código transversal (no pertenece a un feature)
│   ├── api/client.js            # Instancia de axios + interceptores
│   ├── lib/errors.js            # getErrorMessage() — normaliza errores del back
│   ├── store/loadingStore.js    # Contador de peticiones activas (global loader)
│   └── components/
│       ├── ProtectedRoute.jsx   # Guard: sin token → /login
│       ├── PublicOnlyRoute.jsx  # Guard: con token → /home
│       ├── RootRedirect.jsx     # Redirige / según sesión
│       ├── Layout.jsx           # Navbar + <Outlet/>
│       ├── Navbar.jsx           # Menú "Ver Reddit" + Logout + email
│       ├── GlobalLoader.jsx     # Overlay bloqueante mientras hay peticiones
│       └── Loading.jsx          # Spinner genérico (contenido)
│
├── features/
│   ├── auth/                    # FEATURE: autenticación
│   │   ├── api/authApi.js       #   registerRequest / loginRequest
│   │   ├── models/User.js       #   entidad User
│   │   ├── mappers/userMapper.js#   API → User
│   │   ├── usecases/            #   register.js, login.js
│   │   ├── hooks/               #   useRegister.js, useLogin.js
│   │   ├── store/authStore.js   #   zustand + persist (sesión)
│   │   ├── components/          #   RegisterForm, LoginForm
│   │   └── pages/               #   RegisterPage, LoginPage
│   ├── home/                    # FEATURE: home + menú
│   │   └── pages/HomePage.jsx   #   saludo + tarjeta "Ver Reddit"
│   └── subreddits/              # FEATURE: lista + detalle + filtros
│       ├── api/subredditApi.js  #   getSubredditsRequest / getSubredditByIdRequest
│       ├── models/              #   Subreddit.js, Filters.js (defaults + query string)
│       ├── mappers/             #   subredditMapper.js (lista → { items, meta })
│       ├── usecases/            #   getSubreddits.js, getSubredditById.js
│       ├── hooks/               #   useSubreddits.js, useSubreddit.js
│       ├── components/          #   FiltersBar, SubredditTable, Pagination
│       └── pages/               #   SubredditListPage, SubredditDetailPage
│
├── assets/                      # Imágenes del template original
└── ... (vite.config.js, package.json, etc.)
```

### Convención interna de cada feature

```
features/<nombre>/
├── api/          # Data: llamadas HTTP concretas (authApi.js, subredditApi.js)
├── models/       # Data: entidades del dominio (User, Subreddit, Filters)
├── mappers/      # Dominio: transforman respuesta de API → modelo
├── usecases/     # Dominio: lógica de negocio pura (sin React)
├── hooks/        # Presentación: envuelven useQuery/useMutation
├── components/   # Presentación: UI del feature
└── pages/        # Presentación: pantallas que se registran en el router
```

---

## 4. Las "cosas nuevas" explicadas

### 4.1 Vite (en vez de Create React App)

CRA está deprecado. Vite es el bundler moderno: arranca en milisegundos con HMR.
No hay `webpack.config.js`; la config vive en `vite.config.js`:

```js
// vite.config.js
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { proxy: { '/api': 'http://localhost:3000' } },
})
```

- **Alias `@/`**: importa desde `src/` sin rutas relativas locas. Ej: `@/shared/api/client`.
- **Proxy**: en dev, cualquier petición a `/api/...` se reenvía al backend en `localhost:3000`.
  Así **no hay problemas de CORS** y el frontend llama rutas relativas (`/api/auth/login`),
  no URLs absolutas.

### 4.2 Tailwind CSS v4 (sin `tailwind.config.js`)

En la v4 la configuración se hace en **CSS**, no en un archivo de config. Se instala el
plugin de Vite y basta una línea en `src/index.css`:

```css
@import 'tailwindcss';
```

Las clases utilitarias se usan directo en el JSX:

```jsx
<button className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
```

### 4.3 React Router v7 (modo "data router")

Ya no se usa `<BrowserRouter>` + `<Routes>` a mano (aunque sigue disponible). Lo nuevo
es **`createBrowserRouter`** + `RouterProvider`, que permite rutas anidadas con guards
como elementos padre:

```jsx
// src/app/router.jsx
export const router = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },
  {
    element: <PublicOnlyRoute />,           // guard para páginas públicas
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,            // guard para páginas privadas
    children: [
      {
        element: <Layout />,                // layout con Navbar
        children: [
          { path: '/home', element: <HomePage /> },
          { path: '/subreddits', element: <SubredditListPage /> },
          { path: '/subreddits/:id', element: <SubredditDetailPage /> },
        ],
      },
    ],
  },
])
```

- **Guards como rutas padre**: un `ProtectedRoute` envuelve a todos sus hijos. Si no hay
  token, redirige con `<Navigate to="/login" replace />`. Si lo hay, renderiza `<Outlet />`
  (que renderiza al hijo correspondiente).
- En v7 los imports vienen de `react-router-dom` (o `react-router`), no de `react-router-dom` antiguo.

### 4.4 TanStack Query v5 (fetch + cache + mutaciones)

Reemplaza el `useEffect` + `fetch` + `useState` manual para datos del servidor. Tres ideas clave:

1. **`useQuery`** para leer datos: recibe una *queryKey* (identificadores únicos) y una función que retorna datos. La cache se indexa por la key.

```js
const { data, isLoading, error } = useQuery({
  queryKey: ['subreddits', filters],   // cada combinación de filtros = nueva cache
  queryFn: () => getSubreddits(filters),
})
```

2. **`useMutation`** para escribir (login, register, logout):

```js
const mutation = useMutation({
  mutationFn: login,                    // función que llama a la API
  onSuccess: (data) => setSession(data), // qué hacer al éxito
})
mutation.mutate({ email, password })
```

3. **`QueryClient`**: configura defaults globales en `app/providers.jsx`:

```js
new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
})
```

### 4.5 Zustand v5 (estado global minimalista)

Para estado de **sesión** (no para datos del server). Se crea con `create()` y opcionalmente
se persiste en `localStorage` con el middleware `persist`:

```js
// src/features/auth/store/authStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: ({ token, user }) => set({ token, user }),
      clearSession: () => set({ token: null, user: null }),
    }),
    { name: 'pedbox-auth' },          // clave en localStorage
  ),
)
```

En componentes se lee con **selectores** (evita re-renders innecesarios):

```js
const token = useAuthStore((state) => state.token)
```

Fuera de React (ej. en el interceptor de axios) se accede con `getState()`:

```js
useAuthStore.getState().clearSession()
```

### 4.6 Axios con interceptores

El cliente HTTP está centralizado en `src/shared/api/client.js`:

```js
export const apiClient = axios.create({ baseURL: env.apiBaseUrl })
```

- **Request interceptor**: agrega `Authorization: Bearer <token>` a **todas** las peticiones
  automáticamente, leyendo el token del store. No hay que pasarlo a mano en cada llamada.
- **Response interceptor**: si cualquier respuesta da `401` (token vencido/revocado),
  limpia la sesión y los guards redirigen solos a `/login`. Se excluye `/auth/login` y
  `/auth/register` para no limpiar sesión ante "credenciales incorrectas".
- **Global loader**: el request interceptor incrementa `activeRequests` en `loadingStore`
  y los response (éxito **y** error) la decrementan. Así el overlay se oculta siempre,
  incluso si la petición falla. Se puede excluir una petición puntual con
  `apiClient.get('/ruta', { skipLoader: true })`.

### 4.7 React 19 (notas)

- React Compiler: el template lo deja desactivado por performance en dev/build. No es
  necesario para este proyecto.
- `StrictMode` sigue en `main.jsx`: en dev monta doble los componentes para detectar efectos con bugs (normal, no es error).

### 4.8 Global Loader (spinner bloqueante global)

Cada petición HTTP muestra un **overlay que bloquea la página** hasta que termina la
transacción. Tres piezas:

1. **`shared/store/loadingStore.js`** — store de zustand sin persist con un **contador**
   (`activeRequests`), no un booleano. Si hay 3 peticiones en paralelo, el overlay no
   desaparece al terminar la primera.

```js
export const useLoadingStore = create((set) => ({
  activeRequests: 0,
  start: () => set((s) => ({ activeRequests: s.activeRequests + 1 })),
  stop: () => set((s) => ({ activeRequests: Math.max(s.activeRequests - 1, 0) })),
}))
export const selectIsLoading = (s) => s.activeRequests > 0
```

2. **`shared/api/client.js`** — los interceptores llaman `start()`/`stop()` (ver 4.6).
3. **`shared/components/GlobalLoader.jsx`** — si `selectIsLoading` es `true`, renderiza un
   `fixed inset-0 z-50` con `backdrop-blur`, fondo translúcido, `cursor-wait` y spinner
   centrado. Montado en `main.jsx` como hermano de `<RouterProvider>` para cubrir **todas**
   las pantallas, incluidas las públicas (login/register).

### 4.9 Cosas nuevas usadas en el feature de subreddits

#### `useParams()` — leer parámetros de la URL

La ruta `/subreddits/:id` define el segmento `:id`. En el componente se lee con:

```jsx
import { useParams } from 'react-router-dom'
const { id } = useParams()   // si la URL es /subreddits/2qh1i → id = '2qh1i'
```

#### `useLocation()` — leer datos pasados por navegación

Para pasar un mensaje de una pantalla a otra sin URL (como el aviso verde del registro):

```jsx
// Registers envía: navigate('/login', { state: { message: 'Cuenta creada' } })
// Login lee:
const location = useLocation()
const message = location.state?.message
```

`?.` es **optional chaining**: si `location.state` es `null`, no revienta y devuelve `undefined`.

#### Debounce — no disparar la búsqueda en cada tecla

El filtro `search` espera 400ms después de dejar de escribir antes de llamar a la API.
Se hace con `useRef` para guardar el temporizador y `clearTimeout` para reiniciarlo:

```jsx
const debounceRef = useRef(null)

const handleSearchChange = (e) => {
  const value = e.target.value
  setSearch(value)
  clearTimeout(debounceRef.current)          // cancela el anterior
  debounceRef.current = setTimeout(() => {    // agenda el nuevo
    onChange({ ...filters, search: value, page: 1 })
  }, 400)
}

useEffect(() => () => clearTimeout(debounceRef.current), []) // limpia al desmontar
```

`useRef` devuelve un objeto estable que **no** provoca re-renders al mutarlo; sirve para
guardar valores "sueltos" como timers o referencias al DOM.

#### `Intl.NumberFormat` — formatear números por idioma

Para mostrar `44200000` como `44.200.000` sin librerías:

```js
const numberFormatter = new Intl.NumberFormat('es') // instancia una sola vez (fuera del componente)
numberFormatter.format(subreddit.subscribers)        // → "44.200.000"
```

Fechas: `createdUtc` llega como **timestamp Unix en segundos**, así que se multiplica por 1000
(ms) antes de `new Date()`; `fetchedAt` llega como string ISO y se formatea directo.

#### `URLSearchParams` — armar query strings

`buildQueryString()` (en `models/Filters.js`) construye la cadena de parámetros
(`?page=1&limit=10&search=node&...`) de forma segura, omitiendo los vacíos:

```js
const params = new URLSearchParams()
params.set('page', '1')
params.set('search', 'node')
params.toString() // → "page=1&search=node"
```

#### `??` (nullish coalescing) y `.filter(Boolean)`

```js
subreddit.subscribers ?? 0   // si subscribers es null/undefined, usa 0
```

`??` es distinto de `||`: solo cae al valor por defecto si es `null`/`undefined`
(no si es `0`, `''` o `false`). Y `.filter(Boolean)` elimina `null`/`undefined` de un array:

```js
const items = data.map(mapSubredditFromApi).filter(Boolean)
```

### 4.10 JavaScript esencial usado en el proyecto

Para leer el código sin atorarse, estas son las características modernas de JS que
aparecen en casi todos los archivos. Cada una con un ejemplo tomado del proyecto.

#### `const` y `let` (nunca `var`)

- `const` → valor que **no se reasigna** (el que más se usa).
- `let` → valor que sí se reasigna (ej. contadores).

```js
const numberFormatter = new Intl.NumberFormat('es') // nunca se reasigna → const
let count = 0
count = count + 1                                    // se reasigna → let
```

#### Arrow functions (funciones flecha)

Sintaxis corta para definir funciones. `(parametros) => resultado`.

```js
// Normal
function sum(a, b) { return a + b }

// Flecha con cuerpo { } → necesita return
const sum = (a, b) => { return a + b }

// Flecha sin cuerpo → devuelve la expresión directa
const sum = (a, b) => a + b
```

Un solo parámetro permite omitir los paréntesis:

```js
const items = arr.map(subreddit => subreddit.name)
```

Dentro de React son esenciales porque las flechas **no crean su propio `this`**:
siempre heredan el contexto del componente.

#### Template literals (backticks `` ` ``)

Interpolar variables dentro de strings con `${}`:

```js
// Antes (concatenar):
const url = 'https://reddit.com/' + subreddit.name

// Ahora:
const url = `https://reddit.com/${subreddit.name}`
```

En el proyecto: `getSubredditsRequest` arma la URL del detalle:

```js
apiClient.get(`/subreddits/${id}`)
```

#### Destructuring (desempaquetar objetos/arrays)

Extrae propiedades de un objeto en variables:

```js
// Objeto de la API
const response = { data: { accessToken: 'abc', user: { email: 'x@y.com' } } }

// Sin destructuring:
const token = response.data.accessToken

// Con destructuring:
const { data } = response                       // data = { accessToken, user }
const { accessToken, user } = data              // ya tengo ambas variables
```

En parámetros de función se usa muchísimo:

```js
// usecases/register.js
export async function register({ email, password }) {
  // aquí ya existen las variables email y password
}
```

Se puede renombrar al extraer:

```js
const { accessToken: token } = data   // token = data.accessToken
```

#### Spread operator (`...`)

Copia un objeto/array y permite sobrescribir campos:

```js
const filters = { page: 1, search: '', sortBy: 'subscribers' }

// Copia filters y cambia page a 2 (sin mutar el original):
const next = { ...filters, page: 2 }
// next = { page: 2, search: '', sortBy: 'subscribers' }
```

Aparece en `SubredditListPage`:

```js
const [filters, setFilters] = useState({ ...DEFAULT_FILTERS }) // copia para no mutar el original
setFilters((prev) => ({ ...prev, page }))                      // copia prev y cambia page
```

> **Por qué copiar y no mutar**: React detecta cambios comparando referencias. Si mutas
> el objeto, la referencia no cambia y React no se entera. Siempre crea un objeto nuevo.

#### `map` — transformar cada elemento de un array

`arr.map(fn)` devuelve un **nuevo array** aplicando `fn` a cada elemento:

```js
const nombres = subreddits.map((s) => s.name)  // ['AskReddit', 'node', ...]
```

En `subredditMapper.js` convierte cada objeto de la API en un modelo `Subreddit`:

```js
responseData.data.map(mapSubredditFromApi)
```

#### `filter` — quedarse solo con lo que cumple una condición

```js
const mayores = numeros.filter((n) => n >= 18)
```

Con `.filter(Boolean)` se eliminan los valores que dan "falso" (`null`, `undefined`, `0`, `''`):

```js
const items = data.map(mapSubredditFromApi).filter(Boolean)
```

#### `async / await` — trabajar con promesas de forma "lineal"

Una petición HTTP devuelve una **Promise** (algo que aún no está resuelto). Con
`async`/`await` se espera sin anidar callbacks:

```js
export async function getSubreddits(filters) {
  const response = await getSubredditsRequest(filters) // espera al backend
  return mapSubredditListFromApi(response.data)        // recién aquí sigue
}
```

- `async function` → la función **siempre devuelve una Promise**.
- `await` → pausa la ejecución hasta que la promesa se resuelve. Solo puede usarse
  dentro de una función `async`.

#### `import` / `export` — módulos

```js
// Módulo A exporta una función
export function mapUserFromApi(data) { ... }

// Módulo B la importa
import { mapUserFromApi } from '../mappers/userMapper'
```

Dos tipos de export:

| Tipo | Sintaxis | Importación |
|---|---|---|
| **Named** (varias por archivo) | `export function foo() {}` | `import { foo } from '...'` |
| **Default** (una por archivo) | `export default function Bar() {}` | `import Bar from '...'` |

En este proyecto:
- **Componentes/páginas** → export **default** (ej. `LoginPage`, `FiltersBar`).
- **Utilidades/hooks/dominio** → export **named** (ej. `useSubreddits`, `getErrorMessage`).

#### Operador ternario — "if corto"

```js
const label = error ? 'Hubo un error' : 'Todo bien'
```

En `GlobalLoader`:

```jsx
if (!isLoading) return null        // si no está cargando, no pintes nada
```

#### Truthy / falsy

JS evalúa todo valor como verdadero o falso. Son **falsy**: `false, 0, ''`, `null`,
`undefined`, `NaN`. Todo lo demás es truthy. Por eso se puede escribir:

```js
if (token) { ... }        // token existe → bloquea/permite según el caso
if (!isLoading) { ... }   // ! niega: si NO está cargando
```

#### Atajos de objetos (shorthand)

Si la variable se llama igual que la propiedad, se puede omitir:

```js
// Largo:
return { user: user, token: token }

// Corto (igual):
return { user, token }
```

#### Resumen rápido de símbolos

| Símbolo | Nombre | Significado |
|---|---|---|
| `=>` | Flecha | Definir función corta |
| `const` / `let` | Declaración | Valor fijo / reasignable |
| `{}` | Objeto | Colección clave-valor |
| `[]` | Array | Lista |
| `...` | Spread/rest | Copiar o expandir |
| `?` | Ternario | Condicional en una línea |
| `?.` | Optional chaining | Acceso seguro (no revienta si es null) |
| `??` | Nullish | Default solo si es null/undefined |
| `${}` | Template literal | Interpolar variables en string |
| `await` | Espera | Esperar una promesa |
| `&&` / `\|\|` | AND / OR lógico | Combinar condiciones |

### 4.11 Recorrido guiado por archivos reales

Para que veas cómo encaja todo, leemos dos archivos del proyecto línea a línea.

#### Archivo real 1: `features/subreddits/usecases/getSubreddits.js`

```js
import { getSubredditsRequest } from '../api/subredditApi'      // 1
import { mapSubredditListFromApi } from '../mappers/subredditMapper' // 2

export async function getSubreddits(filters) {                  // 3
  const response = await getSubredditsRequest(filters)          // 4
  return mapSubredditListFromApi(response.data)                 // 5
}
```

- **1-2**: importa las funciones que usará. `../` sube una carpeta.
- **3**: `export async function` → función pública y asíncrona. Recibe `filters`
  (objeto con los filtros).
- **4**: `await` pausa hasta que axios devuelva la respuesta del backend. `response` es
  el objeto completo de axios; su propiedad `.data` es el body JSON (`{ data: [...], meta: {...} }`).
- **5**: mapea ese body a la forma del modelo (`{ items, meta }`) y lo devuelve. La función
  `getSubreddits` es **una promesa** que resuelve al resultado mapeado.

#### Archivo real 2: `features/subreddits/components/Pagination.jsx`

```jsx
export function Pagination({ page, totalPages, total, onChange }) { // 1
  if (!totalPages || totalPages <= 1) {                             // 2
    return null
  }

  return (
    <div className="...">
      <p>{total > 0 ? `Mostrando ${total} subreddits` : ''}</p>     // 3

      <button onClick={() => onChange(page - 1)} ...>Anterior</button> // 4
      <span>Página {page} de {totalPages}</span>
      <button onClick={() => onChange(page + 1)} ...>Siguiente</button>
    </div>
  )
}
```

- **1**: destructuring en los **props** — el componente recibe un objeto de props y saca
  `page`, `totalPages`, `total` y `onChange` (una función que avisa "cambia de página").
- **2**: guard clause — si no hay paginación (1 página o menos), no renderiza nada (`return null`).
- **3**: ternario + template literal para el texto con el total.
- **4**: `onClick={() => onChange(page - 1)}` — el evento recibe una **arrow function**
  que llama a `onChange` con la página nueva. El padre (`SubredditListPage`) actualiza
  el estado `filters.page` y la query se dispara sola.

> Regla de oro del flujo: **los componentes hijos nunca hacen fetch**. Piden datos por
> props/hooks y le avisan al padre con callbacks (`onChange`, `onSubmit`). El padre
> decide qué hacer (actualizar estado → refetch automático).

---

## 5. Flujo de datos de una petición (patrón del proyecto)

```
Componente/página → hook (useQuery/useMutation) → usecase (dominio) → api (axios) → interceptor agrega token → backend
                                                        ↑
                                               response → mappers → modelo
```

Ejemplo real (lista de subreddits, ya implementada):

1. `SubredditListPage` renderiza `FiltersBar` + `SubredditTable`.
2. Los filtros (search, sortBy, order, over18, page, limit) viven en estado local.
3. `useSubreddits(filters)` llama a `useQuery` con `queryKey: ['subreddits', filters]`.
4. La query llama al usecase `getSubreddits(filters)`, que manda los filtros como
   query params a `GET /subreddits`.
5. Cambiar cualquier filtro = nueva queryKey = refetch automático (cache por combinación).
6. El detalle sigue el mismo patrón con `useSubreddit(id)` y `GET /subreddits/:id`.

---

## 6. Comandos útiles

| Comando | Qué hace |
|---|---|
| `npm install` | Instala dependencias |
| `npm run dev` | Dev server en `http://localhost:5173` (proxy a :3000) |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build localmente |
| `npm run lint` | Lint con oxlint |

> El backend debe estar corriendo en `http://localhost:3000`. Su contrato está en `API.md`.

---

## 7. Ruta por seguir (roadmap)

1. **Fase 2 — Register** ✅: form → `POST /auth/register` → éxito redirige a `/login` con mensaje.
2. **Fase 3 — Login** ✅: `POST /auth/login` → `setSession()` → `/home`. Link "¿No tienes cuenta?" → `/register`. Muestra `state.message` de "cuenta creada".
3. **Fase 4a — Home + menú** ✅: saludo con email + tarjeta "Ver Reddit" → `/subreddits`.
4. **Fase 4b — Logout por API** ⏳: conectar el botón Logout a `POST /auth/logout` + `clearSession()`.
5. **Fase 5 — Lista** ✅: `GET /subreddits` + `FiltersBar` (debounce) + tabla + paginación (usa el `meta` del back).
6. **Fase 6 — Detalle** ✅: `GET /subreddits/:id` con `useParams()`.
7. Verificar `npm run lint` y `npm run build` al cerrar cada fase.
