import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HelpModal } from '@/components/help/HelpModal'
import { ThemeContextType, useTheme } from '@/contexts/ThemeContext'

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
}))

describe('HelpModal', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
    } as ThemeContextType)
  })

  it('renders nothing when isOpen is false', () => {
    render(<HelpModal isOpen={false} onClose={mockOnClose} />)

    const modal = screen.queryByText('Why Use a Lean Coffee Timer?')
    expect(modal).not.toBeInTheDocument()
  })

  it('renders the modal content when isOpen is true', () => {
    render(<HelpModal isOpen={true} onClose={mockOnClose} />)

    const heading = screen.getByText('Why Use a Lean Coffee Timer?')
    expect(heading).toBeInTheDocument()

    const description = screen.getByText(
      /Lean Coffee is a structured but agenda-less meeting format/
    )
    expect(description).toBeInTheDocument()

    const link = screen.getByText('leancoffee.org')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://leancoffee.org/')
  })

  it('calls onClose handler when close button is clicked', async () => {
    render(<HelpModal isOpen={true} onClose={mockOnClose} />)

    const closeButton = screen.getByRole('button', { name: 'Close help modal' })
    await userEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('applies light theme styling when theme is light', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
    } as ThemeContextType)

    render(<HelpModal isOpen={true} onClose={mockOnClose} />)

    const modalContent = screen
      .getByText('Why Use a Lean Coffee Timer?')
      .closest('div')
    expect(modalContent).toHaveClass('bg-white')
    expect(modalContent).toHaveClass('text-gray-900')
  })

  it('applies dark theme styling when theme is dark', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
    } as ThemeContextType)

    render(<HelpModal isOpen={true} onClose={mockOnClose} />)

    const modalContent = screen
      .getByText('Why Use a Lean Coffee Timer?')
      .closest('div')
    expect(modalContent).toHaveClass('bg-gray-800')
    expect(modalContent).toHaveClass('text-white')
  })

  it('renders list items correctly', () => {
    render(<HelpModal isOpen={true} onClose={mockOnClose} />)

    const listItems = [
      'Keep discussions focused and time-boxed',
      'Ensure equal participation from all attendees',
      'Democratically decide which topics deserve more time',
      'Prevent meetings from running over their allocated time',
      'Make meetings more productive and engaging',
    ]

    listItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument()
    })
  })
})
