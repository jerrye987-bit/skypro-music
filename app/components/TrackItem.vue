<template>
  <div class="playlist__item">
    <div class="playlist__track">
      <div class="track__title">
        <div class="track__titleImage">
          <svg class="track__titleSvg">
            <use xlink:href="/img/icon/sprite.svg#icon-note" />
          </svg>
        </div>
        <div class="track__title-text">
          <a class="track__titleLink" href="">
            {{ track.title }}
            <span class="track__titleSpan">{{ track.subtitle }}</span>
          </a>
        </div>
      </div>
      <div class="track__author">
        <a class="track__authorLink" href="">{{ track.author }}</a>
      </div>
      <div class="track__album">
        <a class="track__albumLink" href="">{{ track.album }}</a>
      </div>
      <div class="track__time">
        <svg class="track__timeSvg">
          <use xlink:href="/img/icon/sprite.svg#icon-like" />
        </svg>
        <span class="track__timeText">{{ track.time }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    track: {
      type: Object,
      required: true,
    },
  })
</script>

<style scoped>
  .track__titleLink,
  .track__authorLink,
  .track__albumLink {
    text-decoration: none;
  }

  .playlist__track {
    font-family: 'Montserrat', sans-serif;
  }

  .playlist__item {
    width: 100%;
    display: block;
    margin-bottom: 12px;
  }

  .playlist__track {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .track__title {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 0 1 447px;
    min-width: 0;
  }

  .track__titleImage {
    width: 51px;
    height: 51px;
    padding: 16px;
    background: #313131;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 17px;
  }

  .track__titleSvg {
    width: 18px;
    height: 17px;
    fill: transparent;
    stroke: #4e4e4e;
  }

  .track__titleLink {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #ffffff;
  }

  .track__titleSpan {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #4e4e4e;
  }

  .track__author {
    flex: 0 1 321px;
    min-width: 0;
    display: flex;
    justify-content: flex-start;
  }

  .track__authorLink {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #ffffff;
    text-align: left;
  }

  .track__album {
    flex: 0 1 245px;
    min-width: 0;
  }

  .track__albumLink {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #696969;
  }

  .track__timeSvg {
    width: 14px;
    height: 12px;
    margin-right: 17px;
    fill: transparent;
    stroke: #696969;
  }

  .track__timeText {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    text-align: right;
    color: #696969;
  }
</style>
