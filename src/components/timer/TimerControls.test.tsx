import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimerControls } from '@/components/timer/TimerControls'

describe('TimerControls', () => {
  const mockProps = {
    isRunning: false,
    onStart: vi.fn(),
    onExtend: vi.fn(),
    onReset: vi.fn(),
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders all three buttons correctly', () => {
    render(<TimerControls {...mockProps} />)

    const extendButton = screen.getByRole('button', {
      name: /extend discussion time/i,
    })
    const startButton = screen.getByRole('button', {
      name: /start discussion timer/i,
    })
    const resetButton = screen.getByRole('button', { name: /reset timer/i })

    expect(extendButton).toBeInTheDocument()
    expect(startButton).toBeInTheDocument()
    expect(resetButton).toBeInTheDocument()
  })

  it('has responsive layout with different column spans', () => {
    render(<TimerControls {...mockProps} />)

    // Start button should span 2 columns on mobile
    const startButton = screen.getByRole('button', {
      name: /start discussion timer/i,
    })
    expect(startButton).toHaveClass('col-span-2')
    expect(startButton).toHaveClass('sm:col-span-1')

    // Check responsive text sizes
    expect(startButton).toHaveClass('text-sm')
    expect(startButton).toHaveClass('sm:text-base')
  })

  it('disables Start Discussion button when isRunning is true', () => {
    render(<TimerControls {...mockProps} isRunning={true} />)

    const startButton = screen.getByRole('button', {
      name: /start discussion timer/i,
    })
    expect(startButton).toBeDisabled()
  })

  it('enables Start Discussion button when isRunning is false', () => {
    render(<TimerControls {...mockProps} isRunning={false} />)

    const startButton = screen.getByRole('button', {
      name: /start discussion timer/i,
    })
    expect(startButton).not.toBeDisabled()
  })

  it('applies correct variant to Extend button based on isRunning state', () => {
    const { rerender } = render(
      <TimerControls {...mockProps} isRunning={false} />
    )

    // When not running, Extend button should have ghost variant (hover:bg-accent)
    let extendButton = screen.getByRole('button', {
      name: /extend discussion time/i,
    })
    expect(extendButton).toHaveClass('hover:bg-accent')
    expect(extendButton).not.toHaveClass('bg-primary')

    rerender(<TimerControls {...mockProps} isRunning={true} />)

    // When running, Extend button should have default variant (bg-primary)
    extendButton = screen.getByRole('button', {
      name: /extend discussion time/i,
    })
    expect(extendButton).toHaveClass('bg-primary')
  })

  it('applies correct variant to Reset button based on isRunning state', () => {
    const { rerender } = render(
      <TimerControls {...mockProps} isRunning={false} />
    )

    // When not running, Reset button should have ghost variant (hover:bg-accent)
    let resetButton = screen.getByRole('button', { name: /reset timer/i })
    expect(resetButton).toHaveClass('hover:bg-accent')
    expect(resetButton).not.toHaveClass('bg-destructive')

    rerender(<TimerControls {...mockProps} isRunning={true} />)

    // When running, Reset button should have destructive variant (bg-destructive)
    resetButton = screen.getByRole('button', { name: /reset timer/i })
    expect(resetButton).toHaveClass('bg-destructive')
  })

  it('calls handler functions when buttons are clicked', async () => {
    render(<TimerControls {...mockProps} />)

    const startButton = screen.getByRole('button', {
      name: /start discussion timer/i,
    })
    const extendButton = screen.getByRole('button', {
      name: /extend discussion time/i,
    })
    const resetButton = screen.getByRole('button', { name: /reset timer/i })

    await userEvent.click(startButton)
    expect(mockProps.onStart).toHaveBeenCalledTimes(1)

    await userEvent.click(extendButton)
    expect(mockProps.onExtend).toHaveBeenCalledTimes(1)

    await userEvent.click(resetButton)
    expect(mockProps.onReset).toHaveBeenCalledTimes(1)
  })

  it('has correct order of buttons in desktop view', () => {
    render(<TimerControls {...mockProps} />)

    const startButton = screen.getByRole('button', {
      name: /start discussion timer/i,
    })
    const extendButton = screen.getByRole('button', {
      name: /extend discussion time/i,
    })
    const resetButton = screen.getByRole('button', { name: /reset timer/i })

    expect(startButton).toHaveClass('sm:order-2')
    expect(extendButton).toHaveClass('sm:order-1')
    expect(resetButton).toHaveClass('sm:order-3')
  })
})
