<template>
  <div>
    <FilterControls
      :tracks="tracks"
      :title="categoryTitle"
      @filters-update="handleFiltersUpdate"
    />

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
import { computed, ref, watch } from 'vue'
import { navigateTo } from '#app'

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
  { immediate: true }
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
  { immediate: true }
)

onMounted(async () => {
  await fetchFavoriteTracks()
})

const activeFilters = ref({
  исполнителю: null,
  'году выпуска': null,
  жанру: null,
})

const handleFiltersUpdate = (values) => {
  activeFilters.value = values
}

const filteredTracks = computed(() => {
  let result = tracks.value || []

  if (activeFilters.value['исполнителю']) {
    const term = String(activeFilters.value['исполнителю']).toLowerCase().trim()
    result = result.filter((t) => t.author && String(t.author).toLowerCase().includes(term))
  }

  if (activeFilters.value['году выпуска']) {
    const term = String(activeFilters.value['году выпуска']).trim()
    result = result.filter((t) => {
      const dateStr = t.release_date
      if (!dateStr) return false
      const str = String(dateStr)
      if (str.length < 4) return false
      const year = str.split('-')[0]
      return year === term
    })
  }

  if (activeFilters.value['жанру']) {
    const term = String(activeFilters.value['жанру']).toLowerCase().trim()
    result = result.filter((t) => {
      const genres = Array.isArray(t.genre) ? t.genre : t.genre ? [String(t.genre)] : []

      return genres.some((g) => {
        const gNorm = String(g).toLowerCase().trim()
        return gNorm.includes(term)
      })
    })
  }

  return result
})
</script>
