import { usePlayerStore } from '~/stores/player'

export function useAudioPlayer() {
  const playerStore = usePlayerStore()

  watchEffect(() => {
    if (playerStore.progress >= 100 && playerStore.isPlaying) {
      playerStore.setPlaying(false)
    }
  })

  const initPlayer = (element) => {
    if (!element) {
      console.error('Плеера нет :(')
      return
    }
    playerStore.setAudioRef(element)
  }

  // Плей\Пауза
  const playTrack = async (track) => {
    if (!playerStore.audioRef) {
      console.error('Плеер не инициализирован: audioRef отсутствует')
      return
    }

    if (!playerStore.currentTrack) {
      playerStore.setCurrentTrack(track)
      playerStore.audioRef.src = track.track_file
      try {
        await playerStore.audioRef.play()
        playerStore.setPlaying(true)
      } catch (e) {
        console.error('Ошибка запуска нового трека', e)
        playerStore.setPlaying(false)
      }
      return
    }

    const isSameTrack = playerStore.currentTrack.track_file === track.track_file

    if (isSameTrack && playerStore.isPlaying) {
      playerStore.audioRef.pause()
      playerStore.setPlaying(false)
      return
    }

    if (isSameTrack && !playerStore.isPlaying) {
      try {
        await playerStore.audioRef.play()
        playerStore.setPlaying(true)
      } catch (e) {
        console.error('Ошибка продолжения воспроизведения', e)
        playerStore.setPlaying(false)
      }
      return
    }

    playerStore.setCurrentTrack(track)
    playerStore.audioRef.src = track.track_file
    playerStore.audioRef.load()

    setTimeout(async () => {
      try {
        await playerStore.audioRef.play()
        playerStore.setPlaying(true)
      } catch (e) {
        console.error('Ошибка play() для нового трека', e)
        playerStore.setPlaying(false)
      }
    }, 100)
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
    playTrack,
    handleTimeUpdate,
    seekTo,
    updateVolume,
  }
}
