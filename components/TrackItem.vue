<template>
  <div class="playlist__item">
    <div class="playlist__track">
      <div class="track__title">
        <div class="track__titleImage">
            <div
              class="track-indicator"
              :class="{
                'track-indicator--active': isCurrentTrack,
                'track-indicator--paused': !isPlaying
              }"
            ></div>
          <svg class="track__titleSvg">
            <use xlink:href="/img/icon/sprite.svg#icon-note" />
          </svg>
        </div>
        <div class="track__title-text">
          <a class="track__titleLink" role="button" tabindex="0" @click.stop="handlePlay">
            {{ track?.name || 'Нет названия' }}
            <span class="track__titleSpan">{{ track?.subtitle }}</span>
          </a>
        </div>
      </div>

      <!-- Исполнитель -->
      <div class="track__author">
        <a class="track__authorLink" role="button" tabindex="0" @click.stop="handlePlay">
          {{ track?.author || 'Неизвестный' }}
        </a>
      </div>

      <!-- Альбом -->
      <div class="track__album">
        <a class="track__albumLink" role="button" tabindex="0" @click.stop="handlePlay">
          {{ track?.album || 'Без альбома' }}
        </a>
      </div>

      <!-- Лайк и время -->
      <div class="track__time">
        <svg
          class="track__timeSvg"
          :class="{ 'track__timeSvg--liked': isInFavorites }"
          @click.stop="toggleFavorite"
        >

          <use xlink:href="/img/icon/sprite.svg#icon-like" />
        </svg>
        <span class="track__timeText">{{ track?.time || '00:00' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePlayerStore } from '~/stores/player'
import { ref, computed } from 'vue'

const props = defineProps({
  track: {
    type: Object,
    required: true,
  },
  favoriteTracks: {
    type: Array,
    default: () => [],
  }
})

const emit = defineEmits(['play', 'refresh-favorites', 'need-login'])

const playerStore = usePlayerStore()

const isCurrentTrack = computed(() => {
  if (!playerStore.currentTrack) {
    return false
  }

  const currentFile = playerStore.currentTrack.track_file
  const trackFile = props.track?.track_file

  return currentFile === trackFile
})

const isPlaying = computed(() => playerStore.isPlaying)

const handlePlay = () => {
  emit('play', props.track)
}
const isPending = ref(false)

const isInFavorites = computed(() => {
  const trackId = String(props.track?._id ?? '')
  return props.favoriteTracks.some(
    (fav) => String(fav?._id ?? '') === trackId
  )
})

const toggleFavorite = async () => {
  const id = props.track?._id

  if (isPending.value || !id) return
  isPending.value = true

  const token = localStorage.getItem('access_token')

  if (!token) {
    isPending.value = false
    emit('need-login')
    return
  }

  try {
    const baseUrl = 'https://webdev-music-003b5b991590.herokuapp.com'
    const url = `${baseUrl}/catalog/track/${id}/favorite/`
    const method = isInFavorites.value ? 'DELETE' : 'POST'

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      const msg = data?.message || `Ошибка: ${res.status} ${res.statusText}`
      alert(msg)
      return
    }

    emit('refresh-favorites')
  } catch (e) {
    console.error('toggleFavorite error:', e)
    alert('Не удалось изменить избранное. Проверьте соединение.')
  } finally {
    isPending.value = false
  }
}
</script>

<style scoped>
.track__titleLink,
.track__authorLink,
.track__albumLink {
  text-decoration: none;
  color: inherit;
}

.playlist__item {
  width: 100%;
  display: block;
  margin-bottom: 12px;
}

.playlist__track {
  font-family: 'Montserrat', sans-serif;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.track__title {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 0 1 447px;
  min-width: 0;
}

.track__titleImage {
  width: 51px;
  height: 51px;
  padding: 16px;
  background: #313131;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 17px;
  position: relative;
  z-index: 1;
}

.track__titleSvg {
  width: 18px;
  height: 17px;
  fill: transparent;
  stroke: #4e4e4e;
  cursor: pointer;
}

.track__titleLink {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  cursor: pointer;
}

.track__titleSpan {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #4e4e4e;
}

.track__author {
  flex: 0 1 321px;
  min-width: 0;
  display: flex;
  justify-content: flex-start;
  padding-left: 10px;
}

.track__authorLink {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  text-align: left;
  cursor: pointer;
}

.track__album {
  flex: 0 1 245px;
  min-width: 0;
  padding-left: 10px;
}

.track__albumLink {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #696969;
  cursor: pointer;
}

.track__time {
  flex: 0 0 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.track__timeSvg {
  width: 14px;
  height: 12px;
  margin-right: 17px;
  fill: transparent;
  stroke: #696969;
  cursor: pointer;
}

.track__timeSvg--liked {
  fill: #b672ff;
  stroke: transparent;
}

.track__timeText {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #696969;
  text-align: right;
}

.track-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(182, 114, 255, 0.5);
  background-color: transparent;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.track-indicator.track-indicator--active {
  background-color: #b672ff;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.track-indicator.track-indicator--active:not(.track-indicator--paused) {
  animation: pulse-dot 1.4s infinite ease-in-out;
}

@keyframes pulse-dot {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.4);
    opacity: 0.6;
  }
}

</style>
