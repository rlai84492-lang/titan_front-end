import React, {
  createContext, useContext,
  useState, useCallback, useRef, useEffect,
} from 'react'
import { fetchDashboard } from '../api/dashboardApi'
import { getAuthToken } from '../api/authStorage'

import { useAuth } from './AuthContext'   // adjust path if needed


const DashboardContext = createContext(null)

export function DashboardProvider({ children }) {

  // ── Data ─────────────────────────────────────────────────────────
  const [sessions,      setSessions]      = useState([])
  const [leads,         setLeads]         = useState([])
  const [totalSessions, setTotalSessions] = useState(0)   // real DB count
  const [totalLeads,    setTotalLeads]    = useState(0)   // real DB count
  const [metrics,       setMetrics]       = useState({})
  const [hourly,        setHourly]        = useState({ labels: [], inbound: [], outbound: [] })
  const [collData,      setCollData]      = useState({ mens: 0, womens: 0, couples: 0 })
  const [timeline,      setTimeline]      = useState([])

  // ── Status ───────────────────────────────────────────────────────
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)

  // ── Date range — shared across all pages ─────────────────────────
  const [dateRange,   setDateRange]   = useState('today')
  const [customStart, setCustomStart] = useState('')
  const [customEnd,   setCustomEnd]   = useState('')

  // ── Internal refs ─────────────────────────────────────────────────
  /**
   * currentParamsKey: tracks what is currently shown on screen.
   * If params haven't changed (auto-refresh), we skip the loading spinner
   * so the UI doesn't flash.
   */
  

  
  const currentParamsKeyRef = useRef(null)
  /**
   * isInFlight: prevents concurrent requests.
   * e.g., user switches flow twice quickly — second call waits or wins.
   */
  const isInFlightRef = useRef(false)
  const mountedRef    = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  // ─────────────────────────────────────────────────────────────────
  // loadDashboard — main data fetch
  // ─────────────────────────────────────────────────────────────────
  /**
   * Call this whenever you want fresh dashboard data.
   *
   * @param {string} flow     - bday_t10 | bday_t0 | anniv_t10 | anniv_t0
   * @param {object} opts     - override { dateRange, customStart, customEnd }
   *
   * Smart loading: shows spinner only when flow or range changes.
   * Silent refresh (same params) does NOT flash the loading state.
   */
  const loadDashboard = useCallback(async (flow = 'bday_t10', opts = {}) => {
    if (isInFlightRef.current) {
      console.warn('[Dashboard] Request already in flight, skipping duplicate call')
      return
    }

    const range = opts.dateRange   ?? dateRange
    const start = opts.customStart ?? customStart
    const end   = opts.customEnd   ?? customEnd

    const paramsKey = `${flow}|${range}|${start}|${end}`
    const isFreshLoad = currentParamsKeyRef.current !== paramsKey

    console.log('[Dashboard] loadDashboard', { flow, range, start, end, isFresh: isFreshLoad })

    if (isFreshLoad) setLoading(true)
    setError(null)
    isInFlightRef.current = true

    try {
      const data = await fetchDashboard(flow, {
        dateRange: range, customStart: start, customEnd: end,
      })

      if (!mountedRef.current) return   // unmounted while request was in flight

      setSessions(Array.isArray(data.sessions) ? data.sessions : [])
      setLeads(Array.isArray(data.leads)       ? data.leads    : [])

      // totalSessions / totalLeads from server COUNT queries — real DB numbers
      setTotalSessions(data.totalSessions ?? data.sessions?.length ?? 0)
      setTotalLeads(data.totalLeads       ?? data.leads?.length    ?? 0)

      setMetrics(data.metrics  ?? {})
      setHourly(data.hourly    ?? { labels: [], inbound: [], outbound: [] })
      setCollData(data.collData ?? { mens: 0, womens: 0, couples: 0 })
      setTimeline(Array.isArray(data.timeline) ? data.timeline : [])
      setLastRefresh(new Date().toISOString())

      // ← Now this is the "current" params — next same-params call is a silent refresh
      currentParamsKeyRef.current = paramsKey

      console.log('[Dashboard] ✅ Loaded', {
        sessions: data.totalSessions,
        leads:    data.totalLeads,
      })
    } catch (err) {
      console.error('[Dashboard] ❌ Failed', err)
      if (mountedRef.current) setError(err.message)
    } finally {
      if (mountedRef.current) setLoading(false)
      isInFlightRef.current = false
    }
  }, [dateRange, customStart, customEnd])

  // ─────────────────────────────────────────────────────────────────
  // AUTO-LOAD on mount
  // ─────────────────────────────────────────────────────────────────
  /**
   * ★ FIX for "first load shows no data":
   *
   * Root cause: loadDashboard was only called when a user clicked a flow
   * button or changed date range. On first render, nothing triggered it,
   * so the dashboard stayed empty until the user clicked or refreshed.
   *
   * Fix: call loadDashboard once on mount if a token exists.
   * We use a ref so we always call the LATEST version of loadDashboard
   * without having to list it as a dependency (which would cause infinite loops).
   */
const loadDashboardRef = useRef(loadDashboard)
useEffect(() => { loadDashboardRef.current = loadDashboard }, [loadDashboard])

// ✅ Watch auth state — fires when user logs in, not just on mount
const { isAuthenticated } = useAuth()   // use whatever your AuthContext exports

useEffect(() => {
  if (isAuthenticated) {
    loadDashboardRef.current('bday_t10', { dateRange: 'today' })
  }
}, [isAuthenticated])   // ← fires when login happens, not on mount

  // ─────────────────────────────────────────────────────────────────
  // Context value
  // ─────────────────────────────────────────────────────────────────
  return (
    <DashboardContext.Provider value={{
      // Data
      sessions, leads,
      totalSessions, totalLeads,
      metrics, hourly, collData, timeline,

      // Status
      loading, error, lastRefresh,

      // Actions
      loadDashboard,

      // Date range — read & write (shared by all pages)
      dateRange,   setDateRange,
      customStart, setCustomStart,
      customEnd,   setCustomEnd,
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used inside DashboardProvider')
  return ctx
}