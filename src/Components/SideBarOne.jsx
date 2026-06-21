// import React, { useEffect, useState } from 'react'
// import {
//   LayoutDashboard, MessageSquare, Users, PhoneCall, Store,
//   BarChart2, Calendar, Settings, HelpCircle,
//   ChevronRight, TrendingUp, BookOpen, CalendarClock,
// } from 'lucide-react'
// import { useDashboard } from '../context/DashboardContext'
// import { useUI } from '../context/UIContext'


// // ── Nav config  (badge key = field name returned by /api/dashboard/counts)
// const NAV = [
//   {
//     group: 'OVERVIEW',
//     items: [
//       { id: 'overview', label: 'Overview', icon: LayoutDashboard },
//       { id: 'conversations', label: 'Conversations', icon: MessageSquare, badgeKey: 'conversations' },
//       { id: 'leads', label: 'Leads', icon: PhoneCall, badgeKey: 'leads' },
//       { id: 'dobRevisions', label: 'DOB Revisions', icon: CalendarClock, badgeKey: 'dobRevisions' },   // ← NAYA ITEM
//     ],
//   },
//   {
//     group: 'ANALYTICS',
//     items: [
//       { id: 'analytics', label: 'Analytics', icon: BarChart2 },
//       { id: 'campaigns', label: 'Campaigns', icon: Calendar },
//       { id: 'performance', label: 'Performance', icon: TrendingUp },
//     ],
//   },
//   {
//     group: 'MANAGEMENT',
//     items: [
//       { id: 'customers', label: 'Customers', icon: Users },
//       { id: 'stores', label: 'Stores', icon: Store },
//       { id: 'catalogue', label: 'Catalogue', icon: BookOpen },
//     ],
//   },
//   {
//     group: 'SYSTEM',
//     items: [
//       { id: 'settings', label: 'Settings', icon: Settings },
//       { id: 'help', label: 'Help', icon: HelpCircle },
//     ],
//   },
// ]

// export default function SideBarOne({ active, setActive, collapsed, setCollapsed }) {

//   const { setDateRange, setCustomStart, setCustomEnd } = useDashboard()
//   const { setActiveFlow } = useUI()

//   // ── counts fetched from backend ───────────────────────────────
//   const [counts, setCounts] = useState({})

//   useEffect(() => {
//     let cancelled = false

//     const fetchCounts = async () => {
//       try {

// const data = await authFetch('/api/dashboard/counts')

//         if (!cancelled) setCounts(data)
//       } catch (err) {
//         console.warn('SideBar counts fetch error:', err)
//       }
//     }

//     fetchCounts()                          // immediate first load
//     const timer = setInterval(fetchCounts, 30_000)  // refresh every 30 s

//     return () => {
//       cancelled = true
//       clearInterval(timer)
//     }
//   }, [])

//   // ── badge display helper ──────────────────────────────────────
//   const getBadge = (badgeKey) => {
//     if (!badgeKey) return null
//     const val = counts[badgeKey]
//     if (val === undefined || val === null) return null
//     return val > 999 ? '999+' : String(val)
//   }

//   // ─────────────────────────────────────────────────────────────
//   return (
//     <aside
//       className="fixed top-0 left-0 h-screen flex flex-col z-40 overflow-hidden bg-white border-r border-[#EEEBE6]"
//       style={{
//         width: collapsed ? '68px' : '240px',
//         transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1)',
//         boxShadow: '1px 0 12px rgba(0,0,0,0.04)',
//       }}
//     >
//       {/* ── Logo ── */}
//       <div className="h-16 flex items-center px-4 border-b border-[#EEEBE6] flex-shrink-0 gap-3 overflow-hidden">
        
//           <img src='https://www.titan.co.in/on/demandware.static/Sites-Titan-Site/-/default/dw3e3fcc7b/images/header/titan-logo.svg'></img>
        
      
//       </div>

//       {/* ── Nav ── */}
//       <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
//         {NAV.map(section => (
//           <div key={section.group} className="mb-1">
//             {!collapsed && (
//               <div className="text-[9px] font-bold tracking-[0.12em] text-[#C4BEB6] px-3 mb-1.5 mt-2 uppercase">
//                 {section.group}
//               </div>
//             )}

