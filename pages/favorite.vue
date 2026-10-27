<template>
  <div>
    <FilterControls
      :tracks="favoriteTracks"
      title="Мои треки"
    />
    <div v-if="isLoading" class="loading-state">
      <p>Загрузка избранного...</p>
    </div>
    <PlayList
      v-if="filteredTracks.length > 0"
      :filtered-tracks="filteredTracks"
      :favorite-tracks="favoriteTracks"
      @refresh-favorites="refreshFavorites"
    />

    <div v-else class="empty-state">
      <h3>В избранном пока пусто 😔</h3>
      <p>Добавьте любимые треки — они появятся здесь.</p>
    </div>
  </div>
</template>

<script setup>
import FilterControls from '~/components/FilterControls.vue'
import PlayList from '~/components/PlayList.vue'
import { useFavoriteTracks } from '~/composables/useFavoriteTracks'
import { useFiltersStore } from '~/stores/filters'

useHead({
  title: 'Мои треки | Skypro.Music',
  meta: [
    { name: 'description', content: 'Ваши избранные треки на Skypro.Music' },
    { property: 'og:site_name', content: 'Skypro Music' },
  ],
})

const { favoriteTracks, fetchFavoriteTracks, isLoading } = useFavoriteTracks()

const refreshFavorites = async () => {
  await fetchFavoriteTracks()
}

onMounted(async () => {
  if (!import.meta.client) return

  const token = localStorage.getItem('access_token')

  if (!token) {
    return navigateTo('/signin')
  }

  await fetchFavoriteTracks()
})

const filtersStore = useFiltersStore()
const filteredTracks = computed(() => filtersStore.filteredTracks(favoriteTracks.value))

</script>
