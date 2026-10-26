export const shuffleTracks = <T>(tracks: T[]): T[] => {
  const shuffled = [...tracks]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const a = shuffled[i]
    const b = shuffled[j]
    if (a !== undefined && b !== undefined) {
      shuffled[i] = b
      shuffled[j] = a
    }
  }

  return shuffled
}
