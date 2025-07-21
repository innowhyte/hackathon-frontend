import { useContext, useState } from 'react'
import { AppContext } from '../../context/app-context'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { ClockIcon, Trash2Icon } from 'lucide-react'

interface Feedback {
  id: number
  text: string
  date: string
}

const FeedbackDialog = () => {
  const context = useContext(AppContext)
  const [feedbackText, setFeedbackText] = useState('')

  if (!context) {
    return null
  }

  const { showFeedbackModal, setShowFeedbackModal, selectedStudentForFeedback, studentFeedback, setStudentFeedback } =
    context

  const handleSaveFeedback = () => {
    if (selectedStudentForFeedback && feedbackText.trim()) {
      const newFeedback: Feedback = {
        id: Date.now(),
        text: feedbackText.trim(),
        date: new Date().toISOString(),
      }

      setStudentFeedback((prev: any) => ({
        ...prev,
        [selectedStudentForFeedback.id]: [newFeedback, ...(prev[selectedStudentForFeedback.id] || [])],
      }))
      setFeedbackText('')
    }
  }

  const handleDeleteFeedback = (feedbackId: number) => {
    if (selectedStudentForFeedback) {
      setStudentFeedback((prev: any) => ({
        ...prev,
        [selectedStudentForFeedback.id]: prev[selectedStudentForFeedback.id].filter(
          (feedback: Feedback) => feedback.id !== feedbackId,
        ),
      }))
    }
  }

  const handleClose = () => {
    setShowFeedbackModal(false)
    setFeedbackText('')
  }

  const currentStudentFeedback = selectedStudentForFeedback ? studentFeedback[selectedStudentForFeedback.id] || [] : []

  return (
    <Dialog
      open={showFeedbackModal}
      onOpenChange={open => {
        if (!open) {
          handleClose()
        }
      }}
    >
      <DialogContent className="bg-background">
        <DialogHeader className="border-border border-b px-6 py-4">
            <DialogTitle className="text-foreground text-lg font-semibold">
              Add Feedback for {selectedStudentForFeedback?.name}
            </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {/* Previous Feedback Section */}
          {currentStudentFeedback.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center">
                <ClockIcon className="text-muted-foreground mr-2 h-4 w-4" />
                <h3 className="text-foreground text-sm font-medium">
                  Previous Feedback ({currentStudentFeedback.length})
                </h3>
              </div>
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {currentStudentFeedback.map((feedback: Feedback) => (
                  <div
                    key={feedback.id}
                    className="bg-muted/50 border-border flex items-start justify-between rounded-lg border p-3"
                  >
                    <div className="flex-1 pr-3">
                      <p className="text-foreground mb-1 text-sm">{feedback.text}</p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(feedback.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFeedback(feedback.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-6 w-6 p-0"
                    >
                      <Trash2Icon className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Feedback Section */}
          <div className="space-y-3">
            <label className="text-foreground text-sm font-medium">Add New Feedback</label>
            <Textarea
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              placeholder="Enter your feedback about this student's performance, behavior, or any observations..."
              className="border-border focus:border-primary min-h-[120px] resize-none rounded-lg border-2 transition-colors focus:ring-0 focus:outline-none"
            />
            <p className="text-muted-foreground text-xs">This feedback will be saved with today's date and time.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-border hover:bg-muted h-11 flex-1 rounded-lg border-2 font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveFeedback}
              disabled={!feedbackText.trim()}
              className="bg-primary hover:bg-primary/90 h-11 flex-1 rounded-lg font-medium disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save Feedback
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FeedbackDialog
