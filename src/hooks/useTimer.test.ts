import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimer } from './useTimer'
import store from 'store2'
import { beepSound, alarmSound } from '@/components/timer/TimerUtils'

vi.mock('store2', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
  },
}))

vi.mock('@/components/timer/TimerUtils', () => ({
  beepSound: { play: vi.fn() },
  alarmSound: { play: vi.fn() },
}))

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.resetAllMocks()
    vi.mocked(store.get).mockReturnValue(null)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Initialization', () => {
    it('should initialize with default values when no saved settings', () => {
      const { result } = renderHook(() => useTimer())

      expect(result.current.state).toEqual({
        topicTime: 5 * 60,
        extensionTime: 2 * 60,
        timeLeft: 5 * 60,
        totalTime: 0,
        isRunning: false,
        isMuted: false,
      })
    })

    it('should initialize with saved settings when available', () => {
      const savedSettings = {
        topicTime: 10 * 60,
        extensionTime: 3 * 60,
        isMuted: true,
      }
      vi.mocked(store.get).mockReturnValue(savedSettings)

      const { result } = renderHook(() => useTimer())

      expect(result.current.state).toEqual({
        topicTime: 10 * 60,
        extensionTime: 3 * 60,
        timeLeft: 10 * 60,
        totalTime: 0,
        isRunning: false,
        isMuted: true,
      })
    })

    it('should initialize with provided values', () => {
      const { result } = renderHook(() =>
        useTimer({ initialTopicTime: 15 * 60, initialExtensionTime: 4 * 60 })
      )

      expect(result.current.state).toEqual({
        topicTime: 15 * 60,
        extensionTime: 4 * 60,
        timeLeft: 15 * 60,
        totalTime: 0,
        isRunning: false,
        isMuted: false,
      })
    })

    it('should use saved settings over provided values', () => {
      const savedSettings = {
        topicTime: 10 * 60,
        extensionTime: 3 * 60,
        isMuted: true,
      }
      vi.mocked(store.get).mockReturnValue(savedSettings)

      const { result } = renderHook(() =>
        useTimer({ initialTopicTime: 15 * 60, initialExtensionTime: 4 * 60 })
      )

      expect(result.current.state).toEqual({
        topicTime: 10 * 60,
        extensionTime: 3 * 60,
        timeLeft: 10 * 60,
        totalTime: 0,
        isRunning: false,
        isMuted: true,
      })
    })
  })

  describe('SET_TOPIC_TIME', () => {
    it('should update topic time and save to store', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.dispatch({ type: 'SET_TOPIC_TIME', payload: 10 * 60 })
      })

      expect(result.current.state.topicTime).toBe(10 * 60)
      expect(store.set).toHaveBeenCalledWith('timerSettings', {
        topicTime: 10 * 60,
        extensionTime: 2 * 60,
        isMuted: false,
      })
    })

    it('should update topic time but not affect running timer', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.dispatch({ type: 'START_TIMER' })
      })

      act(() => {
        vi.advanceTimersByTime(30 * 1000) // 30 seconds
      })

      const timeLeftBeforeChange = result.current.state.timeLeft

      act(() => {
        result.current.dispatch({ type: 'SET_TOPIC_TIME', payload: 10 * 60 })
      })

      expect(result.current.state.topicTime).toBe(10 * 60)
      expect(result.current.state.timeLeft).toBe(timeLeftBeforeChange)
      expect(result.current.state.isRunning).toBe(true)
    })
  })

  describe('SET_EXTENSION_TIME', () => {
    it('should update extension time and save to store', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.dispatch({ type: 'SET_EXTENSION_TIME', payload: 3 * 60 })
      })

      expect(result.current.state.extensionTime).toBe(3 * 60)
      expect(store.set).toHaveBeenCalledWith('timerSettings', {
        topicTime: 5 * 60,
        extensionTime: 3 * 60,
        isMuted: false,
      })
    })

    it('should update extension time without affecting current timer state', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.dispatch({ type: 'START_TIMER' })
      })

      act(() => {
        vi.advanceTimersByTime(60 * 1000) // 1 minute
      })

      const timeLeftBeforeChange = result.current.state.timeLeft

      act(() => {
        result.current.dispatch({ type: 'SET_EXTENSION_TIME', payload: 3 * 60 })
      })

      expect(result.current.state.extensionTime).toBe(3 * 60)
      expect(result.current.state.timeLeft).toBe(timeLeftBeforeChange)
      expect(result.current.state.isRunning).toBe(true)
    })
  })

  describe('TOGGLE_MUTE', () => {
    it('should toggle mute state and save to store', () => {
      const { result } = renderHook(() => useTimer())

      expect(result.current.state.isMuted).toBe(false)

      act(() => {
        result.current.dispatch({ type: 'TOGGLE_MUTE' })
      })

      expect(result.current.state.isMuted).toBe(true)
      expect(store.set).toHaveBeenCalledWith('timerSettings', {
        topicTime: 5 * 60,
        extensionTime: 2 * 60,
        isMuted: true,
      })

      act(() => {
        result.current.dispatch({ type: 'TOGGLE_MUTE' })
      })

      expect(result.current.state.isMuted).toBe(false)
      expect(store.set).toHaveBeenCalledWith('timerSettings', {
        topicTime: 5 * 60,
        extensionTime: 2 * 60,
        isMuted: false,
      })
    })

    it('should not play sounds when muted', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.dispatch({ type: 'TOGGLE_MUTE' })
      })

      act(() => {
        result.current.dispatch({ type: 'START_TIMER' })
      })

      // Fast-forward to 10 seconds left
      act(() => {
        vi.advanceTimersByTime((5 * 60 - 10) * 1000)
      })

      expect(beepSound.play).not.toHaveBeenCalled()

      // Fast-forward to 0 seconds
      act(() => {
        vi.advanceTimersByTime(10 * 1000)
      })

      expect(alarmSound.play).not.toHaveBeenCalled()
    })

    it('should resume playing sounds when unmuted', () => {
      const { result } = renderHook(() => useTimer())

      // Start muted
      act(() => {
        result.current.dispatch({ type: 'TOGGLE_MUTE' })
      })

      act(() => {
        result.current.dispatch({ type: 'START_TIMER' })
      })

      // Fast-forward to 11 seconds left (just before beeps start)
      act(() => {
        vi.advanceTimersByTime((5 * 60 - 11) * 1000)
      })

      // Unmute
      act(() => {
        result.current.dispatch({ type: 'TOGGLE_MUTE' })
      })

      // Advance to 10 seconds left (should trigger beep)
      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(beepSound.play).toHaveBeenCalledTimes(1)
    })
  })

  describe('START_TIMER', () => {
    it('should start the timer', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.dispatch({ type: 'START_TIMER' })
      })

      expect(result.current.state).toEqual({
        topicTime: 5 * 60,
        extensionTime: 2 * 60,
        timeLeft: 5 * 60,
        totalTime: 0,
        isRunning: true,
        isMuted: false,
      })
    })

    it('should restart the timer when already running', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.dispatch({ type: 'START_TIMER' })
      })

      act(() => {
        vi.advanceTimersByTime(60 * 1000) // 1 minute
      })

      expect(result.current.state.timeLeft).toBe(5 * 60 - 60)

      act(() => {
        result.current.dispatch({ type: 'START_TIMER' })
      })

      expect(result.current.state.timeLeft).toBe(5 * 60)
      expect(result.current.state.totalTime).toBe(0)
      expect(result.current.state.isRunning).toBe(true)
    })
  })

  describe('EXTEND_TIMER', () => {
    it('should extend the timer', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.dispatch({ type: 'START_TIMER' })
      })

      // Fast-forward 1 minute
      act(() => {
        vi.advanceTimersByTime(60 * 1000)
      })

      const timeLeftBeforeExtension = result.current.state.timeLeft

      act(() => {
        result.current.dispatch({ type: 'EXTEND_TIMER' })
      })

      expect(result.current.state.timeLeft).toBe(
        timeLeftBeforeExtension + 2 * 60
      )
      expect(result.current.state.isRunning).toBe(true)
    })

    it('should extend and restart a stopped timer', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.dispatch({ type: 'START_TIMER' })
      })

      // Run down timer
      act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000)
      })

      expect(result.current.state.isRunning).toBe(false)
      expect(result.current.state.timeLeft).toBe(0)

      act(() => {
        result.current.dispatch({ type: 'EXTEND_TIMER' })
      })

      expect(result.current.state.timeLeft).toBe(2 * 60)
      expect(result.current.state.isRunning).toBe(true)
    })

    it('should extend a timer that has not been started', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.dispatch({ type: 'EXTEND_TIMER' })
      })

      expect(result.current.state.timeLeft).toBe(5 * 60 + 2 * 60)
      expect(result.current.state.isRunning).toBe(true)
    })
  })

  describe('RESET_TIMER', () => {
    it('should reset the timer', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.dispatch({ type: 'START_TIMER' })
      })

      // Fast-forward 1 minute
      act(() => {
        vi.advanceTimersByTime(60 * 1000)
      })

      act(() => {
        result.current.dispatch({ type: 'RESET_TIMER' })
      })

      expect(result.current.state).toEqual({
        topicTime: 5 * 60,
        extensionTime: 2 * 60,
        timeLeft: 5 * 60,
        totalTime: 0,
        isRunning: false,
        isMuted: false,
      })
    })

    it('should reset a timer that has not been started', () => {
      const { result } = renderHook(() => useTimer())

      // Change some settings first
      act(() => {
        result.current.dispatch({ type: 'SET_TOPIC_TIME', payload: 10 * 60 })
      })

      act(() => {
        result.current.dispatch({ type: 'RESET_TIMER' })
      })

      expect(result.current.state).toEqual({
        topicTime: 10 * 60,
        extensionTime: 2 * 60,
        timeLeft: 10 * 60,
        totalTime: 0,
        isRunning: false,
        isMuted: false,
      })
    })
  })

  describe('TICK', () => {
    it('should tick and decrement timeLeft when running', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.dispatch({ type: 'START_TIMER' })
      })

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(result.current.state.timeLeft).toBe(5 * 60 - 2)
      expect(result.current.state.totalTime).toBe(2)
    })

    it('should play beep sound when timeLeft is between 1 and 10 seconds', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.dispatch({ type: 'START_TIMER' })
      })

      // Fast-forward to 11 seconds left
      act(() => {
        vi.advanceTimersByTime((5 * 60 - 11) * 1000)
      })

      expect(beepSound.play).not.toHaveBeenCalled()

      // Advance to 10 seconds left
      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(beepSound.play).toHaveBeenCalledTimes(1)

      // Advance to 1 second left
      act(() => {
        vi.advanceTimersByTime(8000)
      })

      expect(beepSound.play).toHaveBeenCalledTimes(9)
    })

    it('should play alarm sound when timer reaches zero', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.dispatch({ type: 'START_TIMER' })
      })

      // Fast-forward to 1 second left
      act(() => {
        vi.advanceTimersByTime((5 * 60 - 1) * 1000)
      })

      expect(alarmSound.play).not.toHaveBeenCalled()

      // Advance to 0 seconds left
      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(alarmSound.play).toHaveBeenCalledTimes(1)
    })

    it('should stop running when timer reaches zero', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.dispatch({ type: 'START_TIMER' })
      })

      // Run down timer
      act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000)
      })

      expect(result.current.state.isRunning).toBe(false)
      expect(result.current.state.timeLeft).toBe(0)
    })

    it('should continue incrementing totalTime when timer reaches zero', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.dispatch({ type: 'START_TIMER' })
      })

      // Run down timer
      act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000)
      })

      expect(result.current.state.totalTime).toBe(5 * 60)

      // No more ticks should happen after timer stops
      act(() => {
        vi.advanceTimersByTime(10 * 1000)
      })

      expect(result.current.state.totalTime).toBe(5 * 60)
    })
  })

  describe('Combined actions', () => {
    it('should handle extending then resetting timer', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.dispatch({ type: 'START_TIMER' })
      })

      act(() => {
        vi.advanceTimersByTime(60 * 1000) // 1 minute
      })

      act(() => {
        result.current.dispatch({ type: 'EXTEND_TIMER' })
      })

      expect(result.current.state.timeLeft).toBe(5 * 60 - 60 + 2 * 60)

      act(() => {
        result.current.dispatch({ type: 'RESET_TIMER' })
      })

      expect(result.current.state.timeLeft).toBe(5 * 60)
      expect(result.current.state.isRunning).toBe(false)
    })

    it('should handle changing settings then starting timer', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.dispatch({ type: 'SET_TOPIC_TIME', payload: 10 * 60 })
      })

      act(() => {
        result.current.dispatch({ type: 'SET_EXTENSION_TIME', payload: 3 * 60 })
      })

      act(() => {
        result.current.dispatch({ type: 'START_TIMER' })
      })

      expect(result.current.state.timeLeft).toBe(10 * 60)
      expect(result.current.state.isRunning).toBe(true)

      act(() => {
        vi.advanceTimersByTime(60 * 1000) // 1 minute
      })

      act(() => {
        result.current.dispatch({ type: 'EXTEND_TIMER' })
      })

      expect(result.current.state.timeLeft).toBe(10 * 60 - 60 + 3 * 60)
    })

    it('should maintain mute state across timer operations', () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.dispatch({ type: 'TOGGLE_MUTE' })
      })

      expect(result.current.state.isMuted).toBe(true)

      act(() => {
        result.current.dispatch({ type: 'START_TIMER' })
      })

      expect(result.current.state.isMuted).toBe(true)

      act(() => {
        result.current.dispatch({ type: 'RESET_TIMER' })
      })

      expect(result.current.state.isMuted).toBe(true)

      act(() => {
        result.current.dispatch({ type: 'EXTEND_TIMER' })
      })

      expect(result.current.state.isMuted).toBe(true)
    })
  })
})
