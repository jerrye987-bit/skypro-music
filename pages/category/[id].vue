<template>
  <div>
    <FilterControls :tracks="tracks" :title="categoryTitle" />

    <div v-if="isLoading" class="loading-state">
      <p>Загрузка треков...</p>
    </div>

    <PlayList
      v-else-if="filteredTracks.length > 0"
      :filtered-tracks="filteredTracks"
      :favorite-tracks="favoriteTracks"
      @refresh-favorites="refreshFavorites"
    />

    <div v-else class="empty-state">
      <h3>Треков не найдено 🤔</h3>
      <p>Попробуйте обновить страницу.</p>
    </div>
  </div>
</template>

<script setup>
import FilterControls from '~/components/FilterControls.vue'
import PlayList from '~/components/PlayList.vue'
import { useCatalogTracks } from '~/composables/useCatalogTracks'
import { useFavoriteTracks } from '~/composables/useFavoriteTracks'
import { useFiltersStore } from '~/stores/filters'

const route = useRoute()

const categories = {
  2: 'Плейлист дня',
  3: '100 танцевальных хитов',
  4: 'Инди-заряд',
}

const categoryId = computed(() => Number(route.params.id))

watch(
  categoryId,
  (id) => {
    if (!categories[id]) return navigateTo('/')
  },
  { immediate: true },
)

const categoryTitle = computed(() => categories[categoryId.value] || '')

useHead({
  title: computed(() => `${categoryTitle.value} | Skypro.Music`),
  meta: [
    { name: 'description', content: 'Подборка треков на Skypro.Music' },
    { property: 'og:site_name', content: 'Skypro Music' },
  ],
})

const { tracks, fetchCatalogTracks, isLoading } = useCatalogTracks()

const { favoriteTracks, fetchFavoriteTracks } = useFavoriteTracks()

const refreshFavorites = async () => {
  await fetchFavoriteTracks()
}

watch(
  categoryId,
  async (id) => {
    if (!categories[id]) return
    await fetchCatalogTracks(id)
  },
  { immediate: true },
)

onMounted(async () => {
  await fetchFavoriteTracks()
})

const filtersStore = useFiltersStore()
const filteredTracks = computed(() => filtersStore.filteredTracks(tracks.value))
</script>
