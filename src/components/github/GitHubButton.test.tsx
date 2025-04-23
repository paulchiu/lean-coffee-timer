import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GitHubButton } from '@/components/github/GitHubButton'
import { ThemeContextType, useTheme } from '@/contexts/ThemeContext'

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
}))

const mockOpen = vi.fn()
vi.stubGlobal('open', mockOpen)

describe('GitHubButton', () => {
  const mockRepo = 'user/repo'

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: false,
    } as ThemeContextType)
  })

  it('renders a button with GitHub icon', () => {
    render(<GitHubButton repo={mockRepo} />)

    const button = screen.getByRole('button', {
      name: `View ${mockRepo} on GitHub (opens new in tab)`,
    })

    expect(button).toBeInTheDocument()
  })

  it('opens the correct GitHub URL when clicked', async () => {
    render(<GitHubButton repo={mockRepo} />)

    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(window.open).toHaveBeenCalledWith(
      `https://github.com/${mockRepo}`,
      '_blank'
    )
  })

  it('applies dark mode styling when isDarkMode is true', () => {
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: true,
    } as ThemeContextType)

    render(<GitHubButton repo={mockRepo} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gray-800')
    expect(button).toHaveClass('text-white')
  })

  it('does not apply dark mode styling when isDarkMode is false', () => {
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: false,
    } as ThemeContextType)

    render(<GitHubButton repo={mockRepo} />)

    const button = screen.getByRole('button')
    expect(button).not.toHaveClass('bg-gray-800')
    expect(button).not.toHaveClass('text-white')
  })
})
