export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const token = localStorage.getItem('access_token')
  const refresh = localStorage.getItem('refresh_token')

  if (!token && !refresh) {
    return navigateTo('/signin')
  }
})
