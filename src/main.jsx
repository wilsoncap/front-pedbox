import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { AppProviders } from './app/providers'
import { router } from './app/router'
import { GlobalLoader } from './shared/components/GlobalLoader'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders>
      <GlobalLoader />
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
)
