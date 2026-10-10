<template>
  <div v-if="error" class="error-message">
    Произошла ошибка: {{ error }}
  </div>
  <div v-if="loading">Загружаем...</div>
  <div class="centerblock__header">
    <div class="centerblock__search">
      <svg class="search__svg">
        <use xlink:href="/img/icon/sprite.svg#icon-search" />
      </svg>
      <input
        v-model="searchQuery"
        class="search__text"
        type="search"
        placeholder="Поиск"
        name="search"
      >
    </div>
  </div>
  <h2 class="centerblock__h2">Треки</h2>
  <div class="centerblock__filter">
    <div class="filter__title">Искать по:</div>
    <div
      v-for="filter in filters"
      :key="filter"
      class="filter-group"
    >
      <div
        class="filter__button"
        :class="{ active: activeFilter === filter }"
        @click="toggleFilter(filter)"
      >
        {{ filter }}
      </div>
      <div
        v-if="activeFilter === filter"
        class="filter-dropdown"
      >
        <ul class="filter-list">
          <li
            v-for="item in getFilterItems(filter)"
            :key="item"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTracks } from '@/composables/useTracks'

const { tracks, loading, error, fetchTracks } = useTracks()

const searchQuery = ref('')
const filters = ['исполнителю', 'году выпуска', 'жанру']
const activeFilter = ref('null')

// Функция переключения фильтра
const toggleFilter = (filter) => {
  activeFilter.value = activeFilter.value === filter ? null : filter
}

const getFilterItems = (filter) => {
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

// Вычисляемые свойства для списков
const authorItems = computed(() => {
  if (!tracks.value) return []
  const items = new Set()
  tracks.value.forEach(track => {
    if (track.author) {
      items.add(track.author)
    }
  })
  return Array.from(items).sort((a, b) => {
    if (a === 'Неизвестно') return 1
    if (b === 'Неизвестно') return -1
    return a.localeCompare(b)
  })
})

const yearItems = computed(() => {
  if (!tracks.value) return []
  const items = new Set()
  tracks.value.forEach(track => {
    const year = track.release_date?.split('-')[0] || 'Неизвестно'
    items.add(year)
  })
  return Array.from(items).sort((a, b) => {
    if (a === 'Неизвестно') return 1
    if (b === 'Неизвестно') return -1
    return b.localeCompare(a)
  })
})

const genreItems = computed(() => {
  if (!tracks.value) return []
  const items = new Set()
  tracks.value.forEach(track => {
    if (Array.isArray(track.genre)) {
      track.genre.forEach(g => g && items.add(g.toLowerCase().trim()))
    } else if (track.genre) {
      items.add(track.genre.toLowerCase().trim())
    }
  })
  return Array.from(items).sort((a, b) => {
    if (a === 'неизвестно') return 1
    if (b === 'неизвестно') return -1
    return a.localeCompare(b)
  })
})

onMounted(() => {
  fetchTracks()
})
</script>

<style scoped>
.error-message {
  color: red;
  margin: 20px 0;
  padding: 10px;
  background: rgba(255, 0, 0, 0.1);
}

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
  font-size: 64px;
  line-height: 72px;
  letter-spacing: -0.8px;
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

.filter__button {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 60px;
  padding: 6px 20px;
  cursor: pointer;
  margin-bottom: 5px;
}

.filter-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  background: #2E2E2E;
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
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #4B4949;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ffffff;
    border: 2px solid #2b2b2b;
    border-radius: 10px;
  }
}

.filter-list li {
  padding: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #ffffff;
}

.filter-list li:hover {
  color: #B672FF;

}
</style>
