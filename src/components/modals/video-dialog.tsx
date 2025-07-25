import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useVideoGeneration } from '@/hooks/use-video-generation'
import { Loader2, Send, Save, X } from 'lucide-react'
import type { Classroom } from '@/queries/classroom-queries'
import type { VideoGeneration } from '@/hooks/use-video-generation'
import { useVideo } from '@/queries/video-queries'
import { useSaveVideo } from '@/mutations/video-mutations'
import { toast } from 'sonner'

const VideoDialog = ({
  topic_id,
  day_id,
  showVideoDialog,
  setShowVideoDialog,
  latestClassroom,
}: {
  topic_id: number | string
  day_id: string
  showVideoDialog: boolean
  setShowVideoDialog: (show: boolean) => void
  latestClassroom: Classroom
}) => {
  // Blackboard generation hook
  const { isGenerating, progress, generateVideo, cancelGeneration, reset } = useVideoGeneration()

  // Blackboard query and mutation
  const { data: fetchedVideo, isLoading: isVideoLoading } = useVideo(
    typeof topic_id === 'number' ? topic_id : parseInt(topic_id, 10),
    day_id.toString(),
  )
  const saveVideoMutation = useSaveVideo()

  // State for blackboard generation
  const [threadId] = useState(() => crypto.randomUUID())
  const [generatedVideo, setGeneratedVideo] = useState<VideoGeneration | null>(null)
  const [currentMessage, setCurrentMessage] = useState('')

  // Reset video when dialog opens
  useEffect(() => {
    if (showVideoDialog) {
      setGeneratedVideo(null)
      setCurrentMessage('')
      reset()
    }
  }, [showVideoDialog, reset])

  const handleSendMessage = async () => {
    const message = currentMessage.trim()

    // Clear input
    setCurrentMessage('')

    // Generate video response
    await generateVideo({
      latestClassroom,
      day_id: day_id.toString(),
      topic_id: topic_id.toString(),
      teacher_requirements: message,
      thread_id: threadId,
      onVideoGenerated: videoObj => {
        setGeneratedVideo(videoObj)
      },
      onError: errorMessage => {
        console.error('Error:', errorMessage)
        toast.error('Failed to generate video')
      },
    })
  }

  const handleSaveToDatabase = () => {
    if (!generatedVideo) return
    saveVideoMutation.mutate(
      {
        day_id: day_id.toString(),
        topic_id: topic_id.toString(),
        video_url: generatedVideo.video_url,
      },
      {
        onSuccess: () => {
          toast.success('Video saved!')
        },
        onError: () => {
          toast.error('Failed to save video')
        },
      },
    )
  }

  return (
    <>
      <Dialog
        open={showVideoDialog}
        onOpenChange={open => {
          setShowVideoDialog(open)
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
                Generate Video
              </div>
            </DialogTitle>
            <DialogDescription className="text-start">Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>
          <div className="p-0">
            {/* Video Display */}
            <div className="mb-6">
              {isVideoLoading ? (
                <div className="bg-muted rounded-xl p-4 text-center text-sm">Loading video...</div>
              ) : generatedVideo ? (
                <div className="bg-muted rounded-xl p-4">
                  <h4 className="text-foreground mb-3 flex items-center text-lg font-medium">
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Generated Video
                  </h4>
                  <div className="text-center">
                    <video
                      src={generatedVideo.video_url}
                      controls
                      className="mx-auto max-h-64 max-w-full cursor-pointer rounded-lg border border-neutral-200 bg-neutral-100 object-contain transition-opacity hover:opacity-80"
                    />
                  </div>
                </div>
              ) : fetchedVideo && fetchedVideo.video_url ? (
                <div className="bg-muted rounded-xl p-4">
                  <h4 className="text-foreground mb-3 flex items-center text-lg font-medium">
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Saved Video
                  </h4>
                  <div className="text-center">
                    <video
                      src={fetchedVideo.video_url}
                      controls
                      className="mx-auto max-h-64 max-w-full cursor-pointer rounded-lg border border-neutral-200 bg-neutral-100 object-contain transition-opacity hover:opacity-80"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-muted rounded-xl p-4">
                  <div className="text-foreground text-sm leading-relaxed">
                    <p>The video will be generated based on the topic and your requirements.</p>
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
              {/* <div className="relative">
                <textarea
                  value={currentMessage}
                  onChange={e => {
                    setCurrentMessage(e.target.value)
                  }}
                  placeholder="Describe what you want to video..."
                  rows={3}
                  className="border-border focus:border-secondary text-foreground w-full resize-none rounded-2xl border-2 p-4 pr-4 transition-colors duration-200 focus:ring-0 focus:outline-none"
                  disabled={isGenerating}
                />
              </div> */}

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
                        Generate Video
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
                  disabled={saveVideoMutation.isPending || !generatedVideo}
                >
                  {saveVideoMutation.isPending ? (
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
    </>
  )
}

export default VideoDialog
