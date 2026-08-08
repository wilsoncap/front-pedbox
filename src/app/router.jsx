import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { PublicOnlyRoute } from '@/shared/components/PublicOnlyRoute'
import { RootRedirect } from '@/shared/components/RootRedirect'
import { Layout } from '@/shared/components/Layout'
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import HomePage from '@/features/home/pages/HomePage'
import SubredditListPage from '@/features/subreddits/pages/SubredditListPage'
import SubredditDetailPage from '@/features/subreddits/pages/SubredditDetailPage'
import CharactersPage from '@/features/characters/pages/CharactersPage'
import CharacterDetailPage from '@/features/characters/pages/CharacterDetailPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/home', element: <HomePage /> },
          { path: '/subreddits', element: <SubredditListPage /> },
          { path: '/subreddits/:id', element: <SubredditDetailPage /> },
          { path: '/characters', element: <CharactersPage /> },
          { path: '/characters/:id', element: <CharacterDetailPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <RootRedirect />,
  },
])
