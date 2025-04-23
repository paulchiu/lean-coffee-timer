import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HelpButton } from '@/components/help/HelpButton'
import { ThemeContextType, useTheme } from '@/contexts/ThemeContext'

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
}))

describe('HelpButton', () => {
  const mockOnClick = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: false,
    } as ThemeContextType)
  })

  it('renders a button with Help icon', () => {
    render(<HelpButton onClick={mockOnClick} />)

    const button = screen.getByRole('button', {
      name: "Show 'Why Lean Coffee Timer?'",
    })

    expect(button).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', async () => {
    render(<HelpButton onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('applies dark mode styling when isDarkMode is true', () => {
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: true,
    } as ThemeContextType)

    render(<HelpButton onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gray-800')
    expect(button).toHaveClass('text-white')
  })

  it('does not apply dark mode styling when isDarkMode is false', () => {
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: false,
    } as ThemeContextType)

    render(<HelpButton onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    expect(button).not.toHaveClass('bg-gray-800')
    expect(button).not.toHaveClass('text-white')
  })
})
