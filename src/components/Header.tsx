import { useContext } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from './ui/button'
import { AppContext } from '../context/app-context'

interface HeaderProps {
  title: string
  onBack: () => void
  showAIHelp?: boolean
}

export default function Header({ title, onBack, showAIHelp = false }: HeaderProps) {
  const context = useContext(AppContext)

  if (!context) {
    return null
  }

  const { setShowAIHelpDialog } = context

  return (
    <div className="bg-secondary flex items-center justify-between p-4 shadow-sm backdrop-blur-sm">
      <Button onClick={onBack} variant="default" size="icon" className="rounded-lg p-2 transition-colors duration-200">
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <h1 className="text-xl font-medium text-black">{title}</h1>
      {showAIHelp ? (
        <Button
          onClick={() => setShowAIHelpDialog(true)}
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full shadow-md transition-all duration-300 hover:shadow-lg"
          aria-label="Get AI Teaching Help"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        </Button>
      ) : (
        <div className="w-10"></div>
      )}
    </div>
  )
}
