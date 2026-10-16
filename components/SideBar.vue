<template>
  <div class="playlist-sidebar">
    <!-- Блок пользователя -->
    <div class="sidebar__personal">
      <p class="sidebar__personalName">Sergey.Ivanov</p>
      <div class="sidebar__icon">
        <svg>
          <use xlink:href="/img/icon/sprite.svg#logout" />
        </svg>
      </div>
    </div>

    <!-- Список карточек плейлистов -->
    <div class="sidebar__block">
      <div class="sidebar__list">
        <div class="sidebar__item">
          <NuxtLink to="/playlist/day" class="sidebar__link">
            <img
              class="sidebar__img"
              src="/img/playlist01.png"
              alt="Day's playlist"
              width="250"
              height="170"
            >
          </NuxtLink>
        </div>
        <div class="sidebar__item">
          <NuxtLink to="/playlist/rock" class="sidebar__link">
            <img
              class="sidebar__img"
              src="/img/playlist02.png"
              alt="Rock hits"
              width="250"
              height="170"
            >
          </NuxtLink>
        </div>
        <div class="sidebar__item">
          <NuxtLink to="/playlist/jazz" class="sidebar__link">
            <img
              class="sidebar__img"
              src="/img/playlist03.png"
              alt="Jazz vibes"
              width="250"
              height="170"
            >
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playlist-sidebar {
  max-width: 418px;
  padding: 20px 90px 20px 78px;
  flex-shrink: 0;
}

.sidebar__personal {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 0 15px 0;
}

.sidebar__personalName {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  margin-right: 16px;
}

.sidebar__icon {
  width: 43px;
  height: 43px;
  background-color: #313131;
  border-radius: 50%;
  cursor: pointer;
}

.sidebar__block {
  height: 100%;
  padding-top: 240px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.sidebar__list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar__item {
  width: 250px;
  height: 150px;
}

.sidebar__item:not(:last-child) {
  margin-bottom: 30px;
}

.sidebar__link {
  width: 100%;
  height: 100%;
  display: block;
}

.sidebar__img {
  width: 100%;
  height: auto;
  object-fit: cover;
}
</style>