//             {section.items.map(item => {
//               const Icon = item.icon
//               const isActive = active === item.id
//               const badge = getBadge(item.badgeKey)   // ← dynamic

//               return (
//                 <button
//                   key={item.id}
//                   onClick={() => {
//                     setActive(item.id)
//                     setActiveFlow('bday_t10')    // reset to Birthday T-10
//                     setDateRange('today')        // reset to Today
//                     setCustomStart('')
//                     setCustomEnd('')
//                   }} className={`
//                     w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
//                     mb-0.5 text-left group relative overflow-hidden
//                     transition-all duration-200
//                     ${isActive
//                       ? 'text-[#E85A2B]'
//                       : 'text-[#6B6560] hover:text-[#1A1713]'}
//                   `}
//                   style={isActive ? {
//                     background: 'linear-gradient(135deg, #FEF0EB 0%, #FFF5F0 100%)',
//                     boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 4px rgba(232,90,43,0.12)',
//                   } : {}}
//                   title={collapsed ? item.label : ''}
//                 >
//                   {/* Hover bg */}
//                   {!isActive && (
//                     <div className="absolute inset-0 bg-[#F8F7F6] opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-150" />
//                   )}

//                   {/* Active left bar */}
//                   {isActive && (
//                     <span
//                       className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
//                       style={{ background: 'linear-gradient(180deg, #E85A2B, #FF7040)' }}
//                     />
//                   )}

//                   <Icon
//                     size={17}
//                     className={`flex-shrink-0 relative z-10 transition-colors duration-150 ${isActive ? 'text-[#E85A2B]' : 'text-[#B0A9A1] group-hover:text-[#6B6560]'
//                       }`}
//                   />

//                   {!collapsed && (
//                     <>
//                       <span className="text-[13px] font-medium flex-1 whitespace-nowrap relative z-10">
//                         {item.label}
//                       </span>

//                       {/* ── Dynamic badge ── */}
//                       {badge !== null && (
//                         <span
//                           className="text-[10px] font-bold px-1.5 py-0.5 rounded-full relative z-10 min-w-[20px] text-center"
//                           style={isActive
//                             ? { background: '#E85A2B', color: '#fff' }
//                             : { background: '#F0EDE8', color: '#9B9590' }
//                           }
//                         >
//                           {badge}
//                         </span>
//                       )}

//                       {isActive && (
//                         <ChevronRight size={13} className="text-[#E85A2B] opacity-50 relative z-10" />
//                       )}
//                     </>
//                   )}

//                   {/* Collapsed tooltip badge (shown as dot if count > 0) */}
//                   {collapsed && badge !== null && Number(badge) > 0 && (
//                     <span
//                       className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
//                       style={{ background: '#E85A2B' }}
//                     />
//                   )}
//                 </button>
//               )
//             })}
//           </div>
//         ))}
//       </nav>
// <img className='W-9 h-8' src='/RLAI.jpeg'></img>
//       {/* ── Live status ── */}
//       {!collapsed && (
//         <div className="px-3 pb-3">
//           <div
//             className="rounded-2xl p-3 border"
//             style={{
//               background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
//               borderColor: '#BBF7D0',
//             }}
//           >




//             <div className="flex items-center gap-2 mb-0.5">
//               <div className="relative flex-shrink-0">
//                 <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-40" />
//                 <span className="w-2 h-2 rounded-full bg-green-500 block relative z-10" />
//               </div>
//               <span className="text-[12px] font-bold text-green-700">Bot is Live</span>
//             </div>
//             <div className="text-[10px] text-green-600/70 font-medium pl-4">
//               Karix API connected
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Collapse toggle ── */}
//       <button
//         onClick={() => setCollapsed(c => !c)}
//         className="h-10 flex items-center justify-center border-t border-[#EEEBE6] text-[#B0A9A1] hover:text-[#6B6560] hover:bg-[#F8F7F6] flex-shrink-0 transition-colors duration-150"
//       >
//         <ChevronRight
//           size={15}
//           className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`}
//         />
//       </button>
//     </aside>
//   )
// }

