import { ref, onMounted } from 'vue'

const BASE_URL = 'https://webdev-music-003b5b991590.herokuapp.com'

interface Track {
  _id: string
  name: string
  author: string
  album?: string
  time?: string
  track_file?: string
}

export const usePlaylists = () => {
  const tracksDay = ref<Track[]>([])
  const tracksDance = ref<Track[]>([])
  const tracksIndie = ref<Track[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTracks = async (endpoint: string) => {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`)
      if (!res.ok) {
        throw new Error(`Ошибка API: ${res.status}`)
      }
      const data = await res.json()
      return Array.isArray(data) ? data : (data.result || [])
    } catch (e: unknown) {
      console.error('Ошибка при запросе треков:', e)
      throw e
    }
  }

  const loadAllPlaylists = async () => {
    loading.value = true
    error.value = null

    try {
      const [day, dance, indie] = await Promise.all([
        fetchTracks('/catalog/track/all/'),
        fetchTracks('/catalog/track/all/'),
        fetchTracks('/catalog/track/all/'),
      ])

      tracksDay.value = day as Track[]
      tracksDance.value = dance as Track[]
      tracksIndie.value = indie as Track[]
    } catch (e: unknown) {
      console.error('Не удалось загрузить плейлисты:', e) // <-- тоже используем
      error.value = 'Не удалось загрузить плейлисты. Проверьте соединение.'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    loadAllPlaylists()
  })

  return {
    tracksDay,
    tracksDance,
    tracksIndie,
    loading,
    error,
    loadAllPlaylists,
  }
}
