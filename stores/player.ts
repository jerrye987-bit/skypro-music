import { defineStore } from 'pinia'
import { shuffleTracks } from '~/utils/shuffle'

interface Track {
  id: number
  name: string
  track_file: string
}

interface AudioElement {
  src: string
  volume: number
  load(): void
  play(): Promise<void>
  pause(): void
}

export const usePlayerStore = defineStore('player', {
  state: () => ({
    // Текущий трек
    currentTrack: null as Track | null,
    // Список треков
    playlist: [] as Track[],
    // Исходный порядок плейлиста (для отката shuffle)
    originalPlaylist: [] as Track[],
    // Играет ли сейчас
    isPlaying: false,
    // Прогресс воспроизведения (0-100)
    progress: 0,
    // Громкость (0-100)
    volume: 50,
    // Ссылка на аудиотег
    audioRef: null as AudioElement | null,
    // Повтор текущего трека
    isLoop: false,
    // Включено ли перемешивание
    isShuffled: false,
  }),

  actions: {
    // Установить текущий трек
    setCurrentTrack(track: Track) {
      this.currentTrack = track
    },

    play() {
      if (!this.audioRef) return Promise.resolve()

      return this.audioRef
        .play()
        .then(() => {
          this.isPlaying = true
        })
        .catch((e) => {
          if ((e as DOMException)?.name === 'AbortError') {
            return Promise.resolve()
          }
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
    setPlaylist(tracks: Track[]) {
      if (this.isShuffled) {
        // Shuffle активен — новый список сразу перемешиваем
        this.originalPlaylist = [...tracks]
        this.playlist = shuffleTracks(tracks)
      } else {
        this.playlist = [...tracks]
        this.originalPlaylist = []
      }
    },

    // Установить прогресс
    setProgress(progress: number) {
      this.progress = progress
    },

    // Установить громкость
    setVolume(volume: number) {
      this.volume = volume
    },

    // Установить состояние воспроизведения
    setPlaying(isPlaying: boolean) {
      this.isPlaying = isPlaying
    },

    // Установить ссылку на аудиоэлемент
    setAudioRef(element: AudioElement | null) {
      this.audioRef = element
      if (this.audioRef) {
        this.audioRef.volume = this.volume / 100
      }
    },

    // Внутренний хелпер: поставить трек и запустить
    startTrack(track: Track | undefined) {
      this.currentTrack = track ?? null

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
        (t) => t.track_file === this.currentTrack?.track_file,
      )
      const isLast = currentIndex === this.playlist.length - 1

      // На последнем треке вперёд нельзя
      if (isLast || currentIndex === -1) return

      this.startTrack(this.playlist[currentIndex + 1])
    },

    // Предыдущий трек
    prevTrack() {
      if (!this.playlist.length || !this.currentTrack) return

      const currentIndex = this.playlist.findIndex(
        (t) => t.track_file === this.currentTrack?.track_file,
      )
      const isFirst = currentIndex === 0

      // На первом треке назад нельзя
      if (isFirst || currentIndex === -1) return

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
        this.playlist = shuffleTracks(this.playlist)
        this.isShuffled = true
      } else {
        // Возвращаем исходный порядок
        this.playlist = [...this.originalPlaylist]
        this.isShuffled = false
      }
    },
  },
})
