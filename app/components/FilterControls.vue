<template>
  <div class="centerblock__header">
    <div class="centerblock__search">
      <svg class="search__svg">
        <use xlink:href="/img/icon/sprite.svg#icon-search"></use>
      </svg>
      <input
        class="search__text"
        type="search"
        placeholder="Поиск"
        name="search"
        v-model="searchQuery"
      />
    </div>
  </div>
  <h2 class="centerblock__h2">Треки</h2>
  <div class="centerblock__filter">
    <div class="filter__title">Искать по:</div>
    <div
      v-for="filter in filters"
      :key="filter"
      class="filter__button"
      :class="{ active: activeFilter === filter }"
      @click="activeFilter = filter"
    >
      {{ filter }}
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'

  const searchQuery = ref('')
  const filters = ['исполнителю', 'году выпуска', 'жанру']
  const activeFilter = ref('исполнителю')
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
</style>
