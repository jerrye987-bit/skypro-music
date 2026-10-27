<template>
  <div class="centerblock__header">
    <div class="centerblock__search">
      <svg class="search__svg">
        <use xlink:href="/img/icon/sprite.svg#icon-search" />
      </svg>
      <input
        v-model="searchQuery"
        class="search__text"
        type="search"
        placeholder="Поиск по названию"
        name="search"
      />
    </div>
  </div>

  <h2 class="centerblock__h2">
    {{ title }}
    <button
      v-if="hasActiveFilters"
      class="reset-btn"
      style="
        margin-left: 15px;
        font-size: 14px;
        color: #aaa;
        background: none;
        border: none;
        cursor: pointer;
      "
      @click="resetFilters"
    >
      Сбросить фильтр
    </button>
  </h2>

  <div class="centerblock__filter">
    <div class="filter__title">Искать по:</div>
    <div v-for="filter in filters" :key="filter" class="filter-group">
      <div
        class="filter__button"
        :class="{ active: activeFilter === filter }"
        @click="toggleFilter(filter)"
      >
        {{ filter }}
      </div>
      <div v-if="activeFilter === filter" class="filter-dropdown">
        <ul class="filter-list">
          <template v-if="filter === 'году выпуска'">
            <li
              v-for="option in sortOptions"
              :key="'sort-' + option.value"
              :class="{ 'sort-option--active': sortOrder === option.value }"
              @click="selectSort(option.value)"
            >
              {{ option.label }}
            </li>
          </template>
          <template v-else>
            <li
              v-for="item in getFilterItems(filter)"
              :key="item"
              @click="selectFilterValue(filter, item)"
            >
              {{ item }}
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFiltersStore } from '~/stores/filters'

const props = defineProps({
  title: { type: String, default: 'Треки' },
  tracks: { type: Array, default: () => [] },
})

const filtersStore = useFiltersStore()
const { searchQuery, sortOrder, activeFilters } = storeToRefs(filtersStore)

// Единственное локальное состояние — какой дропдаун открыт (чисто визуальное)
const activeFilter = ref(null)

const filters = ['исполнителю', 'году выпуска', 'жанру']
const sortOptions = [
  { label: 'По умолчанию', value: '' },
  { label: 'Сначала новые', value: 'desc' },
  { label: 'Сначала старые', value: 'asc' },
]

const hasActiveFilters = computed(() => {
  return (
    !!activeFilter.value ||
    Object.values(activeFilters.value).some((v) => v !== null) ||
    !!searchQuery.value ||
    !!sortOrder.value
  )
})

const toggleFilter = (filter) => {
  activeFilter.value = activeFilter.value === filter ? null : filter
}

const selectSort = (value) => {
  filtersStore.setSortOrder(value === '' ? null : value)
  activeFilter.value = null
}

const selectFilterValue = (filter, value) => {
  filtersStore.setFilterValue(filter, value)
  activeFilter.value = null
}

const resetFilters = () => {
  activeFilter.value = null
  filtersStore.resetFilters()
}

const getFilterItems = (filter) => {
  if (!props.tracks || props.tracks.length === 0) return []
  switch (filter) {
    case 'исполнителю':
      return authorItems.value
    case 'году выпуска':
      return yearItems.value
    case 'жанру':
      return genreItems.value
    default:
      return []
  }
}

const getTrackYear = (release_date) => {
  if (typeof release_date === 'string' && release_date.includes('-')) {
    const year = release_date.split('-')[0]
    return /^\d{4}$/.test(year) ? year : 'Неизвестно'
  }
  return 'Неизвестно'
}

const authorItems = computed(() => {
  const items = new Set()
  props.tracks.forEach((track) => {
    if (track.author) items.add(track.author)
  })
  return Array.from(items).sort((a, b) => {
    if (a === 'Неизвестно') return 1
    if (b === 'Неизвестно') return -1
    return a.localeCompare(b)
  })
})

const yearItems = computed(() => {
  const items = new Set()
  props.tracks.forEach((track) => {
    items.add(getTrackYear(track.release_date))
  })
  return Array.from(items).sort((a, b) => {
    if (a === 'Неизвестно') return 1
    if (b === 'Неизвестно') return -1
    const na = Number(a)
    const nb = Number(b)
    if (!isNaN(na) && !isNaN(nb)) return nb - na
    return b.localeCompare(a)
  })
})

const genreItems = computed(() => {
  const items = new Set()
  props.tracks.forEach((track) => {
    const genres = Array.isArray(track.genre) ? track.genre : [track.genre].filter(Boolean)
    genres.forEach((g) => items.add(String(g).toLowerCase().trim()))
  })
  return Array.from(items).sort((a, b) => {
    if (a === 'неизвестно') return 1
    if (b === 'неизвестно') return -1
    return a.localeCompare(b)
  })
})
</script>

<style scoped>
.centerblock__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.centerblock__search {
  width: 100%;
  border-bottom: 1px solid #4e4e4e;
  margin-bottom: 51px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.search__svg {
  width: 17px;
  height: 17px;
  margin-right: 5px;
  stroke: #ffffff;
  fill: transparent;
}
.search__text {
  flex-grow: 100;
  background-color: transparent;
  border: none;
  padding: 13px 10px 14px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
}
.search__text::placeholder {
  background-color: transparent;
  color: #ffffff;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
.centerblock__h2 {
  font-weight: 400;
  font-size: 60px;
  line-height: 64px;
  letter-spacing: -1.3%;
  margin-bottom: 45px;
  color: #ffffff;
}
.centerblock__filter {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 51px;
}
.filter__title {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  margin-right: 15px;
}
.filter__button {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 60px;
  padding: 6px 20px;
  cursor: pointer;
}
.filter__button:not(:last-child) {
  margin-right: 10px;
}
.filter__button:hover {
  border-color: #d9b6ff;
  color: #d9b6ff;
}
.filter__button:active {
  border-color: #ad61ff;
  color: #ad61ff;
}
.filter-group {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  margin-right: 15px;
}
.filter-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  background: #2e2e2e;
  padding: 12px;
  border-radius: 8px;
  z-index: 10;
  width: max-content;
  min-width: 150px;
  max-width: 300px;
  word-break: break-word;
}
.filter-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
}
.filter-list li {
  padding: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #ffffff;
}
.filter-list li:hover {
  color: #b672ff;
}

.filter-divider {
  border-top: 1px solid #4e4e4e;
  margin: 6px 0;
}

.filter-list li.sort-option--active {
  color: #b672ff;
  text-decoration: underline;
}
</style>
