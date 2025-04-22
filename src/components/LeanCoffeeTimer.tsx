import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { beepSound, alarmSound } from '@/components/timer/TimerUtils'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { TimerControls } from '@/components/timer/TimerControls'
import { TimerSettings } from '@/components/timer/TimerSettings'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { HelpButton } from '@/components/help/HelpButton'
import { HelpModal } from '@/components/help/HelpModal'
import { cva } from 'class-variance-authority'

const timerVariants = cva(
  'flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-300',
  {
    variants: {
      theme: {
        light: 'bg-white text-gray-900',
        dark: 'bg-gray-900 text-white',
      },
    },
    defaultVariants: {
      theme: 'light',
    },
  }
)

export default function LeanCoffeeTimer() {
  // Timer state
  const [topicTime, setTopicTime] = useState(5 * 60) // 5 minutes in seconds
  const [extensionTime, setExtensionTime] = useState(2 * 60) // 2 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(topicTime)
  const [totalTime, setTotalTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  // UI state
  const [showHelpModal, setShowHelpModal] = useState(false)

  // Theme context
  const { theme } = useTheme()

  // Timer control handlers
  const startTimer = useCallback(() => {
    setIsRunning(true)
    setTimeLeft(topicTime)
    setTotalTime(0)
  }, [topicTime])

  const extendTime = useCallback(() => {
    setTimeLeft(prevTime => prevTime + extensionTime)
    if (!isRunning) {
      setIsRunning(true)
    }
  }, [extensionTime, isRunning])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(topicTime)
    setTotalTime(0)
  }, [topicTime])

  // Timer effect
  useEffect(() => {
    if (!isRunning) {
      return
    }

    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime > 1 && prevTime <= 11) {
          beepSound.play()
        } else if (prevTime >= 0 && prevTime <= 1) {
          alarmSound.play()
        } else if (prevTime < 0) {
          setIsRunning(false)
          return 0
        }

        return prevTime - 1
      })
      setTotalTime(prevTotal => prevTotal + 1)
    }, 1000)

    if (timeLeft === 0) {
      clearInterval(interval)
      // Timer reached zero here, allowing for extension
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  return (
    <div className={timerVariants({ theme })}>
      <TimerDisplay timeLeft={timeLeft} totalTime={totalTime} />

      <TimerControls
        isRunning={isRunning}
        onStart={startTimer}
        onExtend={extendTime}
        onReset={resetTimer}
      />

      <TimerSettings
        topicTime={topicTime}
        extensionTime={extensionTime}
        onTopicTimeChange={setTopicTime}
        onExtensionTimeChange={setExtensionTime}
      />

      {/* Theme and Help Controls */}
      <div className="fixed bottom-4 right-4 z-10">
        <div className="flex gap-2">
          <ThemeToggle />
          <HelpButton onClick={() => setShowHelpModal(true)} />
        </div>
      </div>

      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  )
}
