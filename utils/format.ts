export const formatDuration = (seconds: unknown): string => {
  if (typeof seconds !== 'number' || Number.isNaN(seconds) || seconds < 0) {
    return ''
  }

  const total = Math.floor(seconds)
  const minutes = Math.floor(total / 60)
  const secs = total % 60

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}
