// import React, { useEffect, useCallback } from 'react'
// import { useAuth } from './context/AuthContext'
// import { useDashboard } from './context/DashboardContext'
// import { useUI } from './context/UIContext'
// import LoginPageOne from './Components/LoginPage/Components/LoginPageOne'
// import SideBarOne from './Components/SideBarOne'
// import TopBarOne from './Components/TopBarOne'
// import FlowSelector from './Components/FlowSelector'

// import OverviewPage      from './pages/OverviewPage'
// import ConversationsPage from './pages/ConversationsPage'
// import LeadsPage         from './pages/LeadsPage'
// import LogsPage          from './pages/LogsPage'

// import DobRevisionsPage from './pages/DobRevisionsPage'


// const PAGE_TITLES = {
//   overview:      'Dashboard Overview',
//   conversations: 'Conversations',
//   leads:         'Leads & Follow-ups',
//   logs:          'Production Logs',
//   dobRevisions: 'DOB / Date Revisions',

//   analytics:     'Analytics',
//   campaigns:     'Campaign Manager',
//   customers:     'Customers',
//   stores:        'Stores',
//   settings:      'Settings',
//   help:          'Help & Support',
// }

// function ComingSoon({ label }) {
//   return (
//     <div className="flex flex-col items-center justify-center py-28 text-center">
//       <div className="text-5xl mb-4">🚧</div>
//       <div className="font-sora font-semibold text-[#28241F] text-lg mb-2">{label}</div>
//       <div className="text-[#A49D94] text-sm max-w-xs">
//         Connect your Spring Boot APIs to unlock this section.
//       </div>
//     </div>
//   )
// }

// function PageRouter({ activePage }) {
//   switch (activePage) {
//     case 'overview':      return <OverviewPage />
//     case 'conversations': return <ConversationsPage />
//     case 'leads':         return <LeadsPage />
//     case 'logs':          return <LogsPage />
//     case 'dobRevisions': return <DobRevisionsPage />

//     case 'analytics':     return <ComingSoon label="Analytics" />
//     case 'campaigns':     return <ComingSoon label="Campaign Manager" />
//     case 'customers':     return <ComingSoon label="Customers" />
//     case 'stores':        return <ComingSoon label="Stores" />
//     case 'settings':      return <ComingSoon label="Settings" />
//     case 'help':          return <ComingSoon label="Help & Support" />
//     default:              return <OverviewPage />
//   }
// }

// // ── Date Range Picker — Context se judi hai (global) ────────────
// const DATE_PRESETS = [
//   { label: 'Today',   value: 'today'  },
//   { label: '7 Days',  value: '7days'  },
//   { label: '30 Days', value: '30days' },
//   { label: 'Custom',  value: 'custom' },
// ]

// function DateRangePicker() {
//   const {
//     dateRange, setDateRange,
//     customStart, setCustomStart,
//     customEnd, setCustomEnd,
//     loadDashboard,
//   } = useDashboard()
//   const { activeFlow } = useUI()

//   const [showCustom, setShowCustom] = React.useState(dateRange === 'custom')

//   function handlePreset(val) {
//     console.log('%c[DateRange] Preset changed →', 'color:#A855F7;font-weight:bold', val)
//     setDateRange(val)
//     setShowCustom(val === 'custom')

//     // Custom select hone par turant call mat karo — start/end date chahiye pehle
//     if (val !== 'custom') {
//       loadDashboard(activeFlow, { dateRange: val })
//     }
//   }

//   function applyCustomRange() {
//     if (!customStart || !customEnd) return
//     console.log('%c[DateRange] Custom range applied →', 'color:#A855F7;font-weight:bold', { customStart, customEnd })
//     loadDashboard(activeFlow, { dateRange: 'custom', customStart, customEnd })
//   }

//   return (
//     <div className="flex items-center gap-2 flex-wrap">
//       <div className="flex gap-1 bg-[#F5F3F0] rounded-xl p-1">
//         {DATE_PRESETS.map(p => (
//           <button
//             key={p.value}
//             onClick={() => handlePreset(p.value)}
//             className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
//             style={dateRange === p.value
//               ? { background: '#fff', color: '#1A1713', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
//               : { color: '#6B6560' }
//             }
//           >
//             {p.label}
//           </button>
//         ))}
//       </div>

