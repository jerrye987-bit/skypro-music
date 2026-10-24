const BASE_URL = '/api'

let refreshPromise: Promise<string | null> | null = null

const clearTokens = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
}

const refreshTokens = async (): Promise<string | null> => {
  const refresh = localStorage.getItem('refresh_token')
  if (!refresh) return null

  try {
    const res = await fetch(`${BASE_URL}/user/token/refresh/`, {
      method: 'POST',
      body: JSON.stringify({ refresh }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) return null

    const data = await res.json()
    if (!data.access) return null

    localStorage.setItem('access_token', data.access)
    if (data.refresh) localStorage.setItem('refresh_token', data.refresh)

    return data.access
  } catch {
    return null
  }
}

export const useAuthFetch = async (url: string, options: RequestInit = {}) => {
  const makeRequest = (token: string | null) =>
    fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

  const token = localStorage.getItem('access_token')
  let res = await makeRequest(token)

  if (res.status === 401) {
    if (!refreshPromise) {
      refreshPromise = refreshTokens().finally(() => {
        refreshPromise = null
      })
    }

    const newToken = await refreshPromise

    if (newToken) {
      res = await makeRequest(newToken)
    } else {
      clearTokens()
    }
  }

  return res
}
