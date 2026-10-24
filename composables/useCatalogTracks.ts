import { ref } from 'vue'

export const useCatalogTracks = () => {
  const tracks = ref<any[]>([])
  const isLoading = ref(false)

  const fetchCatalogTracks = async (id: number) => {
    isLoading.value = true
    try {
      const selRes = await fetch(`/api/catalog/selection/${id}/`)
      if (!selRes.ok) {
        throw new Error(`Ошибка загрузки подборки: ${selRes.status}`)
      }
      const selData: any = await selRes.json()

      const ids: number[] = selData?.data?.items ?? []

      const allRes = await fetch('/api/catalog/track/all/')
      if (!allRes.ok) {
        throw new Error(`Ошибка загрузки треков: ${allRes.status}`)
      }

      const allData: any = await allRes.json()

      const allTracks: any[] = Array.isArray(allData) ? allData : allData?.data ?? []

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
