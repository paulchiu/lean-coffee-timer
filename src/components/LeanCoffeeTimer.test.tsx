import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LeanCoffeeTimer from '@/components/LeanCoffeeTimer'
import { ThemeContextType, useTheme } from '@/contexts/ThemeContext'
import { useTimer, TimerAction, TimerState } from '@/hooks/useTimer'

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
}))

vi.mock('@/hooks/useTimer', () => ({
  useTimer: vi.fn(),
}))

interface TimerDisplayProps {
  timeLeft: number
  totalTime: number
}

interface TimerControlsProps {
  isRunning: boolean
  onStart: () => void
  onExtend: () => void
  onReset: () => void
}

interface TimerSettingsProps {
  topicTime: number
  extensionTime: number
  onTopicTimeChange: (time: number) => void
  onExtensionTimeChange: (time: number) => void
}

interface HelpButtonProps {
  onClick: () => void
}

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

interface GitHubButtonProps {
  repo: string
}

interface MuteButtonProps {
  isMuted: boolean
  onToggle: () => void
}

vi.mock('@/components/timer/TimerDisplay', () => ({
  TimerDisplay: ({ timeLeft, totalTime }: TimerDisplayProps) => (
    <div data-testid="timer-display">
      Time left: {timeLeft}, Total: {totalTime}
    </div>
  ),
}))

vi.mock('@/components/timer/TimerControls', () => ({
  TimerControls: ({
    isRunning,
    onStart,
    onExtend,
    onReset,
  }: TimerControlsProps) => (
    <div data-testid="timer-controls">
      <button onClick={onStart} data-testid="start-button">
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button onClick={onExtend} data-testid="extend-button">
        Extend
      </button>
      <button onClick={onReset} data-testid="reset-button">
        Reset
      </button>
    </div>
  ),
}))

vi.mock('@/components/timer/TimerSettings', () => ({
  TimerSettings: ({
    topicTime,
    extensionTime,
    onTopicTimeChange,
    onExtensionTimeChange,
  }: TimerSettingsProps) => (
    <div data-testid="timer-settings">
      <input
        data-testid="topic-time-input"
        value={topicTime}
        onChange={e => onTopicTimeChange(Number(e.target.value))}
      />
      <input
        data-testid="extension-time-input"
        value={extensionTime}
        onChange={e => onExtensionTimeChange(Number(e.target.value))}
      />
    </div>
  ),
}))

vi.mock('@/components/theme/ThemeToggle', () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Toggle Theme</button>,
}))

vi.mock('@/components/help/HelpButton', () => ({
  HelpButton: ({ onClick }: HelpButtonProps) => (
    <button data-testid="help-button" onClick={onClick}>
      Help
    </button>
  ),
}))

vi.mock('@/components/help/HelpModal', () => ({
  HelpModal: ({ isOpen, onClose }: HelpModalProps) =>
    isOpen ? (
      <div data-testid="help-modal">
        <button onClick={onClose} data-testid="close-modal">
          Close
        </button>
      </div>
    ) : null,
}))

vi.mock('@/components/github/GitHubButton', () => ({
  GitHubButton: ({ repo }: GitHubButtonProps) => (
    <button data-testid="github-button">{repo}</button>
  ),
}))

vi.mock('@/components/sound/MuteButton', () => ({
  MuteButton: ({ isMuted, onToggle }: MuteButtonProps) => (
    <button data-testid="mute-button" onClick={onToggle} aria-pressed={isMuted}>
      {isMuted ? 'Unmute' : 'Mute'}
    </button>
  ),
}))

