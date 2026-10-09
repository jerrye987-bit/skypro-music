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
          <input
            :class="$style.modal__input"
            type="password"
            name="repeatPassword"
            placeholder="Повторите пароль"
            v-model="repeatPassword"
          />
          <div :class="$style.errorContainer">
            <span v-if="error">{{ error }}</span>
          </div>
          <button :class="$style.modal__btnSignupEnt" type="submit">Зарегистрироваться</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import { useRouter } from 'vue-router'
import styles from '@/assets/signup.module.css'

const $style = styles
// const router = useRouter()
const email = ref('')
const password = ref('')
const repeatPassword = ref('')
const error = ref('')

function handleSubmit() {
  error.value = ''
  if (!email.value || !password.value || !repeatPassword.value) {
    error.value = 'Заполните все поля'
    return
  }
  if (password.value !== repeatPassword.value) {
    error.value = 'Пароли не совпадают'
    return
  }
  console.log('Регистрация:', email.value, password.value)
}
</script>
