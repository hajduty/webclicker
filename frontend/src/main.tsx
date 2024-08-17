import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './Auth/AuthContext.tsx'
import { ThemeProvider } from '@emotion/react'
import theme from './theme.ts'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
      <div><Toaster
                position="bottom-right"
                reverseOrder={false}
            />
            </div>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
