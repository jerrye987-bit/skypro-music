import { describe, it, expect } from 'vitest'
import { formatDuration } from '~/utils/format'

describe('formatDuration', () => {
  it.each([
    [125, '02:05'],
    [65, '01:05'],
    [61, '01:01'],
    [60, '01:00'],
    [59, '00:59'],
    [3599, '59:59'],
    [0, '00:00'],
  ])('%d секунд → %s', (input, expected) => {
    expect(formatDuration(input)).toBe(expected)
  })

  it('дробные секунды — дробная часть отбрасывается', () => {
    expect(formatDuration(90.7)).toBe('01:30')
  })

  it.each([
    ['строка', 'abc'],
    ['null', null],
    ['undefined', undefined],
    ['NaN', Number.NaN],
    ['отрицательное число', -5],
  ])('%s → пустая строка', (_label, input) => {
    expect(formatDuration(input)).toBe('')
  })
})
