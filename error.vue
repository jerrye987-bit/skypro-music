<template>
  <div class="error-page">
    <h1 v-if="error.status === 404">Страница не найдена</h1>
    <h1 v-else>Что-то пошло не так</h1>

    <!-- Показываем только то сообщение, которое ты передала через showError -->
    <p>{{ userMessage }}</p>

    <NuxtLink to="/signin" class="btn-home">Попробовать снова</NuxtLink>
  </div>
</template>

<script setup>
// Получаем объект ошибки, который автоматически передаёт Nuxt при вызове showError
const { error } = defineProps({
  error: {
    type: Object,
    default: () => ({
      status: 500,
      message: 'Произошла ошибка. Попробуйте позже.',
      statusText: 'Ошибка',
    }),
  },
})

// Если сервер вернул понятное сообщение — показываем его.
// Если нет — ставим дефолтный текст.
const userMessage = error.message || 'Произошла ошибка. Попробуйте позже.'
</script>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 20px;
}

h1 {
  font-family: 'Montserrat', sans-serif;
  font-size: 32px;
  margin-bottom: 16px;
  color: #181818;
}

p {
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  color: #555;
  max-width: 500px;
  margin-bottom: 24px;
}

.btn-home {
  font-family: 'Montserrat', sans-serif;
  background-color: #580ea2;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-home:hover {
  background-color: #3f007d;
}
</style>
