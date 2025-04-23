import { Button } from '@/components/ui/button'
import { Volume2, VolumeX } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

type MuteButtonProps = {
  isMuted: boolean
  onToggle: () => void
}

export function MuteButton({ isMuted, onToggle }: MuteButtonProps) {
  const { isDarkMode } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onToggle}
      className={isDarkMode ? 'bg-gray-800 text-white' : ''}
      aria-label={isMuted ? 'Play timer sounds' : 'Mute timer sounds'}
    >
      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </Button>
  )
}
