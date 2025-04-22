import { motion } from 'framer-motion'
import { formatTime } from '@/components/timer/TimerUtils'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

type TimerDisplayProps = {
  timeLeft: number
  totalTime: number
}

export function TimerDisplay({ timeLeft, totalTime }: TimerDisplayProps) {
  const { isDarkMode } = useTheme()

  const timerColor =
    timeLeft <= 10
      ? isDarkMode
        ? 'text-red-400'
        : 'text-red-500'
      : isDarkMode
        ? 'text-white'
        : 'text-primary'

  return (
    <>
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
        className={cn(
          'mb-8 text-lg sm:text-xl md:text-2xl',
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        )}
      >
        Discussion Time{' '}
        <span className="tabular-nums">{formatTime(totalTime)}</span>
      </div>
    </>
  )
}
