import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

export const useFavoriteTracks = () => {
  const favoriteTracks = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchFavoriteTracks = async () => {
    isLoading.value = true
    error.value = null

    const auth = useAuthStore()
    const token = localStorage.getItem('access_token')

    if (!token) {
      isLoading.value = false
      error.value = 'Требуется авторизация'
      return
    }

    try {
      const response = await fetch(
        'https://webdev-music-003b5b991590.herokuapp.com/catalog/track/favorite/all',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        if (response.status === 401) {
          error.value = 'Сессия истекла. Пожалуйста, войдите снова.'
          auth.logout()
        } else {
          const data = await response.json().catch(() => ({}))
          error.value = data?.message || `Ошибка API: ${response.status}`
        }
        return
      }

      const data = await response.json()

      favoriteTracks.value = Array.isArray(data) ? data : data.tracks || []
    } catch (e: any) {
      console.error('Ошибка загрузки избранного:', e)
      error.value = e instanceof Error ? e.message : 'Не удалось загрузить избранное'
    } finally {
      isLoading.value = false
    }
  }

  return {
    favoriteTracks,
    isLoading,
    error,
    fetchFavoriteTracks,
  }
}
