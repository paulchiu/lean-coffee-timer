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

    expect(
      screen.getByRole('button', { name: /extend discussion time/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /start discussion timer/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /reset timer/i })
    ).toBeInTheDocument()
  })

  it('calls onStart when Start Discussion button is clicked', async () => {
    render(<TimerControls {...mockProps} />)

    const startButton = screen.getByRole('button', {
      name: /start discussion timer/i,
    })
    await userEvent.click(startButton)

    expect(mockProps.onStart).toHaveBeenCalledTimes(1)
  })

  it('calls onExtend when Extend button is clicked', async () => {
    render(<TimerControls {...mockProps} />)

    const extendButton = screen.getByRole('button', {
      name: /extend discussion time/i,
    })
    await userEvent.click(extendButton)

    expect(mockProps.onExtend).toHaveBeenCalledTimes(1)
  })

  it('calls onReset when Reset button is clicked', async () => {
    render(<TimerControls {...mockProps} />)

    const resetButton = screen.getByRole('button', { name: /reset timer/i })
    await userEvent.click(resetButton)

    expect(mockProps.onReset).toHaveBeenCalledTimes(1)
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

    // When not running, Extend button should have ghost variant (no bg-primary class)
    let extendButton = screen.getByRole('button', {
      name: /extend discussion time/i,
    })
    expect(extendButton).not.toHaveClass('bg-primary')
    expect(extendButton).toHaveClass('hover:bg-accent')

    rerender(<TimerControls {...mockProps} isRunning={true} />)

    // When running, Extend button should have default variant (has bg-primary class)
    extendButton = screen.getByRole('button', {
      name: /extend discussion time/i,
    })
    expect(extendButton).toHaveClass('bg-primary')
  })

  it('applies correct variant to Reset button based on isRunning state', () => {
    const { rerender } = render(
      <TimerControls {...mockProps} isRunning={false} />
    )

    // When not running, Reset button should have ghost variant (no bg-destructive class)
    let resetButton = screen.getByRole('button', { name: /reset timer/i })
    expect(resetButton).not.toHaveClass('bg-destructive')
    expect(resetButton).toHaveClass('hover:bg-accent')

    rerender(<TimerControls {...mockProps} isRunning={true} />)

    // When running, Reset button should have destructive variant (has bg-destructive class)
    resetButton = screen.getByRole('button', { name: /reset timer/i })
    expect(resetButton).toHaveClass('bg-destructive')
  })
})
