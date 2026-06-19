// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { AuthProvider } from './context/AuthContext.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <AuthProvider>
//     <App />
//     </AuthProvider>
//   </StrictMode>,
// )



import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider }      from './context/AuthContext.jsx'
import { DashboardProvider } from './context/DashboardContext.jsx'
import { UIProvider }        from './context/UIContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <UIProvider>
        <DashboardProvider>
          <App />
        </DashboardProvider>
      </UIProvider>
    </AuthProvider>
  </StrictMode>
)