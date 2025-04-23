import { useEffect, useReducer } from 'react'
import { beepSound, alarmSound } from '@/components/timer/TimerUtils'

const FIVE_MINS = 5 * 60
const TWO_MINS = 2 * 60

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
}

export type TimerAction =
  | { type: 'SET_TOPIC_TIME'; payload: number }
  | { type: 'SET_EXTENSION_TIME'; payload: number }
  | { type: 'START_TIMER' }
  | { type: 'EXTEND_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'TICK' }

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'SET_TOPIC_TIME':
      return { ...state, topicTime: action.payload }
    case 'SET_EXTENSION_TIME':
      return { ...state, extensionTime: action.payload }
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

      if (newTimeLeft < 0) {
        return {
          ...state,
          isRunning: false,
          timeLeft: 0,
          totalTime: state.totalTime + 1,
        }
      }

      return {
        ...state,
        timeLeft: newTimeLeft,
        totalTime: state.totalTime + 1,
      }
    }
    default:
      return state
  }
}

export function useTimer({
  initialTopicTime = FIVE_MINS,
  initialExtensionTime = TWO_MINS,
}: UseTimerProps = {}) {
  const initialState: TimerState = {
    topicTime: initialTopicTime,
    extensionTime: initialExtensionTime,
    timeLeft: initialTopicTime,
    totalTime: 0,
    isRunning: false,
  }
  const [state, dispatch] = useReducer(timerReducer, initialState)

  // Timer countdown
  useEffect(() => {
    if (!state.isRunning) {
      return
    }

    const interval = setInterval(() => {
      const nextTick = state.timeLeft - 1

      if (1 <= nextTick && nextTick <= 10) {
        beepSound.play()
      } else if (nextTick === 0) {
        alarmSound.play()
      }

      dispatch({ type: 'TICK' })
    }, 1000)

    if (state.timeLeft === 0) {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [state.isRunning, state.timeLeft])

  // Hook provides state and dispatch function
  return { state, dispatch }
}
