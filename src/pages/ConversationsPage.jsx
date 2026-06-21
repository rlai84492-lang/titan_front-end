// // import React, { useState, useCallback, useEffect, useRef } from 'react'
// // import { useDashboard } from '../context/DashboardContext'
// // import { useUI }        from '../context/UIContext'
// // import { fetchSessions } from '../api/dashboardApi'
// // import CardOne          from '../Components/CardOne'
// // import MetricCardOne    from '../Components/MetricCardOne'
// // import ConversationsTableOne from '../Components/ConversationsTableOne'

// // // ── Page size for server-side pagination ─────────────────────
// // const PAGE_SIZE = 100

// // // ── Flow config for the loader animation ──────────────────────
// // const FLOW_CONFIG = {
// //   bday_t10:  { label: 'Birthday T-10',     emoji: '🎂', hex: '#3B82F6', pulse: '#DBEAFE' },
// //   bday_t0:   { label: 'Birthday T-Day',    emoji: '🎁', hex: '#EF4444', pulse: '#FEE2E2' },
// //   anniv_t10: { label: 'Anniversary T-10',  emoji: '💍', hex: '#A855F7', pulse: '#F3E8FF' },
// //   anniv_t0:  { label: 'Anniversary T-Day', emoji: '🌹', hex: '#EC4899', pulse: '#FCE7F3' },
// // }

// // // ── Premium Loader ────────────────────────────────────────────
// // function PremiumLoader({ activeFlow }) {
// //   const cfg = FLOW_CONFIG[activeFlow] || FLOW_CONFIG.bday_t10
// //   return (
// //     <div className="min-h-[60vh] flex flex-col items-center justify-center select-none">
// //       <div className="relative flex items-center justify-center mb-8">
// //         <div className="absolute w-32 h-32 rounded-full border border-dashed"
// //           style={{ borderColor: cfg.hex + '20', animation: 'spin 4s linear infinite' }} />
// //         <div className="absolute w-24 h-24 rounded-full border-[2.5px] border-transparent"
// //           style={{ borderTopColor: cfg.hex, borderRightColor: cfg.hex + '30', animation: 'spin 1.1s linear infinite' }} />
// //         <div className="absolute w-16 h-16 rounded-full border-2 border-transparent"
// //           style={{ borderBottomColor: cfg.hex, borderLeftColor: cfg.hex + '40', animation: 'spin 0.75s linear infinite reverse' }} />
// //         <div className="absolute w-12 h-12 rounded-full"
// //           style={{ background: cfg.pulse, animation: 'pulsate 1.6s ease-in-out infinite' }} />
// //         <div className="relative z-10 text-2xl" style={{ animation: 'pulsate 1.6s ease-in-out infinite' }}>
// //           {cfg.emoji}
// //         </div>
// //       </div>
// //       <div className="flex items-center gap-2 mb-1.5">
// //         <span className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: cfg.hex }}>TITAN WORLD</span>
// //         <span className="w-1 h-1 rounded-full" style={{ background: cfg.hex + '80' }} />
// //         <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">Conversations</span>
// //       </div>
// //       <div className="text-sm font-bold mb-1" style={{ color: cfg.hex }}>{cfg.label}</div>
// //       <div className="text-[10px] text-gray-400 mb-6">Loading conversations…</div>
// //       <div className="flex items-center gap-1.5 mb-8">
// //         {[0, 1, 2].map(i => (
// //           <div key={i} className="w-2 h-2 rounded-full"
// //             style={{ background: cfg.hex, animation: `bounce 1.2s ease-in-out ${i * 0.18}s infinite` }} />
// //         ))}
// //       </div>
// //       <div className="w-full max-w-3xl px-4 space-y-3">
// //         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
// //           {[...Array(4)].map((_, i) => (
// //             <div key={i} className="h-16 rounded-xl"
// //               style={{ background: `linear-gradient(90deg, #F5F3F0 25%, ${cfg.pulse} 50%, #F5F3F0 75%)`, backgroundSize: '300% 100%', animation: `shimmer 1.8s ease-in-out ${i * 0.08}s infinite` }} />
// //           ))}
// //         </div>
// //         <div className="h-48 rounded-xl"
// //           style={{ background: `linear-gradient(90deg, #F5F3F0 25%, ${cfg.pulse} 50%, #F5F3F0 75%)`, backgroundSize: '300% 100%', animation: 'shimmer 1.8s ease-in-out 0.3s infinite' }} />
// //       </div>
// //       <style>{`
// //         @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
// //         @keyframes pulsate { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.92)} }
// //         @keyframes bounce  { 0%,100%{transform:translateY(0);opacity:0.35} 50%{transform:translateY(-6px);opacity:1} }
// //         @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
// //       `}</style>
// //     </div>
// //   )
// // }

// // // ════════════════════════════════════════════════════════════════
// // // ConversationsPage — server-side paginated, no 500-row cap
// // // ════════════════════════════════════════════════════════════════
// // export default function ConversationsPage() {
// //   const { dateRange, customStart, customEnd } = useDashboard()
// //   const { activeFlow }                        = useUI()

// //   // ── Server data ───────────────────────────────────────────────
// //   const [sessions,      setSessions]      = useState([])
// //   const [page,          setPage]          = useState(0)
// //   const [totalSessions, setTotalSessions] = useState(0)
// //   const [totalPages,    setTotalPages]    = useState(1)

// //   // ── Loading states ────────────────────────────────────────────
// //   const [initialLoading, setInitialLoading] = useState(true)
// //   const [pageLoading,    setPageLoading]    = useState(false)
// //   const [error,          setError]          = useState(null)

// //   // ── Filter state (sent to server) ─────────────────────────────
// //   const [collection,  setCollection]  = useState('')
// //   const [brand,       setBrand]       = useState('')
// //   const [step,        setStep]        = useState('')
// //   const [search,      setSearch]      = useState('')
// //   const [sortField,   setSortField]   = useState('lastActivity')
// //   const [sortDir,     setSortDir]     = useState('desc')