describe('LeanCoffeeTimer', () => {
  const mockDispatch = vi.fn() as unknown as React.Dispatch<TimerAction>
  const mockTimerState: TimerState = {
    timeLeft: 300,
    totalTime: 300,
    topicTime: 300,
    extensionTime: 60,
    isRunning: false,
    isMuted: false,
    allowNegative: false,
  }

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      isDarkMode: false,
    } as ThemeContextType)

    vi.mocked(useTimer).mockReturnValue({
      state: mockTimerState,
      dispatch: mockDispatch,
    })
  })

  it('renders the timer components', () => {
    render(<LeanCoffeeTimer />)

    expect(screen.getByTestId('timer-display')).toBeInTheDocument()
    expect(screen.getByTestId('timer-controls')).toBeInTheDocument()
    expect(screen.getByTestId('timer-settings')).toBeInTheDocument()
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
    expect(screen.getByTestId('help-button')).toBeInTheDocument()
    expect(screen.getByTestId('github-button')).toBeInTheDocument()
    expect(screen.getByTestId('mute-button')).toBeInTheDocument()
  })

  it('applies the correct theme class based on theme context', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      isDarkMode: true,
    } as ThemeContextType)

    const { container } = render(<LeanCoffeeTimer />)

    // Check if the container has the dark theme class
    expect(container.firstChild).toHaveClass('bg-gray-900')
    expect(container.firstChild).toHaveClass('text-white')
  })

  it('dispatches START_TIMER action when start button is clicked', () => {
    render(<LeanCoffeeTimer />)

    fireEvent.click(screen.getByTestId('start-button'))

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'START_TIMER' })
  })

  it('dispatches EXTEND_TIMER action when extend button is clicked', () => {
    render(<LeanCoffeeTimer />)

    fireEvent.click(screen.getByTestId('extend-button'))

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'EXTEND_TIMER' })
  })

  it('dispatches RESET_TIMER action when reset button is clicked', () => {
    render(<LeanCoffeeTimer />)

    fireEvent.click(screen.getByTestId('reset-button'))

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESET_TIMER' })
  })

  it('dispatches SET_TOPIC_TIME action when topic time is changed', () => {
    render(<LeanCoffeeTimer />)

    fireEvent.change(screen.getByTestId('topic-time-input'), {
      target: { value: '600' },
    })

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TOPIC_TIME',
      payload: 600,
    })
  })

  it('dispatches SET_EXTENSION_TIME action when extension time is changed', () => {
    render(<LeanCoffeeTimer />)

    fireEvent.change(screen.getByTestId('extension-time-input'), {
      target: { value: '120' },
    })

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_EXTENSION_TIME',
      payload: 120,
    })
  })

  it('shows help modal when help button is clicked', () => {
    render(<LeanCoffeeTimer />)

    // Initially the modal should not be visible
    expect(screen.queryByTestId('help-modal')).not.toBeInTheDocument()

    // Click the help button
    fireEvent.click(screen.getByTestId('help-button'))

    // Now the modal should be visible
    expect(screen.getByTestId('help-modal')).toBeInTheDocument()
  })

  it('closes help modal when close button is clicked', () => {
    render(<LeanCoffeeTimer />)

    // Open the modal
    fireEvent.click(screen.getByTestId('help-button'))
    expect(screen.getByTestId('help-modal')).toBeInTheDocument()

    // Close the modal
    fireEvent.click(screen.getByTestId('close-modal'))
    expect(screen.queryByTestId('help-modal')).not.toBeInTheDocument()
  })

  it('dispatches TOGGLE_MUTE action when mute button is clicked', () => {
    render(<LeanCoffeeTimer />)

    fireEvent.click(screen.getByTestId('mute-button'))

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_MUTE' })
  })

  it('displays muted state when timer is muted', () => {
    vi.mocked(useTimer).mockReturnValue({
      state: { ...mockTimerState, isMuted: true },
      dispatch: mockDispatch,
    })

    render(<LeanCoffeeTimer />)

    const muteButton = screen.getByTestId('mute-button')
    expect(muteButton).toHaveAttribute('aria-pressed', 'true')
    expect(muteButton).toHaveTextContent('Unmute')
  })

  it('displays unmuted state when timer is not muted', () => {
    vi.mocked(useTimer).mockReturnValue({
      state: { ...mockTimerState, isMuted: false },
      dispatch: mockDispatch,
    })

    render(<LeanCoffeeTimer />)

    const muteButton = screen.getByTestId('mute-button')
    expect(muteButton).toHaveAttribute('aria-pressed', 'false')
    expect(muteButton).toHaveTextContent('Mute')
  })
})