//       {showCustom && (
//         <div className="flex items-center gap-2">
//           <input
//             type="date" value={customStart}
//             onChange={e => setCustomStart(e.target.value)}
//             className="text-[11px] border border-[#EEEBE6] rounded-lg px-2 py-1 outline-none focus:border-[#E85A2B]"
//           />
//           <span className="text-[11px] text-gray-400">to</span>
//           <input
//             type="date" value={customEnd}
//             onChange={e => setCustomEnd(e.target.value)}
//             className="text-[11px] border border-[#EEEBE6] rounded-lg px-2 py-1 outline-none focus:border-[#E85A2B]"
//           />
//           <button
//             onClick={applyCustomRange}
//             disabled={!customStart || !customEnd}
//             className="px-3 py-1 rounded-lg text-[11px] font-bold text-white disabled:opacity-40 transition-all"
//             style={{ background: 'linear-gradient(135deg,#E85A2B,#FF7040)' }}
//           >
//             Apply
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

// // ── Dashboard Layout ──────────────────────────────────────────
// function Dashboard() {
//   const { user, isAuthenticated, authLoading, logout } = useAuth()
//   const { sessions, leads, loading, lastRefresh, loadDashboard, dateRange, customStart, customEnd } = useDashboard()
//   const { activePage, setActivePage, activeFlow, sidebarCollapsed, toggleSidebar } = useUI()

//   const sidebarW = sidebarCollapsed ? '68px' : '240px'

//   const refresh = useCallback(() => {
//     console.log('%c[App] Manual refresh clicked', 'color:#378ADD;font-weight:bold')
//     loadDashboard(activeFlow, { dateRange, customStart, customEnd })
//   }, [loadDashboard, activeFlow, dateRange, customStart, customEnd])

//   // ── Initial load — page pehli baar khulte hi ───────────────────
//   useEffect(() => {
//     console.log('%c[App] Initial mount — loading default flow:', 'color:#1D9E75;font-weight:bold', activeFlow)
//     loadDashboard(activeFlow, { dateRange, customStart, customEnd })
//   }, []) // eslint-disable-line

//   // ── Flow tab change → reload (date range bhi respect hoga) ─────
//   useEffect(() => {
//     console.log('%c[App] Tab clicked → reloading for flow:', 'color:#E85A2B;font-weight:bold', activeFlow)
//     loadDashboard(activeFlow, { dateRange, customStart, customEnd })
//   }, [activeFlow]) // eslint-disable-line



//   const conversationsCount = sessions.length
//   const leadsCount         = leads.length

//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-[#F8F7F6] flex items-center justify-center">
//         <div className="bg-white border border-[#EFEDEA] shadow rounded-2xl px-6 py-4 text-sm text-[#A49D94]">
//           Checking session…
//         </div>
//       </div>
//     )
//   }

//   if (!isAuthenticated) return <LoginPageOne />

//   return (
//     <div className="min-h-screen bg-[#F8F7F6]">

//       {/* ① Sidebar */}
//       <SideBarOne
//         active={activePage}
//         setActive={setActivePage}
//         collapsed={sidebarCollapsed}
//         setCollapsed={toggleSidebar}
//         conversationsCount={conversationsCount}
//         leadsCount={leadsCount}
//       />

//       {/* ② Topbar */}
//       <TopBarOne
//         pageTitle={PAGE_TITLES[activePage] || 'Dashboard'}
//         onRefresh={refresh}
//         loading={loading}
//         lastRefresh={lastRefresh ? new Date(lastRefresh) : null}
//         sidebarW={sidebarW}
//         user={user}
//         onLogout={logout}
//       />

//       {/* ③ Flow selector + Date range — GLOBAL, har page pe asar */}
//       <div
//         className="fixed top-16 right-0 z-20 flex items-center justify-between px-4 py-2 bg-white border-b border-[#EEEBE6]"
//         style={{
//           left: sidebarW,
//           transition: 'left 0.28s cubic-bezier(0.4,0,0.2,1)',
//           boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
//         }}
//       >
//         <FlowSelector />
//         <DateRangePicker />
//       </div>

