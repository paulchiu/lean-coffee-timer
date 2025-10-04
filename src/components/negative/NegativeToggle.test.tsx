import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NegativeToggle } from '@/components/negative/NegativeToggle'
import { ThemeContextType, useTheme } from '@/contexts/ThemeContext'

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
}))

describe('NegativeToggle', () => {
  const mockOnToggle = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: false,
    } as ThemeContextType)
  })

  it('renders a button with AlarmClock icon when negative time is disabled', () => {
    render(<NegativeToggle isEnabled={false} onToggle={mockOnToggle} />)

    const button = screen.getByRole('button', {
      name: 'Allow negative time',
    })

    expect(button).toBeInTheDocument()
  })

  it('renders a button with AlarmClockMinus icon when negative time is enabled', () => {
    render(<NegativeToggle isEnabled={true} onToggle={mockOnToggle} />)

    const button = screen.getByRole('button', {
      name: 'Stop at zero (disable negative time)',
    })

    expect(button).toBeInTheDocument()
  })

  it('calls onToggle when clicked', async () => {
    render(<NegativeToggle isEnabled={false} onToggle={mockOnToggle} />)

    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(mockOnToggle).toHaveBeenCalledTimes(1)
  })

  it('applies dark mode styling when isDarkMode is true', () => {
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: true,
    } as ThemeContextType)

    render(<NegativeToggle isEnabled={false} onToggle={mockOnToggle} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gray-800')
    expect(button).toHaveClass('text-white')
  })

  it('does not apply dark mode styling when isDarkMode is false', () => {
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: false,
    } as ThemeContextType)

    render(<NegativeToggle isEnabled={false} onToggle={mockOnToggle} />)

    const button = screen.getByRole('button')
    expect(button).not.toHaveClass('bg-gray-800')
    expect(button).not.toHaveClass('text-white')
  })
})

