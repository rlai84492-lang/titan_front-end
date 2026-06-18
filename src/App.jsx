import React, { useEffect, useCallback } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import store from './store'
import { loadDashboard, filterByFlow } from './store/dashboardSlice'
import { setActivePage, toggleSidebar } from './store/uiSlice'
import { useAuth } from './context/AuthContext'
import LoginPageOne from './Components/LoginPage/Components/LoginPageOne'
import SideBarOne from './Components/SideBarOne'
import TopBarOne from './Components/TopBarOne'
import FlowSelector from './Components/FlowSelector'

// ── Pages ─────────────────────────────────────────────────────
import OverviewPage      from './pages/OverviewPage'
import ConversationsPage from './pages/ConversationsPage'
import LeadsPage         from './pages/LeadsPage'
import LogsPage from './pages/LogsPage'

// ─────────────────────────────────────────────────────────────
const PAGE_TITLES = {
  overview:      'Dashboard Overview',
  conversations: 'Conversations',
  leads:         'Leads & Follow-ups',
  logs:          'Production Logs', 
  analytics:     'Analytics',
  campaigns:     'Campaign Manager',
  customers:     'Customers',
  stores:        'Stores',
  settings:      'Settings',
  help:          'Help & Support',
}

// ── Placeholder for unbuilt pages ─────────────────────────────
function ComingSoon({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="text-5xl mb-4">🚧</div>
      <div className="font-sora font-semibold text-[#28241F] text-lg mb-2">{label}</div>
      <div className="text-[#A49D94] text-sm max-w-xs">
        Connect your Spring Boot APIs to unlock this section.
      </div>
    </div>
  )
}

// ── Page router ───────────────────────────────────────────────
function PageRouter() {
  const activePage = useSelector(s => s.ui.activePage)
  switch (activePage) {
    case 'overview':      return <OverviewPage />
    case 'conversations': return <ConversationsPage />
    case 'leads':         return <LeadsPage />
    case 'logs':          return <LogsPage />        // ← YE ADD KARO
    case 'analytics':     return <ComingSoon label="Analytics" />
    case 'campaigns':     return <ComingSoon label="Campaign Manager" />
    case 'customers':     return <ComingSoon label="Customers" />
    case 'stores':        return <ComingSoon label="Stores" />
    case 'settings':      return <ComingSoon label="Settings" />
    case 'help':          return <ComingSoon label="Help & Support" />
    default:              return <OverviewPage />
  }
}

// ── Dashboard layout ──────────────────────────────────────────
function Dashboard() {
  const dispatch     = useDispatch()
  const activePage   = useSelector(s => s.ui.activePage)
  const activeFlow   = useSelector(s => s.ui.activeFlow)
  const collapsed    = useSelector(s => s.ui.sidebarCollapsed)
  const lastRefresh  = useSelector(s => s.dashboard.lastRefresh)
  const loading      = useSelector(s => s.dashboard.loading)
  const { user, isAuthenticated, authLoading, logout } = useAuth()

  const sidebarW = collapsed ? '68px' : '240px'

  const refresh = useCallback(async () => {
    const result = await dispatch(loadDashboard())
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(filterByFlow(store.getState().ui.activeFlow))
    }
  }, [dispatch])

  // Initial load + 30s auto-refresh
  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 30_000)
    return () => clearInterval(id)
  }, [refresh])

  // Re-filter when flow tab changes
  useEffect(() => {
    dispatch(filterByFlow(activeFlow))
  }, [activeFlow, dispatch])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F7F6] flex items-center justify-center">
        <div className="bg-white border border-[#EFEDEA] shadow rounded-2xl px-6 py-4 text-sm text-[#A49D94]">
          Checking session…
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return <LoginPageOne />

  return (
    <div className="min-h-screen bg-[#F8F7F6]">

      {/* ① Sidebar */}
      <SideBarOne
        active={activePage}
        setActive={p => dispatch(setActivePage(p))}
        collapsed={collapsed}
        setCollapsed={() => dispatch(toggleSidebar())}
      />

      {/* ② Topbar */}
      <TopBarOne
        pageTitle={PAGE_TITLES[activePage] || 'Dashboard'}
        onRefresh={refresh}
        loading={loading}
        lastRefresh={lastRefresh ? new Date(lastRefresh) : null}
        sidebarW={sidebarW}
        user={user}
        onLogout={logout} when
      />

      {/* ③ Flow selector bar — below topbar */}
      <div
        className="fixed top-16 right-0 z-20 flex items-center px-4 py-2 bg-white border-b border-[#EEEBE6]"
        style={{
          left: sidebarW,
          transition: 'left 0.28s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}
      >
        <FlowSelector />
      </div>

      {/* ④ Main content */}
      <main
        className="pt-28 min-h-screen"
        style={{
          marginLeft: sidebarW,
          transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div className="p-4 max-w-[1600px]">
          <PageRouter />
        </div>
      </main>

    </div>
  )
}

// ── Root — wraps everything in Redux Provider ─────────────────
export default function App() {
  return (
    <Provider store={store}>
      <Dashboard />
    </Provider>
  )
}