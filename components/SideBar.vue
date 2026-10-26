<template>
  <div class="playlist-sidebar">
    <!-- Блок пользователя -->
    <ClientOnly>
      <div class="sidebar__personal">
        <p class="sidebar__personalName">
          {{ userName || 'Гость' }}
        </p>

        <div v-if="showLogoutButton" class="sidebar__icon" @click="handleLogout">
          <svg width="40" height="40">
            <use xlink:href="/img/icon/sprite.svg#logout" />
          </svg>
        </div>
      </div>
    </ClientOnly>

    <!-- Список карточек плейлистов -->
    <div class="sidebar__block">
      <div class="sidebar__list">
        <div class="sidebar__item">
          <NuxtLink to="/category/2" class="sidebar__link">
            <NuxtImg
              class="sidebar__img"
              src="/img/playlist01.png"
              alt="Плейлист дня"
              width="250"
              height="150"
              loading="lazy"
              placeholder="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='150'%3E%3Crect width='100%25' height='100%25' fill='%23313131'/%3E%3C/svg%3E"
            />
          </NuxtLink>
        </div>
        <div class="sidebar__item">
          <NuxtLink to="/category/3" class="sidebar__link">
            <NuxtImg
              class="sidebar__img"
              src="/img/playlist02.png"
              alt="100 танцевальных хитов"
              width="250"
              height="150"
              loading="lazy"
              placeholder="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='150'%3E%3Crect width='100%25' height='100%25' fill='%23313131'/%3E%3C/svg%3E"
            />
          </NuxtLink>
        </div>
        <div class="sidebar__item">
          <NuxtLink to="/category/4" class="sidebar__link">
            <NuxtImg
              class="sidebar__img"
              src="/img/playlist03.png"
              alt="Инди-заряд"
              width="250"
              height="150"
              loading="lazy"
              placeholder="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='150'%3E%3Crect width='100%25' height='100%25' fill='%23313131'/%3E%3C/svg%3E"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFavoriteTracks } from '~/composables/useFavoriteTracks'

const authStore = useAuthStore()

const { clearFavoriteTracks } = useFavoriteTracks()

const userName = computed(() => authStore.user?.username || authStore.user?.name || null)

const showLogoutButton = computed(() => !!authStore.user)

const handleLogout = async () => {
  clearFavoriteTracks()
  await authStore.logout()
  navigateTo('/')
}
</script>

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
  aspect-ratio: 250 / 150;
  object-fit: cover;
}
</style>
