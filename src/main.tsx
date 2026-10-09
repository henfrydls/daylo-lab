import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// Lab only: the stopwatch for the round about the first sheet being slow.
import { startLabStopwatch } from './lib/labStopwatch'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// After the render and never before it. An earlier version ran first, threw on
// a property Tauri will not let anybody rewrite, and Daylo opened to a white
// screen on every launch.
startLabStopwatch()
