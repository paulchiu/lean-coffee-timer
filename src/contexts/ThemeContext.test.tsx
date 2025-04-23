import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from './ThemeContext'
import store from 'store2'

vi.mock('store2', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
  },
}))

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Initialization', () => {
    it('should initialize with light theme when no saved settings', () => {
      vi.mocked(store.get).mockReturnValue(null)

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      expect(result.current).toEqual({
        isDarkMode: false,
        theme: 'light',
        toggleDarkMode: expect.any(Function),
      })
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('should initialize with dark theme when saved settings is dark', () => {
      vi.mocked(store.get).mockReturnValue('dark')

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      expect(result.current).toEqual({
        isDarkMode: true,
        theme: 'dark',
        toggleDarkMode: expect.any(Function),
      })
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should initialize with light theme when saved settings is light', () => {
      vi.mocked(store.get).mockReturnValue('light')

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      expect(result.current).toEqual({
        isDarkMode: false,
        theme: 'light',
        toggleDarkMode: expect.any(Function),
      })
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  describe('toggleDarkMode', () => {
    it('should toggle from light to dark mode', () => {
      vi.mocked(store.get).mockReturnValue('light')

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      act(() => {
        result.current.toggleDarkMode()
      })

      expect(result.current.isDarkMode).toBe(true)
      expect(result.current.theme).toBe('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(store.set).toHaveBeenCalledWith('themeSettings', 'dark')
    })

    it('should toggle from dark to light mode', () => {
      vi.mocked(store.get).mockReturnValue('dark')

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      act(() => {
        result.current.toggleDarkMode()
      })

      expect(result.current.isDarkMode).toBe(false)
      expect(result.current.theme).toBe('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
      expect(store.set).toHaveBeenCalledWith('themeSettings', 'light')
    })

    it('should toggle multiple times correctly', () => {
      vi.mocked(store.get).mockReturnValue('light')

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      // First toggle: light -> dark
      act(() => {
        result.current.toggleDarkMode()
      })

      expect(result.current.isDarkMode).toBe(true)
      expect(result.current.theme).toBe('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(store.set).toHaveBeenCalledWith('themeSettings', 'dark')

      // Second toggle: dark -> light
      act(() => {
        result.current.toggleDarkMode()
      })

      expect(result.current.isDarkMode).toBe(false)
      expect(result.current.theme).toBe('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
      expect(store.set).toHaveBeenCalledWith('themeSettings', 'light')
    })
  })

  describe('useTheme hook', () => {
    it('should throw error when used outside of ThemeProvider', () => {
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      expect(() => {
        renderHook(() => useTheme())
      }).toThrow('useTheme must be used within a ThemeProvider')

      consoleError.mockRestore()
    })
  })

  describe('DOM interactions', () => {
    it('should add dark class to document when in dark mode', () => {
      vi.mocked(store.get).mockReturnValue('dark')

      renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should remove dark class from document when switching to light mode', () => {
      vi.mocked(store.get).mockReturnValue('dark')

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      expect(document.documentElement.classList.contains('dark')).toBe(true)

      act(() => {
        result.current.toggleDarkMode()
      })

      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  describe('Storage interactions', () => {
    it('should save theme settings to store when toggling', () => {
      vi.mocked(store.get).mockReturnValue('light')

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      })

      act(() => {
        result.current.toggleDarkMode()
      })

      expect(store.set).toHaveBeenCalledWith('themeSettings', 'dark')

      act(() => {
        result.current.toggleDarkMode()
      })

      expect(store.set).toHaveBeenCalledWith('themeSettings', 'light')
    })
  })
})
