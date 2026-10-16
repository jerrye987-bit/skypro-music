<template>
  <div>
    <FilterControls title="Треки" />
    <PlayList />
  </div>
</template>

<script setup>
import FilterControls from '~/components/FilterControls.vue'
import PlayList from '~/components/PlayList.vue'

import { useHead } from '@unhead/vue'


useHead({
  title: 'Главная | Skypro.Music',
  meta: [
    { name: 'description', content: 'Музыкальная платформа Skypro.Music' },
    { property: 'og:site_name', content: 'Skypro Music' },
  ],
})
</script>
