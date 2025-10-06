import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext'   // <-- make sure this import exists

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>         {/* <-- wrap App with the provider */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
