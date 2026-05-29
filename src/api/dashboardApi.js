// import { getToken } from "./authApi"
// import { clearAuthStorage, getAuthToken } from "./authStorage"

// const API_BASE = (
//   import.meta.env.VITE_API_BASE_URL ||
//   'https://quack-freestyle-slashed.ngrok-free.dev'
// ).trim()  // ✅ newline safe

// const commonHeaders = {
//   'Content-Type': 'application/json',
//   'ngrok-skip-browser-warning': 'true',
// }



// async function authFetch(path, options = {}) {
//   const token = getAuthToken()

//   const response = await fetch(`${API_BASE}${path}`, {
//     ...options,
//     headers: {
//       'Content-Type': 'application/json',
//       ...(options.headers || {}),
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//   })

//   if (response.status === 401 || response.status === 403) {
//     clearAuthStorage()
//     window.location.reload()
//     throw new Error('Unauthorized')
//   }

//   if (!response.ok) {
//     throw new Error(`API failed: ${response.status}`)
//   }

//   return response.json()
// }

// export async function fetchDashboard() {
//   return authFetch('/api/dashboard')
// }

// export async function fetchSessions() {
//   return authFetch('/api/bot-sessions')
// }

// export async function fetchLeads() {
//   return authFetch('/api/leads')
// }


import { clearAuthStorage, getAuthToken } from "./authStorage"

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  'https://quack-freestyle-slashed.ngrok-free.dev'
).trim()

const isNgrok = API_BASE.includes('ngrok')

async function authFetch(path, options = {}) {
  const token = getAuthToken()

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(isNgrok ? { 'ngrok-skip-browser-warning': 'true' } : {}), // ✅ ngrok pe hi lagao
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (response.status === 401 || response.status === 403) {
    clearAuthStorage()
    window.location.reload()
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    throw new Error(`API failed: ${response.status}`)
  }

  return response.json()
}

export async function fetchDashboard() {
  return authFetch('/api/dashboard')
}

export async function fetchSessions() {
  return authFetch('/api/bot-sessions')
}

export async function fetchLeads() {
  return authFetch('/api/leads')
}