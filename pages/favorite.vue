<template>
  <div>
    <FilterControls
      :tracks="favoriteTracks"
      title="Мои треки"
      @filters-update="handleFiltersUpdate"
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
import { ref, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { navigateTo } from '#app'

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

const activeFilters = ref({
  исполнителю: null,
  'году выпуска': null,
  жанру: null,
})

const handleFiltersUpdate = (values) => {
  activeFilters.value = values
}

const filteredTracks = computed(() => {
  let result = favoriteTracks.value || []

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
