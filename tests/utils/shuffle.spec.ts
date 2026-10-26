import { describe, it, expect, vi, afterEach } from 'vitest'
import { shuffleTracks } from '~/utils/shuffle'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('shuffleTracks', () => {
  it('возвращает все исходные элементы', () => {
    expect([...shuffleTracks([1, 2, 3, 4, 5])].sort()).toEqual([1, 2, 3, 4, 5])
  })

  it('не меняет исходный массив', () => {
    const tracks = [1, 2, 3]
    shuffleTracks(tracks)
    expect(tracks).toEqual([1, 2, 3])
  })

  it('пустой массив → пустой массив', () => {
    expect(shuffleTracks([])).toEqual([])
  })

  it('один элемент → тот же один элемент', () => {
    expect(shuffleTracks([42])).toEqual([42])
  })

  it('детерминирован при подмене Math.random', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(shuffleTracks([1, 2, 3])).toEqual([2, 3, 1])
  })

  it('не падает на разрежённом массиве с дырами', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const arr: (number | undefined)[] = Array(3)
    arr[0] = 1
    arr[2] = 3

    const result = shuffleTracks(arr as number[])

    expect(result).toHaveLength(3)
    expect([...result].filter((x) => x !== undefined).sort()).toEqual([1, 3])
  })

  it('не падает, когда элемент для обмена — дыра', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.4).mockReturnValueOnce(0.5)
    const arr: (number | undefined)[] = Array(3)
    arr[0] = 1
    arr[2] = 3

    const result = shuffleTracks(arr as number[])

    expect(result).toHaveLength(3)
    expect([...result].filter((x) => x !== undefined).sort()).toEqual([1, 3])
  })
})