import React, { useEffect, useState } from 'react'
import {
  LayoutDashboard, MessageSquare, Users, PhoneCall, Store,
  BarChart2, Calendar, Settings, HelpCircle,
  ChevronRight, TrendingUp, BookOpen, CalendarClock,
} from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'
import { useUI } from '../context/UIContext'


// ── Nav config  (badge key = field name returned by /api/dashboard/counts)
const NAV = [
  {
    group: 'OVERVIEW',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'conversations', label: 'Conversations', icon: MessageSquare, badgeKey: 'conversations' },
      { id: 'leads', label: 'Leads', icon: PhoneCall, badgeKey: 'leads' },
      { id: 'dobRevisions', label: 'DOB Revisions', icon: CalendarClock, badgeKey: 'dobRevisions' },
    ],
  },
  {
    group: 'ANALYTICS',
    items: [
      { id: 'analytics', label: 'Analytics', icon: BarChart2 },
      { id: 'campaigns', label: 'Campaigns', icon: Calendar },
      { id: 'performance', label: 'Performance', icon: TrendingUp },
    ],
  },
  {
    group: 'MANAGEMENT',
    items: [
      { id: 'customers', label: 'Customers', icon: Users },
      { id: 'stores', label: 'Stores', icon: Store },
      { id: 'catalogue', label: 'Catalogue', icon: BookOpen },
    ],
  },
  {
    group: 'SYSTEM',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
      { id: 'help', label: 'Help', icon: HelpCircle },
    ],
  },
]

