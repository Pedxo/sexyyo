import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'

/* ====================================
   INTER
   -----------------------------------
   Main application font.
   ==================================== */

import '@fontsource/inter/400.css'
import '@fontsource/inter/400-italic.css'

import '@fontsource/inter/500.css'
import '@fontsource/inter/500-italic.css'

import '@fontsource/inter/600.css'
import '@fontsource/inter/600-italic.css'

import '@fontsource/inter/700.css'
import '@fontsource/inter/700-italic.css'

/* =========================================================
   INTER TIGHT
   ========================================================= */

import '@fontsource-variable/inter-tight/wght.css'
import '@fontsource-variable/inter-tight/wght-italic.css'

import './index.css'
import router from './routes/AppRoutes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)