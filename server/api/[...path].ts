export default defineEventHandler((event) => {
  const path = event.path.replace(/^\/api/, '')
  return proxyRequest(event, `https://webdev-music-003b5b991590.herokuapp.com${path}`)
})
