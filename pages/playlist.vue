<template>
  <div>
    <FilterControls title="Мои треки" />
    <PlayList />
  </div>
</template>

<script setup>
import FilterControls from '~/components/FilterControls.vue';

useHead({
  title: 'Плейлист | Skypro.Music',
  meta: [
    { name: 'description', content: 'Музыкальная платформа Skypro.Music' },
    { property: 'og:site_name', content: 'Skypro Music' },
  ],
})
</script>