// //   const mountedRef    = useRef(true)
// //   // ★ FIX: requestIdRef prevents stale fetch responses from overwriting newer results.
// //   //        Every fetch increments this counter. A response is only applied if its
// //   //        id still matches — so an older slow response can't overwrite a newer one.
// //   const requestIdRef  = useRef(0)

// //   useEffect(() => {
// //     mountedRef.current = true
// //     return () => { mountedRef.current = false }
// //   }, [])

// //   // ── Core fetch for filter / sort / page changes ───────────────
// //   // ★ FIX 1: Always uses pageLoading (shimmer) — NEVER setInitialLoading.
// //   //           This means the table stays mounted and filter dropdowns are
// //   //           never wiped when the user selects a filter.
// //   // ★ FIX 2: Removed sessions.length from deps — it was causing loadPage to
// //   //           recreate after every data fetch, which rippled into stale closures.
// //   // ★ FIX 3: All filter values are passed explicitly via opts so there is no
// //   //           stale-closure risk on the API call arguments.
// //   const loadPage = useCallback(async (targetPage, opts = {}) => {
// //     const reqId = ++requestIdRef.current  // cancel any in-flight older request

// //     setPageLoading(true)
// //     setError(null)

// //     try {
// //       const data = await fetchSessions(
// //         opts.flow        ?? activeFlow,
// //         opts.dateRange   ?? dateRange,
// //         opts.customStart ?? customStart,
// //         opts.customEnd   ?? customEnd,
// //         opts.collection  !== undefined ? opts.collection : collection,
// //         opts.brand       !== undefined ? opts.brand      : brand,
// //         opts.step        !== undefined ? opts.step       : step,
// //         opts.search      !== undefined ? opts.search     : search,
// //         opts.sortField   ?? sortField,
// //         opts.sortDir     ?? sortDir,
// //         targetPage,
// //         PAGE_SIZE
// //       )

// //       // Discard stale responses
// //       if (requestIdRef.current !== reqId || !mountedRef.current) return

// //       setSessions(data.sessions)
// //       setTotalSessions(data.totalSessions)
// //       setTotalPages(data.totalPages)
// //       setPage(targetPage)
// //     } catch (err) {
// //       if (requestIdRef.current === reqId && mountedRef.current) setError(err.message)
// //     } finally {
// //       // ★ FIX: Do NOT touch initialLoading here — only the flow/date effect controls it.
// //       if (requestIdRef.current === reqId && mountedRef.current) {
// //         setPageLoading(false)
// //       }
// //     }
// //   }, [activeFlow, dateRange, customStart, customEnd, collection, brand, step, search, sortField, sortDir])
// //   // ★ sessions.length intentionally NOT in deps

// //   // ── Reload when flow or date range changes ────────────────────
// //   // ★ FIX: Single effect — resets state AND fetches in one go.
// //   //         The old two-effect pattern had a race where the second effect
// //   //         read a stale `initialLoading` value and skipped the fetch entirely,
// //   //         causing the "stuck loading" bug on 7-day / custom filters.
// //   useEffect(() => {
// //     const reqId = ++requestIdRef.current  // cancel any in-flight older request

// //     // Reset all filters and show full loader
// //     setCollection('')
// //     setBrand('')
// //     setStep('')
// //     setSearch('')
// //     setSortField('lastActivity')
// //     setSortDir('desc')
// //     setPage(0)
// //     setSessions([])
// //     setInitialLoading(true)
// //     setError(null)

// //     // Fetch directly — no stale initialLoading read needed
// //     fetchSessions(
// //       activeFlow, dateRange, customStart, customEnd,
// //       '', '', '', '', 'lastActivity', 'desc', 0, PAGE_SIZE
// //     ).then(data => {
// //       if (requestIdRef.current !== reqId || !mountedRef.current) return
// //       setSessions(data.sessions)
// //       setTotalSessions(data.totalSessions)
// //       setTotalPages(data.totalPages)
// //       setPage(0)
// //       setInitialLoading(false)
// //     }).catch(err => {
// //       if (requestIdRef.current !== reqId || !mountedRef.current) return
// //       setError(err.message)
// //       setInitialLoading(false)
// //     })
// //   }, [activeFlow, dateRange, customStart, customEnd]) // eslint-disable-line react-hooks/exhaustive-deps

// //   // ── Filter change handler (called by ConversationsTableOne) ───
// //   const handleFilterChange = useCallback((newFilters) => {
// //     const nextCollection = newFilters.collection !== undefined ? newFilters.collection : collection
// //     const nextBrand      = newFilters.brand      !== undefined ? newFilters.brand      : brand
// //     const nextStep       = newFilters.step       !== undefined ? newFilters.step       : step
// //     const nextSearch     = newFilters.search     !== undefined ? newFilters.search     : search

// //     setCollection(nextCollection)
// //     setBrand(nextBrand)
// //     setStep(nextStep)
// //     setSearch(nextSearch)

// //     // ★ FIX: Always pass dateRange/customStart/customEnd explicitly so loadPage
// //     //         never falls back to a stale closure value.
// //     //         Without this, clicking a filter after switching to "30 Days" would
// //     //         use the old "today" dateRange from loadPage's previous closure → wrong data.
// //     loadPage(0, {
// //       collection:  nextCollection,
// //       brand:       nextBrand,
// //       step:        nextStep,
// //       search:      nextSearch,
// //       sortField,
// //       sortDir,
// //       dateRange,
// //       customStart,
// //       customEnd,
// //     })
// //   }, [collection, brand, step, search, sortField, sortDir, loadPage, dateRange, customStart, customEnd])

