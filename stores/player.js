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
    // Повтор текущего трека
    isLoop: false,
    // Включено ли перемешивание
    isShuffled: false,
    // Исходный порядок плейлиста (для отката shuffle)
    originalPlaylist: [],
  }),

  actions: {
    // Установить текущий трек
    setCurrentTrack(track) {
      this.currentTrack = track
    },

    play() {
      if (!this.audioRef) return Promise.resolve()

      return this.audioRef.play()
        .then(() => {
          this.isPlaying = true
        })
        .catch((e) => {
          console.warn('Не удалось запустить аудио:', e)
          this.isPlaying = false
          return Promise.resolve()
        })
    },

  pause() {
    this.isPlaying = false
    if (this.audioRef) {
      this.audioRef.pause()
    }
  },

    // Установить плейлист
    setPlaylist(tracks) {
      if (this.isShuffled) {
        // Shuffle активен — новый список сразу перемешиваем
        this.originalPlaylist = [...tracks]

        const shuffled = [...tracks]
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }

        this.playlist = shuffled
      } else {
        this.playlist = [...tracks]
        this.originalPlaylist = []
      }
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

    // Внутренний хелпер: поставить трек и запустить
    startTrack(track) {
      this.currentTrack = track

      if (this.audioRef && track?.track_file) {
        this.audioRef.src = track.track_file
        this.audioRef.load()
        this.play()
      }
    },

    // Следующий трек
    nextTrack() {
      if (!this.playlist.length || !this.currentTrack) return

      const currentIndex = this.playlist.findIndex(
        (t) => t.track_file === this.currentTrack.track_file
      )
      const isLast = currentIndex === this.playlist.length - 1

      // На последнем треке вперёд нельзя
      if (isLast) return

      this.startTrack(this.playlist[currentIndex + 1])
    },

    // Предыдущий трек
    prevTrack() {
      if (!this.playlist.length || !this.currentTrack) return

      const currentIndex = this.playlist.findIndex(
        (t) => t.track_file === this.currentTrack.track_file
      )
      const isFirst = currentIndex === 0

      // На первом треке назад нельзя
      if (isFirst) return

      this.startTrack(this.playlist[currentIndex - 1])
    },


    // Закольцевать трек
    toggleLoop() {
      this.isLoop = !this.isLoop
    },


    // Перемешать треки
    toggleShuffle() {
      if (!this.playlist.length) return

      if (!this.isShuffled) {
        // Запоминаем исходный порядок и перемешиваем копию
        this.originalPlaylist = [...this.playlist]

        const shuffled = [...this.playlist]
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }

        this.playlist = shuffled
        this.isShuffled = true
      } else {
        // Возвращаем исходный порядок
        this.playlist = [...this.originalPlaylist]
        this.isShuffled = false
      }
    },
  },
})
