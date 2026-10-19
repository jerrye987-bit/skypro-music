<template>
  <div>
    <FilterControls
      title="Мои треки"
      @filters-update="onFiltersUpdate"
   />
    <PlayList :tracks="filteredTracks" :loading="loading" :error="error" />
  </div>
</template>

<script setup>
import FilterControls from '~/components/FilterControls.vue'
import PlayList from '~/components/PlayList.vue'
import { usePlaylists } from '~/composables/usePlaylists'
import { computed, ref } from 'vue'

const { allTracks, loading, error } = usePlaylists()

const currentFilters = ref({
  'исполнителю': null,
  'году выпуска': null,
  'жанру': null
})

const onFiltersUpdate = (values) => {
  currentFilters.value = values
}

const filteredTracks = computed(() => {
  let result = allTracks.value || []

  if (currentFilters.value['исполнителю']) {
    const val = currentFilters.value['исполнителю']?.toLowerCase()
    result = result.filter(track =>
      track.author?.toLowerCase() === val
    )
  }
  if (currentFilters.value['году выпуска']) {
    const val = currentFilters.value['году выпуска']
    result = result.filter(track => {
      const year = track.release_date?.split('-')[0]
      return year === val
    })
  }
  if (currentFilters.value['жанру']) {
    const val = currentFilters.value['жанру']?.toLowerCase()
    result = result.filter(track => {
      const genres = Array.isArray(track.genre)
        ? track.genre.map(g => String(g).toLowerCase())
        : [String(track.genre).toLowerCase()].filter(Boolean)
      return genres.includes(val)
    })
  }

  return result
})

useHead({
  title: 'Плейлист | Skypro.Music',
  meta: [
    { name: 'description', content: 'Музыкальная платформа Skypro.Music' },
    { property: 'og:site_name', content: 'Skypro Music' },
  ],
})
</script>