// //   // ── Sort change handler ────────────────────────────────────────
// //   const handleSort = useCallback((field, dir) => {
// //     setSortField(field)
// //     setSortDir(dir)
// //     loadPage(0, { collection, brand, step, search, sortField: field, sortDir: dir, dateRange, customStart, customEnd })
// //   }, [collection, brand, step, search, loadPage, dateRange, customStart, customEnd])

// //   // ── Page change handler ────────────────────────────────────────
// //   const handlePageChange = useCallback((newPage) => {
// //     loadPage(newPage, { collection, brand, step, search, sortField, sortDir, dateRange, customStart, customEnd })
// //     window.scrollTo({ top: 0, behavior: 'smooth' })
// //   }, [loadPage, collection, brand, step, search, sortField, sortDir, dateRange, customStart, customEnd])

// //   // ── Metric tiles ───────────────────────────────────────────────
// //   const completed = sessions.filter(s => s.currentStep?.includes('COMPLETED')).length

// //   if (initialLoading) return <PremiumLoader activeFlow={activeFlow} />

// //   if (error) {
// //     return (
// //       <div className="flex flex-col items-center justify-center py-20 text-center">
// //         <div className="text-4xl mb-4">⚠️</div>
// //         <div className="text-[14px] font-semibold text-red-500 mb-2">Failed to load conversations</div>
// //         <div className="text-[12px] text-[#B0A9A1] mb-4">{error}</div>
// //         <button
// //           onClick={() => loadPage(0, { collection: '', brand: '', step: '', search: '', sortField: 'lastActivity', sortDir: 'desc' })}
// //           className="px-4 py-2 rounded-xl text-[12px] font-bold text-white"
// //           style={{ background: '#E85A2B' }}>
// //           Retry
// //         </button>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="space-y-5">

// //       {/* ── Metric tiles ── */}
// //       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
// //         {[
// //           { icon: '💬', label: 'Total Sessions', value: totalSessions, accent: 'blue'   },
// //           { icon: '✅', label: 'Completed',      value: completed,     accent: 'orange' },
// //         ].map((m, i) => <MetricCardOne key={m.label} {...m} delay={i * 50} />)}
// //       </div>

// //       {/* ── Main conversations table ── */}
// //       <CardOne
// //         title="All Conversations"
// //         subtitle={`Showing ${totalSessions.toLocaleString()} total sessions — filtered to current flow`}
// //         icon="💬"
// //       >
// //         <ConversationsTableOne
// //           sessions={sessions}
// //           totalSessions={totalSessions}
// //           page={page}
// //           totalPages={totalPages}
// //           pageSize={PAGE_SIZE}
// //           pageLoading={pageLoading}
// //           sortField={sortField}
// //           sortDir={sortDir}
// //           activeFlow={activeFlow}
// //           dateRange={dateRange}
// //           customStart={customStart}
// //           customEnd={customEnd}
// //           collection={collection}
// //           brand={brand}
// //           step={step}
// //           search={search}
// //           onFilterChange={handleFilterChange}
// //           onSort={handleSort}
// //           onPageChange={handlePageChange}
// //         />
// //       </CardOne>

// //     </div>
// //   )
// // }

// import React, { useState, useCallback, useEffect, useRef } from 'react'
// import { useDashboard } from '../context/DashboardContext'
// import { useUI }        from '../context/UIContext'
// import { fetchSessions } from '../api/dashboardApi'
// import CardOne          from '../Components/CardOne'
// import MetricCardOne    from '../Components/MetricCardOne'
// import ConversationsTableOne from '../Components/ConversationsTableOne'

// // ── Page size for server-side pagination ─────────────────────
// const PAGE_SIZE = 100

// // ── Flow config for the loader animation ──────────────────────
// const FLOW_CONFIG = {
//   bday_t10:  { label: 'Birthday T-10',     emoji: '🎂', hex: '#3B82F6', pulse: '#DBEAFE' },
//   bday_t0:   { label: 'Birthday T-Day',    emoji: '🎁', hex: '#EF4444', pulse: '#FEE2E2' },
//   anniv_t10: { label: 'Anniversary T-10',  emoji: '💍', hex: '#A855F7', pulse: '#F3E8FF' },
//   anniv_t0:  { label: 'Anniversary T-Day', emoji: '🌹', hex: '#EC4899', pulse: '#FCE7F3' },
// }

// // ── Premium Loader ────────────────────────────────────────────
// function PremiumLoader({ activeFlow }) {
//   const cfg = FLOW_CONFIG[activeFlow] || FLOW_CONFIG.bday_t10
//   return (
//     <div className="min-h-[60vh] flex flex-col items-center justify-center select-none">
//       <div className="relative flex items-center justify-center mb-8">
//         <div className="absolute w-32 h-32 rounded-full border border-dashed"
//           style={{ borderColor: cfg.hex + '20', animation: 'spin 4s linear infinite' }} />
//         <div className="absolute w-24 h-24 rounded-full border-[2.5px] border-transparent"
//           style={{ borderTopColor: cfg.hex, borderRightColor: cfg.hex + '30', animation: 'spin 1.1s linear infinite' }} />
//         <div className="absolute w-16 h-16 rounded-full border-2 border-transparent"
//           style={{ borderBottomColor: cfg.hex, borderLeftColor: cfg.hex + '40', animation: 'spin 0.75s linear infinite reverse' }} />
//         <div className="absolute w-12 h-12 rounded-full"
//           style={{ background: cfg.pulse, animation: 'pulsate 1.6s ease-in-out infinite' }} />
//         <div className="relative z-10 text-2xl" style={{ animation: 'pulsate 1.6s ease-in-out infinite' }}>
//           {cfg.emoji}
//         </div>
//       </div>
//       <div className="flex items-center gap-2 mb-1.5">
//         <span className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: cfg.hex }}>TITAN WORLD</span>
//         <span className="w-1 h-1 rounded-full" style={{ background: cfg.hex + '80' }} />
//         <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">Conversations</span>
//       </div>
//       <div className="text-sm font-bold mb-1" style={{ color: cfg.hex }}>{cfg.label}</div>
//       <div className="text-[10px] text-gray-400 mb-6">Loading conversations…</div>
//       <div className="flex items-center gap-1.5 mb-8">
//         {[0, 1, 2].map(i => (
//           <div key={i} className="w-2 h-2 rounded-full"
//             style={{ background: cfg.hex, animation: `bounce 1.2s ease-in-out ${i * 0.18}s infinite` }} />
//         ))}
//       </div>
//       <div className="w-full max-w-3xl px-4 space-y-3">
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
//           {[...Array(4)].map((_, i) => (
//             <div key={i} className="h-16 rounded-xl"
//               style={{ background: `linear-gradient(90deg, #F5F3F0 25%, ${cfg.pulse} 50%, #F5F3F0 75%)`, backgroundSize: '300% 100%', animation: `shimmer 1.8s ease-in-out ${i * 0.08}s infinite` }} />
//           ))}
//         </div>
//         <div className="h-48 rounded-xl"
//           style={{ background: `linear-gradient(90deg, #F5F3F0 25%, ${cfg.pulse} 50%, #F5F3F0 75%)`, backgroundSize: '300% 100%', animation: 'shimmer 1.8s ease-in-out 0.3s infinite' }} />
//       </div>
//       <style>{`
//         @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
//         @keyframes pulsate { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.92)} }
//         @keyframes bounce  { 0%,100%{transform:translateY(0);opacity:0.35} 50%{transform:translateY(-6px);opacity:1} }
//         @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
//       `}</style>
//     </div>
//   )
// }

