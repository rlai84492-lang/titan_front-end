import React, { createContext, useContext, useState } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [activePage,       setActivePage]       = useState('overview')
  const [activeFlow,       setActiveFlow]       = useState('bday_t10')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  function toggleSidebar() {
    setSidebarCollapsed(prev => !prev)
  }

  return (
    <UIContext.Provider value={{
      activePage,       setActivePage,
      activeFlow,       setActiveFlow,
      sidebarCollapsed, toggleSidebar,
    }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used inside UIProvider')
  return ctx
}