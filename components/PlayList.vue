<template>
  <div class="centerblock__content">
    <div class="content__title">
      <div class="playlistTitle__col col01">Трек</div>
      <div class="playlistTitle__col col02">Исполнитель</div>
      <div class="playlistTitle__col col03">Альбом</div>
      <div class="playlistTitle__col col04">
        <svg class="playlistTitle__svg" width="12" height="12" viewBox="0 0 12 12">
          <use xlink:href="/img/icon/sprite.svg#icon-watch" />
        </svg>
      </div>
    </div>

    <!-- Добавляем компонент для отображения треков -->
    <TrackList />
  </div>
</template>

<script setup>
 import TrackList from './TrackList.vue';  // Импортируем компонент
</script>

<style scoped>
.centerblock__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.content__playlist {
  display: flex;
  flex-direction: column;
}

.sidebar-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 280px;
  flex-shrink: 0;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.card img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 12px;
  margin-bottom: 8px;
}

.card span {
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.2;
}

.content__title {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
}

.playlistTitle__col {
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 2px;
  color: #696969;
  text-transform: uppercase;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col01 {
  flex: 0 1 447px;
  min-width: 0;
}

.col02 {
  flex: 0 1 321px;
  min-width: 0;
}

.col03 {
  flex: 0 1 245px;
  min-width: 0;
}

.col04 {
  flex: 0 0 60px;
  text-align: end;
}

@media (max-width: 768px) {
  .page-layout {
    flex-direction: column;
  }
  .sidebar-column {
    width: 100%;
  }
}
</style>
