import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Game from './Game.tsx'
import './styles/modern-normalize.css'
import './styles/style.css'
import './styles/utils.css' /* utility classes have the highest priority */

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Game />
  </StrictMode>,
)
