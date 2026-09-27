import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import store from 'store2'

export type ThemeContextType = {
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

  const theme: ThemeContextType['theme'] = isDarkMode ? 'dark' : 'light'

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    store.set(SETTINGS_KEY, theme)
  }, [isDarkMode, theme])

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
