<template>
  <div class="wrapper">
    <div class="container">
      <main class="main">
        <NavBar />

        <div class="centerblock">
          <FilterControls />
          <Playlist />
        </div>

        <div class="main__sidebar">
          <div class="sidebar__personal">
            <p class="sidebar__personalName">Sergey.Ivanov</p>
            <div class="sidebar__icon">
              <svg>
                <use xlink:href="/img/icon/sprite.svg#logout" />
              </svg>
            </div>
          </div>
          <div class="sidebar__block">
            <div class="sidebar__list">
              <div class="sidebar__item">
                <a class="sidebar__link" href="#">
                  <img
                    class="sidebar__img"
                    src="/img/playlist01.png"
                    alt="day's playlist"
                    width="250"
                    height="170"
                  >
                </a>
              </div>
              <div class="sidebar__item">
                <a class="sidebar__link" href="#">
                  <img
                    class="sidebar__img"
                    src="/img/playlist02.png"
                    alt="day's playlist"
                    width="250"
                    height="170"
                  >
                </a>
              </div>
              <div class="sidebar__item">
                <a class="sidebar__link" href="#">
                  <img
                    class="sidebar__img"
                    src="/img/playlist03.png"
                    alt="day's playlist"
                    width="250"
                    height="170"
                  >
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PlayerBar />

      <footer class="footer" />
    </div>
  </div>
</template>

<script setup>
  import NavBar from '@/components/NavBar.vue'
  import FilterControls from '@/components/FilterControls.vue'
  import Playlist from '@/components/PlayList.vue'
  import PlayerBar from '@/components/PlayerBar.vue'
</script>

<style scoped>
  .wrapper {
    width: 100%;
    min-height: 100%;
    background-color: #383838;
  }

  .container {
    display: flex;
    flex-direction: row;
    gap: 24px;
    width: 100%;
    box-sizing: border-box;
    margin: 0 auto;
    position: relative;
    background-color: #181818;
    padding: 0 20px 73px 20px;
  }

  .main {
    flex: 1 1 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .centerblock {
    width: auto;
    flex-grow: 3;
    padding: 20px 40px 20px 111px;
    display: flex;
    flex-direction: column;
  }

  .main__sidebar {
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
    padding: 240px 0 0 0;
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
  }

  .sidebar__img {
    width: 100%;
    height: auto;
  }

  .footer {
    /* пусто, но класс сохранён */
  }
</style>
