<template>
  <div :class="$style.wrapper">
    <div :class="$style.containerEnter">
      <div :class="$style.modal__block">
        <form :class="$style.modal__form" @submit.prevent="handleSubmit">
          <RouterLink to="/">
            <div :class="$style.modal__logo">
              <img src="/img/logo_modal.svg" alt="logo" />
            </div>
          </RouterLink>
          <input
            :class="[$style.modal__input, $style.login]"
            type="text"
            name="login"
            placeholder="Почта"
            v-model="email"
          />
          <input
            :class="$style.modal__input"
            type="password"
            name="password"
            placeholder="Пароль"
            v-model="password"
          />
          <div :class="$style.errorContainer">
            <span v-if="error">{{ error }}</span>
          </div>
          <button :class="$style.modal__btnEnter" type="submit">Войти</button>
          <RouterLink to="/signup" :class="$style.modal__btnSignup">
            Зарегистрироваться
          </RouterLink>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import { useRouter } from 'vue-router'
import styles from '@/assets/signin.module.css'

// const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

function handleSubmit() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Заполните все поля'
    return
  }
  console.log('Вход:', email.value, password.value)
}

// Доступ к CSS-классам через $style
const $style = styles
</script>
