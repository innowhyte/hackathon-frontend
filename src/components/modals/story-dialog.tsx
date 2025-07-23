import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { useStoryGeneration } from '../../hooks/use-story-generation'
import { Loader2, Send, Save, X } from 'lucide-react'
import { Alert, AlertDescription } from '../ui/alert'
import type { Classroom } from '@/queries/classroom-queries'
import { useStoryByTopicId } from '../../queries/story-queries'
import { useSaveStory } from '../../mutations/story-mutations'

const StoryDialog = ({
  topic,
  topic_id,
  showStoryDialog,
  setShowStoryDialog,
  latestClassroom,
  concept_to_introduce,
}: {
  topic: string
  topic_id: string
  showStoryDialog: boolean
  setShowStoryDialog: (show: boolean) => void
  latestClassroom: Classroom
  concept_to_introduce: string
}) => {
  // Story generation hook
  const { isGenerating, progress, error, generateStory, cancelGeneration, reset } = useStoryGeneration()

  // Story query and mutation
  const { data: fetchedStory, isLoading: isStoryLoading } = useStoryByTopicId(topic_id)
  const saveStoryMutation = useSaveStory()

  // State for story generation
  const [threadId] = useState(() => crypto.randomUUID())
  const [generatedStory, setGeneratedStory] = useState('')
  const [currentMessage, setCurrentMessage] = useState('')

  // Reset story when dialog opens
  useEffect(() => {
    if (showStoryDialog) {
      setGeneratedStory('')
      setCurrentMessage('')
      reset()
    }
  }, [showStoryDialog, reset])

  const handleSendMessage = async () => {
    const message = currentMessage.trim()
    if (!message) return

    // Clear input
    setCurrentMessage('')

    // Generate story response
    await generateStory({
      latestClassroom,
      topic_id: '1',
      topic,
      context: message,
      concept_to_introduce: concept_to_introduce,
      thread_id: threadId,
      onProgress: progressMessage => {
        console.log('Progress:', progressMessage)
      },
      onStoryGenerated: storyContent => {
        setGeneratedStory(storyContent)
      },
      onError: errorMessage => {
        console.error('Error:', errorMessage)
      },
    })
  }

  const handleSaveToDatabase = () => {
    if (!generatedStory) return
    saveStoryMutation.mutate({ topic_id, story: generatedStory })
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
          <DialogDescription>Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <div className="p-0">
          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {/* Progress Display */}
          {isGenerating && progress && (
            <div className="bg-muted mb-4 flex items-center gap-2 rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">{progress}</span>
            </div>
          )}

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
                  <p className="whitespace-pre-wrap">{generatedStory}</p>
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
                  <p className="whitespace-pre-wrap">{fetchedStory.story}</p>
                </div>
              </div>
            ) : (
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
                  Sample Story
                </h4>
                <div className="text-foreground scrollbar-thin scrollbar-thumb-secondary scrollbar-track-muted max-h-64 overflow-y-auto pr-2 text-sm leading-relaxed">
                  <p>
                    Our story begins in the bustling city of Bengaluru, right in the heart of Cubbon Park. Imagine a
                    tiny, adventurous water droplet named Droplet. Droplet loved his life in a small puddle near a
                    vibrant flowerbed. One morning, as the Bengaluru sun began to climb high in the sky, Droplet felt
                    something peculiar. The air around him was getting warmer and warmer.
                  </p>
                  <p className="mt-2">
                    "Woah, it's getting toasty!" Droplet exclaimed. He noticed his friends, other little water droplets
                    in the puddle, were also feeling the heat. As the sun's rays intensified, Droplet felt himself
                    getting lighter and lighter. He was no longer a liquid! He was transforming into something
                    invisible, something airy. It was like he was floating upwards, becoming a tiny puff of mist.
                  </p>
                  <p className="mt-2">
                    "This is amazing!" Droplet thought. He was no longer bound to the ground. He was rising, higher and
                    higher, leaving the park behind. This incredible journey, where the sun's warm hug turned him from
                    liquid water into an invisible gas called water vapor, was just the beginning of his grand
                    adventure. He was *evaporating*!
                  </p>
                </div>
              </div>
            )}
          </div>

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
                className="border-border focus:border-secondary text-foreground w-full resize-none rounded-2xl border-2 p-4 pr-12 transition-colors duration-200 focus:ring-0 focus:outline-none"
                disabled={isGenerating}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1">
              <Button
                onClick={handleSendMessage}
                variant="secondary"
                className="flex-1 rounded-3xl px-6 py-4 font-medium transition-all duration-300"
                disabled={isGenerating || !currentMessage.trim()}
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
                      Send Message
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
