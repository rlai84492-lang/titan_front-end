const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  'https://quack-freestyle-slashed.ngrok-free.dev'



  // ✅ Common headers — ek jagah define karo
const commonHeaders = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',  // ← YE ADD KARO
}





export async function fetchDashboard() {
  const response = await fetch(`${API_BASE}/api/dashboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Dashboard API failed: ${response.status}`)
  }

  return response.json()
}

export async function fetchSessions() {
  const response = await fetch(`${API_BASE}/api/bot-sessions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Sessions API failed: ${response.status}`)
  }

  return response.json()
}

export async function fetchLeads() {
  const response = await fetch(`${API_BASE}/api/leads`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Leads API failed: ${response.status}`)
  }

  return response.json()
}