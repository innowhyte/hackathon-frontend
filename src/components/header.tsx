import { ArrowLeft } from 'lucide-react'
import { Button } from './ui/button'

interface HeaderProps {
  title: string
  onBack: () => void
}

export default function Header({ title, onBack }: HeaderProps) {
  return (
    <div className="bg-secondary flex items-center justify-between px-4 py-2 shadow-sm backdrop-blur-sm">
      <Button onClick={onBack} variant="default" size="icon" className="rounded-lg p-2 transition-colors duration-200">
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <h1 className="text-xl font-medium text-black">{title}</h1>
      <div className="w-10"></div>
    </div>
  )
}
