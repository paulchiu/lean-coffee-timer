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
    <div className="w-full max-w-md mb-6">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {/* Start button takes full width on mobile, 1/3 width on desktop */}
        <Button
          onClick={onStart}
          disabled={isRunning}
          variant="default"
          className="text-sm sm:text-base col-span-2 sm:col-span-1 sm:order-2"
          aria-label="Start discussion timer"
        >
          Start Discussion
        </Button>

        {/* Extend button takes half width on mobile, 1/3 width on desktop */}
        <Button
          onClick={onExtend}
          variant={isRunning ? 'default' : 'ghost'}
          className="text-sm sm:text-base sm:order-1"
          aria-label="Extend discussion time"
        >
          Extend
        </Button>

        {/* Reset button takes half width on mobile, 1/3 width on desktop */}
        <Button
          onClick={onReset}
          variant={isRunning ? 'destructive' : 'ghost'}
          className="text-sm sm:text-base sm:order-3"
          aria-label="Reset timer"
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
