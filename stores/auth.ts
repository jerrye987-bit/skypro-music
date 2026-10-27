import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isCriticalError = ref<boolean>(false)

  const setTokens = (access: string, refresh: string) => {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
  }

  const clearTokens = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }

  const initAuth = () => {
    if (!import.meta.client) return

    const access = localStorage.getItem('access_token')
    if (access) {
      try {
        user.value = JSON.parse(localStorage.getItem('user') || 'null')
      } catch {
        user.value = null
      }
    }
  }

  const logout = () => {
    clearTokens()
    user.value = null
    error.value = null
  }

  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    isCriticalError.value = false

    try {
      const res = await fetch('/api/user/login/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const message = data?.message || `Ошибка авторизации: ${res.status} ${res.statusText}`
        error.value = message
        return
      }

      const data = await res.json()

      const tokenRes = await fetch('/api/user/token/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      })

      if (!tokenRes.ok) {
        const tokensData = await tokenRes.json().catch(() => ({}))
        const tokenMessage = tokensData?.message || 'Не удалось получить токены.'
        error.value = tokenMessage
        return
      }

      const tokensData = await tokenRes.json()
      if (tokensData.access && tokensData.refresh) {
        setTokens(tokensData.access, tokensData.refresh)
        user.value = data
        localStorage.setItem('user', JSON.stringify(data))
      } else {
        error.value = 'Сервер не вернул токены.'
      }
    } catch (e: any) {
      console.error('Критическая ошибка в login:', e)
      error.value =
        e instanceof Error ? e.message : 'Произошла непредвиденная ошибка. Попробуйте позже.'
      isCriticalError.value = true
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isLoading,
    error,
    isCriticalError,
    login,
    clearTokens,
    logout,
    initAuth,
  }
})
