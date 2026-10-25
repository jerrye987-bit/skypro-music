import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Типы — сразу после импортов, до определения стора
type FilterValues = {
  исполнителю: string | null
  'году выпуска': string | null
  жанру: string | null
}

export const useFiltersStore = defineStore('filters', () => {
  // Состояние
  const activeFilters = ref<FilterValues>({
    исполнителю: null,
    'году выпуска': null,
    жанру: null,
  })
  const searchQuery = ref('')
  const sortOrder = ref<'asc' | 'desc' | null>(null)

  const setFilters = (values: FilterValues) => {
    activeFilters.value = values
  }

  const setSearchQuery = (value: string) => {
    searchQuery.value = value
  }

  const setSortOrder = (value: 'asc' | 'desc' | null) => {
    sortOrder.value = value
  }

  const setFilterValue = (key: keyof FilterValues, value: string | null) => {
    activeFilters.value = { ...activeFilters.value, [key]: value }
  }

  const resetFilters = () => {
    activeFilters.value = { исполнителю: null, 'году выпуска': null, жанру: null }
    searchQuery.value = ''
    sortOrder.value = null
  }

  const filteredTracks = computed(() => {
    return (tracks: any[]) => {
      let result = tracks || []

      if (searchQuery.value.trim()) {
        const term = searchQuery.value.toLowerCase().trim()
        result = result.filter((t) => t.name && String(t.name).toLowerCase().includes(term))
      }

      if (activeFilters.value['исполнителю']) {
        const term = String(activeFilters.value['исполнителю']).toLowerCase().trim()
        result = result.filter((t) => t.author && String(t.author).toLowerCase().includes(term))
      }

      if (activeFilters.value['году выпуска']) {
        const term = String(activeFilters.value['году выпуска']).trim()
        result = result.filter((t) => {
          const dateStr = t.release_date
          if (!dateStr) return false
          const str = String(dateStr)
          if (str.length < 4) return false
          const year = str.split('-')[0]
          return year === term
        })
      }

      if (activeFilters.value['жанру']) {
        const term = String(activeFilters.value['жанру']).toLowerCase().trim()
        result = result.filter((t) => {
          const genres = Array.isArray(t.genre) ? t.genre : t.genre ? [String(t.genre)] : []
          return genres.some((g: unknown) => String(g).toLowerCase().trim().includes(term))
        })
      }

      if (sortOrder.value === 'asc' || sortOrder.value === 'desc') {
        result = [...result].sort((a, b) => {
          const yearA = a.release_date ? Number(String(a.release_date).split('-')[0]) : 0
          const yearB = b.release_date ? Number(String(b.release_date).split('-')[0]) : 0
          return sortOrder.value === 'asc' ? yearA - yearB : yearB - yearA
        })
      }

      return result
    }
  })

  return {
    activeFilters,
    searchQuery,
    sortOrder,
    setFilters,
    setSearchQuery,
    setSortOrder,
    setFilterValue,
    resetFilters,
    filteredTracks,
  }
})
