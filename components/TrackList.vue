<script setup>
import { onMounted } from 'vue'
import { useTracks } from '@/composables/useTracks'
import TrackItem from './TrackItem.vue'
import { useAudioPlayer } from '~/composables/useAudioPlayer'

const { tracks, loading, error, fetchTracks } = useTracks()
const { playTrack } = useAudioPlayer()

onMounted(() => {
  fetchTracks()
})
</script>

<template>
  <div class="content__playlist playlist">
    <div v-if="loading" class="loading">Загрузка треков...</div>

    <div v-else-if="error" class="error">Ошибка загрузки: {{ error }}</div>

    <div v-else >
      <TrackItem v-for="track in tracks" :key="track.id" :track="track" @play="playTrack" />
    </div>
  </div>
</template>

<style scoped>
.loading,
.error {
  padding: 20px;
  text-align: center;
}

</style>
