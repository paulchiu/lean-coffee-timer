import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { ThemeContextType, useTheme } from '@/contexts/ThemeContext'

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
}))

describe('ThemeToggle', () => {
  const mockToggleDarkMode = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: false,
      theme: 'light',
      toggleDarkMode: mockToggleDarkMode,
    } as ThemeContextType)
  })

  it('renders a button with Moon icon when in light mode', () => {
    render(<ThemeToggle />)

    const button = screen.getByRole('button', {
      name: 'Switch to dark theme',
    })

    expect(button).toBeInTheDocument()
  })

  it('renders a button with Sun icon when in dark mode', () => {
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: true,
      theme: 'dark',
      toggleDarkMode: mockToggleDarkMode,
    } as ThemeContextType)

    render(<ThemeToggle />)

    const button = screen.getByRole('button', {
      name: 'Switch to light theme',
    })

    expect(button).toBeInTheDocument()
  })

  it('calls toggleDarkMode when clicked', async () => {
    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(mockToggleDarkMode).toHaveBeenCalledTimes(1)
  })

  it('applies dark mode styling when isDarkMode is true', () => {
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: true,
      theme: 'dark',
      toggleDarkMode: mockToggleDarkMode,
    } as ThemeContextType)

    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gray-800')
    expect(button).toHaveClass('text-white')
  })

  it('does not apply dark mode styling when isDarkMode is false', () => {
    vi.mocked(useTheme).mockReturnValue({
      isDarkMode: false,
      theme: 'light',
      toggleDarkMode: mockToggleDarkMode,
    } as ThemeContextType)

    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    expect(button).not.toHaveClass('bg-gray-800')
    expect(button).not.toHaveClass('text-white')
  })
})
