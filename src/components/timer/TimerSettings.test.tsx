import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TimerSettings } from '@/components/timer/TimerSettings'
import { ThemeContextType, useTheme } from '@/contexts/ThemeContext'

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
}))

describe('TimerSettings', () => {
  const mockProps = {
    topicTime: 300, // 5 minutes in seconds
    extensionTime: 120, // 2 minutes in seconds
    onTopicTimeChange: vi.fn(),
    onExtensionTimeChange: vi.fn(),
  }

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
    } as ThemeContextType)
  })

  it('renders with correct initial values', () => {
    render(<TimerSettings {...mockProps} />)

    const topicTimeInput = screen.getByLabelText(
      'Topic Time (minutes)'
    ) as HTMLInputElement
    const extensionTimeInput = screen.getByLabelText(
      'Extension Time (minutes)'
    ) as HTMLInputElement

    expect(topicTimeInput).toBeInTheDocument()
    expect(extensionTimeInput).toBeInTheDocument()
    expect(topicTimeInput.value).toBe('5')
    expect(extensionTimeInput.value).toBe('2')
  })

  it('calls onTopicTimeChange when topic time is changed', () => {
    render(<TimerSettings {...mockProps} />)

    const topicTimeInput = screen.getByLabelText(
      'Topic Time (minutes)'
    ) as HTMLInputElement
    fireEvent.change(topicTimeInput, { target: { value: '10' } })

    expect(mockProps.onTopicTimeChange).toHaveBeenCalledWith(600) // 10 minutes in seconds
  })

  it('calls onExtensionTimeChange when extension time is changed', () => {
    render(<TimerSettings {...mockProps} />)

    const extensionTimeInput = screen.getByLabelText(
      'Extension Time (minutes)'
    ) as HTMLInputElement
    fireEvent.change(extensionTimeInput, { target: { value: '3' } })

    expect(mockProps.onExtensionTimeChange).toHaveBeenCalledWith(180) // 3 minutes in seconds
  })

  it('applies dark theme styling when theme is dark', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
    } as ThemeContextType)

    render(<TimerSettings {...mockProps} />)

    const topicTimeInput = screen.getByLabelText('Topic Time (minutes)')
    const extensionTimeInput = screen.getByLabelText('Extension Time (minutes)')
    const topicTimeLabel = screen.getByText('Topic Time (minutes)')
    const extensionTimeLabel = screen.getByText('Extension Time (minutes)')

    expect(topicTimeInput).toHaveClass('bg-gray-800')
    expect(topicTimeInput).toHaveClass('text-white')
    expect(extensionTimeInput).toHaveClass('bg-gray-800')
    expect(extensionTimeInput).toHaveClass('text-white')
    expect(topicTimeLabel).toHaveClass('text-gray-300')
    expect(extensionTimeLabel).toHaveClass('text-gray-300')
  })

  it('applies light theme styling when theme is light', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
    } as ThemeContextType)

    render(<TimerSettings {...mockProps} />)

    const topicTimeInput = screen.getByLabelText('Topic Time (minutes)')
    const extensionTimeInput = screen.getByLabelText('Extension Time (minutes)')
    const topicTimeLabel = screen.getByText('Topic Time (minutes)')
    const extensionTimeLabel = screen.getByText('Extension Time (minutes)')

    expect(topicTimeInput).not.toHaveClass('bg-gray-800')
    expect(topicTimeInput).not.toHaveClass('text-white')
    expect(extensionTimeInput).not.toHaveClass('bg-gray-800')
    expect(extensionTimeInput).not.toHaveClass('text-white')
    expect(topicTimeLabel).toHaveClass('text-gray-700')
    expect(extensionTimeLabel).toHaveClass('text-gray-700')
  })

  it('has proper accessibility attributes', () => {
    render(<TimerSettings {...mockProps} />)

    const topicTimeInput = screen.getByLabelText('Topic Time (minutes)')
    const extensionTimeInput = screen.getByLabelText('Extension Time (minutes)')

    expect(topicTimeInput).toHaveAttribute(
      'aria-describedby',
      'topic-time-description'
    )
    expect(extensionTimeInput).toHaveAttribute(
      'aria-describedby',
      'extension-time-description'
    )

    const topicTimeDescription = screen.getByText(
      'Enter a value between 1 and 60 minutes for the starting topic discussion time'
    )
    const extensionTimeDescription = screen.getByText(
      'Enter a value between 1 and 60 minutes for how long you would like to extend discussions by'
    )

    expect(topicTimeDescription).toBeInTheDocument()
    expect(extensionTimeDescription).toBeInTheDocument()
  })

  it('has min and max attributes set correctly', () => {
    render(<TimerSettings {...mockProps} />)

    const topicTimeInput = screen.getByLabelText(
      'Topic Time (minutes)'
    ) as HTMLInputElement
    const extensionTimeInput = screen.getByLabelText(
      'Extension Time (minutes)'
    ) as HTMLInputElement

    expect(topicTimeInput).toHaveAttribute('min', '1')
    expect(topicTimeInput).toHaveAttribute('max', '60')
    expect(extensionTimeInput).toHaveAttribute('min', '1')
    expect(extensionTimeInput).toHaveAttribute('max', '60')
  })
})
