import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { useBlackboardGeneration } from '../../hooks/use-blackboard-generation'
import { Loader2, Send, Save, X } from 'lucide-react'
import type { Classroom } from '@/queries/classroom-queries'
import type { BlackboardDrawing } from '@/hooks/use-blackboard-generation'
import { useBlackboardDrawing } from '../../queries/blackboard-queries'
import { useSaveBlackboardDrawing } from '../../mutations/blackboard-mutations'
import { toast } from 'sonner'

const BlackboardDialog = ({
  topic_id,
  day_id,
  showBlackboardDialog,
  setShowBlackboardDialog,
  latestClassroom,
}: {
  topic_id: number | string
  day_id: string
  showBlackboardDialog: boolean
  setShowBlackboardDialog: (show: boolean) => void
  latestClassroom: Classroom
}) => {
  // Blackboard generation hook
  const { isGenerating, progress, generateDrawing, cancelGeneration, reset } = useBlackboardGeneration()

  // Blackboard query and mutation
  const { data: fetchedDrawing, isLoading: isDrawingLoading } = useBlackboardDrawing(
    typeof topic_id === 'number' ? topic_id : parseInt(topic_id, 10),
    day_id.toString(),
  )
  const saveDrawingMutation = useSaveBlackboardDrawing()

  // State for blackboard generation
  const [threadId] = useState(() => crypto.randomUUID())
  const [generatedDrawing, setGeneratedDrawing] = useState<BlackboardDrawing | null>(null)
  const [currentMessage, setCurrentMessage] = useState('')
  const [showImagePreview, setShowImagePreview] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState('')

  // Reset drawing when dialog opens
  useEffect(() => {
    if (showBlackboardDialog) {
      setGeneratedDrawing(null)
      setCurrentMessage('')
      reset()
    }
  }, [showBlackboardDialog, reset])

  const handleSendMessage = async () => {
    const message = currentMessage.trim()

    // Clear input
    setCurrentMessage('')

    // Generate drawing response
    await generateDrawing({
      latestClassroom,
      day_id: day_id.toString(),
      topic_id: topic_id.toString(),
      teacher_requirements: message,
      thread_id: threadId,
      onDrawingGenerated: drawingObj => {
        setGeneratedDrawing(drawingObj)
      },
      onError: errorMessage => {
        console.error('Error:', errorMessage)
        toast.error('Failed to generate blackboard drawing')
      },
    })
  }

  const handleSaveToDatabase = () => {
    if (!generatedDrawing) return
    saveDrawingMutation.mutate(
      {
        day_id: day_id.toString(),
        topic_id: topic_id.toString(),
        image_url: generatedDrawing.image_url,
      },
      {
        onSuccess: () => {
          toast.success('Blackboard drawing saved!')
        },
        onError: () => {
          toast.error('Failed to save blackboard drawing')
        },
      },
    )
  }

  const handleImageClick = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl)
    setShowImagePreview(true)
  }

  return (
    <>
      <Dialog
        open={showBlackboardDialog}
        onOpenChange={open => {
          setShowBlackboardDialog(open)
        }}
      >
        <DialogContent
          className="max-h-[90vh] overflow-y-auto"
          onInteractOutside={e => {
            e.preventDefault()
          }}
          onEscapeKeyDown={e => {
            e.preventDefault()
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-start">
              <div className="flex items-center justify-start">
                <svg className="text-secondary mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Generate Blackboard Drawing
              </div>
            </DialogTitle>
            <DialogDescription className="text-start">Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>
          <div className="p-0">
            {/* Drawing Display */}
            <div className="mb-6">
              {isDrawingLoading ? (
                <div className="bg-muted rounded-xl p-4 text-center text-sm">Loading drawing...</div>
              ) : generatedDrawing ? (
                <div className="text-center">
                  <img
                    src={generatedDrawing.image_url}
                    alt="Generated Blackboard Drawing"
                    className="mx-auto max-h-64 max-w-full cursor-pointer rounded-lg border border-neutral-200 bg-neutral-100 object-contain transition-opacity hover:opacity-80"
                    onClick={() => handleImageClick(generatedDrawing.image_url)}
                  />
                </div>
              ) : fetchedDrawing && fetchedDrawing.image_url ? (
                <div className="text-center">
                  <img
                    src={fetchedDrawing.image_url}
                    alt="Saved Blackboard Drawing"
                    className="mx-auto max-h-64 max-w-full cursor-pointer rounded-lg border border-neutral-200 bg-neutral-100 object-contain transition-opacity hover:opacity-80"
                    onClick={() => handleImageClick(fetchedDrawing.image_url)}
                  />
                </div>
              ) : (
                <div className="bg-muted rounded-xl p-4">
                  <div className="text-foreground text-sm leading-relaxed">
                    <p>The blackboard drawing will be generated based on the topic and your requirements.</p>
                  </div>
                </div>
              )}
            </div>
            {/* Progress Display */}
            {isGenerating && progress && (
              <div className="bg-muted mb-4 flex items-center gap-2 rounded-lg p-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">{progress}</span>
              </div>
            )}

            {/* Input Area */}
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={currentMessage}
                  onChange={e => {
                    setCurrentMessage(e.target.value)
                  }}
                  placeholder="Add any additional details/requirements to the drawing..."
                  rows={3}
                  className="border-border focus:border-secondary text-foreground w-full resize-none rounded-2xl border-2 p-4 pr-4 transition-colors duration-200 focus:ring-0 focus:outline-none"
                  disabled={isGenerating}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1">
                <Button
                  onClick={handleSendMessage}
                  variant="secondary"
                  className="flex-1 rounded-3xl px-6 py-4 font-medium transition-all duration-300"
                  disabled={isGenerating}
                >
                  <span className="flex items-center justify-center">
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Generate Drawing
                      </>
                    )}
                  </span>
                </Button>

                {isGenerating && (
                  <Button variant="outline" onClick={cancelGeneration} className="rounded-3xl px-4 py-4">
                    <X className="h-5 w-5" />
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={handleSaveToDatabase}
                  className="rounded-3xl px-6 py-4"
                  disabled={saveDrawingMutation.isPending || !generatedDrawing}
                >
                  {saveDrawingMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="max-h-[90vh] max-w-4xl p-2">
          <div className="flex items-center justify-center">
            <img
              src={previewImageUrl}
              alt="Blackboard Drawing Preview"
              className="max-h-[80vh] max-w-full rounded-lg object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default BlackboardDialog
