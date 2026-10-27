import { ref } from 'vue'

interface Track {
  _id: string
  name: string
  author: string
  album?: string
  time?: string
  track_file?: string
}

// Единое состояние на весь проект: где бы ни вызвали композабл — список один
const favoriteTracks = ref<Track[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export const useFavoriteTracks = () => {
  const fetchFavoriteTracks = async () => {
    if (!localStorage.getItem('access_token')) {
      favoriteTracks.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await useAuthFetch('/api/catalog/track/favorite/all/', {
        method: 'GET',
      })

      if (response.status === 401) {
        error.value = 'Сессия истекла. Войдите заново.'
        await navigateTo('/signin')
        return
      }

      if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`)
      }

      const json = await response.json()

      const rawData = Array.isArray(json) ? json : (json?.data ?? [])

      favoriteTracks.value = Array.isArray(rawData) ? rawData : []
    } catch (e: unknown) {
      console.error('Ошибка при запросе избранного:', e)
      error.value = 'Не удалось загрузить избранное. Проверьте соединение или авторизацию.'
    } finally {
      loading.value = false
    }
  }

  const clearFavoriteTracks = () => {
    favoriteTracks.value = []
  }

  const setFavoriteState = (track: Track, liked: boolean) => {
    const id = String(track._id)
    if (liked) {
      favoriteTracks.value = [
        track,
        ...favoriteTracks.value.filter((t) => String(t._id) !== id),
      ]
    } else {
      favoriteTracks.value = favoriteTracks.value.filter((t) => String(t._id) !== id)
    }
  }

  return {
    favoriteTracks,
    loading,
    isLoading: loading,
    error,
    fetchFavoriteTracks,
    clearFavoriteTracks,
    setFavoriteState,
  }
}
