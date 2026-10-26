<template>
  <div>
    <FilterControls
      :tracks="tracks"
      title="Треки"
    />

    <PlayList
      :filtered-tracks="filteredTracks"
      :favorite-tracks="favoriteTracks"
      @refresh-favorites="refreshFavorites"
    />
  </div>
</template>

<script setup>
import FilterControls from '~/components/FilterControls.vue'
import PlayList from '~/components/PlayList.vue'
import { useTracks } from '~/composables/useTracks'
import { useFavoriteTracks } from '~/composables/useFavoriteTracks'
import { useFiltersStore } from '~/stores/filters'
import { computed, onMounted } from 'vue'

useHead({
  title: 'Главная | Skypro.Music',
  meta: [
    { name: 'description', content: 'Музыкальная платформа Skypro.Music' },
    { property: 'og:site_name', content: 'Skypro Music' },
  ],
})

const { tracks, fetchTracks } = useTracks()
const { favoriteTracks, fetchFavoriteTracks } = useFavoriteTracks()

const refreshFavorites = () => {
  fetchFavoriteTracks()
}

const filtersStore = useFiltersStore()
const filteredTracks = computed(() => filtersStore.filteredTracks(tracks.value))

onMounted(async () => {
  await Promise.all([fetchTracks(), fetchFavoriteTracks()])
})
</script>
