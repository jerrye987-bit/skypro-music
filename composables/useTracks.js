import { ref } from 'vue'
import { usePlayerStore } from '~/stores/player'
import { formatDuration } from '~/utils/format'

export const useTracks = () => {
  const tracks = ref([])
  const loading = ref(false)
  const error = ref(null)

  const playerStore = usePlayerStore()

  const fetchTracks = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('/api/catalog/track/all/')
      if (!response.ok) {
        throw new Error('Не удалось получить треки')
      }
      const data = await response.json()

      const rawTracks = Array.isArray(data) ? data : (data?.data ?? [])

      const formattedTracks = rawTracks.map((track) => ({
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
