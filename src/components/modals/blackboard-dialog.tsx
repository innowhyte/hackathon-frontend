import { useContext, useState } from 'react'
import { AppContext } from '../../context/app-context'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

const BlackboardDialog = () => {
  const context = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string>('black_board_drawing.jpg')

  if (!context) {
    return null
  }

  const { showBlackboardDialog, setShowBlackboardDialog, blackboardPrompt, setBlackboardPrompt } = context

  const handleBlackboardSubmit = () => {
    if (blackboardPrompt.trim()) {
      // Handle blackboard generation logic here
      console.log('Generating blackboard drawing with prompt:', blackboardPrompt)
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        setGeneratedImage('black_board_drawing.jpg')
      }, 2000)
    }
  }

  return (
    <Dialog
      open={showBlackboardDialog}
      onOpenChange={open => {
        setShowBlackboardDialog(open)
        if (!open) {
          setBlackboardPrompt('')
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <svg className="text-secondary mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Blackboard Drawing Generator
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <div className="mb-6 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                <img
                  src={`/${generatedImage}`}
                  alt="Blackboard Drawing"
                  className="mx-auto w-full max-w-xs rounded-lg border border-neutral-200 bg-neutral-100 object-contain"
                />
              </>
            )}
            <label className="text-muted-foreground mb-3 block text-sm font-medium">
              Describe what you want to draw on the blackboard:
            </label>
            <div className="relative">
              <textarea
                value={blackboardPrompt}
                onChange={e => setBlackboardPrompt(e.target.value)}
                placeholder="e.g., Draw a simple diagram showing the water cycle with evaporation, condensation, and precipitation"
                rows={4}
                className="border-border focus:border-secondary text-foreground w-full resize-none rounded-2xl border-2 p-4 transition-colors duration-200 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
          <Button
            onClick={handleBlackboardSubmit}
            variant="secondary"
            className="w-full rounded-3xl px-6 py-4 font-medium transition-all duration-300"
            disabled={!blackboardPrompt.trim()}
          >
            <span className="flex items-center justify-center">
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Generate Drawing
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BlackboardDialog
