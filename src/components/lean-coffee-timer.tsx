import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Howl } from 'howler'
import { Moon, Sun, HelpCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const beepSound = new Howl({
  src: ['/beep.mp3'],
})

export default function LeanCoffeeTimer() {
  const [topicTime, setTopicTime] = useState(5 * 60) // 5 minutes in seconds
  const [extensionTime, setExtensionTime] = useState(2 * 60) // 2 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(topicTime)
  const [totalTime, setTotalTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

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

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          beepSound.play()
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

  const timerColor =
    timeLeft <= 10
      ? isDarkMode
        ? 'text-red-400'
        : 'text-red-500'
      : isDarkMode
        ? 'text-white'
        : 'text-primary'

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
    >
      <motion.div
        className={`text-[5rem] sm:text-[8rem] md:text-[12rem]/[12rem] tabular-nums font-bold ${timerColor}`}
        animate={{ scale: timeLeft <= 10 ? [1, 1.1, 1] : 1 }}
        transition={{
          duration: 0.5,
          repeat: timeLeft <= 10 ? Number.POSITIVE_INFINITY : 0,
        }}
      >
        {formatTime(timeLeft)}
      </motion.div>

      <div
        className={`mb-8 text-lg sm:text-xl md:text-2xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
      >
        Discussion Time{' '}
        <span className="tabular-nums">{formatTime(totalTime)}</span>
      </div>

      <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
        <Button
          onClick={startTimer}
          disabled={isRunning}
          variant={isDarkMode ? 'secondary' : 'default'}
          className="text-sm sm:text-base"
        >
          Start Discussion
        </Button>
        <Button
          onClick={extendTime}
          variant={isDarkMode ? 'secondary' : 'default'}
          className="text-sm sm:text-base"
        >
          Extend Time
        </Button>
        <Button
          onClick={resetTimer}
          variant={isDarkMode ? 'secondary' : 'default'}
          className="text-sm sm:text-base"
        >
          Reset
        </Button>
      </div>

      <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div>
          <Label
            htmlFor="topic-time"
            className={`text-sm mb-1 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Topic Time (minutes)
          </Label>
          <Input
            id="topic-time"
            type="number"
            min="1"
            max="60"
            value={topicTime / 60}
            onChange={e => setTopicTime(parseInt(e.target.value) * 60)}
            className={`${isDarkMode ? 'bg-gray-800 text-white' : ''} text-center`}
            disabled={isRunning}
          />
        </div>
        <div>
          <Label
            htmlFor="extension-time"
            className={`text-sm mb-1 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Extension Time (minutes)
          </Label>
          <Input
            id="extension-time"
            type="number"
            min="1"
            max="30"
            value={extensionTime / 60}
            onChange={e => setExtensionTime(parseInt(e.target.value) * 60)}
            className={`${isDarkMode ? 'bg-gray-800 text-white' : ''} text-center`}
            disabled={isRunning}
          />
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-10">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={isDarkMode ? 'bg-gray-800 text-white' : ''}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowHelpModal(true)}
            className={isDarkMode ? 'bg-gray-800 text-white' : ''}
          >
            <HelpCircle size={20} />
          </Button>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div
            className={`relative w-full max-w-lg p-4 sm:p-6 mx-auto rounded-lg shadow-lg overflow-y-auto max-h-[90vh] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setShowHelpModal(false)}
            >
              <X size={20} />
            </Button>

            <h2 className="mb-4 text-lg sm:text-xl font-bold pr-6">
              Why Use a Lean Coffee Timer?
            </h2>

            <div className="space-y-3 text-sm sm:text-base">
              <p>
                Lean Coffee is a structured but agenda-less meeting format that
                helps teams:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Keep discussions focused and time-boxed</li>
                <li>Ensure equal participation from all attendees</li>
                <li>Democratically decide which topics deserve more time</li>
                <li>Prevent meetings from running over their allocated time</li>
                <li>Make meetings more productive and engaging</li>
              </ul>
              <p className="mt-4">
                This timer helps facilitate Lean Coffee sessions by providing
                clear time boundaries and the ability to extend discussions when
                the group finds value in continuing.
              </p>
              <p className="mt-4">
                For more information, visit{' '}
                <a
                  href="https://leancoffee.org/"
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  leancoffee.org
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
