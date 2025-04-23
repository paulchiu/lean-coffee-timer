import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MuteButton } from '@/components/sound/MuteButton'
import { ThemeContextType, useTheme } from '@/contexts/ThemeContext'

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
}))

describe('MuteButton', () => {
  const mockOnToggle = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: false,
    } as ThemeContextType)
  })

  it('renders a button with Volume2 icon when not muted', () => {
    render(<MuteButton isMuted={false} onToggle={mockOnToggle} />)

    const button = screen.getByRole('button', {
      name: 'Mute timer sounds',
    })

    expect(button).toBeInTheDocument()
  })

  it('renders a button with VolumeX icon when muted', () => {
    render(<MuteButton isMuted={true} onToggle={mockOnToggle} />)

    const button = screen.getByRole('button', {
      name: 'Play timer sounds',
    })

    expect(button).toBeInTheDocument()
  })

  it('calls onToggle handler when clicked', async () => {
    render(<MuteButton isMuted={false} onToggle={mockOnToggle} />)

    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(mockOnToggle).toHaveBeenCalledTimes(1)
  })

  it('applies dark mode styling when isDarkMode is true', () => {
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: true,
    } as ThemeContextType)

    render(<MuteButton isMuted={false} onToggle={mockOnToggle} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gray-800')
    expect(button).toHaveClass('text-white')
  })

  it('does not apply dark mode styling when isDarkMode is false', () => {
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: false,
    } as ThemeContextType)

    render(<MuteButton isMuted={false} onToggle={mockOnToggle} />)

    const button = screen.getByRole('button')
    expect(button).not.toHaveClass('bg-gray-800')
    expect(button).not.toHaveClass('text-white')
  })
})
