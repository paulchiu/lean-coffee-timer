import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cva } from 'class-variance-authority'

type HelpModalProps = {
  isOpen: boolean
  onClose: () => void
}

const modalVariants = cva(
  'relative w-full max-w-lg p-4 sm:p-6 mx-auto rounded-lg shadow-lg overflow-y-auto max-h-[90vh]',
  {
    variants: {
      theme: {
        light: 'bg-white text-gray-900',
        dark: 'bg-gray-800 text-white',
      },
    },
    defaultVariants: {
      theme: 'light',
    },
  }
)

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const { theme } = useTheme()

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className={modalVariants({ theme })}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          <X size={20} />
        </Button>

        <h2 className="mb-4 text-lg sm:text-xl font-bold pr-6">
          Why Use a Lean Coffee Timer?
        </h2>

        <div className="space-y-3 text-sm sm:text-base">
          <p>
            Lean Coffee is a structured but agenda-less meeting format that
            helps teams:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Keep discussions focused and time-boxed</li>
            <li>Ensure equal participation from all attendees</li>
            <li>Democratically decide which topics deserve more time</li>
            <li>Prevent meetings from running over their allocated time</li>
            <li>Make meetings more productive and engaging</li>
          </ul>
          <p className="mt-4">
            This timer helps facilitate Lean Coffee sessions by providing clear
            time boundaries and the ability to extend discussions when the group
            finds value in continuing.
          </p>
          <p className="mt-4">
            For more information, visit{' '}
            <a
              href="https://leancoffee.org/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              leancoffee.org
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
