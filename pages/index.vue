<template>
  <div>
    <FilterControls :tracks="tracks" title="Треки" @filters-update="handleFiltersUpdate" />

    <PlayList :filtered-tracks="filteredTracks" />
  </div>
</template>

<script setup>
import FilterControls from '~/components/FilterControls.vue'
import PlayList from '~/components/PlayList.vue'
import { useTracks } from '~/composables/useTracks'
import { ref, computed } from 'vue'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Главная | Skypro.Music',
  meta: [
    { name: 'description', content: 'Музыкальная платформа Skypro.Music' },
    { property: 'og:site_name', content: 'Skypro Music' },
  ],
})

const { tracks, fetchTracks } = useTracks()

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
    result = result.filter(t =>
      t.author && String(t.author).toLowerCase().includes(term)
    )
  }

  if (activeFilters.value['году выпуска']) {
    const term = String(activeFilters.value['году выпуска']).trim()
    result = result.filter(t => {
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
    result = result.filter(t => {
      const genres = Array.isArray(t.genre)
        ? t.genre
        : (t.genre ? [String(t.genre)] : [])
      return genres.some(g => {
        const gNorm = String(g).toLowerCase().trim()
        return gNorm.includes(term)
      })
    })
  }


return result
})

fetchTracks()
</script>
