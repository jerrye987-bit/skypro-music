import { usePlayerStore } from '~/stores/player'

export function useAudioPlayer() {
  const playerStore = usePlayerStore()

  // Трек закончился
  const handleEnded = () => {
    if (!playerStore.audioRef) return

    if (playerStore.isLoop) {
      // Повторяем текущий трек
      playerStore.audioRef.currentTime = 0
      playerStore.play()
      return
    }

    // Трек закончился — переходим к следующему
    const currentIndex = playerStore.playlist.findIndex(
      (t) => t.track_file === playerStore.currentTrack?.track_file,
    )
    const isLast = currentIndex === playerStore.playlist.length - 1

    if (playerStore.currentTrack && !isLast) {
      playerStore.nextTrack()
    } else {
      // Плейлист закончился — останавливаемся
      playerStore.setPlaying(false)
      playerStore.setProgress(0)
    }
  }

  const initPlayer = (element) => {
    if (!element) {
      console.error('Плеера нет :(')
      return
    }
    playerStore.setAudioRef(element)
  }

  // Кнопка Play в нижней панели
  const togglePlay = async () => {
    if (!playerStore.audioRef) return

    // Трек не выбран — запускаем первый из плейлиста
    if (!playerStore.currentTrack) {
      const first = playerStore.playlist[0]
      if (first) {
        await playTrack(first)
      }
      return
    }

    // Трек выбран — переключаем пауза/плей
    if (playerStore.isPlaying) {
      playerStore.audioRef.pause()
      playerStore.setPlaying(false)
    } else {
      await playerStore.play()
    }
  }

  // Плей\Пауза по клику на трек
  const playTrack = async (track) => {
    if (!playerStore.audioRef) {
      console.error('Плеер не инициализирован: audioRef отсутствует')
      return
    }

    const isSameTrack = playerStore.currentTrack?.track_file === track.track_file

    if (isSameTrack) {
      // Тот же трек: пауза или продолжение
      if (playerStore.isPlaying) {
        playerStore.audioRef.pause()
        playerStore.setPlaying(false)
      } else {
        await playerStore.play()
      }
      return
    }

    // Другой трек — единственный путь запуска
    playerStore.startTrack(track)
  }

  // Обновляем прогресс трека
  const handleTimeUpdate = () => {
    if (!playerStore.audioRef) return

    const currentTime = playerStore.audioRef.currentTime
    const duration = playerStore.audioRef.duration

    if (duration) {
      const progress = (currentTime / duration) * 100
      playerStore.setProgress(progress)
    }
  }

  // Перематываем
  const seekTo = (percentage) => {
    if (!playerStore.audioRef || !playerStore.currentTrack) return
    const newTime = (percentage / 100) * playerStore.audioRef.duration
    playerStore.audioRef.currentTime = newTime
    playerStore.setProgress(percentage)
  }

  // Меняем громкость
  const updateVolume = () => {
    if (!playerStore.audioRef) return
    playerStore.audioRef.volume = playerStore.volume / 100
  }

  return {
    initPlayer,
    handleEnded,
    playTrack,
    togglePlay,
    handleTimeUpdate,
    seekTo,
    updateVolume,
  }
}
