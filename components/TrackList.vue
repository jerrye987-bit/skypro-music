<template>
  <div class="playlist-list">
    <TrackItem
      v-for="track in tracks"
      :key="String(track._id)"
      :track="track"
      :favorite-tracks="favoriteTracks"
      @play="(t) => emit('play', t)"
      @refresh-favorites="emit('refresh-favorites')"
      @need-login="(e) => emit('need-login', e)"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import TrackItem from './TrackItem.vue'

const emit = defineEmits(['play', 'refresh-favorites', 'need-login'])

defineProps({
  tracks: {
    type: Array,
    default: () => []
  },
  favoriteTracks: {
    type: Array,
    default: () => []
  },
})
</script>

<style scoped>
.loading,
.error {
  padding: 20px;
  text-align: center;
}

.track-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.track-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid #4e4e4e;
  color: #ffffff;
}

.content__title {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
}

.playlistTitle__col {
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 2px;
  color: #696969;
  text-transform: uppercase;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col01 {
  flex: 0 1 447px;
  min-width: 0;
}

.col02 {
  flex: 0 1 321px;
  min-width: 0;
}

.col03 {
  flex: 0 1 245px;
  min-width: 0;
}

.col04 {
  flex: 0 0 80px;
  text-align: end;
}
</style>
