import { motion } from 'framer-motion'
import { formatTime } from '@/components/timer/TimerUtils'
import { useTheme } from '@/contexts/ThemeContext'
import { cva } from 'class-variance-authority'

const timerVariants = cva(
  'text-[5rem] sm:text-[8rem] md:text-[12rem]/[12rem] tabular-nums font-bold',
  {
    variants: {
      urgency: {
        normal: '',
        urgent: '',
      },
      theme: {
        light: '',
        dark: '',
      },
    },
    compoundVariants: [
      {
        urgency: 'normal',
        theme: 'light',
        className: 'text-primary',
      },
      {
        urgency: 'normal',
        theme: 'dark',
        className: 'text-white',
      },
      {
        urgency: 'urgent',
        theme: 'light',
        className: 'text-red-500',
      },
      {
        urgency: 'urgent',
        theme: 'dark',
        className: 'text-red-400',
      },
    ],
    defaultVariants: {
      urgency: 'normal',
      theme: 'light',
    },
  }
)

const discussionTimeVariants = cva('mb-8 text-lg sm:text-xl md:text-2xl', {
  variants: {
    theme: {
      light: 'text-gray-700',
      dark: 'text-gray-300',
    },
  },
  defaultVariants: {
    theme: 'light',
  },
})

type TimerDisplayProps = {
  timeLeft: number
  totalTime: number
  allowNegative?: boolean
}

export function TimerDisplay({ timeLeft, totalTime, allowNegative = false }: TimerDisplayProps) {
  const { theme } = useTheme()

  return (
    <>
      <motion.div
        className={timerVariants({
          urgency: timeLeft <= 10 ? 'urgent' : 'normal',
          theme,
        })}
        animate={{ scale: timeLeft <= 10 ? [1, 1.1, 1] : 1 }}
        transition={{
          duration: 0.5,
          repeat: timeLeft <= 10 ? Number.POSITIVE_INFINITY : 0,
        }}
        aria-label="Time remaining"
      >
        {allowNegative ? formatTime(timeLeft, true) : formatTime(timeLeft)}
      </motion.div>

      <div className={discussionTimeVariants({ theme })}>
        Discussion Time{' '}
        <span className="tabular-nums" aria-label="Time lapsed">
          {formatTime(totalTime)}
        </span>
      </div>
    </>
  )
}