// // ════════════════════════════════════════════════════════════════
// // ConversationsPage — server-side paginated, no 500-row cap
// // ════════════════════════════════════════════════════════════════
// export default function ConversationsPage() {
//   // ── "sessions" yahan se FULL list hai (context se) — sirf
//   //    metric-tiles calculation ke liye use hoga (Overview se
//   //    yahan move kiye gaye 6 conversation-funnel tiles).
//   //    Table display ABHI BHI server-paginated "sessions" state
//   //    use karegi (neeche), dono alag hain isliye naam alag rakha.
//   const { dateRange, customStart, customEnd, sessions: allSessions } = useDashboard()
//   const { activeFlow }                        = useUI()

//   // ── Server data (table display ke liye — paginated) ────────────
//   const [sessions,      setSessions]      = useState([])
//   const [page,          setPage]          = useState(0)
//   const [totalSessions, setTotalSessions] = useState(0)
//   const [totalPages,    setTotalPages]    = useState(1)

//   // ── Loading states ────────────────────────────────────────────
//   const [initialLoading, setInitialLoading] = useState(true)
//   const [pageLoading,    setPageLoading]    = useState(false)
//   const [error,          setError]          = useState(null)

//   // ── Filter state (sent to server) ─────────────────────────────
//   const [collection,  setCollection]  = useState('')
//   const [brand,       setBrand]       = useState('')
//   const [step,        setStep]        = useState('')
//   const [search,      setSearch]      = useState('')
//   const [sortField,   setSortField]   = useState('lastActivity')
//   const [sortDir,     setSortDir]     = useState('desc')

//   const mountedRef    = useRef(true)
//   // ★ FIX: requestIdRef prevents stale fetch responses from overwriting newer results.
//   //        Every fetch increments this counter. A response is only applied if its
//   //        id still matches — so an older slow response can't overwrite a newer one.
//   const requestIdRef  = useRef(0)

//   useEffect(() => {
//     mountedRef.current = true
//     return () => { mountedRef.current = false }
//   }, [])

//   // ── Core fetch for filter / sort / page changes ───────────────
//   // ★ FIX 1: Always uses pageLoading (shimmer) — NEVER setInitialLoading.
//   //           This means the table stays mounted and filter dropdowns are
//   //           never wiped when the user selects a filter.
//   // ★ FIX 2: Removed sessions.length from deps — it was causing loadPage to
//   //           recreate after every data fetch, which rippled into stale closures.
//   // ★ FIX 3: All filter values are passed explicitly via opts so there is no
//   //           stale-closure risk on the API call arguments.
//   const loadPage = useCallback(async (targetPage, opts = {}) => {
//     const reqId = ++requestIdRef.current  // cancel any in-flight older request

//     setPageLoading(true)
//     setError(null)

//     try {
//       const data = await fetchSessions(
//         opts.flow        ?? activeFlow,
//         opts.dateRange   ?? dateRange,
//         opts.customStart ?? customStart,
//         opts.customEnd   ?? customEnd,
//         opts.collection  !== undefined ? opts.collection : collection,
//         opts.brand       !== undefined ? opts.brand      : brand,
//         opts.step        !== undefined ? opts.step       : step,
//         opts.search      !== undefined ? opts.search     : search,
//         opts.sortField   ?? sortField,
//         opts.sortDir     ?? sortDir,
//         targetPage,
//         PAGE_SIZE
//       )

//       // Discard stale responses
//       if (requestIdRef.current !== reqId || !mountedRef.current) return

//       setSessions(data.sessions)
//       setTotalSessions(data.totalSessions)
//       setTotalPages(data.totalPages)
//       setPage(targetPage)
//     } catch (err) {
//       if (requestIdRef.current === reqId && mountedRef.current) setError(err.message)
//     } finally {
//       // ★ FIX: Do NOT touch initialLoading here — only the flow/date effect controls it.
//       if (requestIdRef.current === reqId && mountedRef.current) {
//         setPageLoading(false)
//       }
//     }
//   }, [activeFlow, dateRange, customStart, customEnd, collection, brand, step, search, sortField, sortDir])
//   // ★ sessions.length intentionally NOT in deps

//   // ── Reload when flow or date range changes ────────────────────
//   // ★ FIX: Single effect — resets state AND fetches in one go.
//   //         The old two-effect pattern had a race where the second effect
//   //         read a stale `initialLoading` value and skipped the fetch entirely,
//   //         causing the "stuck loading" bug on 7-day / custom filters.
//   useEffect(() => {
//     const reqId = ++requestIdRef.current  // cancel any in-flight older request

