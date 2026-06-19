


import React, { createContext, useContext, useState, useCallback } from 'react'
import { fetchDashboard } from '../api/dashboardApi'

const DashboardContext = createContext(null)

export function DashboardProvider({ children }) {
  const [sessions,    setSessions]    = useState([])
  const [leads,       setLeads]       = useState([])
  const [metrics,     setMetrics]     = useState({})
  const [hourly,      setHourly]      = useState({ labels: [], inbound: [], outbound: [] })
  const [campData,    setCampData]    = useState({ labels: [], t10: [], tday: [] })
  const [collData,    setCollData]    = useState({ mens: 0, womens: 0, couples: 0 })
  const [timeline,    setTimeline]    = useState([])
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)

  // ── Date Range — GLOBAL state ──────────────────────────────────
  const [dateRange,   setDateRange]   = useState('today')   // today | 7days | 30days | custom
  const [customStart, setCustomStart] = useState('')
  const [customEnd,   setCustomEnd]   = useState('')

  // ── Load dashboard — flow + date range dono respect karta hai ──
  const loadDashboard = useCallback(async (flow = 'bday_t10', opts = {}) => {
    const range = opts.dateRange   ?? dateRange
    const start = opts.customStart ?? customStart
    const end   = opts.customEnd   ?? customEnd

    console.log('%c[Dashboard] API call triggered', 'color:#E85A2B;font-weight:bold', {
      flow,
      dateRange: range,
      customStart: start,
      customEnd: end,
      endpoint: `/api/dashboard?flow=${flow}`,
    })

    setLoading(true)
    setError(null)
    try {
      const data = await fetchDashboard(flow, { dateRange: range, customStart: start, customEnd: end })
      console.log('%c[Dashboard] API response received ✅', 'color:#1D9E75;font-weight:bold', data)

      setSessions(Array.isArray(data.sessions) ? data.sessions : [])
      setLeads(Array.isArray(data.leads)       ? data.leads    : [])
      setMetrics(data.metrics  || {})
      setHourly(data.hourly    || { labels: [], inbound: [], outbound: [] })
      setCampData(data.campData || { labels: [], t10: [], tday: [] })
      setCollData(data.collData || { mens: 0, womens: 0, couples: 0 })
      setTimeline(Array.isArray(data.timeline) ? data.timeline : [])
      setLastRefresh(new Date().toISOString())
    } catch (err) {
      console.error('%c[Dashboard] API call failed ❌', 'color:#EF4444;font-weight:bold', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [dateRange, customStart, customEnd])

  return (
    <DashboardContext.Provider value={{
      sessions, leads, metrics, hourly,
      campData, collData, timeline,
      loading, error, lastRefresh,
      loadDashboard,
      // ── Date range exposed globally ──
      dateRange, setDateRange,
      customStart, setCustomStart,
      customEnd, setCustomEnd,
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