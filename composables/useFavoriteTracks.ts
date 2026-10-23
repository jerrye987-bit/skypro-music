import { ref } from 'vue'

const BASE_URL = 'https://webdev-music-003b5b991590.herokuapp.com'

interface Track {
  _id: string
  name: string
  author: string
  album?: string
  time?: string
  track_file?: string
}

export const useFavoriteTracks = () => {
  const favoriteTracks = ref<Track[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchFavoriteTracks = async () => {
    loading.value = true
    error.value = null

    const token = localStorage.getItem('access_token')

    if (!token) {
      loading.value = false
      error.value = 'Требуется авторизация'
      return
    }

    try {
      const response = await fetch(
        `${BASE_URL}/catalog/track/favorite/all/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`)
      }

      const json = await response.json()

      const rawData = json?.data || []

      favoriteTracks.value = Array.isArray(rawData) ? rawData : []

    } catch (e: unknown) {
      console.error('Ошибка при запросе избранного:', e)
      error.value = 'Не удалось загрузить избранное. Проверьте соединение или авторизацию.'
    } finally {
      loading.value = false
    }
  }

  return {
    favoriteTracks,
    loading,
    error,
    fetchFavoriteTracks,
  }
}
