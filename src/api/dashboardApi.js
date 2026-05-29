const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  'https://quack-freestyle-slashed.ngrok-free.dev'
).trim()  // ✅ newline safe

const commonHeaders = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
}

export async function fetchDashboard() {
  const response = await fetch(`${API_BASE}/api/dashboard`, {
    method: 'GET',
    headers: commonHeaders,  // ✅ commonHeaders use karo
  })
  if (!response.ok) throw new Error(`Dashboard API failed: ${response.status}`)
  return response.json()
}

export async function fetchSessions() {
  const response = await fetch(`${API_BASE}/api/bot-sessions`, {
    method: 'GET',
    headers: commonHeaders,  // ✅
  })
  if (!response.ok) throw new Error(`Sessions API failed: ${response.status}`)
  return response.json()
}

export async function fetchLeads() {
  const response = await fetch(`${API_BASE}/api/leads`, {
    method: 'GET',
    headers: commonHeaders,  // ✅
  })
  if (!response.ok) throw new Error(`Leads API failed: ${response.status}`)
  return response.json()
}