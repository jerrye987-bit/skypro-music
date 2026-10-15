<template>
  <nav class="main__nav">
    <div class="nav__logo">
      <img width="250" height="170" class="logo__image" src="/img/logo.svg" alt="logo" >
    </div>

    <div
      class="nav__burger"
      @click="toggleMenu"
    >
      <span class="burger__line" />
      <span class="burger__line" />
      <span class="burger__line" />
    </div>

    <div
      class="nav__menu"
      :class="{ 'nav__menu--open': isMenuOpen }"
    >
      <ul class="menu__list">
        <li class="menu__item">
          <NuxtLink to="/" class="menu__link">Главное</NuxtLink>
        </li>
        <li class="menu__item">
          <NuxtLink to="/playlist" class="menu__link">Мой плейлист</NuxtLink>
        </li>
        <li class="menu__item">
          <NuxtLink to="/signin" class="menu__link">Войти</NuxtLink>
        </li>
    </ul>
  </div>
</nav>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

onMounted(() => {
  isMenuOpen.value = false
})
</script>

<style scoped>
.main__nav {
  width: 244px;
  background-color: #181818;
  padding: 20px 0 20px 36px;
  position: relative;
}

.nav__logo {
  width: 113.33px;
  height: 43px;
  padding: 13px 0;
  background-color: transparent;
  margin-bottom: 20px;
}

.nav__burger {
  width: 20px;
  height: 40px;
  padding: 13px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.nav__menu {
  transition: all 0.3s ease;
  opacity: 0;
  position: absolute;
  top: 100px;

  width: 100%;
  background-color: #181818;
  padding: 20px 0;
  pointer-events: none;
}

.nav__menu--open {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
}

.nav__burger.active .burger__line:nth-child(1) {
  transform: rotate(-45deg) translate(-5px, 5px);
}

.nav__burger.active .burger__line:nth-child(2) {
  opacity: 0;
}

.nav__burger.active .burger__line:nth-child(3) {
  transform: rotate(45deg) translate(-5px, -5px);
}

.nav__burger:active {
  .burger__line {
    background-color: #fff;
  }
}

.nav__content {
  padding-top: 60px;
}

.logo__image {
  width: 113.33px;
  height: 17px;
  color: #181818;
}

.burger__line {
  display: block;
  width: 100%;
  height: 1px;
  background-color: #d3d3d3;
  flex-shrink: 0;
}

.menu__list {
  list-style: none;
  padding: 18px 0 10px 0;
  margin: 0;
}

.menu__item {
  padding: 5px 0;
  margin-bottom: 16px;
}

.menu__link {
  color: #ffffff;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>
