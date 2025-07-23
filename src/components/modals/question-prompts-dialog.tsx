import { useContext } from 'react'
import { AppContext } from '../../context/app-context'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'

const QuestionPromptsDialog = ({
  showQuestionPromptsDialog,
  setShowQuestionPromptsDialog,
}: {
  showQuestionPromptsDialog: boolean
  setShowQuestionPromptsDialog: (open: boolean) => void
}) => {
  const context = useContext(AppContext)

  if (!context) {
    return null
  }

  const { questionPromptsPrompt, setQuestionPromptsPrompt, topic } = context

  const handleQuestionPromptsSubmit = () => {
    if (questionPromptsPrompt.trim()) {
      // Handle question prompts generation logic here
      console.log('Generating question prompts with prompt:', questionPromptsPrompt)
    }
  }

  return (
    <Dialog
      open={showQuestionPromptsDialog}
      onOpenChange={open => {
        setShowQuestionPromptsDialog(open)
        if (!open) {
          setQuestionPromptsPrompt('')
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-start">
            <div className="flex items-center justify-start">
              <svg className="text-secondary mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Generate Questions
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="p-0">
          <div className="mb-6">
            <div className="bg-muted mb-4 rounded-xl p-4">
              <h4 className="text-foreground mb-3 flex items-center text-lg font-medium">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Sample Questions:
              </h4>
              <div className="text-foreground space-y-2 text-sm">
                <li>What do you already know about {topic}?</li>
                <li>How do you think {topic} affects our daily lives?</li>
                <li>What questions do you have about {topic}?</li>
                <li>Can you think of examples of {topic} in your community?</li>
                <li>What would happen if we didn't have {topic}?</li>
              </div>
            </div>
            <label className="text-muted-foreground mb-3 block text-sm font-medium">
              Customize the question prompts:
            </label>
            <div className="relative">
              <textarea
                value={questionPromptsPrompt}
                onChange={e => setQuestionPromptsPrompt(e.target.value)}
                placeholder="e.g., Make the questions more specific to grade level, or focus on practical applications"
                rows={4}
                className="border-border focus:border-secondary text-foreground w-full resize-none rounded-2xl border-2 p-4 transition-colors duration-200 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
          <Button
            onClick={handleQuestionPromptsSubmit}
            variant="secondary"
            className="w-full rounded-3xl px-6 py-4 font-medium transition-all duration-300"
            disabled={!questionPromptsPrompt.trim()}
          >
            <span className="flex items-center justify-center">
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Generate Prompts
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default QuestionPromptsDialog
