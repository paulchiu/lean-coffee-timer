import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'

type TimerControlsProps = {
  isRunning: boolean
  onStart: () => void
  onExtend: () => void
  onReset: () => void
}

export function TimerControls({
  isRunning,
  onStart,
  onExtend,
  onReset,
}: TimerControlsProps) {
  const { isDarkMode } = useTheme()

  return (
    <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
      <Button
        onClick={onStart}
        disabled={isRunning}
        variant={isDarkMode ? 'secondary' : 'default'}
        className="text-sm sm:text-base"
      >
        Start Discussion
      </Button>
      <Button
        onClick={onExtend}
        variant={isDarkMode ? 'secondary' : 'default'}
        className="text-sm sm:text-base"
      >
        Extend Time
      </Button>
      <Button
        onClick={onReset}
        variant={isDarkMode ? 'secondary' : 'default'}
        className="text-sm sm:text-base"
      >
        Reset
      </Button>
    </div>
  )
}
