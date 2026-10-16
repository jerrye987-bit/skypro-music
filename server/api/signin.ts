import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)
  const { email, password } = body || {}

  if (!email?.trim() || !password?.trim()) {
    // ✅ Так правильно в текущей версии h3: просто возвращаем объект со статусом
    return {
      statusCode: 400,
      statusMessage: 'Заполните email и пароль',
      message: 'Email и пароль обязательны',
    }
  }

  // Дальше твоя логика (БД и т.д.)
  return { success: true, email }
})
