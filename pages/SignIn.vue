<template>
  <div class="wrapper">
    <div class="containerEnter">
      <div class="modal__block">
        <form class="modal__form" @submit.prevent="handleSubmit">
          <NuxtLink to="/">
            <div class="modal__logo">
              <img src="/img/logo_modal.svg" alt="logo" >
            </div>
          </NuxtLink>

          <div class="field-group">
            <input
              v-model="email"
              class="modal__input"
              type="text"
              name="login"
              placeholder="Почта"
              autocomplete="email"
            >
          </div>

          <div class="field-group">
            <input
              v-model="password"
              class="modal__input"
              type="password"
              name="password"
              placeholder="Пароль"
              autocomplete="current-password"
            >
          </div>

          <button class="modal__btnEnter" type="submit">Войти</button>

          <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>

          <NuxtLink to="/signup" class="modal__btnSignup">
            Зарегистрироваться
          </NuxtLink>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showError } from '#app'
import { navigateTo } from '#imports'

definePageMeta({
  layout: false,
})

const email = ref('')
const password = ref('')
const errorMessage = ref(null)


const handleSubmit = async () => {
  errorMessage.value = null

  if (!email.value.trim()) {
    return showError({
      status: 400,
      message: 'Пожалуйста, введите почту.',
    })
  }

  if (!password.value.trim()) {
    return showError({
      status: 400,
      message: 'Пожалуйста, введите пароль.',
    })
  }

   await navigateTo('/')
  // Запрос к API
  // try {
  //   await $fetch('/api/signin', {
  //     method: 'POST',
  //     body: { email: email.value, password: password.value },
  //   })
  //   // navigateTo('/')
  // } catch (e) {
  //   console.error(e)

  //   showError({
  //     status: 500,
  //     message: 'Не удалось выполнить вход. Попробуйте позже.',
  //   })
  // }
}
</script>

<style scoped>
.wrapper {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
}

.containerEnter {
  max-width: 100%;
  height: 100vh;
  margin: 0 auto;
  background-color: #181818;
}

.modal__block {
  position: relative;
  left: calc(50% - (366px / 2));
  top: calc(50% - (439px / 2));
  opacity: 1;
}

.modal__form {
  width: 366px;
  background-color: #ffffff;
  border-radius: 12px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 43px 44px 47px 40px;
}

.modal__form input:first-child {
  margin-bottom: 30px;
}
.modal__btnEnter:hover {
  background-color: #3f007d;
}

.modal__btnSignup:hover {
  background-color: #f4f5f6;
}

.modal__btnEnter:active {
  background-color: #271a58;
}

.modal__btnSignup:active {
  background-color: #d9d9d9;
}

.modal__logo {
  width: 140px;
  height: 21px;
  margin-bottom: 34px;
  background-color: transparent;
}

.modal__logo img {
  width: 140px;
  height: auto;
}

.modal__input {
  width: 100%;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid #d0cece;
  padding: 8px 1px;
  margin: 0 !important;
}

.modal__input::-webkit-input-placeholder {
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.05px;
  color: #d0cece;
}

.modal__input:-ms-input-placeholder {
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.05px;
  color: #d0cece;
}

.modal__input::-ms-input-placeholder {
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.05px;
  color: #d0cece;
}

.modal__input::placeholder {
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.05px;
  color: #d0cece;
}

.field-group {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 38px;
}

.modal__btnEnter {
  width: 278px;
  height: 52px;
  background-color: #580ea2;
  border-radius: 6px;
  margin-top: 22px;
  margin-bottom: 20px;
  border: none;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.05px;
  color: #ffffff;
}

.modal__btnSignup {
  width: 278px;
  height: 52px;
  background-color: transparent;
  border: 1px solid #d0cece;
  border-radius: 6px;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.05px;
  color: #000000;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}

.login {
  margin-bottom: 30px;
}
</style>
