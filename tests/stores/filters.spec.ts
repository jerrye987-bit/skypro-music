import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFiltersStore } from '~/stores/filters'

const tracks = [
  { name: 'Sunset', author: 'Artist A', release_date: '2020-05-01', genre: ['rock'] },
  { name: 'Ocean', author: 'Artist B', release_date: '1999-12-31', genre: 'jazz' },
  { name: 'Night Sky', author: 'artist a', release_date: '2023-01-15', genre: ['Rock', 'indie'] },
  { name: 'Ghost', author: 'Artist C', genre: [] },
]

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('поиск по названию', () => {
  it('ищет без учёта регистра', () => {
    const store = useFiltersStore()
    store.setSearchQuery('sunset')
    expect(store.filteredTracks(tracks)).toEqual([tracks[0]])
  })

  it('обрезает пробелы в запросе', () => {
    const store = useFiltersStore()
    store.setSearchQuery('  ocean  ')
    expect(store.filteredTracks(tracks)).toEqual([tracks[1]])
  })

  it('запрос из одних пробелов не фильтрует', () => {
    const store = useFiltersStore()
    store.setSearchQuery('   ')
    expect(store.filteredTracks(tracks)).toHaveLength(4)
  })

  it('трек без name не ломает поиск', () => {
    const store = useFiltersStore()
    store.setSearchQuery('ghost')
    const withBroken = [...tracks, { author: 'X', genre: [] }]
    expect(store.filteredTracks(withBroken)).toEqual([tracks[3]])
  })
})

describe('фильтры по значениям', () => {
  it('по исполнителю — без учёта регистра', () => {
    const store = useFiltersStore()
    store.setFilterValue('исполнителю', 'artist a')
    expect(store.filteredTracks(tracks)).toEqual([tracks[0], tracks[2]])
  })

  it('по году выпуска', () => {
    const store = useFiltersStore()
    store.setFilterValue('году выпуска', '2020')
    expect(store.filteredTracks(tracks)).toEqual([tracks[0]])
  })

  it('дата короче 4 символов не матчится по году', () => {
    const store = useFiltersStore()
    store.setFilterValue('году выпуска', '99')
    const withShort = [{ name: 'X', release_date: '99' }]
    expect(store.filteredTracks(withShort)).toEqual([])
  })

  it('трек без даты исключается при фильтре по году', () => {
    const store = useFiltersStore()
    store.setFilterValue('году выпуска', '2020')
    const noDate = [{ name: 'X' }]
    expect(store.filteredTracks(noDate)).toEqual([])
  })

  it('жанр может быть массивом', () => {
    const store = useFiltersStore()
    store.setFilterValue('жанру', 'rock')
    expect(store.filteredTracks(tracks)).toEqual([tracks[0], tracks[2]])
  })

  it('жанр может быть строкой', () => {
    const store = useFiltersStore()
    store.setFilterValue('жанру', 'jazz')
    expect(store.filteredTracks(tracks)).toEqual([tracks[1]])
  })

  it('трек без жанра исключается при фильтре по жанру', () => {
    const store = useFiltersStore()
    store.setFilterValue('жанру', 'rock')
    const noGenre = [{ name: 'X' }]
    expect(store.filteredTracks(noGenre)).toEqual([])
  })

  it('фильтры комбинируются', () => {
    const store = useFiltersStore()
    store.setSearchQuery('sky')
    store.setFilterValue('году выпуска', '2023')
    expect(store.filteredTracks(tracks)).toEqual([tracks[2]])
  })
})

describe('сортировка', () => {
  it('asc: без даты → в начало, далее по году', () => {
    const store = useFiltersStore()
    store.setSortOrder('asc')
    expect(store.filteredTracks(tracks).map((t) => t.name)).toEqual([
      'Ghost',
      'Ocean',
      'Sunset',
      'Night Sky',
    ])
  })

  it('desc: в обратном порядке', () => {
    const store = useFiltersStore()
    store.setSortOrder('desc')
    expect(store.filteredTracks(tracks).map((t) => t.name)).toEqual([
      'Night Sky',
      'Sunset',
      'Ocean',
      'Ghost',
    ])
  })

  it('не мутирует исходный массив', () => {
    const store = useFiltersStore()
    store.setSortOrder('asc')
    store.filteredTracks(tracks)
    expect(tracks.map((t) => t.name)).toEqual(['Sunset', 'Ocean', 'Night Sky', 'Ghost'])
  })

  it('asc: трек без даты в середине массива попадает в компаратор вторым', () => {
    const store = useFiltersStore()
    store.setSortOrder('asc')
    const mixed = [tracks[1], tracks[3], tracks[0]]
    expect(store.filteredTracks(mixed).map((t) => t.name)).toEqual(['Ghost', 'Ocean', 'Sunset'])
  })
})

describe('сеттеры и сброс', () => {
  it('filteredTracks от null → пустой массив', () => {
    const store = useFiltersStore()
    expect(store.filteredTracks(null)).toEqual([])
  })

  it('setFilters задаёт все значения разом', () => {
    const store = useFiltersStore()
    store.setFilters({ исполнителю: 'A', 'году выпуска': '2020', жанру: 'rock' })
    expect(store.activeFilters).toEqual({
      исполнителю: 'A',
      'году выпуска': '2020',
      жанру: 'rock',
    })
  })

  it('setFilterValue не затирает остальные фильтры', () => {
    const store = useFiltersStore()
    store.setFilterValue('жанру', 'rock')
    store.setFilterValue('исполнителю', 'A')
    expect(store.activeFilters['жанру']).toBe('rock')
    expect(store.activeFilters['исполнителю']).toBe('A')
  })

  it('setSortOrder принимает null', () => {
    const store = useFiltersStore()
    store.setSortOrder(null)
    expect(store.sortOrder).toBeNull()
  })

  it('resetFilters очищает всё', () => {
    const store = useFiltersStore()
    store.setSearchQuery('rock')
    store.setSortOrder('asc')
    store.setFilterValue('жанру', 'rock')
    store.resetFilters()
    expect(store.searchQuery).toBe('')
    expect(store.sortOrder).toBeNull()
    expect(store.activeFilters).toEqual({
      исполнителю: null,
      'году выпуска': null,
      жанру: null,
    })
  })
})
