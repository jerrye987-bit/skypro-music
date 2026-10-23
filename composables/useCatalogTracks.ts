import { ref } from 'vue'

const BASE_URL = 'https://webdev-music-003b5b991590.herokuapp.com'

export const useCatalogTracks = () => {
  const tracks = ref<any[]>([])
  const isLoading = ref(false)

  const fetchCatalogTracks = async (id: number) => {
    isLoading.value = true
    try {
      // Шаг 1: получаем список id треков подборки
      const selRes = await fetch(`${BASE_URL}/catalog/selection/${id}/`)
      const selData: any = await selRes.json()

      const ids: number[] = selData?.data?.items ?? []

      // Шаг 2: получаем все треки целиком
      const allRes = await fetch(`${BASE_URL}/catalog/track/all/`)
      const allData: any = await allRes.json()

      // Ответ может прийти массивом или обёрнутым в data — пробуем оба варианта
      const allTracks: any[] = Array.isArray(allData) ? allData : allData?.data ?? []

      // Шаг 3: оставляем только треки, чьи id есть в подборке
      tracks.value = allTracks.filter((t: any) => ids.includes(t._id))
    } catch (e) {
      console.error('Ошибка загрузки плейлиста:', e)
      tracks.value = []
    } finally {
      isLoading.value = false
    }
  }

  return { tracks, fetchCatalogTracks, isLoading }
}
