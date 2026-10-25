import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    // Текущий трек
    currentTrack: null,
    // Список треков
    playlist: [],
    // Играет ли сейчас
    isPlaying: false,
    // Прогресс воспроизведения (0-100)
    progress: 0,
    // Громкость (0-100)
    volume: 50,
    // Ссылка на аудиотег
    audioRef: null,
  }),

  actions: {
    // Установить текущий трек
    setCurrentTrack(track) {
      this.currentTrack = track

      if (this.audioRef && track?.track_file) {
        this.audioRef.src = track.track_file
        this.play()
      }
    },

    play() {
    this.isPlaying = true
    if (this.audioRef) {
      return this.audioRef.play().catch(e => {
        console.warn('Не удалось запустить аудио:', e)
        return Promise.resolve()
      })
    }
    return Promise.resolve()
  },

  pause() {
    this.isPlaying = false
    if (this.audioRef) {
      this.audioRef.pause()
    }
  },

    // Установить плейлист
    setPlaylist(tracks) {
      this.playlist = tracks
    },

    // Установить прогресс
    setProgress(progress) {
      this.progress = progress
    },

    // Установить громкость
    setVolume(volume) {
      this.volume = volume
    },

    // Установить состояние воспроизведения
    setPlaying(isPlaying) {
      this.isPlaying = isPlaying
    },

    // Установить ссылку на аудиоэлемент
    setAudioRef(element) {
      this.audioRef = element
      if (this.audioRef) {
        this.audioRef.volume = this.volume / 100
      }
    },
  },
})
