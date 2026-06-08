import { clearAuthStorage, getAuthToken } from "./authStorage"

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  // "https://sasquatch-hence-ferment.ngrok-free.dev"
  "http://40.80.81.142"
).trim()

const isNgrok = API_BASE.includes("ngrok")

function baseHeaders(options = {}) {
  return {
    ...(isNgrok ? { "ngrok-skip-browser-warning": "true" } : {}),
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  }
}

async function publicFetch(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: baseHeaders(options),
  })

  if (!response.ok) {
    throw new Error(`API failed: ${response.status}`)
  }

  return response.json()
}

async function authFetch(path, options = {}) {
  const token = getAuthToken()

  if (!token) {
    throw new Error("No auth token found. Please login again.")
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...baseHeaders(options),
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status === 401 || response.status === 403) {
    clearAuthStorage()
    throw new Error("Unauthorized")
  }

  if (!response.ok) {
    throw new Error(`API failed: ${response.status}`)
  }

  return response.json()
}

export async function loginAdmin(email, password) {
  return publicFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function fetchMe() {
  return authFetch("/api/auth/me")
}

export async function fetchDashboard() {
  return authFetch("/api/dashboard")
}

export async function fetchSessions() {
  return authFetch("/api/bot-sessions")
}

export async function fetchLeads(page = 0, size = 500, flow = null) {
  const params = new URLSearchParams({ page, size })
  if (flow && flow !== 'all') params.append('flow', flow)
  
  const data = await authFetch(`/api/leads?${params}`)
  
  // ← paginated response se leads array nikalo
  return Array.isArray(data) ? data : (data.leads || [])
}

// Your existing functions stay the same — just add this one:

export async function fetchSessionsByFlow(flow) {
  return authFetch(`/api/bot-sessions/flow/${flow}`)
}