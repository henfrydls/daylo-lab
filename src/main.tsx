import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// Lab only: the stopwatch for the round about the first sheet being slow.
import { startLabStopwatch } from './lib/labStopwatch'

startLabStopwatch()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