//     // Reset all filters and show full loader
//     setCollection('')
//     setBrand('')
//     setStep('')
//     setSearch('')
//     setSortField('lastActivity')
//     setSortDir('desc')
//     setPage(0)
//     setSessions([])
//     setInitialLoading(true)
//     setError(null)

//     // Fetch directly — no stale initialLoading read needed
//     fetchSessions(
//       activeFlow, dateRange, customStart, customEnd,
//       '', '', '', '', 'lastActivity', 'desc', 0, PAGE_SIZE
//     ).then(data => {
//       if (requestIdRef.current !== reqId || !mountedRef.current) return
//       setSessions(data.sessions)
//       setTotalSessions(data.totalSessions)
//       setTotalPages(data.totalPages)
//       setPage(0)
//       setInitialLoading(false)
//     }).catch(err => {
//       if (requestIdRef.current !== reqId || !mountedRef.current) return
//       setError(err.message)
//       setInitialLoading(false)
//     })
//   }, [activeFlow, dateRange, customStart, customEnd]) // eslint-disable-line react-hooks/exhaustive-deps

//   // ── Filter change handler (called by ConversationsTableOne) ───
//   const handleFilterChange = useCallback((newFilters) => {
//     const nextCollection = newFilters.collection !== undefined ? newFilters.collection : collection
//     const nextBrand      = newFilters.brand      !== undefined ? newFilters.brand      : brand
//     const nextStep       = newFilters.step       !== undefined ? newFilters.step       : step
//     const nextSearch     = newFilters.search     !== undefined ? newFilters.search     : search

//     setCollection(nextCollection)
//     setBrand(nextBrand)
//     setStep(nextStep)
//     setSearch(nextSearch)

//     // ★ FIX: Always pass dateRange/customStart/customEnd explicitly so loadPage
//     //         never falls back to a stale closure value.
//     //         Without this, clicking a filter after switching to "30 Days" would
//     //         use the old "today" dateRange from loadPage's previous closure → wrong data.
//     loadPage(0, {
//       collection:  nextCollection,
//       brand:       nextBrand,
//       step:        nextStep,
//       search:      nextSearch,
//       sortField,
//       sortDir,
//       dateRange,
//       customStart,
//       customEnd,
//     })
//   }, [collection, brand, step, search, sortField, sortDir, loadPage, dateRange, customStart, customEnd])

//   // ── Sort change handler ────────────────────────────────────────
//   const handleSort = useCallback((field, dir) => {
//     setSortField(field)
//     setSortDir(dir)
//     loadPage(0, { collection, brand, step, search, sortField: field, sortDir: dir, dateRange, customStart, customEnd })
//   }, [collection, brand, step, search, loadPage, dateRange, customStart, customEnd])

//   // ── Page change handler ────────────────────────────────────────
//   const handlePageChange = useCallback((newPage) => {
//     loadPage(newPage, { collection, brand, step, search, sortField, sortDir, dateRange, customStart, customEnd })
//     window.scrollTo({ top: 0, behavior: 'smooth' })
//   }, [loadPage, collection, brand, step, search, sortField, sortDir, dateRange, customStart, customEnd])

//   if (initialLoading) return <PremiumLoader activeFlow={activeFlow} />

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20 text-center">
//         <div className="text-4xl mb-4">⚠️</div>
//         <div className="text-[14px] font-semibold text-red-500 mb-2">Failed to load conversations</div>
//         <div className="text-[12px] text-[#B0A9A1] mb-4">{error}</div>
//         <button
//           onClick={() => loadPage(0, { collection: '', brand: '', step: '', search: '', sortField: 'lastActivity', sortDir: 'desc' })}
//           className="px-4 py-2 rounded-xl text-[12px] font-bold text-white"
//           style={{ background: '#E85A2B' }}>
//           Retry
//         </button>
//       </div>
//     )
//   }

//   const isBday = activeFlow?.includes('bday')

//   // ── Completed (current paginated page se — jaisa pehle tha) ────
//   const completed = sessions.filter(s => s.currentStep?.includes('COMPLETED')).length

//   // ════════════════════════════════════════════════════════════
//   // ── Conversation funnel metrics — OverviewPage se yahan move
//   // kiye gaye. FULL session list (allSessions, context se) use
//   // karte hain — paginated "sessions" (table display ke liye)
//   // se nahi, taaki numbers TOTAL ke hisaab se sahi aayein,
//   // sirf current page ka subset nahi.
//   // ════════════════════════════════════════════════════════════
//   const conv = {
//     confirmed: allSessions.filter(s =>
//       s.currentStep?.includes('OPENER_SENT') ||
//       s.currentStep?.includes('GENDER_SELECTION_SENT') ||
//       s.currentStep?.includes('BRAND_CAROUSEL') ||
//       s.currentStep?.includes('CATALOGUE_SENT') ||
//       s.currentStep?.includes('OFFER_SENT') ||
//       s.currentStep?.includes('COMPLETED')
//     ).length,
//     enteredDiscovery: allSessions.filter(s => s.currentStep?.includes('OPENER_SENT')).length,
//     carouselReached:  allSessions.filter(s => s.currentStep?.includes('BRAND_CAROUSEL')).length,
//     catalogueSent:    allSessions.filter(s => s.currentStep?.includes('CATALOGUE_SENT')).length,
//     offerTapped:      allSessions.filter(s => s.currentStep?.includes('OFFER_SENT')).length,
//     reengagement:     allSessions.filter(s => s.currentStep?.includes('COMPLETED')).length,
//   }

//   return (
//     <div className="space-y-5">

