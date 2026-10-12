import { ref } from 'vue'
import { usePlayerStore } from '~/stores/player'

const API_URL = 'https://webdev-music-003b5b991590.herokuapp.com'

export const useTracks = () => {
  const tracks = ref([])
  const loading = ref(false)
  const error = ref(null)

  const playerStore = usePlayerStore()

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const fetchTracks = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/catalog/track/all/`)
      if (!response.ok) {
        throw new Error('Не удалось получить треки')
      }
      const data = await response.json()

      const formattedTracks = data.data.map((track) => ({
        ...track,
        time: formatDuration(track.duration_in_seconds),
      }))

      tracks.value = formattedTracks

      playerStore.setPlaylist(formattedTracks)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка при загрузке треков'
    } finally {
      loading.value = false
    }
  }

  return {
    tracks,
    loading,
    error,
    fetchTracks,
    formatDuration,
  }
}
