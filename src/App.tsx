import LeanCoffeeTimer from '@/components/LeanCoffeeTimer'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <LeanCoffeeTimer />
    </ThemeProvider>
  )
}

export default App
