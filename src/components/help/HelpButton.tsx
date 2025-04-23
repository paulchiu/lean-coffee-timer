import { Button } from '@/components/ui/button'
import { HelpCircle } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

type HelpButtonProps = {
  onClick: () => void
}

export function HelpButton({ onClick }: HelpButtonProps) {
  const { isDarkMode } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className={isDarkMode ? 'bg-gray-800 text-white' : ''}
      aria-label="Show 'Why Lean Coffee Timer?'"
    >
      <HelpCircle size={20} />
    </Button>
  )
}
