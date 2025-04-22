import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

type TimerSettingsProps = {
  topicTime: number
  extensionTime: number
  onTopicTimeChange: (value: number) => void
  onExtensionTimeChange: (value: number) => void
}

export function TimerSettings({
  topicTime,
  extensionTime,
  onTopicTimeChange,
  onExtensionTimeChange,
}: TimerSettingsProps) {
  const { isDarkMode } = useTheme()

  return (
    <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <div>
        <Label
          htmlFor="topic-time"
          className={cn(
            'text-sm mb-1 block',
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          )}
        >
          Topic Time (minutes)
        </Label>
        <Input
          id="topic-time"
          type="number"
          min="1"
          max="60"
          value={topicTime / 60}
          onChange={e => onTopicTimeChange(Number(e.target.value) * 60)}
          className={cn('text-center', isDarkMode && 'bg-gray-800 text-white')}
        />
      </div>
      <div>
        <Label
          htmlFor="extension-time"
          className={cn(
            'text-sm mb-1 block',
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          )}
        >
          Extension Time (minutes)
        </Label>
        <Input
          id="extension-time"
          type="number"
          min="1"
          max="60"
          value={extensionTime / 60}
          onChange={e => onExtensionTimeChange(Number(e.target.value) * 60)}
          className={cn('text-center', isDarkMode && 'bg-gray-800 text-white')}
        />
      </div>
    </div>
  )
}
