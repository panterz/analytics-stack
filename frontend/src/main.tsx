import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { RoomShell } from '@sqlrooms/room-shell'
import { ThemeProvider } from '@sqlrooms/ui'
import { roomStore } from './room-store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="analytics-stack-ui-theme">
      <RoomShell roomStore={roomStore}>
        <App />
      </RoomShell>
    </ThemeProvider>
  </StrictMode>,
)