export default function SideBarOne({ active, setActive, collapsed, setCollapsed }) {

  const { setDateRange, setCustomStart, setCustomEnd } = useDashboard()
  const { setActiveFlow } = useUI()

  // ── counts fetched from backend ───────────────────────────────
  const [counts, setCounts] = useState({})

  useEffect(() => {
    let cancelled = false

    const fetchCounts = async () => {
      try {
        const data = await authFetch('/api/dashboard/counts')
        if (!cancelled) setCounts(data)
      } catch (err) {
        console.warn('SideBar counts fetch error:', err)
      }
    }

    fetchCounts()                                  // immediate first load
    const timer = setInterval(fetchCounts, 30_000) // refresh every 30 s

    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [])

  // ── badge display helper ──────────────────────────────────────
  const getBadge = (badgeKey) => {
    if (!badgeKey) return null
    const val = counts[badgeKey]
    if (val === undefined || val === null) return null
    return val > 999 ? '999+' : String(val)
  }

  // ─────────────────────────────────────────────────────────────
  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col z-40 overflow-hidden bg-white border-r border-[#EEEBE6]"
      style={{
        width: collapsed ? '68px' : '240px',
        transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '1px 0 12px rgba(0,0,0,0.04)',
      }}
    >
      {/* ── Logo ── */}
      <div className="h-16 flex items-center px-4 border-b border-[#EEEBE6] flex-shrink-0 gap-3 overflow-hidden pl-10">
        <img
          src="https://www.titan.co.in/on/demandware.static/Sites-Titan-Site/-/default/dw3e3fcc7b/images/header/titan-logo.svg"
          alt="Titan"
        />
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
        {NAV.map(section => (
          <div key={section.group} className="mb-1">
            {!collapsed && (
              <div className="text-[9px] font-bold tracking-[0.12em] text-[#C4BEB6] px-3 mb-1.5 mt-2 uppercase">
                {section.group}
              </div>
            )}

            {section.items.map(item => {
              const Icon = item.icon
              const isActive = active === item.id
              const badge = getBadge(item.badgeKey)

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActive(item.id)
                    setActiveFlow('bday_t10')
                    setDateRange('today')
                    setCustomStart('')
                    setCustomEnd('')
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                    mb-0.5 text-left group relative overflow-hidden
                    transition-all duration-200
                    ${isActive
                      ? 'text-[#E85A2B]'
                      : 'text-[#6B6560] hover:text-[#1A1713]'}
                  `}
                  style={isActive ? {
                    background: 'linear-gradient(135deg, #FEF0EB 0%, #FFF5F0 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 4px rgba(232,90,43,0.12)',
                  } : {}}
                  title={collapsed ? item.label : ''}
                >
                  {/* Hover bg */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-[#F8F7F6] opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-150" />
                  )}

                  {/* Active left bar */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                      style={{ background: 'linear-gradient(180deg, #E85A2B, #FF7040)' }}
                    />
                  )}

                  <Icon
                    size={17}
                    className={`flex-shrink-0 relative z-10 transition-colors duration-150 ${
                      isActive ? 'text-[#E85A2B]' : 'text-[#B0A9A1] group-hover:text-[#6B6560]'
                    }`}
                  />

                  {!collapsed && (
                    <>
                      <span className="text-[13px] font-medium flex-1 whitespace-nowrap relative z-10">
                        {item.label}
                      </span>

                      {/* ── Dynamic badge ── */}
                      {badge !== null && (
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full relative z-10 min-w-[20px] text-center"
                          style={isActive
                            ? { background: '#E85A2B', color: '#fff' }
                            : { background: '#F0EDE8', color: '#9B9590' }
                          }
                        >
                          {badge}
                        </span>
                      )}

                      {isActive && (
                        <ChevronRight size={13} className="text-[#E85A2B] opacity-50 relative z-10" />
                      )}
                    </>
                  )}

                  {/* Collapsed tooltip badge (dot if count > 0) */}
                  {collapsed && badge !== null && Number(badge) > 0 && (
                    <span
                      className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                      style={{ background: '#E85A2B' }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

{/* ── Powered By RLAI ── */}
<div className="border-t border-[#EEEBE6] flex-shrink-0">
  {!collapsed ? (
    <div className="flex flex-col items-center gap-1.5 px-4 py-3">
      <span style={{
        fontSize: '8px',
        fontWeight: 600,
        letterSpacing: '0.16em',
        color: '#C4BEB6',
        textTransform: 'uppercase',
      }}>
        Powered by
      </span>
      <img
        src="/RLAI.jpeg"
        alt="RLAI"
        style={{
          height: '40px',
          width: 'auto',
          maxWidth: '160px',
          borderRadius: '10px',
          animation: 'rlaiGlow 2.8s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes rlaiGlow {
          0%, 100% {
            filter: drop-shadow(0 0 4px rgba(99,102,241,0.35))
                    drop-shadow(0 0 10px rgba(99,102,241,0.15));
          }
          50% {
            filter: drop-shadow(0 0 8px rgba(99,102,241,0.75))
                    drop-shadow(0 0 20px rgba(99,102,241,0.35));
          }
        }
      `}</style>
    </div>
  ) : (
    <div className="flex justify-center py-2.5">
      <img
        src="/RLAI.jpeg"
        alt="RLAI"
        style={{
          height: '32px',
          width: '42px',
          objectFit: 'cover',
          borderRadius: '7px',
          filter: 'drop-shadow(0 0 6px rgba(99,102,241,0.6))',
        }}
      />
    </div>
  )}
</div>

      {/* ── Live status ── */}
      {/* {!collapsed && (
        <div className="px-3 pb-3">
          <div
            className="rounded-2xl p-3 border"
            style={{
              background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
              borderColor: '#BBF7D0',
            }}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <div className="relative flex-shrink-0">
                <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-40" />
                <span className="w-2 h-2 rounded-full bg-green-500 block relative z-10" />
              </div>
              <span className="text-[12px] font-bold text-green-700">Bot is Live</span>
            </div>
            <div className="text-[10px] text-green-600/70 font-medium pl-4">
              Karix API connected
            </div>
          </div>
        </div>
      )} */}

      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="h-10 flex items-center justify-center border-t border-[#EEEBE6] text-[#B0A9A1] hover:text-[#6B6560] hover:bg-[#F8F7F6] flex-shrink-0 transition-colors duration-150"
      >
        <ChevronRight
          size={15}
          className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`}
        />
      </button>
    </aside>
  )
}