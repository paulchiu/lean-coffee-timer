import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTheme } from '@/contexts/ThemeContext'
import { cva } from 'class-variance-authority'

type TimerSettingsProps = {
  topicTime: number
  extensionTime: number
  onTopicTimeChange: (value: number) => void
  onExtensionTimeChange: (value: number) => void
}

const labelVariants = cva('text-sm mb-1 block', {
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

const inputVariants = cva('text-center', {
  variants: {
    theme: {
      light: '',
      dark: 'bg-gray-800 text-white',
    },
  },
  defaultVariants: {
    theme: 'light',
  },
})

export function TimerSettings({
  topicTime,
  extensionTime,
  onTopicTimeChange,
  onExtensionTimeChange,
}: TimerSettingsProps) {
  const { theme } = useTheme()

  return (
    <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <div>
        <Label htmlFor="topic-time" className={labelVariants({ theme })}>
          Topic Time (minutes)
        </Label>
        <Input
          id="topic-time"
          type="number"
          min="1"
          max="60"
          value={topicTime / 60}
          onChange={e => onTopicTimeChange(Number(e.target.value) * 60)}
          className={inputVariants({ theme })}
        />
      </div>
      <div>
        <Label htmlFor="extension-time" className={labelVariants({ theme })}>
          Extension Time (minutes)
        </Label>
        <Input
          id="extension-time"
          type="number"
          min="1"
          max="60"
          value={extensionTime / 60}
          onChange={e => onExtensionTimeChange(Number(e.target.value) * 60)}
          className={inputVariants({ theme })}
        />
      </div>
    </div>
  )
}
