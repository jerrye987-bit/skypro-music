<script setup>
import { useTracks } from '@/composables/useTracks'

const { tracks, loading, error, fetchTracks } = useTracks()

onMounted(() => {
  fetchTracks()
})
</script>

<template>
  <div class="content__playlist playlist">
    <!-- Отображение загрузки -->
    <div v-if="loading" class="loading">
      Загрузка треков...
    </div>

    <!-- Обработка ошибок -->
    <div v-else-if="error" class="error">
      Ошибка загрузки: {{ error }}
    </div>

    <!-- Отображение треков -->
    <div v-else>
      <TrackItem
        v-for="track in tracks"
        :key="track.id"
        :track="track"
      />
    </div>
  </div>
</template>

<style scoped>
  .loading, .error {
    padding: 20px;
    text-align: center;
  }
</style>
