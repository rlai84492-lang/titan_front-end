const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8081'

export function getToken() {
  return localStorage.getItem('titan_admin_token')
}

export function getUser() {
  const raw = localStorage.getItem('titan_admin_user')
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveAuth(data) {
  localStorage.setItem('titan_admin_token', data.token)

  localStorage.setItem('titan_admin_user', JSON.stringify({
    userId: data.userId,
    fullName: data.fullName,
    email: data.email,
    role: data.role,
  }))
}

export function clearAuth() {
  localStorage.removeItem('titan_admin_token')
  localStorage.removeItem('titan_admin_user')
}

export async function loginAdmin(email, password) {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    let message = 'Login failed'

    try {
      const error = await response.json()
      message = error.message || message
    } catch {
      // ignore
    }

    throw new Error(message)
  }

  return response.json()
}

export async function fetchMe() {
  const token = getToken()

  const response = await fetch(`${API_BASE}/api/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Session expired')
  }

  return response.json()
}