//       {/* ④ Main content */}
//       <main
//         className="pt-28 min-h-screen"
//         style={{
//           marginLeft: sidebarW,
//           transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
//         }}
//       >
//         <div className="p-4 max-w-[1600px]">
//           <PageRouter activePage={activePage} />
//         </div>
//       </main>

//     </div>
//   )
// }

// export default function App() {
//   return <Dashboard />
// }


import React, { useEffect, useCallback } from 'react'
import { useAuth } from './context/AuthContext'
import { useDashboard } from './context/DashboardContext'
import { useUI } from './context/UIContext'
import LoginPageOne from './Components/LoginPage/Components/LoginPageOne'
import SideBarOne from './Components/SideBarOne'
import TopBarOne from './Components/TopBarOne'
import FlowSelector from './Components/FlowSelector'

import OverviewPage      from './pages/OverviewPage'
import ConversationsPage from './pages/ConversationsPage'
import LeadsPage         from './pages/LeadsPage'
import LogsPage          from './pages/LogsPage'
import DobRevisionsPage  from './pages/DobRevisionsPage'

const PAGE_TITLES = {
  overview:      'Dashboard Overview',
  conversations: 'Conversations',
  leads:         'Leads & Follow-ups',
  logs:          'Production Logs',
  dobRevisions:  'DOB / Date Revisions',
  analytics:     'Analytics',
  campaigns:     'Campaign Manager',
  customers:     'Customers',
  stores:        'Stores',
  settings:      'Settings',
  help:          'Help & Support',
}

// ── Pages jinke liye GLOBAL Flow selector + Date range bar 
//    HIDE honi chahiye (kyunki unka apna local filter/state hai,
//    ya unko flow/date filter ki zarurat hi nahi) ────────────────
const PAGES_WITHOUT_GLOBAL_FILTERS = ['dobRevisions']

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

function PageRouter({ activePage }) {
  switch (activePage) {
    case 'overview':      return <OverviewPage />
    case 'conversations': return <ConversationsPage />
    case 'leads':         return <LeadsPage />
    case 'logs':          return <LogsPage />
    case 'dobRevisions':  return <DobRevisionsPage />
    case 'analytics':     return <ComingSoon label="Analytics" />
    case 'campaigns':     return <ComingSoon label="Campaign Manager" />
    case 'customers':     return <ComingSoon label="Customers" />
    case 'stores':        return <ComingSoon label="Stores" />
    case 'settings':      return <ComingSoon label="Settings" />
    case 'help':          return <ComingSoon label="Help & Support" />
    default:              return <OverviewPage />
  }
}

// ── Date Range Picker — Context se judi hai (global) ────────────
const DATE_PRESETS = [
  { label: 'Today',   value: 'today'  },
  { label: '7 Days',  value: '7days'  },
  { label: '30 Days', value: '30days' },
  { label: 'Custom',  value: 'custom' },
]

