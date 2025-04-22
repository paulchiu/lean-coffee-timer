import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleDarkMode}
      className={isDarkMode ? 'bg-gray-800 text-white' : ''}
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  )
}
