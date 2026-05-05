import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { CareerProvider } from './context/CareerContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CareerProvider>
        <App />
      </CareerProvider>
    </AuthProvider>
  </StrictMode>,
)
