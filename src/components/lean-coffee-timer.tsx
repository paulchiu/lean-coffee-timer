import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Howl } from 'howler'
import { Moon, Sun } from 'lucide-react'
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

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1)
        setTotalTime(prevTotal => prevTotal + 1)

        if (timeLeft <= 11) {
          beepSound.play()
        }
      }, 1000)
    } else if (timeLeft === 0) {
      beepSound.play() // Play a final beep when the timer reaches zero
      // We don't set isRunning to false here, allowing for extension
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
        className={`text-[12rem]/[12rem] tabular-nums font-bold ${timerColor}`}
        animate={{ scale: timeLeft <= 10 ? [1, 1.1, 1] : 1 }}
        transition={{
          duration: 0.5,
          repeat: timeLeft <= 10 ? Number.POSITIVE_INFINITY : 0,
        }}
      >
        {formatTime(timeLeft)}
      </motion.div>

      <div
        className={`mb-16 text-2xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
      >
        Discussion Time{' '}
        <span className="tabular-nums">{formatTime(totalTime)}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8">
        <Button
          onClick={startTimer}
          disabled={isRunning}
          variant={isDarkMode ? 'secondary' : 'default'}
        >
          Start Discussion
        </Button>
        <Button
          onClick={extendTime}
          disabled={!isRunning && timeLeft > 0}
          variant={isDarkMode ? 'secondary' : 'default'}
        >
          Extend Time
        </Button>
        <Button
          onClick={resetTimer}
          variant={isDarkMode ? 'secondary' : 'outline'}
          className={isDarkMode ? 'text-gray-700' : ''}
        >
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <Label
            htmlFor="topicTime"
            className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}
          >
            Topic Time (minutes)
          </Label>
          <Input
            id="topicTime"
            type="number"
            value={topicTime / 60}
            onChange={e => setTopicTime(Number(e.target.value) * 60)}
            min={1}
            className={`w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
          />
        </div>
        <div>
          <Label
            htmlFor="extensionTime"
            className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}
          >
            Extension Time (minutes)
          </Label>
          <Input
            id="extensionTime"
            type="number"
            value={extensionTime / 60}
            onChange={e => setExtensionTime(Number(e.target.value) * 60)}
            min={1}
            className={`w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
          />
        </div>
      </div>

      <div className="fixed bottom-4 right-4">
        <Button
          onClick={toggleDarkMode}
          variant={isDarkMode ? 'default' : 'outline'}
          size="icon"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
