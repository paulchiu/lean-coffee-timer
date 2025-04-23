import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { ThemeContextType, useTheme } from '@/contexts/ThemeContext'
import { formatTime } from '@/components/timer/TimerUtils'

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
}))

vi.mock('@/components/timer/TimerUtils', () => ({
  formatTime: vi.fn(),
}))

describe('TimerDisplay', () => {
  const mockTimeLeft = 60
  const mockTotalTime = 300
  const mockFormattedTimeLeft = '01:00'
  const mockFormattedTotalTime = '05:00'

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
    } as ThemeContextType)
    vi.mocked(formatTime).mockImplementation(time => {
      if (time === mockTimeLeft) {
        return mockFormattedTimeLeft
      }
      if (time === mockTotalTime) {
        return mockFormattedTotalTime
      }
      return '00:00'
    })
  })

  it('renders the timer with correct formatted time', () => {
    render(<TimerDisplay timeLeft={mockTimeLeft} totalTime={mockTotalTime} />)

    const timerElement = screen.getByLabelText('Time remaining')
    const totalTimeElement = screen.getByLabelText('Time lapsed')

    expect(timerElement).toBeInTheDocument()
    expect(timerElement).toHaveTextContent(mockFormattedTimeLeft)
    expect(totalTimeElement).toBeInTheDocument()
    expect(totalTimeElement).toHaveTextContent(mockFormattedTotalTime)
    expect(formatTime).toHaveBeenCalledWith(mockTimeLeft)
    expect(formatTime).toHaveBeenCalledWith(mockTotalTime)
  })

  it('applies normal styling when time is not urgent', () => {
    render(<TimerDisplay timeLeft={60} totalTime={mockTotalTime} />)

    const timerElement = screen.getByLabelText('Time remaining')
    expect(timerElement).toHaveClass('text-primary')
    expect(timerElement).not.toHaveClass('text-red-500')
  })

  it('applies urgent styling when time is 10 seconds or less', () => {
    render(<TimerDisplay timeLeft={10} totalTime={mockTotalTime} />)

    const timerElement = screen.getByLabelText('Time remaining')
    expect(timerElement).toHaveClass('text-red-500')
    expect(timerElement).not.toHaveClass('text-primary')
  })

  it('applies light theme styling', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
    } as ThemeContextType)

    render(<TimerDisplay timeLeft={mockTimeLeft} totalTime={mockTotalTime} />)

    const timerElement = screen.getByLabelText('Time remaining')
    const discussionTimeElement = screen.getByText(/Discussion Time/, {
      exact: false,
    })

    expect(timerElement).toHaveClass('text-primary')
    expect(discussionTimeElement).toHaveClass('text-gray-700')
  })

  it('applies dark theme styling', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
    } as ThemeContextType)

    render(<TimerDisplay timeLeft={mockTimeLeft} totalTime={mockTotalTime} />)

    const timerElement = screen.getByLabelText('Time remaining')
    const discussionTimeElement = screen.getByText(/Discussion Time/, {
      exact: false,
    })

    expect(timerElement).toHaveClass('text-white')
    expect(discussionTimeElement).toHaveClass('text-gray-300')
  })

  it('applies urgent styling for times less than or equal to 10 seconds', () => {
    render(<TimerDisplay timeLeft={5} totalTime={mockTotalTime} />)

    const timerElement = screen.getByLabelText('Time remaining')
    expect(timerElement).toHaveClass('text-red-500')
  })

  it('applies normal styling for times greater than 10 seconds', () => {
    render(<TimerDisplay timeLeft={11} totalTime={mockTotalTime} />)

    const timerElement = screen.getByLabelText('Time remaining')
    expect(timerElement).toHaveClass('text-primary')
  })
})
