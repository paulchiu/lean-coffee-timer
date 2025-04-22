import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'
import { Github } from 'lucide-react'

interface GitHubButtonProps {
  repo: string
}

export function GitHubButton({ repo }: GitHubButtonProps) {
  const { isDarkMode } = useTheme()

  const handleClick = () => {
    // Construct the full GitHub URL
    const githubUrl = `https://github.com/${repo}`
    // Redirect to the repository
    window.open(githubUrl, '_blank')
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      className={isDarkMode ? 'bg-gray-800 text-white' : ''}
    >
      <Github size={20} />
    </Button>
  )
}
