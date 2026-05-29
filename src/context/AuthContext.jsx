import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const AuthContext = createContext(null)

const TOKEN_KEY = 'titan_admin_token'
const USER_KEY = 'titan_admin_user'

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8081'

function readStoredUser() {
  const raw = localStorage.getItem(USER_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => readStoredUser())
  const [authLoading, setAuthLoading] = useState(true)

  const saveSession = useCallback((loginData) => {
    const nextToken = loginData?.token || ''

    const nextUser = {
      userId: loginData?.userId,
      fullName: loginData?.fullName,
      email: loginData?.email,
      role: loginData?.role,
    }

    localStorage.setItem(TOKEN_KEY, nextToken)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))

    setToken(nextToken)
    setUser(nextUser)

    return nextUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)

    setToken(null)
    setUser(null)
  }, [])

  const login = useCallback(
    async (email, password) => {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!response.ok) {
        let message = 'Login failed'

        try {
          const error = await response.json()
          message = error.message || error.error || message
        } catch {
          // ignore non-json error response
        }

        throw new Error(message)
      }

      const data = await response.json()
      const loggedInUser = saveSession(data)

      return loggedInUser
    },
    [saveSession]
  )

  const refreshMe = useCallback(async () => {
    const storedToken = localStorage.getItem(TOKEN_KEY)

    if (!storedToken) {
      logout()
      return null
    }

    const response = await fetch(`${API_BASE}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedToken}`,
      },
    })

    if (!response.ok) {
      logout()
      return null
    }

    const me = await response.json()

    const nextUser = {
      userId: me?.userId,
      fullName: me?.fullName,
      email: me?.email,
      role: me?.role,
    }

    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))

    setToken(storedToken)
    setUser(nextUser)

    return nextUser
  }, [logout])

  useEffect(() => {
    let mounted = true

    async function bootAuth() {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY)

        if (!storedToken) {
          logout()
          return
        }

        await refreshMe()
      } finally {
        if (mounted) {
          setAuthLoading(false)
        }
      }
    }

    bootAuth()

    return () => {
      mounted = false
    }
  }, [logout, refreshMe])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      authLoading,
      login,
      logout,
      refreshMe,
    }),
    [token, user, authLoading, login, logout, refreshMe]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}