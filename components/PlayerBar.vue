<template>
  <div class="bar">
    <div class="bar__content">
      <div class="bar__playerProgress" @click="handleProgressClick">
        <div class="bar_player-progress-line" :style="{ width: playerStore.progress + '%' }" />
      </div>
      <div class="bar__playerBlock">
        <div class="bar__player player">
          <div class="player__controls">
            <div class="player__btnPrev">
              <svg class="player__btnPrevSvg">
                <use xlink:href="/img/icon/sprite.svg#icon-prev" />
              </svg>
            </div>
            <div class="player__btnPlay btn" @click="handlePlay">
              <svg class="player__btnPlaySvg">
                <use :xlink:href="playIconPath" />
              </svg>
            </div>
            <div class="player__btnNext">
              <svg class="player__btnNextSvg">
                <use xlink:href="/img/icon/sprite.svg#icon-next" />
              </svg>
            </div>
            <div class="player__btnRepeat btnIcon">
              <svg class="player__btnRepeatSvg">
                <use xlink:href="/img/icon/sprite.svg#icon-repeat" />
              </svg>
            </div>
            <div class="player__btnShuffle btnIcon">
              <svg class="player__btnShuffleSvg">
                <use xlink:href="/img/icon/sprite.svg#icon-shuffle" />
              </svg>
            </div>
          </div>

          <div class="player__trackPlay trackPlay">
            <div class="trackPlay__contain">
              <div class="trackPlay__image">
                <svg class="trackPlay__svg">
                  <use xlink:href="/img/icon/sprite.svg#icon-note" />
                </svg>
              </div>
              <div class="trackPlay__author">
                <a class="trackPlay__authorLink" href="#">
                  {{ playerStore.currentTrack?.author || 'Выберите трек' }}</a
                >
              </div>
              <div class="trackPlay__album">
                <a class="trackPlay__albumLink" href="#">
                  {{ playerStore.currentTrack?.album || '' }}
                </a>
              </div>
            </div>
            <div class="trackPlay__likeDis">
              <div class="trackPlay__like btnIcon">
                <svg class="trackPlay__likeSvg">
                  <use xlink:href="/img/icon/sprite.svg#icon-like" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="bar__volumeBlock">
          <div class="volume__content">
            <div class="volume__image">
              <svg class="volume__svg">
                <use xlink:href="/img/icon/sprite.svg#icon-volume" />
              </svg>
            </div>
            <div class="volume__progress btn">
              <input
                v-model="playerStore.volume"
                class="volume__progressLine btn"
                type="range"
                name="range"
                min="0"
                max="100"
                @input="updateVolume"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <audio ref="audioRef" @timeupdate="handleTimeUpdate" />
  </div>
</template>

<script setup>
import { usePlayerStore } from '~/stores/player'
import { useAudioPlayer } from '~/composables/useAudioPlayer'
import { ref, onMounted } from 'vue'

const playerStore = usePlayerStore()
const audioRef = ref(null)

const playIconPath = playerStore.isPlaying
  ? '/img/icon/sprite.svg#icon-pause'
  : '/img/icon/sprite.svg#icon-play'

const { playTrack, handleTimeUpdate, seekTo, updateVolume, initPlayer } = useAudioPlayer()

const handlePlay = () => {
  if (playerStore.currentTrack) {
    playTrack(playerStore.currentTrack)
  }
}

const handleProgressClick = (event) => {
  if (!playerStore.currentTrack) return

  const progressBar = event.currentTarget
  // узнаём, где конкретно мы кликнули
  const clickPosition = event.offsetX
  // получаем общую ширину бара
  const progressBarWidth = progressBar.offsetWidth
  // и узнаем процентное соотношение клика к общей ширине.
  // если в середине - 50%, значит нам нужна половина трека
  const percentage = (clickPosition / progressBarWidth) * 100
  // передаём это значение в хук, чтобы он обновил значение в хранилище
  seekTo(percentage)
}

onMounted(() => {
  initPlayer(audioRef.value)
})
</script>