function DateRangePicker() {
  const {
    dateRange, setDateRange,
    customStart, setCustomStart,
    customEnd, setCustomEnd,
    loadDashboard,
  } = useDashboard()
  const { activeFlow } = useUI()

  const [showCustom, setShowCustom] = React.useState(dateRange === 'custom')

  function handlePreset(val) {
    console.log('%c[DateRange] Preset changed →', 'color:#A855F7;font-weight:bold', val)
    setDateRange(val)
    setShowCustom(val === 'custom')

    // Custom select hone par turant call mat karo — start/end date chahiye pehle
    if (val !== 'custom') {
      loadDashboard(activeFlow, { dateRange: val })
    }
  }

  function applyCustomRange() {
    if (!customStart || !customEnd) return
    console.log('%c[DateRange] Custom range applied →', 'color:#A855F7;font-weight:bold', { customStart, customEnd })
    loadDashboard(activeFlow, { dateRange: 'custom', customStart, customEnd })
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex gap-1 bg-[#F5F3F0] rounded-xl p-1">
        {DATE_PRESETS.map(p => (
          <button
            key={p.value}
            onClick={() => handlePreset(p.value)}
            className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
            style={dateRange === p.value
              ? { background: '#fff', color: '#1A1713', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
              : { color: '#6B6560' }
            }
          >
            {p.label}
          </button>
        ))}
      </div>

      {showCustom && (
        <div className="flex items-center gap-2">
          <input
            type="date" value={customStart}
            onChange={e => setCustomStart(e.target.value)}
            className="text-[11px] border border-[#EEEBE6] rounded-lg px-2 py-1 outline-none focus:border-[#E85A2B]"
          />
          <span className="text-[11px] text-gray-400">to</span>
          <input
            type="date" value={customEnd}
            onChange={e => setCustomEnd(e.target.value)}
            className="text-[11px] border border-[#EEEBE6] rounded-lg px-2 py-1 outline-none focus:border-[#E85A2B]"
          />
          <button
            onClick={applyCustomRange}
            disabled={!customStart || !customEnd}
            className="px-3 py-1 rounded-lg text-[11px] font-bold text-white disabled:opacity-40 transition-all"
            style={{ background: 'linear-gradient(135deg,#E85A2B,#FF7040)' }}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}

// ── Dashboard Layout ──────────────────────────────────────────
function Dashboard() {
  const { user, isAuthenticated, authLoading, logout } = useAuth()
  const { sessions, leads, loading, lastRefresh, loadDashboard, dateRange, customStart, customEnd } = useDashboard()
  const { activePage, setActivePage, activeFlow, sidebarCollapsed, toggleSidebar } = useUI()

  const sidebarW = sidebarCollapsed ? '68px' : '240px'

  // ── Kya is page pe global filter bar dikhani hai? ───────────────
  const showGlobalFilters = !PAGES_WITHOUT_GLOBAL_FILTERS.includes(activePage)

  const refresh = useCallback(() => {
    console.log('%c[App] Manual refresh clicked', 'color:#378ADD;font-weight:bold')
    loadDashboard(activeFlow, { dateRange, customStart, customEnd })
  }, [loadDashboard, activeFlow, dateRange, customStart, customEnd])

  // ── Initial load — page pehli baar khulte hi ───────────────────
  useEffect(() => {
    console.log('%c[App] Initial mount — loading default flow:', 'color:#1D9E75;font-weight:bold', activeFlow)
    loadDashboard(activeFlow, { dateRange, customStart, customEnd })
  }, []) // eslint-disable-line

  // ── Flow tab change → reload (date range bhi respect hoga) ─────
  useEffect(() => {
    console.log('%c[App] Tab clicked → reloading for flow:', 'color:#E85A2B;font-weight:bold', activeFlow)
    loadDashboard(activeFlow, { dateRange, customStart, customEnd })
  }, [activeFlow]) // eslint-disable-line



  const conversationsCount = sessions.length
  const leadsCount         = leads.length

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
        setActive={setActivePage}
        collapsed={sidebarCollapsed}
        setCollapsed={toggleSidebar}
        conversationsCount={conversationsCount}
        leadsCount={leadsCount}
      />

      {/* ② Topbar */}
      <TopBarOne
        pageTitle={PAGE_TITLES[activePage] || 'Dashboard'}
        onRefresh={refresh}
        loading={loading}
        lastRefresh={lastRefresh ? new Date(lastRefresh) : null}
        sidebarW={sidebarW}
        user={user}
        onLogout={logout}
      />

      {/* ③ Flow selector + Date range — GLOBAL, har page pe asar */}
      {/*    SIRF un pages pe dikhti hai jo PAGES_WITHOUT_GLOBAL_FILTERS  */}
      {/*    mein nahi hain (jaise DOB Revisions — uska apna local       */}
      {/*    date-range hai, global wala wahan irrelevant hai)           */}
      {showGlobalFilters && (
        <div
          className="fixed top-16 right-0 z-20 flex items-center justify-between px-4 py-2 bg-white border-b border-[#EEEBE6]"
          style={{
            left: sidebarW,
            transition: 'left 0.28s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <FlowSelector />
          <DateRangePicker />
        </div>
      )}

      {/* ④ Main content */}
      {/*    pt-28 sirf jab global filter bar dikh rahi ho (uske liye   */}
      {/*    space chahiye) — warna sirf topbar jitni jagah (pt-16)    */}
      <main
        className={showGlobalFilters ? 'pt-28 min-h-screen' : 'pt-16 min-h-screen'}
        style={{
          marginLeft: sidebarW,
          transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div className="p-4 max-w-[1600px]">
          <PageRouter activePage={activePage} />
        </div>
      </main>

    </div>
  )
}

export default function App() {
  return <Dashboard />
}