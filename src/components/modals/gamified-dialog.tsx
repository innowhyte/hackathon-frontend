import { useContext } from 'react'
import { AppContext } from '../../context/app-context'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'

const GamifiedDialog = () => {
  const context = useContext(AppContext)

  if (!context) {
    return null
  }

  const { showGamifiedDialog, setShowGamifiedDialog, gamifiedPrompt, setGamifiedPrompt, topic } = context

  const handleGamifiedSubmit = () => {
    if (gamifiedPrompt.trim()) {
      // Handle gamified activity generation logic here
      console.log('Generating gamified activity with prompt:', gamifiedPrompt)
    }
  }

  return (
    <Dialog
      open={showGamifiedDialog}
      onOpenChange={open => {
        setShowGamifiedDialog(open)
        if (!open) {
          setGamifiedPrompt('')
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
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Gamified Activities Generator
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-0">
          <div className="mb-6">
            <div className="bg-muted mb-4 rounded-xl p-4">
              <h4 className="text-foreground mb-3 flex items-center text-lg font-medium">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                How to conduct the game in class:
              </h4>
              <div className="text-foreground space-y-3 text-sm">
                <p>
                  <strong>1. Setup:</strong> Divide the class into teams of 4-5 students. Each team gets a set of{' '}
                  {topic}
                  -related cards or materials.
                </p>
                <p>
                  <strong>2. Game Rules:</strong> Teams compete to answer questions or complete tasks related to {topic}
                  . Points are awarded for correct answers and creative solutions.
                </p>
                <p>
                  <strong>3. Rounds:</strong> Play 3-4 rounds with increasing difficulty. Each round focuses on
                  different aspects of {topic}.
                </p>
                <p>
                  <strong>4. Scoring:</strong> Keep track of points on the board. Bonus points for teamwork and helping
                  others.
                </p>
                <p>
                  <strong>5. Conclusion:</strong> Announce the winning team and review key learning points from the
                  game.
                </p>
              </div>
            </div>
            <label className="text-muted-foreground mb-3 block text-sm font-medium">
              Customize the game instructions:
            </label>
            <div className="relative">
              <textarea
                value={gamifiedPrompt}
                onChange={e => setGamifiedPrompt(e.target.value)}
                placeholder="e.g., Make it more interactive with physical movements, or focus on specific learning objectives"
                rows={4}
                className="border-border focus:border-secondary text-foreground w-full resize-none rounded-2xl border-2 p-4 transition-colors duration-200 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
          <Button
            onClick={handleGamifiedSubmit}
            variant="secondary"
            className="w-full rounded-3xl px-6 py-4 font-medium transition-all duration-300"
            disabled={!gamifiedPrompt.trim()}
          >
            <span className="flex items-center justify-center">
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Generate Game
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GamifiedDialog
