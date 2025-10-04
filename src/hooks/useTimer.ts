import { useEffect, useReducer } from 'react'
import { beepSound, alarmSound } from '@/components/timer/TimerUtils'
import store from 'store2'

const FIVE_MINS = 5 * 60
const TWO_MINS = 2 * 60
const SETTINGS_KEY = 'timerSettings'

interface UseTimerProps {
  initialTopicTime?: number
  initialExtensionTime?: number
}

export interface TimerState {
  topicTime: number
  extensionTime: number
  timeLeft: number
  totalTime: number
  isRunning: boolean
  isMuted: boolean
  allowNegative: boolean
}

export type TimerAction =
  | { type: 'SET_TOPIC_TIME'; payload: number }
  | { type: 'SET_EXTENSION_TIME'; payload: number }
  | { type: 'START_TIMER' }
  | { type: 'EXTEND_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_ALLOW_NEGATIVE' }
  | { type: 'TICK' }

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'SET_TOPIC_TIME': {
      const newState = { ...state, topicTime: action.payload }
      store.set(SETTINGS_KEY, {
        topicTime: newState.topicTime,
        extensionTime: newState.extensionTime,
        isMuted: newState.isMuted,
        allowNegative: newState.allowNegative,
      })
      return newState
    }
    case 'SET_EXTENSION_TIME': {
      const newState = { ...state, extensionTime: action.payload }
      store.set(SETTINGS_KEY, {
        topicTime: newState.topicTime,
        extensionTime: newState.extensionTime,
        isMuted: newState.isMuted,
        allowNegative: newState.allowNegative,
      })
      return newState
    }
    case 'TOGGLE_MUTE': {
      const newState = { ...state, isMuted: !state.isMuted }
      store.set(SETTINGS_KEY, {
        topicTime: newState.topicTime,
        extensionTime: newState.extensionTime,
        isMuted: newState.isMuted,
        allowNegative: newState.allowNegative,
      })
      return newState
    }
    case 'TOGGLE_ALLOW_NEGATIVE': {
      const newState = { ...state, allowNegative: !state.allowNegative }
      store.set(SETTINGS_KEY, {
        topicTime: newState.topicTime,
        extensionTime: newState.extensionTime,
        isMuted: newState.isMuted,
        allowNegative: newState.allowNegative,
      })
      return newState
    }
    case 'START_TIMER':
      return {
        ...state,
        isRunning: true,
        timeLeft: state.topicTime,
        totalTime: 0,
      }
    case 'EXTEND_TIMER':
      return {
        ...state,
        timeLeft: state.timeLeft + state.extensionTime,
        isRunning: true,
      }
    case 'RESET_TIMER':
      return {
        ...state,
        isRunning: false,
        timeLeft: state.topicTime,
        totalTime: 0,
      }
    case 'TICK': {
      const newTimeLeft = state.timeLeft - 1

      return {
        ...state,
        timeLeft: newTimeLeft,
        totalTime: state.totalTime + 1,
      }
    }
    default: {
      const type: never = action
      throw new Error(`Unexpected action: ${type}`)
    }
  }
}

export function useTimer({
  initialTopicTime = FIVE_MINS,
  initialExtensionTime = TWO_MINS,
}: UseTimerProps = {}) {
  const savedSettings = store.get(SETTINGS_KEY) || {}
  const initialState: TimerState = {
    topicTime: savedSettings.topicTime || initialTopicTime,
    extensionTime: savedSettings.extensionTime || initialExtensionTime,
    timeLeft: savedSettings.topicTime || initialTopicTime,
    totalTime: 0,
    isRunning: false,
    isMuted: savedSettings.isMuted || false,
    allowNegative: savedSettings.allowNegative || false,
  }

  const [state, dispatch] = useReducer(timerReducer, initialState)

  // Timer countdown
  useEffect(() => {
    if (!state.isRunning) {
      return
    }

    const interval = setInterval(() => {
      const nextTick = state.timeLeft - 1

      if (state.isMuted) {
        dispatch({ type: 'TICK' })
        return
      }

      if (1 <= nextTick && nextTick <= 10) {
        beepSound.play()
      } else if (nextTick === 0) {
        alarmSound.play()
      }

      dispatch({ type: 'TICK' })
    }, 1000)

    return () => clearInterval(interval)
  }, [state.isRunning, state.timeLeft, state.isMuted, state.allowNegative])

  // Hook provides state and dispatch function
  return { state, dispatch }
}
