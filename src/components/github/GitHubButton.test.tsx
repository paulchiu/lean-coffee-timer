import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GitHubButton } from '@/components/github/GitHubButton'
import { ThemeContextType, useTheme } from '@/contexts/ThemeContext'

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
}))

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

    const link = screen.getByRole('link', {
      name: `View ${mockRepo} on GitHub (opens new in tab)`,
    })

    expect(link).toBeInTheDocument()
  })

  it('has the correct GitHub URL and target', () => {
    render(<GitHubButton repo={mockRepo} />)

    const link = screen.getByRole('link')

    expect(link).toHaveAttribute('href', `https://github.com/${mockRepo}`)
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('applies dark mode styling when isDarkMode is true', () => {
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: true,
    } as ThemeContextType)

    render(<GitHubButton repo={mockRepo} />)

    // Get the button element directly
    const buttonElement = screen.getByLabelText(
      `View ${mockRepo} on GitHub (opens new in tab)`
    )

    expect(buttonElement).toHaveClass('bg-gray-800')
    expect(buttonElement).toHaveClass('text-white')
  })

  it('does not apply dark mode styling when isDarkMode is false', () => {
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: false,
    } as ThemeContextType)

    render(<GitHubButton repo={mockRepo} />)

    // Get the button element directly
    const buttonElement = screen.getByLabelText(
      `View ${mockRepo} on GitHub (opens new in tab)`
    )

    expect(buttonElement).not.toHaveClass('bg-gray-800')
    expect(buttonElement).not.toHaveClass('text-white')
  })
})
