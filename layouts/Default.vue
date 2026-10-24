<template>
  <div class="wrapper">
    <div class="container">
      <div class="main-grid">
        <!-- Колонка 1: Навигация -->
        <aside class="main-grid__nav">
          <NavBar />
        </aside>

        <!-- Колонка 2: Контент страницы (сюда Nuxt подставит index.vue и др.) -->
        <main class="main-grid__content">
          <slot />
        </main>

        <!-- Колонка 3: Правая колонка — карточки плейлистов -->
        <aside class="main-grid__sidebar-right">
          <SideBar />
        </aside>
      </div>
    </div>

    <!-- Плеер всегда внизу -->
    <PlayerBar />
  </div>
</template>

<script setup>
import NavBar from '~/components/NavBar.vue'
import PlayerBar from '~/components/PlayerBar.vue'
import SideBar from '~/components/SideBar.vue'

useHead({
  title: 'Skypro.Music',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { charset: 'utf-8' },
    { name: 'description', content: 'Онлайн-музыкальный сервис Skypro.Music: слушай подборки и добавляй треки в избранное' },
    { property: 'og:site_name', content: 'Skypro Music' },
    { property: 'og:title', content: 'Skypro.Music' },
    { property: 'og:description', content: 'Онлайн-музыкальный сервис: подборки треков и личный плейлист' },
    { property: 'og:type', content: 'website' },
  ],
  htmlAttrs: { lang: 'ru' },
})

const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
})
</script>

<style scoped>
.wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  margin: 0 auto;
  width: 100%;
  padding: 0 16px;
}

/* Чёткая сетка: левая колонка фиксирована, центр растягивается, правая — по контенту */
.main-grid {
  display: grid;
  grid-template-columns: auto 1fr auto; /* Nav | Content | Right Sidebar */
  grid-template-rows: auto 1fr;
  gap: 16px;
  width: 100%;
  min-height: calc(100vh - 73px); /* минус высота плеера */
}

.main-grid__nav {
  grid-column: 1;
  grid-row: 1 / -1; /* На всю высоту сетки */
  display: flex;
  flex-direction: column;
}

.main-grid__content {
  grid-column: 2;
  grid-row: 1 / -1;

  /* ВОТ ЭТО ВАЖНО: ограничиваем ширину контента, но не всей колонки */
  max-width: 1280px;
  margin: 0 auto; /* центрируем только контент внутри колонки */
  width: 100%;
  padding: 0 16px; /* отступы внутри, чтобы текст не прилипал к краям */
}


.main-grid__sidebar-right {
  grid-column: 3;
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  padding-top: 20px; /* небольшой отступ сверху */
}
</style>
