import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { useAIHelpAnswer } from '@/hooks/use-ai-help-answer'
import { Loader2 } from 'lucide-react'
import { MarkdownContent } from '../markdown'

const AIHelpDialog = ({
  showAIHelpDialog,
  setShowAIHelpDialog,
  topicId = '3', // TODO: Replace with real topic id prop
  threadId = '1234', // TODO: Replace with real thread id prop
}: {
  showAIHelpDialog: boolean
  setShowAIHelpDialog: (show: boolean) => void
  topicId?: string
  threadId?: string
}) => {
  const [aiHelpPrompt, setAiHelpPrompt] = useState('')
  const { isGenerating, progress, answer, error, generateAnswer, reset } = useAIHelpAnswer()

  const handleAIHelpSubmit = () => {
    if (aiHelpPrompt.trim()) {
      generateAnswer({
        topic_id: topicId,
        thread_id: threadId,
        question: aiHelpPrompt,
      })
    }
  }

  const handleDialogClose = (open: boolean) => {
    setShowAIHelpDialog(open)
    if (!open) {
      reset()
      setAiHelpPrompt('')
    }
  }

  return (
    <Dialog open={showAIHelpDialog} onOpenChange={handleDialogClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <svg className="text-secondary mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            AI Teaching Assistant
          </DialogTitle>
        </DialogHeader>
        <div className="p-0">
          <div className="mb-6">
            <label className="text-muted-foreground mb-3 block text-sm font-medium">
              Describe the student's doubt or question:
            </label>
            <div className="relative">
              <textarea
                value={aiHelpPrompt}
                onChange={e => setAiHelpPrompt(e.target.value)}
                placeholder="Type any student question or doubt here..."
                rows={5}
                className="border-border focus:border-secondary text-foreground w-full resize-none rounded-2xl border-2 p-4 transition-colors duration-200 focus:ring-0 focus:outline-none"
                disabled={isGenerating}
              />
            </div>
          </div>
          {/* Progress Display */}
          {isGenerating && progress && (
            <div className="bg-muted mb-4 flex items-center gap-2 rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">{progress}</span>
            </div>
          )}

          <Button
            onClick={handleAIHelpSubmit}
            variant="secondary"
            className="w-full rounded-3xl px-6 py-4 font-medium transition-all duration-300"
            disabled={!aiHelpPrompt.trim() || isGenerating}
          >
            <span className="flex items-center justify-center">
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              {isGenerating ? 'Generating...' : 'Submit'}
            </span>
          </Button>
          {answer && (
            <div className="bg-muted border-secondary mt-6 rounded-2xl border-l-4 p-4">
              <h4 className="text-foreground mb-3 flex items-center text-lg font-medium">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Assistant Response
              </h4>
              <div className="text-foreground scrollbar-thin scrollbar-thumb-secondary scrollbar-track-muted max-h-64 overflow-y-auto px-4 text-sm leading-relaxed whitespace-pre-line">
                <MarkdownContent id={crypto.randomUUID()} content={answer} />
              </div>
            </div>
          )}
          {error && <div className="text-destructive mt-4 text-sm">{error}</div>}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AIHelpDialog
