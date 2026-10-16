import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)
  const { email, password } = body || {}

  if (!email?.trim() || !password?.trim()) {
    return {
      statusCode: 400,
      statusMessage: 'Некорректные данные',
      message: 'Почта и пароль обязательны.',
    }
  }

  return {
    success: true,
    email,
    message: 'Данные получены (серверная заглушка без логики)',
  }
})
