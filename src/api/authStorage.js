export const TOKEN_KEY = 'titan_admin_token'
export const USER_KEY = 'titan_admin_user'

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearAuthStorage() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}