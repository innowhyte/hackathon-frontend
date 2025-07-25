import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { ClockIcon, Trash2Icon } from 'lucide-react'

interface Feedback {
  id: string
  text: string
  date: string
}

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedStudent: { id: number; name: string } | null
  studentFeedback: Feedback[]
  onSaveFeedback: (studentId: number, feedback: Feedback) => void
  onDeleteFeedback: (studentId: number, feedbackId: string) => void
}

const FeedbackDialog = ({
  open,
  onOpenChange,
  selectedStudent,
  studentFeedback,
  onSaveFeedback,
  onDeleteFeedback,
}: FeedbackDialogProps) => {
  const [feedbackText, setFeedbackText] = useState('')

  const handleSaveFeedback = () => {
    if (selectedStudent && feedbackText.trim()) {
      const newFeedback: Feedback = {
        id: crypto.randomUUID(),
        text: feedbackText.trim(),
        date: new Date().toISOString(),
      }
      onSaveFeedback(selectedStudent.id, newFeedback)
      setFeedbackText('')
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setFeedbackText('')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        if (!open) {
          handleClose()
        }
      }}
    >
      <DialogContent className="bg-background">
        <DialogHeader className="border-border border-b px-6 py-4">
          <DialogTitle className="text-foreground text-lg font-semibold">
            Feedback for {selectedStudent?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-0">
          {/* Previous Feedback Section */}
          {studentFeedback.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center">
                <ClockIcon className="text-muted-foreground mr-2 h-4 w-4" />
                <h3 className="text-foreground text-sm font-medium">Previous Feedback ({studentFeedback.length})</h3>
              </div>
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {studentFeedback.map((feedback: Feedback) => (
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
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 ml-2"
                      onClick={() => selectedStudent && onDeleteFeedback(selectedStudent.id, feedback.id)}
                      aria-label="Delete feedback"
                    >
                      <Trash2Icon className="h-4 w-4" />
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
