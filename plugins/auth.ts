export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()

  auth.initAuth()

  if (auth.user) {
    const newToken = await refreshTokens()

    if (!newToken) {
      auth.logout()
    }
  }
})
