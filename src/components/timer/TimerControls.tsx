import { Button } from '@/components/ui/button'

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
  return (
    <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
      <Button
        onClick={onExtend}
        variant={isRunning ? 'default' : 'ghost'}
        className="text-sm sm:text-base"
        aria-label="Extend discussion time"
      >
        Extend
      </Button>
      <Button
        onClick={onStart}
        disabled={isRunning}
        variant="default"
        className="text-sm sm:text-base"
        aria-label="Start discussion timer"
      >
        Start Discussion
      </Button>
      <Button
        onClick={onReset}
        variant={isRunning ? 'destructive' : 'ghost'}
        className="text-sm sm:text-base"
        aria-label="Reset timer"
      >
        Reset
      </Button>
    </div>
  )
}
