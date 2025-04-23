import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import store from 'store2'

type ThemeContextType = {
  isDarkMode: boolean
  theme: 'dark' | 'light'
  toggleDarkMode: () => void
}

const SETTINGS_KEY = 'themeSettings'

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = store.get(SETTINGS_KEY)
    return storedTheme === 'dark'
  })

  const [theme, setTheme] = useState<ThemeContextType['theme']>(() => {
    const storedTheme = store.get(SETTINGS_KEY)
    return storedTheme || 'light'
  })

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      setTheme('dark')
      store.set(SETTINGS_KEY, 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      setTheme('light')
      store.set(SETTINGS_KEY, 'light')
    }
  }, [isDarkMode])

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
