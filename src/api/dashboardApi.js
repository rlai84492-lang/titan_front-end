

import { clearAuthStorage, getAuthToken } from "./authStorage"

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').trim()
const isNgrok  = API_BASE.includes("ngrok")

function baseHeaders(options = {}) {
  return {
    ...(isNgrok ? { "ngrok-skip-browser-warning": "true" } : {}),
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  }
}

async function publicFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: baseHeaders(options),
  })
  if (!res.ok) throw new Error(`API failed: ${res.status}`)
  return res.json()
}

/**
 * Authenticated fetch with one automatic retry on network failure.
 * Does NOT retry on 401/403 — those are auth errors, not network errors.
 */
async function authFetch(path, options = {}) {
  const token = getAuthToken()
  if (!token) throw new Error("No auth token found. Please login again.")

  const doFetch = () =>
    fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...baseHeaders(options),
        Authorization: `Bearer ${token}`,
      },
    })

  let res
  try {
    res = await doFetch()
  } catch (networkErr) {
    // One retry on network error (not on HTTP error status)
    await new Promise(r => setTimeout(r, 800))
    res = await doFetch()
  }

  if (res.status === 401 || res.status === 403) {
    clearAuthStorage()
    throw new Error("Unauthorized")
  }
  if (!res.ok) throw new Error(`API failed: ${res.status}`)
  return res.json()
}

// ─────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────

