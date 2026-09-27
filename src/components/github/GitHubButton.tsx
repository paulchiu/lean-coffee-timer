import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'
import { GitHubIcon } from '@/components/github/GitHubIcon'

interface GitHubButtonProps {
  repo: string
}

export function GitHubButton({ repo }: GitHubButtonProps) {
  const { isDarkMode } = useTheme()
  const githubUrl = `https://github.com/${repo}`

  return (
    <Button
      asChild
      variant="outline"
      size="icon"
      className={isDarkMode ? 'bg-gray-800 text-white' : ''}
      aria-label={`View ${repo} on GitHub (opens new in tab)`}
    >
      <a href={githubUrl} target="_blank">
        <GitHubIcon size={20} />
      </a>
    </Button>
  )
}