<style scoped>
.bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(28, 28, 28, 0.5);
}

.bar__content {
  display: flex;
  flex-direction: column;
}

.bar__playerProgress {
  width: 100%;
  height: 5px;
  background: #2e2e2e;
}

.bar__playerBlock {
  height: 73px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.bar__player {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.bar__volumeBlock {
  width: auto;
  display: flex;
  align-items: center;
  padding: 0 92px 0 0;
}

.player__controls {
  display: flex;
  flex-direction: row;
  padding: 0 27px 0 31px;
}

.player__btnPrev,
.player__btnPlay,
.player__btnNext,
.player__btnRepeat,
.player__btnShuffle {
  padding: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.player__btnPrev {
  margin-right: 23px;
}

.player__btnPrevSvg {
  width: 15px;
  height: 14px;
}

.player__btnPlay {
  margin-right: 23px;
}

.player__btnPlaySvg {
  width: 22px;
  height: 20px;
  fill: #d9d9d9;
}

.player__btnNext {
  margin-right: 28px;
  fill: #a53939;
}

.player__btnNextSvg {
  width: 15px;
  height: 14px;
  fill: inherit;
  stroke: #d9d9d9;
}

.player__btnRepeat {
  margin-right: 24px;
}

.player__btnRepeatSvg {
  width: 18px;
  height: 12px;
  fill: transparent;
  stroke: #696969;
}

.player__btnShuffle {
  display: flex;
  align-items: center;
}

.player__btnShuffleSvg {
  width: 19px;
  height: 12px;
  fill: transparent;
  stroke: #696969;
}

.player__trackPlay {
  display: flex;
  flex-direction: row;
}

.trackPlay__contain {
  width: auto;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas: 'image author' 'image album';
  align-items: center;
}

.trackPlay__image {
  width: 51px;
  height: 51px;
  background-color: #313131;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  grid-area: image;
}

.trackPlay__svg {
  width: 18px;
  height: 17px;
  fill: transparent;
  stroke: #4e4e4e;
}

.trackPlay__author {
  grid-area: author;
  min-width: 49px;
}

.trackPlay__authorLink {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  white-space: nowrap;
}

.trackPlay__album {
  grid-area: album;
  min-width: 49px;
}

.trackPlay__albumLink {
  font-weight: 400;
  font-size: 13px;
  line-height: 24px;
  color: #ffffff;
}

.trackPlay__likeDis {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 26%;
}

.trackPlay__like,
.trackPlay__dislike {
  padding: 5px;
  cursor: pointer;
}

.trackPlay__likeSvg {
  width: 14px;
  height: 12px;
  fill: transparent;
  stroke: #696969;
}

.trackPlay__dislike {
  margin-left: 28.5px;
}

.trackPlay__dislikeSvg {
  width: 14.34px;
  height: 13px;
  fill: transparent;
  stroke: #696969;
}

.volume__content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
}

.volume__image {
  width: 13px;
  height: 18px;
  margin-right: 17px;
}

.volume__svg {
  width: 13px;
  height: 18px;
  fill: transparent;
}

.volume__progress {
  width: 109px;
  display: flex;
  align-items: center;
}

.volume__progressLine {
  width: 100%;
  height: 2px;
  appearance: none;
  background: #797979;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
}

.volume__progressLine::-webkit-slider-runnable-track {
  height: 2px;
  background: #797979;
  border-radius: 5px;
}

.volume__progressLine::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #1a1a1a;
  border: 2px solid white;
  border-radius: 50%;
  margin-top: -7px;
}

.btnIcon:hover svg {
  fill: transparent;
  stroke: #acacac;
  cursor: pointer;
}

.btnIcon:active svg {
  fill: transparent;
  stroke: #ffffff;
  cursor: pointer;
}

.btnIcon:active .trackPlay__likeSvg,
.btnIcon:active .trackPlay__dislikeSvg {
  fill: #696969;
  stroke: #ffffff;
  cursor: pointer;
}
</style>
