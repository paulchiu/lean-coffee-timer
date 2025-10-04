import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'
import { AlarmClock, AlarmClockMinus } from 'lucide-react'

type NegativeToggleProps = {
  isEnabled: boolean
  onToggle: () => void
}

export function NegativeToggle({ isEnabled, onToggle }: NegativeToggleProps) {
  const { isDarkMode } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onToggle}
      className={isDarkMode ? 'bg-gray-800 text-white' : ''}
      aria-label={
        isEnabled
          ? 'Stop at zero (disable negative time)'
          : 'Allow negative time'
      }
    >
      {isEnabled ? <AlarmClockMinus size={20} /> : <AlarmClock size={20} />}
    </Button>
  )
}
