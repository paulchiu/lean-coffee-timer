import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'
import { Github } from 'lucide-react'

interface GitHubButtonProps {
  repo: string
}

export function GitHubButton({ repo }: GitHubButtonProps) {
  const { isDarkMode } = useTheme()

  const handleClick = () => {
    const githubUrl = `https://github.com/${repo}`
    window.open(githubUrl, '_blank')
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      className={isDarkMode ? 'bg-gray-800 text-white' : ''}
      aria-label={`View ${repo} on GitHub (opens new in tab)`}
    >
      <Github size={20} />
    </Button>
  )
}
