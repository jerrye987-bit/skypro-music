import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePlayerStore } from '~/stores/player'

const track = (id: number) => ({ id, name: `Track ${id}`, track_file: `file-${id}.mp3` })

const createAudio = () => ({
  src: '',
  volume: 1,
  load: vi.fn(),
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
})

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('простые сеттеры', () => {
  it('setCurrentTrack', () => {
    const store = usePlayerStore()
    store.setCurrentTrack(track(1))
    expect(store.currentTrack?.id).toBe(1)
  })

  it('setProgress, setVolume, setPlaying', () => {
    const store = usePlayerStore()
    store.setProgress(42)
    store.setVolume(80)
    store.setPlaying(true)
    expect(store.progress).toBe(42)
    expect(store.volume).toBe(80)
    expect(store.isPlaying).toBe(true)
  })

  it('setAudioRef выставляет громкость из стора', () => {
    const store = usePlayerStore()
    const audio = createAudio()
    store.setAudioRef(audio)
    expect(audio.volume).toBe(0.5)
  })

  it('setAudioRef(null) не падает', () => {
    const store = usePlayerStore()
    expect(() => store.setAudioRef(null)).not.toThrow()
  })
})

describe('play / pause', () => {
  it('play без audioRef не падает', async () => {
    const store = usePlayerStore()
    await expect(store.play()).resolves.toBeUndefined()
    expect(store.isPlaying).toBe(false)
  })

  it('play запускает воспроизведение', async () => {
    const store = usePlayerStore()
    const audio = createAudio()
    store.setAudioRef(audio)
    await store.play()
    expect(audio.play).toHaveBeenCalled()
    expect(store.isPlaying).toBe(true)
  })

  it('play при ошибке запуска сбрасывает isPlaying', async () => {
    const store = usePlayerStore()
    const audio = createAudio()
    audio.play.mockRejectedValueOnce(new Error('autoplay'))
    store.setAudioRef(audio)
    await store.play()
    expect(store.isPlaying).toBe(false)
  })

  it('play при AbortError не сбрасывает isPlaying', async () => {
    const store = usePlayerStore()
    store.setAudioRef({
      play: vi.fn().mockRejectedValue(new DOMException('interrupted', 'AbortError')),
    } as any)
    store.isPlaying = true

    await store.play()

    expect(store.isPlaying).toBe(true)
  })

  it('pause останавливает', () => {
    const store = usePlayerStore()
    const audio = createAudio()
    store.setAudioRef(audio)
    store.isPlaying = true
    store.pause()
    expect(audio.pause).toHaveBeenCalled()
    expect(store.isPlaying).toBe(false)
  })

  it('pause без audioRef не падает', () => {
    const store = usePlayerStore()
    expect(() => store.pause()).not.toThrow()
  })
})

describe('startTrack', () => {
  it('ставит трек и запускает аудио', async () => {
    const store = usePlayerStore()
    const audio = createAudio()
    store.setAudioRef(audio)

    store.startTrack(track(2))
    expect(store.currentTrack?.id).toBe(2)
    expect(audio.src).toBe('file-2.mp3')
    expect(audio.load).toHaveBeenCalled()
    expect(audio.play).toHaveBeenCalled()
    await vi.waitFor(() => expect(store.isPlaying).toBe(true))
  })

  it('без audioRef только ставит currentTrack', () => {
    const store = usePlayerStore()
    store.startTrack(track(1))
    expect(store.currentTrack?.id).toBe(1)
  })

  it('undefined трек → currentTrack null', () => {
    const store = usePlayerStore()
    store.startTrack(undefined)
    expect(store.currentTrack).toBeNull()
  })
})

