import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { TimerControls } from '@/components/timer/TimerControls'
import { TimerSettings } from '@/components/timer/TimerSettings'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { HelpButton } from '@/components/help/HelpButton'
import { HelpModal } from '@/components/help/HelpModal'
import { cva } from 'class-variance-authority'
import { GitHubButton } from './github/GitHubButton'
import { useTimer } from '@/hooks/useTimer'

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
  const { state: timer, dispatch } = useTimer()
  const [showHelpModal, setShowHelpModal] = useState(false)
  const { theme } = useTheme()

  return (
    <div className={timerVariants({ theme })}>
      <TimerDisplay timeLeft={timer.timeLeft} totalTime={timer.totalTime} />

      <TimerControls
        isRunning={timer.isRunning}
        onStart={() => dispatch({ type: 'START_TIMER' })}
        onExtend={() => dispatch({ type: 'EXTEND_TIMER' })}
        onReset={() => dispatch({ type: 'RESET_TIMER' })}
      />

      <TimerSettings
        topicTime={timer.topicTime}
        extensionTime={timer.extensionTime}
        onTopicTimeChange={time =>
          dispatch({ type: 'SET_TOPIC_TIME', payload: time })
        }
        onExtensionTimeChange={time =>
          dispatch({ type: 'SET_EXTENSION_TIME', payload: time })
        }
      />

      {/* App controls */}
      <div className="fixed bottom-4 right-4 z-10">
        <div className="flex gap-2">
          <ThemeToggle />
          <HelpButton onClick={() => setShowHelpModal(true)} />
          <GitHubButton repo="paulchiu/lean-coffee-timer" />
        </div>
      </div>

      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  )
}