//       {/* ── Metric tiles — Total Sessions + Completed (existing) ── */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//         {[
//           { icon: '💬', label: 'Total Sessions', value: totalSessions, accent: 'blue'   },
//           { icon: '✅', label: 'Completed',      value: completed,     accent: 'orange' },
//         ].map((m, i) => <MetricCardOne key={m.label} {...m} delay={i * 50} />)}
//       </div>

//       {/* ── Conversation Funnel Metrics — moved from OverviewPage ── */}
//       <div>
//         <h2 className="font-sora font-semibold text-[11px] text-[#A49D94] uppercase tracking-widest mb-3">
//           Conversation Metrics
//         </h2>
//         <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
//           {[
//             { label: isBday ? 'Birthday Confirmed' : 'Anniversary Confirmed',  value: conv.confirmed,                color: '#E85A2B', bg: '#FEF0EB' },
//             { label: 'Entered Discovery',                                       value: conv.enteredDiscovery,         color: '#7F77DD', bg: '#EEEDFE' },
//             { label: 'Carousel Reached',                                        value: conv.carouselReached,          color: '#1D9E75', bg: '#E1F5EE' },
//             { label: 'Catalogue Sent',                                          value: conv.catalogueSent,            color: '#0F6E56', bg: '#E0F2F1' },
//             { label: isBday ? 'Birthday Offer' : 'Anniv Offer',                value: conv.offerTapped,              color: '#E09A1A', bg: '#FEF3CD' },
//             { label: 'Re-engagement',                                           value: conv.reengagement,             color: '#A49D94', bg: '#F5F3F0' },
//           ].map(c => (
//             <div key={c.label} className="rounded-xl p-3 border" style={{ background: c.bg, borderColor: c.color + '22' }}>
//               <div className="font-sora font-extrabold text-xl" style={{ color: c.color }}>{c.value}</div>
//               <div className="text-[9px] font-semibold mt-1 leading-tight" style={{ color: c.color, opacity: 0.8 }}>{c.label}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── Main conversations table ── */}
//       <CardOne
//         title="All Conversations"
//         subtitle={`Showing ${totalSessions.toLocaleString()} total sessions — filtered to current flow`}
//         icon="💬"
//       >
//         <ConversationsTableOne
//           sessions={sessions}
//           totalSessions={totalSessions}
//           page={page}
//           totalPages={totalPages}
//           pageSize={PAGE_SIZE}
//           pageLoading={pageLoading}
//           sortField={sortField}
//           sortDir={sortDir}
//           activeFlow={activeFlow}
//           dateRange={dateRange}
//           customStart={customStart}
//           customEnd={customEnd}
//           collection={collection}
//           brand={brand}
//           step={step}
//           search={search}
//           onFilterChange={handleFilterChange}
//           onSort={handleSort}
//           onPageChange={handlePageChange}
//         />
//       </CardOne>

//     </div>
//   )
// }

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useDashboard } from '../context/DashboardContext'
import { useUI }        from '../context/UIContext'
import { fetchSessions } from '../api/dashboardApi'
import CardOne          from '../Components/CardOne'
import MetricCardOne    from '../Components/MetricCardOne'
import ConversationsTableOne from '../Components/ConversationsTableOne'

// ── Page size for server-side pagination ─────────────────────
const PAGE_SIZE = 100

// ── Flow config for the loader animation ──────────────────────
const FLOW_CONFIG = {
  bday_t10:  { label: 'Birthday T-10',     emoji: '🎂', hex: '#3B82F6', pulse: '#DBEAFE' },
  bday_t0:   { label: 'Birthday T-Day',    emoji: '🎁', hex: '#EF4444', pulse: '#FEE2E2' },
  anniv_t10: { label: 'Anniversary T-10',  emoji: '💍', hex: '#A855F7', pulse: '#F3E8FF' },
  anniv_t0:  { label: 'Anniversary T-Day', emoji: '🌹', hex: '#EC4899', pulse: '#FCE7F3' },
}

