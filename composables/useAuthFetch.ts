const BASE_URL = 'https://webdev-music-003b5b991590.herokuapp.com'

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
    const newAccess = data?.access ?? data?.data?.access
    if (!newAccess) return null

    localStorage.setItem('access_token', newAccess)
    // если сервер обновляет и refresh — сохраняем его тоже
    const newRefresh = data?.refresh ?? data?.data?.refresh
    if (newRefresh) localStorage.setItem('refresh_token', newRefresh)

    return newAccess
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

  // Токен протух — обновляем и пробуем ещё раз (только один раз)
  if (res.status === 401) {
    const newToken = await refreshTokens()
    if (newToken) {
      res = await makeRequest(newToken)
    }
  }

  return res
}
