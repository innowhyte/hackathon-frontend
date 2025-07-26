import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { useStoryGeneration } from '../../hooks/use-story-generation'
import { Loader2, Send, Save, X } from 'lucide-react'
import type { Classroom } from '@/queries/classroom-queries'
import type { Story } from '@/queries/story-queries'
import { useStoryByDayAndTopic } from '../../queries/story-queries'
import { useSaveStory } from '../../mutations/story-mutations'
import { toast } from 'sonner'
import { MarkdownContent } from '../markdown'

const StoryDialog = ({
  topic_id,
  day_id,
  showStoryDialog,
  setShowStoryDialog,
  latestClassroom,
}: {
  topic_id: number | string
  day_id: string
  showStoryDialog: boolean
  setShowStoryDialog: (show: boolean) => void
  latestClassroom: Classroom
}) => {
  // Story generation hook
  const { isGenerating, progress, generateStory, cancelGeneration, reset } = useStoryGeneration()

  // Story query and mutation
  const { data: fetchedStory, isLoading: isStoryLoading } = useStoryByDayAndTopic(
    typeof topic_id === 'number' ? topic_id : parseInt(topic_id, 10),
    day_id.toString(),
  )
  const saveStoryMutation = useSaveStory()

  // State for story generation
  const [threadId] = useState(() => crypto.randomUUID())
  const [generatedStory, setGeneratedStory] = useState<Story | null>(null)
  const [currentMessage, setCurrentMessage] = useState('')

  // Reset story when dialog opens
  useEffect(() => {
    if (showStoryDialog) {
      setGeneratedStory(null)
      setCurrentMessage('')
      reset()
    }
  }, [showStoryDialog, reset])

  const handleSendMessage = async () => {
    const message = currentMessage.trim()

    // Clear input
    setCurrentMessage('')

    // Prepare previous_story if available
    // Ensure previous_story matches the expected type (with idea as string)
    let previous_story: Story | null | undefined = undefined
    if (generatedStory) {
      previous_story = generatedStory
    } else if (fetchedStory) {
      previous_story = fetchedStory
    }

    // Generate story response
    await generateStory({
      latestClassroom,
      day_id: day_id.toString(),
      topic_id: topic_id.toString(),
      teacher_requirements: message,
      thread_id: threadId,
      previous_story: previous_story as any, // typecast to satisfy type, since we ensure idea is string above
      onStoryGenerated: storyObj => {
        setGeneratedStory(storyObj)
      },
      onError: errorMessage => {
        console.error('Error:', errorMessage)
        toast.error('Failed to generate story')
      },
    })
  }

  const handleSaveToDatabase = () => {
    if (!generatedStory) return
    saveStoryMutation.mutate(
      {
        day_id: day_id.toString(),
        topic_id: topic_id.toString(),
        story: generatedStory.story,
        idea: generatedStory.idea,
      },
      {
        onSuccess: () => {
          toast.success('Story saved!')
        },
        onError: () => {
          toast.error('Failed to save story')
        },
      },
    )
  }

  return (
    <Dialog
      open={showStoryDialog}
      onOpenChange={open => {
        setShowStoryDialog(open)
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Generate Story
            </div>
          </DialogTitle>
          <DialogDescription className="text-start">Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <div className="p-0">
          {/* Story Display */}
          <div className="mb-6">
            {isStoryLoading ? (
              <div className="bg-muted rounded-xl p-4 text-center text-sm">Loading story...</div>
            ) : generatedStory ? (
              <div className="bg-muted rounded-xl p-4">
                <h4 className="text-foreground mb-3 flex items-center text-lg font-medium">
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Generated Story
                </h4>
                <div className="text-foreground scrollbar-thin scrollbar-thumb-secondary scrollbar-track-muted max-h-64 overflow-y-auto pr-2 text-sm leading-relaxed">
                  <div className="mb-2">
                    <span className="font-semibold">Idea:</span>
                    <span className="ml-2">{generatedStory?.idea}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Story:</span>
                    <div className="mt-1">
                      <MarkdownContent id={`generated-story-${threadId}`} content={generatedStory?.story || ''} />
                    </div>
                  </div>
                </div>
              </div>
            ) : fetchedStory && fetchedStory.story ? (
              <div className="bg-muted rounded-xl p-4">
                <h4 className="text-foreground mb-3 flex items-center text-lg font-medium">
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Saved Story
                </h4>
                <div className="text-foreground scrollbar-thin scrollbar-thumb-secondary scrollbar-track-muted max-h-64 overflow-y-auto pr-2 text-sm leading-relaxed">
                  <div className="mb-2">
                    <span className="font-semibold">Idea:</span>
                    <span className="ml-2">{fetchedStory.idea}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Story:</span>
                    <div className="mt-1">
                      <MarkdownContent id={`fetched-story-${day_id}-${topic_id}`} content={fetchedStory.story} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-muted rounded-xl p-4">
                <div className="text-foreground scrollbar-thin scrollbar-thumb-secondary scrollbar-track-muted max-h-64 overflow-y-auto pr-2 text-sm leading-relaxed">
                  <p>The story will be generated based on the topic and the relevant context.</p>
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
                placeholder="Type your story request or customization here..."
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
                      Generate Story
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
                disabled={saveStoryMutation.isPending || !generatedStory}
              >
                {saveStoryMutation.isPending ? (
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
  )
}

export default StoryDialog
