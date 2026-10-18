import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/red-hat-mono/latin-400.css'
import '@fontsource/red-hat-mono/latin-500.css'
import '@fontsource/red-hat-mono/latin-600.css'
import '@fontsource/red-hat-mono/latin-700.css'
import '@fontsource/roboto-slab/latin-300.css'
import '@fontsource/roboto-slab/latin-400.css'
import '@fontsource/roboto-slab/latin-600.css'
import './styles/base.css'
import './styles/components.css'
import './styles/pages.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