// ── Premium Loader ────────────────────────────────────────────
function PremiumLoader({ activeFlow }) {
  const cfg = FLOW_CONFIG[activeFlow] || FLOW_CONFIG.bday_t10
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center select-none">
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-32 h-32 rounded-full border border-dashed"
          style={{ borderColor: cfg.hex + '20', animation: 'spin 4s linear infinite' }} />
        <div className="absolute w-24 h-24 rounded-full border-[2.5px] border-transparent"
          style={{ borderTopColor: cfg.hex, borderRightColor: cfg.hex + '30', animation: 'spin 1.1s linear infinite' }} />
        <div className="absolute w-16 h-16 rounded-full border-2 border-transparent"
          style={{ borderBottomColor: cfg.hex, borderLeftColor: cfg.hex + '40', animation: 'spin 0.75s linear infinite reverse' }} />
        <div className="absolute w-12 h-12 rounded-full"
          style={{ background: cfg.pulse, animation: 'pulsate 1.6s ease-in-out infinite' }} />
        <div className="relative z-10 text-2xl" style={{ animation: 'pulsate 1.6s ease-in-out infinite' }}>
          {cfg.emoji}
        </div>
      </div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: cfg.hex }}>TITAN WORLD</span>
        <span className="w-1 h-1 rounded-full" style={{ background: cfg.hex + '80' }} />
        <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">Conversations</span>
      </div>
      <div className="text-sm font-bold mb-1" style={{ color: cfg.hex }}>{cfg.label}</div>
      <div className="text-[10px] text-gray-400 mb-6">Loading conversations…</div>
      <div className="flex items-center gap-1.5 mb-8">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full"
            style={{ background: cfg.hex, animation: `bounce 1.2s ease-in-out ${i * 0.18}s infinite` }} />
        ))}
      </div>
      <div className="w-full max-w-3xl px-4 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl"
              style={{ background: `linear-gradient(90deg, #F5F3F0 25%, ${cfg.pulse} 50%, #F5F3F0 75%)`, backgroundSize: '300% 100%', animation: `shimmer 1.8s ease-in-out ${i * 0.08}s infinite` }} />
          ))}
        </div>
        <div className="h-48 rounded-xl"
          style={{ background: `linear-gradient(90deg, #F5F3F0 25%, ${cfg.pulse} 50%, #F5F3F0 75%)`, backgroundSize: '300% 100%', animation: 'shimmer 1.8s ease-in-out 0.3s infinite' }} />
      </div>
      <style>{`
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulsate { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.92)} }
        @keyframes bounce  { 0%,100%{transform:translateY(0);opacity:0.35} 50%{transform:translateY(-6px);opacity:1} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// ConversationsPage — server-side paginated, no 500-row cap
// ════════════════════════════════════════════════════════════════
export default function ConversationsPage() {
  // ── "sessions" yahan se FULL list hai (context se) — sirf
  //    metric-tiles calculation ke liye use hoga (Overview se
  //    yahan move kiye gaye 6 conversation-funnel tiles).
  //    Table display ABHI BHI server-paginated "sessions" state
  //    use karegi (neeche), dono alag hain isliye naam alag rakha.
  const { dateRange, customStart, customEnd, sessions: allSessions } = useDashboard()
  const { activeFlow }                        = useUI()

  // ── Server data (table display ke liye — paginated) ────────────
  const [sessions,      setSessions]      = useState([])
  const [page,          setPage]          = useState(0)
  const [totalSessions, setTotalSessions] = useState(0)
  const [totalPages,    setTotalPages]    = useState(1)

  // ── Loading states ────────────────────────────────────────────
  const [initialLoading, setInitialLoading] = useState(true)
  const [pageLoading,    setPageLoading]    = useState(false)
  const [error,          setError]          = useState(null)

  // ── Filter state (sent to server) ─────────────────────────────
  const [collection,  setCollection]  = useState('')
  const [brand,       setBrand]       = useState('')
  const [step,        setStep]        = useState('')
  const [search,      setSearch]      = useState('')
  const [sortField,   setSortField]   = useState('lastActivity')
  const [sortDir,     setSortDir]     = useState('desc')

  const mountedRef    = useRef(true)
  // ★ FIX: requestIdRef prevents stale fetch responses from overwriting newer results.
  //        Every fetch increments this counter. A response is only applied if its
  //        id still matches — so an older slow response can't overwrite a newer one.
  const requestIdRef  = useRef(0)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  // ── Core fetch for filter / sort / page changes ───────────────
  // ★ FIX 1: Always uses pageLoading (shimmer) — NEVER setInitialLoading.
  //           This means the table stays mounted and filter dropdowns are
  //           never wiped when the user selects a filter.
  // ★ FIX 2: Removed sessions.length from deps — it was causing loadPage to
  //           recreate after every data fetch, which rippled into stale closures.
  // ★ FIX 3: All filter values are passed explicitly via opts so there is no
  //           stale-closure risk on the API call arguments.
  const loadPage = useCallback(async (targetPage, opts = {}) => {
    const reqId = ++requestIdRef.current  // cancel any in-flight older request

    setPageLoading(true)
    setError(null)

    try {
      const data = await fetchSessions(
        opts.flow        ?? activeFlow,
        opts.dateRange   ?? dateRange,
        opts.customStart ?? customStart,
        opts.customEnd   ?? customEnd,
        opts.collection  !== undefined ? opts.collection : collection,
        opts.brand       !== undefined ? opts.brand      : brand,
        opts.step        !== undefined ? opts.step       : step,
        opts.search      !== undefined ? opts.search     : search,
        opts.sortField   ?? sortField,
        opts.sortDir     ?? sortDir,
        targetPage,
        PAGE_SIZE
      )

      // Discard stale responses
      if (requestIdRef.current !== reqId || !mountedRef.current) return

      setSessions(data.sessions)
      setTotalSessions(data.totalSessions)
      setTotalPages(data.totalPages)
      setPage(targetPage)
    } catch (err) {
      if (requestIdRef.current === reqId && mountedRef.current) setError(err.message)
    } finally {
      // ★ FIX: Do NOT touch initialLoading here — only the flow/date effect controls it.
      if (requestIdRef.current === reqId && mountedRef.current) {
        setPageLoading(false)
      }
    }
  }, [activeFlow, dateRange, customStart, customEnd, collection, brand, step, search, sortField, sortDir])
  // ★ sessions.length intentionally NOT in deps

  // ── Reload when flow or date range changes ────────────────────
  // ★ FIX: Single effect — resets state AND fetches in one go.
  //         The old two-effect pattern had a race where the second effect
  //         read a stale `initialLoading` value and skipped the fetch entirely,
  //         causing the "stuck loading" bug on 7-day / custom filters.
  useEffect(() => {
    const reqId = ++requestIdRef.current  // cancel any in-flight older request

    // Reset all filters and show full loader
    setCollection('')
    setBrand('')
    setStep('')
    setSearch('')
    setSortField('lastActivity')
    setSortDir('desc')
    setPage(0)
    setSessions([])
    setInitialLoading(true)
    setError(null)

    // Fetch directly — no stale initialLoading read needed
    fetchSessions(
      activeFlow, dateRange, customStart, customEnd,
      '', '', '', '', 'lastActivity', 'desc', 0, PAGE_SIZE
    ).then(data => {
      if (requestIdRef.current !== reqId || !mountedRef.current) return
      setSessions(data.sessions)
      setTotalSessions(data.totalSessions)
      setTotalPages(data.totalPages)
      setPage(0)
      setInitialLoading(false)
    }).catch(err => {
      if (requestIdRef.current !== reqId || !mountedRef.current) return
      setError(err.message)
      setInitialLoading(false)
    })
  }, [activeFlow, dateRange, customStart, customEnd]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Filter change handler (called by ConversationsTableOne) ───
  const handleFilterChange = useCallback((newFilters) => {
    const nextCollection = newFilters.collection !== undefined ? newFilters.collection : collection
    const nextBrand      = newFilters.brand      !== undefined ? newFilters.brand      : brand
    const nextStep       = newFilters.step       !== undefined ? newFilters.step       : step
    const nextSearch     = newFilters.search     !== undefined ? newFilters.search     : search

    setCollection(nextCollection)
    setBrand(nextBrand)
    setStep(nextStep)
    setSearch(nextSearch)

    // ★ FIX: Always pass dateRange/customStart/customEnd explicitly so loadPage
    //         never falls back to a stale closure value.
    //         Without this, clicking a filter after switching to "30 Days" would
    //         use the old "today" dateRange from loadPage's previous closure → wrong data.
    loadPage(0, {
      collection:  nextCollection,
      brand:       nextBrand,
      step:        nextStep,
      search:      nextSearch,
      sortField,
      sortDir,
      dateRange,
      customStart,
      customEnd,
    })
  }, [collection, brand, step, search, sortField, sortDir, loadPage, dateRange, customStart, customEnd])

  // ── Sort change handler ────────────────────────────────────────
  const handleSort = useCallback((field, dir) => {
    setSortField(field)
    setSortDir(dir)
    loadPage(0, { collection, brand, step, search, sortField: field, sortDir: dir, dateRange, customStart, customEnd })
  }, [collection, brand, step, search, loadPage, dateRange, customStart, customEnd])

  // ── Page change handler ────────────────────────────────────────
  const handlePageChange = useCallback((newPage) => {
    loadPage(newPage, { collection, brand, step, search, sortField, sortDir, dateRange, customStart, customEnd })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [loadPage, collection, brand, step, search, sortField, sortDir, dateRange, customStart, customEnd])

  if (initialLoading) return <PremiumLoader activeFlow={activeFlow} />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <div className="text-[14px] font-semibold text-red-500 mb-2">Failed to load conversations</div>
        <div className="text-[12px] text-[#B0A9A1] mb-4">{error}</div>
        <button
          onClick={() => loadPage(0, { collection: '', brand: '', step: '', search: '', sortField: 'lastActivity', sortDir: 'desc' })}
          className="px-4 py-2 rounded-xl text-[12px] font-bold text-white"
          style={{ background: '#E85A2B' }}>
          Retry
        </button>
      </div>
    )
  }

  const isBday = activeFlow?.includes('bday')

  // ── Completed (current paginated page se — jaisa pehle tha) ────
  const completed = sessions.filter(s => s.currentStep?.includes('COMPLETED')).length

  // ════════════════════════════════════════════════════════════
  // ── Conversation funnel metrics — OverviewPage se yahan move
  // kiye gaye. FULL session list (allSessions, context se) use
  // karte hain — paginated "sessions" (table display ke liye)
  // se nahi, taaki numbers TOTAL ke hisaab se sahi aayein,
  // sirf current page ka subset nahi.
  // ════════════════════════════════════════════════════════════
  const conv = {
    confirmed: allSessions.filter(s =>
      s.currentStep?.includes('OPENER_SENT') ||
      s.currentStep?.includes('GENDER_SELECTION_SENT') ||
      s.currentStep?.includes('BRAND_CAROUSEL') ||
      s.currentStep?.includes('CATALOGUE_SENT') ||
      s.currentStep?.includes('OFFER_SENT') ||
      s.currentStep?.includes('COMPLETED')
    ).length,
    enteredDiscovery: allSessions.filter(s => s.currentStep?.includes('OPENER_SENT')).length,
    carouselReached:  allSessions.filter(s => s.currentStep?.includes('BRAND_CAROUSEL')).length,
    catalogueSent:    allSessions.filter(s => s.currentStep?.includes('CATALOGUE_SENT')).length,
    offerTapped:      allSessions.filter(s => s.currentStep?.includes('OFFER_SENT')).length,
    reengagement:     allSessions.filter(s => s.currentStep?.includes('COMPLETED')).length,
  }

  return (
    <div className="space-y-5">

      {/* ── Metric tiles — all 8 in one grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 gap-3">
        {[
          { icon: '💬', label: 'Total Sessions', value: totalSessions, accent: 'blue'   },
          // { icon: '✅', label: 'Completed',      value: completed,     accent: 'orange' },
          { icon: '🎂', label: isBday ? 'Birthday Confirmed' : 'Anniversary Confirmed', value: conv.confirmed,        accent: 'red'    },
          { icon: '🔎', label: 'Entered Discovery',                                     value: conv.enteredDiscovery, accent: 'purple' },
          { icon: '🎠', label: 'Carousel Reached',                                      value: conv.carouselReached,  accent: 'green'  },
          // { icon: '📖', label: 'Catalogue Sent',                                        value: conv.catalogueSent,    accent: 'teal'   },
          { icon: '🎁', label: isBday ? 'Birthday Offer' : 'Anniv Offer',               value: conv.offerTapped,      accent: 'amber'  },
          // { icon: '🔁', label: 'Re-engagement',                                         value: conv.reengagement,     accent: 'gray'   },
        ].map((m, i) => <MetricCardOne key={m.label} {...m} delay={i * 50} />)}
      </div>

      {/* ── Main conversations table ── */}
      <CardOne
        title="All Conversations"
        subtitle={`Showing ${totalSessions.toLocaleString()} total sessions — filtered to current flow`}
        icon="💬"
      >
        <ConversationsTableOne
          sessions={sessions}
          totalSessions={totalSessions}
          page={page}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          pageLoading={pageLoading}
          sortField={sortField}
          sortDir={sortDir}
          activeFlow={activeFlow}
          dateRange={dateRange}
          customStart={customStart}
          customEnd={customEnd}
          collection={collection}
          brand={brand}
          step={step}
          search={search}
          onFilterChange={handleFilterChange}
          onSort={handleSort}
          onPageChange={handlePageChange}
        />
      </CardOne>

    </div>
  )
}