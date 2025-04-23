import { describe, it, expect, vi, beforeEach } from 'vitest'
import { formatTime, beepSound, alarmSound } from './TimerUtils'

describe('TimerUtils', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('formatTime', () => {
    const sut = formatTime

    it.each`
      seconds | expected
      ${-1}   | ${'00:00'}
      ${0}    | ${'00:00'}
      ${7}    | ${'00:07'}
      ${59}   | ${'00:59'}
      ${60}   | ${'01:00'}
      ${61}   | ${'01:01'}
      ${599}  | ${'09:59'}
      ${600}  | ${'10:00'}
      ${3599} | ${'59:59'}
      ${3600} | ${'60:00'}
      ${3661} | ${'61:01'}
    `(
      'should format $seconds seconds as $expected',
      ({ seconds, expected }) => {
        expect(sut(seconds)).toBe(expected)
      }
    )
  })

  describe('sound objects', () => {
    it('should create beepSound as a Howl instance', () => {
      expect(beepSound).toBeDefined()
    })

    it('should create alarmSound as a Howl instance', () => {
      expect(alarmSound).toBeDefined()
    })
  })
})