describe('навигация по плейлисту', () => {
  it('nextTrack с середины идёт вперёд', () => {
    const store = usePlayerStore()
    store.setPlaylist([track(1), track(2), track(3)])
    store.setCurrentTrack(track(2))
    store.nextTrack()
    expect(store.currentTrack?.id).toBe(3)
  })

  it('nextTrack на последнем треке ничего не делает', () => {
    const store = usePlayerStore()
    store.setPlaylist([track(1), track(2), track(3)])
    store.setCurrentTrack(track(3))
    store.nextTrack()
    expect(store.currentTrack?.id).toBe(3)
  })

  it('nextTrack при пустом плейлисте безопасен', () => {
    const store = usePlayerStore()
    expect(() => store.nextTrack()).not.toThrow()
  })

  it('nextTrack без currentTrack безопасен', () => {
    const store = usePlayerStore()
    store.setPlaylist([track(1), track(2)])
    expect(() => store.nextTrack()).not.toThrow()
  })

  it('prevTrack при пустом плейлисте безопасен', () => {
    const store = usePlayerStore()
    expect(() => store.prevTrack()).not.toThrow()
  })

  it('prevTrack без currentTrack безопасен', () => {
    const store = usePlayerStore()
    store.setPlaylist([track(1), track(2)])
    expect(() => store.prevTrack()).not.toThrow()
  })

  it('prevTrack со второго идёт назад', () => {
    const store = usePlayerStore()
    store.setPlaylist([track(1), track(2), track(3)])
    store.setCurrentTrack(track(2))
    store.prevTrack()
    expect(store.currentTrack?.id).toBe(1)
  })

  it('prevTrack на первом треке ничего не делает', () => {
    const store = usePlayerStore()
    store.setPlaylist([track(1), track(2)])
    store.setCurrentTrack(track(1))
    store.prevTrack()
    expect(store.currentTrack?.id).toBe(1)
  })
})

describe('перемешивание', () => {
  it('toggleShuffle перемешивает и запоминает исходный порядок', () => {
    const store = usePlayerStore()
    vi.spyOn(Math, 'random').mockReturnValue(0)
    store.setPlaylist([track(1), track(2), track(3)])

    store.toggleShuffle()
    expect(store.isShuffled).toBe(true)
    expect(store.playlist.map((t) => t.id)).toEqual([2, 3, 1])
    expect(store.originalPlaylist.map((t) => t.id)).toEqual([1, 2, 3])
  })

  it('повторный toggleShuffle возвращает исходный порядок', () => {
    const store = usePlayerStore()
    vi.spyOn(Math, 'random').mockReturnValue(0)
    store.setPlaylist([track(1), track(2), track(3)])

    store.toggleShuffle()
    store.toggleShuffle()
    expect(store.isShuffled).toBe(false)
    expect(store.playlist.map((t) => t.id)).toEqual([1, 2, 3])
  })

  it('toggleShuffle на пустом плейлисте ничего не делает', () => {
    const store = usePlayerStore()
    store.toggleShuffle()
    expect(store.isShuffled).toBe(false)
  })

  it('setPlaylist при активном shuffle сразу перемешивает', () => {
    const store = usePlayerStore()
    store.isShuffled = true
    vi.spyOn(Math, 'random').mockReturnValue(0)
    store.setPlaylist([track(1), track(2), track(3)])
    expect(store.playlist.map((t) => t.id)).toEqual([2, 3, 1])
    expect(store.originalPlaylist.map((t) => t.id)).toEqual([1, 2, 3])
  })

  it('setPlaylist при выключенном shuffle сохраняет порядок', () => {
    const store = usePlayerStore()
    const tracks = [track(1), track(2)]
    store.setPlaylist(tracks)
    expect(store.playlist).toEqual(tracks)
    expect(store.playlist).not.toBe(tracks)
    expect(store.originalPlaylist).toEqual([])
  })
})

describe('toggleLoop', () => {
  it('переключает повтор', () => {
    const store = usePlayerStore()
    store.toggleLoop()
    expect(store.isLoop).toBe(true)
    store.toggleLoop()
    expect(store.isLoop).toBe(false)
  })
})