export async function loginAdmin(email, password) {
  return publicFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function fetchMe() {
  return authFetch("/api/auth/me")
}

// ─────────────────────────────────────────────────────────────────
// DASHBOARD — flow + date range
// ─────────────────────────────────────────────────────────────────

/**
 * Fetches dashboard data.
 *
 * Response includes:
 *   sessions[]      — first 500 sessions (for table)
 *   leads[]         — first 500 leads (for table)
 *   totalSessions   — real total count from DB (may be > 500)
 *   totalLeads      — real total count from DB
 *   metrics         — all 8 KPI tiles
 *   hourly, collData, timeline
 *
 * @param {string} flow        - bday_t10 | bday_t0 | anniv_t10 | anniv_t0
 * @param {object} dateOpts    - { dateRange, customStart, customEnd }
 */
export const fetchDashboard = async (flow = 'bday_t10', dateOpts = {}) => {
  const { dateRange, customStart, customEnd } = dateOpts
  const params = new URLSearchParams({ flow })

  if (dateRange) params.append('range', dateRange)
  if (dateRange === 'custom' && customStart && customEnd) {
    params.append('startDate', customStart)
    params.append('endDate',   customEnd)
  }

  return authFetch(`/api/dashboard?${params}`)
}


/**
 * Lightweight sidebar counts — fast, cached 30s.
 * Call this separately from the main dashboard to avoid blocking the UI.
 */
export async function fetchDashboardCounts() {
  return authFetch("/api/dashboard/counts")
}

// ─────────────────────────────────────────────────────────────────
// SESSIONS
// ─────────────────────────────────────────────────────────────────

/**
 * Paginated sessions fetch — server-side filters, no 500-row cap.
 *
 * @param {string}  flow        bday_t10 | bday_t0 | anniv_t10 | anniv_t0
 * @param {string}  dateRange   today | 7days | 30days | custom
 * @param {string}  customStart yyyy-MM-dd (only when dateRange=custom)
 * @param {string}  customEnd   yyyy-MM-dd (only when dateRange=custom)
 * @param {string}  collection  MENS | WOMENS | COUPLES | '' (all)
 * @param {string}  brand       exact brand value | '' (all)
 * @param {string}  step        exact current_step | '' (all)
 * @param {string}  search      name or phone substring | ''
 * @param {string}  sortField   lastActivity | customerName | phone | currentStep |
 *                              selectedCollection | selectedBrand
 * @param {string}  sortDir     desc | asc
 * @param {number}  page        0-based page index
 * @param {number}  size        rows per page (max 500 enforced by backend)
 *
 * Returns: { sessions[], totalSessions, totalPages, currentPage, pageSize }
 */
export async function fetchSessions(
  flow        = 'bday_t10',
  dateRange   = 'today',
  customStart = '',
  customEnd   = '',
  collection  = '',
  brand       = '',
  step        = '',
  search      = '',
  sortField   = 'lastActivity',
  sortDir     = 'desc',
  page        = 0,
  size        = 100
) {
  const params = new URLSearchParams({ flow, range: dateRange, page, size, sortField, sortDir })

  if (dateRange === 'custom' && customStart && customEnd) {
    params.append('startDate', customStart)
    params.append('endDate',   customEnd)
  }
  if (collection && collection !== 'All') params.append('collection', collection)
  if (brand      && brand      !== 'All') params.append('brand',      brand)
  if (step       && step       !== 'All') params.append('step',       step)
  if (search     && search.trim())        params.append('search',     search.trim())

  const data = await authFetch(`/api/bot-sessions?${params}`)

  // Normalise: backend always returns paginated envelope
  if (Array.isArray(data)) {
    return { sessions: data, totalSessions: data.length, totalPages: 1, currentPage: 0, pageSize: size }
  }
  return {
    sessions:      Array.isArray(data.sessions) ? data.sessions : [],
    totalSessions: data.totalSessions ?? 0,
    totalPages:    data.totalPages    ?? 1,
    currentPage:   data.currentPage   ?? page,
    pageSize:      data.pageSize      ?? size,
  }
}

export async function fetchSessionsByFlow(flow) {
  return authFetch(`/api/bot-sessions/flow/${flow}`)
}


// ─────────────────────────────────────────────────────────────────
// LEADS — paginated
// ─────────────────────────────────────────────────────────────────

/**
 * Paginated leads fetch.
 *
 * @param {number} page          - 0-based page index
 * @param {number} size          - items per page (capped at 200 by backend)
 * @param {string|null} flow     - bday_t10 | bday_t0 | anniv_t10 | anniv_t0 | null for all
 * @param {string} dateRange     - today | 7days | 30days | custom
 * @param {string} customStart   - yyyy-MM-dd (only when dateRange=custom)
 * @param {string} customEnd     - yyyy-MM-dd (only when dateRange=custom)
 *
 * Returns: { leads[], totalLeads, totalPages, currentPage, pageSize }
 */
// export async function fetchLeads(
//   page        = 0,
//   size        = 100,
//   flow        = null,
//   dateRange   = 'today',
//   customStart = '',
//   customEnd   = ''
// ) {
//   const params = new URLSearchParams({
//     page,
//     size: Math.min(size, 200),
//     range: dateRange,
//   })

//   if (flow && flow !== 'all') params.append('flow', flow)
//   if (dateRange === 'custom' && customStart && customEnd) {
//     params.append('startDate', customStart)
//     params.append('endDate',   customEnd)
//   }

//   const data = await authFetch(`/api/leads?${params}`)

//   // Normalise: backend always returns { leads, totalLeads, totalPages, currentPage, pageSize }
//   if (Array.isArray(data)) {
//     return { leads: data, totalLeads: data.length, totalPages: 1, currentPage: 0, pageSize: size }
//   }
//   return {
//     leads:       Array.isArray(data.leads) ? data.leads : [],
//     totalLeads:  data.totalLeads  ?? 0,
//     totalPages:  data.totalPages  ?? 1,
//     currentPage: data.currentPage ?? page,
//     pageSize:    data.pageSize    ?? size,
//   }
// }


// export async function fetchDobRevisions() {
//   return authFetch("/api/dob-revisions")
// }


// ════════════════════════════════════════════════════════════
// dashboardApi.js mein fetchLeads() function ko REPLACE karo
// (range, customStart, customEnd params add kiye gaye hain)
// ════════════════════════════════════════════════════════════

export async function fetchLeads(
  page = 0,
  size = 100,
  flow = null,
  range = 'today',
  customStart = null,
  customEnd = null
) {
  const params = new URLSearchParams({ page, size })
  if (flow && flow !== 'all') params.append('flow', flow)
  if (range) params.append('range', range)
  if (range === 'custom' && customStart && customEnd) {
    params.append('startDate', customStart)
    params.append('endDate', customEnd)
  }
  const data = await authFetch(`/api/leads?${params}`)
  return data  // { leads, totalLeads, totalPages, currentPage, pageSize, leadMetrics }
}


export async function fetchDobRevisions(range = 'today', startDate = null, endDate = null) {
  const params = new URLSearchParams({ range })
  if (range === 'custom' && startDate && endDate) {
    params.append('startDate', startDate)
    params.append('endDate', endDate)
  }
  return authFetch(`/api/dob-revisions?${params.toString()}`)
}
 