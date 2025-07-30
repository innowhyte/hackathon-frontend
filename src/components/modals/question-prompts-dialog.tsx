import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { useQuestionPromptsGeneration } from '../../hooks/use-question-prompts-generation'
import { Loader2, Send, Save, X } from 'lucide-react'
import type { Classroom } from '@/queries/classroom-queries'
import type { QuestionPromptsResponse } from '@/hooks/use-question-prompts-generation'
import { useQuestionPrompts } from '../../queries/question-prompts-queries'
import { useSaveQuestionPrompts } from '../../mutations/question-prompts-mutations'
import { toast } from 'sonner'
import { MarkdownContent } from '../markdown'

const QuestionPromptsDialog = ({
  topic_id,
  day_id,
  showQuestionPromptsDialog,
  setShowQuestionPromptsDialog,
  latestClassroom,
}: {
  topic_id: number | string
  day_id: string
  showQuestionPromptsDialog: boolean
  setShowQuestionPromptsDialog: (show: boolean) => void
  latestClassroom: Classroom
}) => {
  // Question prompts generation hook
  const { isGenerating, progress, generateQuestionPrompts, cancelGeneration, reset } = useQuestionPromptsGeneration()

  // Question prompts query and mutation
  const { data: fetchedQuestionPrompts, isLoading: isQuestionPromptsLoading } = useQuestionPrompts(
    typeof topic_id === 'number' ? topic_id : parseInt(topic_id, 10),
    day_id.toString(),
  )
  const saveQuestionPromptsMutation = useSaveQuestionPrompts()

  // State for question prompts generation
  const [threadId] = useState(() => crypto.randomUUID())
  const [generatedQuestionPrompts, setGeneratedQuestionPrompts] = useState<QuestionPromptsResponse | null>(null)
  const [currentMessage, setCurrentMessage] = useState('')
  const [carouselIndex, setCarouselIndex] = useState(0)

  // Reset question prompts when dialog opens
  useEffect(() => {
    if (showQuestionPromptsDialog) {
      setGeneratedQuestionPrompts(null)
      setCurrentMessage('')
      setCarouselIndex(0)
      reset()
    }
  }, [showQuestionPromptsDialog, reset])

  // Reset carousel index when question prompts change
  useEffect(() => {
    setCarouselIndex(0)
  }, [generatedQuestionPrompts, fetchedQuestionPrompts])

  const handleSendMessage = async () => {
    const message = currentMessage.trim()

    // Clear input
    setCurrentMessage('')

    // Prepare previous_question_prompts if available
    let previous_question_prompts: QuestionPromptsResponse | null | undefined = undefined
    if (generatedQuestionPrompts) {
      previous_question_prompts = generatedQuestionPrompts
    } else if (fetchedQuestionPrompts) {
      previous_question_prompts = fetchedQuestionPrompts
    }

    // Generate question prompts response
    await generateQuestionPrompts({
      latestClassroom,
      day_id: day_id.toString(),
      topic_id: topic_id.toString(),
      teacher_requirements: message,
      thread_id: threadId,
      previous_question_prompts: previous_question_prompts,
      onQuestionPromptsGenerated: questionPromptsObj => {
        setGeneratedQuestionPrompts(questionPromptsObj)
        setCarouselIndex(0)
      },
      onError: errorMessage => {
        console.error('Error:', errorMessage)
        toast.error('Failed to generate question prompts')
      },
    })
  }

  const handleSaveToDatabase = () => {
    if (!generatedQuestionPrompts) return
    saveQuestionPromptsMutation.mutate(
      {
        day_id: day_id.toString(),
        topic_id: topic_id.toString(),
        question_prompts: generatedQuestionPrompts.question_prompts,
      },
      {
        onSuccess: () => {
          toast.success('Question prompts saved!')
        },
        onError: () => {
          toast.error('Failed to save question prompts')
        },
      },
    )
  }

  const handlePrevious = () => {
    const questions = generatedQuestionPrompts?.question_prompts || fetchedQuestionPrompts?.question_prompts || []
    setCarouselIndex((carouselIndex - 1 + questions.length) % questions.length)
  }

  const handleNext = () => {
    const questions = generatedQuestionPrompts?.question_prompts || fetchedQuestionPrompts?.question_prompts || []
    setCarouselIndex((carouselIndex + 1) % questions.length)
  }

  const currentQuestionPrompts = generatedQuestionPrompts || fetchedQuestionPrompts

  return (
    <Dialog
      open={showQuestionPromptsDialog}
      onOpenChange={open => {
        setShowQuestionPromptsDialog(open)
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
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Generate Questions
            </div>
          </DialogTitle>
          <DialogDescription className="text-start">Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <div className="p-0">
          {/* Question Prompts Display */}
          <div className="mb-6">
            {isQuestionPromptsLoading ? (
              <div className="bg-muted rounded-xl p-4 text-center text-sm">Loading question prompts...</div>
            ) : currentQuestionPrompts && currentQuestionPrompts.question_prompts.length > 0 ? (
              <div className="bg-muted rounded-xl p-4">
                <h4 className="text-foreground mb-3 flex items-center text-lg font-medium">
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {generatedQuestionPrompts ? 'Generated Questions' : 'Saved Questions'}
                </h4>
                <div className="relative w-full">
                  <div className="mb-6 min-h-[180px] rounded-2xl bg-white/90 p-6 shadow-lg">
                                          <div className="space-y-4">
                        <div className="text-lg leading-relaxed font-semibold text-neutral-800">
                          <MarkdownContent id={`question-${threadId}-${carouselIndex}`} content={currentQuestionPrompts.question_prompts[carouselIndex]?.question || ''} />
                        </div>
                        <div className="space-y-3">
                          <div>
                            <h5 className="mb-2 text-sm font-semibold text-neutral-700">Purpose</h5>
                            <div className="text-sm leading-relaxed text-neutral-600">
                              <MarkdownContent id={`purpose-${threadId}-${carouselIndex}`} content={currentQuestionPrompts.question_prompts[carouselIndex]?.purpose || ''} />
                            </div>
                          </div>
                          <div>
                            <h5 className="mb-2 text-sm font-semibold text-neutral-700">Connection</h5>
                            <div className="text-sm leading-relaxed text-neutral-600">
                              <MarkdownContent id={`connection-${threadId}-${carouselIndex}`} content={currentQuestionPrompts.question_prompts[carouselIndex]?.connection || ''} />
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                  {/* Carousel Navigation */}
                  <div className="flex w-full items-center justify-between px-4">
                    <Button
                      onClick={handlePrevious}
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-neutral-200 p-2 hover:bg-neutral-300"
                      aria-label="Previous"
                    >
                      <svg className="h-5 w-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </Button>
                    <span className="text-sm text-neutral-500">
                      {carouselIndex + 1} / {currentQuestionPrompts.question_prompts.length}
                    </span>
                    <Button
                      onClick={handleNext}
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-neutral-200 p-2 hover:bg-neutral-300"
                      aria-label="Next"
                    >
                      <svg className="h-5 w-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-muted rounded-xl p-4">
                <div className="text-foreground text-sm leading-relaxed">
                  <p>The question prompts will be generated based on the topic and your requirements.</p>
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
                placeholder="e.g., Make the questions more specific to grade level, or focus on practical applications"
                rows={4}
                className="border-border focus:border-secondary text-foreground w-full resize-none rounded-2xl border-2 p-4 transition-colors duration-200 focus:ring-0 focus:outline-none"
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
                      Generate Prompts
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
                disabled={saveQuestionPromptsMutation.isPending || !generatedQuestionPrompts}
              >
                {saveQuestionPromptsMutation.isPending ? (
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

export default QuestionPromptsDialog
