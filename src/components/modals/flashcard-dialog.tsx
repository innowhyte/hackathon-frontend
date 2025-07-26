import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { useFlashcardGeneration } from '../../hooks/use-flashcard-generation'
import { Loader2, Send, Save, X } from 'lucide-react'
import type { Classroom } from '@/queries/classroom-queries'
import type { FlashcardResponse, FlashCard } from '@/hooks/use-flashcard-generation'
import { useFlashcards } from '../../queries/flashcard-queries'
import { useSaveFlashcards } from '../../mutations/flashcard-mutations'
import { toast } from 'sonner'

const FlashcardDialog = ({
  topic_id,
  day_id,
  showFlashcardDialog,
  setShowFlashcardDialog,
  latestClassroom,
}: {
  topic_id: number | string
  day_id: string
  showFlashcardDialog: boolean
  setShowFlashcardDialog: (show: boolean) => void
  latestClassroom: Classroom
}) => {
  // Flashcard generation hook
  const { isGenerating, progress, generateFlashcards, cancelGeneration, reset } = useFlashcardGeneration()

  // Flashcard query and mutation
  const { data: fetchedFlashcards, isLoading: isFlashcardsLoading } = useFlashcards(
    typeof topic_id === 'number' ? topic_id : parseInt(topic_id, 10),
    day_id.toString(),
  )
  const saveFlashcardsMutation = useSaveFlashcards()

  // State for flashcard generation and viewing
  const [threadId] = useState(() => crypto.randomUUID())
  const [generatedFlashcards, setGeneratedFlashcards] = useState<FlashcardResponse | null>(null)
  const [currentMessage, setCurrentMessage] = useState('')
  const [isFlipped, setIsFlipped] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  // Get current flashcard data (prioritize generated over fetched)
  const currentFlashcards = generatedFlashcards?.flash_cards || fetchedFlashcards?.flash_cards || []

  // Reset flashcards when dialog opens
  useEffect(() => {
    if (showFlashcardDialog) {
      setGeneratedFlashcards(null)
      setCurrentMessage('')
      setIsFlipped(false)
      setCurrentCardIndex(0)
      reset()
    }
  }, [showFlashcardDialog, reset])

  const handleSendMessage = async () => {
    const message = currentMessage.trim()

    // Clear input
    setCurrentMessage('')

    // Generate flashcards response
    await generateFlashcards({
      latestClassroom,
      day_id: day_id.toString(),
      topic_id: topic_id.toString(),
      teacher_requirements: message,
      thread_id: threadId,
      onFlashcardsGenerated: flashcardsObj => {
        setGeneratedFlashcards(flashcardsObj)
        setCurrentCardIndex(0)
        setIsFlipped(false)
      },
      onError: errorMessage => {
        console.error('Error:', errorMessage)
        toast.error('Failed to generate flashcards')
      },
    })
  }

  const handleSaveToDatabase = () => {
    if (!generatedFlashcards) return
    saveFlashcardsMutation.mutate(
      {
        day_id: day_id.toString(),
        topic_id: topic_id.toString(),
        flash_cards: generatedFlashcards.flash_cards,
      },
      {
        onSuccess: () => {
          toast.success('Flashcards saved!')
        },
        onError: () => {
          toast.error('Failed to save flashcards')
        },
      },
    )
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentCardIndex(prev => (prev + 1) % currentFlashcards.length)
  }

  const handlePrevious = () => {
    setIsFlipped(false)
    setCurrentCardIndex(prev => (prev - 1 + currentFlashcards.length) % currentFlashcards.length)
  }

  const renderCardContent = (card: FlashCard, side: 'front' | 'back') => {
    const isBack = side === 'back'
    const showImage = isBack && card.image_public_url
    const text = isBack ? card.explanation : card.teacher_clue

    if (isBack && showImage) {
      // Answer mode with image - show only the image in the card
      return (
        <div className="flex h-full w-full items-center justify-center p-4">
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-gray-200 shadow-sm">
            <img
              key={`${card.image_public_url}-${currentCardIndex}`}
              src={card.image_public_url}
              alt={card.visual_description}
              className="h-full w-full object-cover"
              onError={e => {
                // Fallback to placeholder on image error
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.parentElement!.innerHTML = `
                  <div class="text-center text-xs text-gray-500 flex items-center justify-center h-full">
                    <div>
                      <svg class="mx-auto mb-1 h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      Image
                    </div>
                  </div>
                `
              }}
            />
          </div>
        </div>
      )
    }

    // Question mode or answer mode without image - centered layout
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-4">
        <div className="flex flex-1 flex-col justify-center text-center">
          {isBack && !showImage && <h3 className="mb-2 text-base font-semibold text-white/90">{card.reveal_text}</h3>}
          <h4 className="mb-2 text-sm font-medium text-white/80">{isBack ? 'Answer' : 'Question'}</h4>
          <p className="mx-auto max-w-full px-2 text-sm leading-relaxed break-words text-white/95">{text}</p>
        </div>
      </div>
    )
  }

  return (
    <Dialog
      open={showFlashcardDialog}
      onOpenChange={open => {
        setShowFlashcardDialog(open)
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Generate Flashcards
            </div>
          </DialogTitle>
          <DialogDescription className="text-start">Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>

        <div className="p-0">
          {/* Flashcard Display */}
          <div className="mb-6">
            {isFlashcardsLoading ? (
              <div className="bg-muted rounded-xl p-4 text-center text-sm">Loading flashcards...</div>
            ) : currentFlashcards.length > 0 ? (
              <div className="bg-muted rounded-xl p-4">
                <h4 className="text-foreground mb-4 flex items-center text-lg font-medium">
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {generatedFlashcards ? 'Generated Flashcards' : 'Saved Flashcards'}
                </h4>

                <div className="max-h-96 overflow-y-auto pr-2">
                  {/* Flashcard Card */}
                  <div className="mb-4 flex justify-center">
                    <div className="perspective-1000 relative h-70 w-72 cursor-pointer" onClick={handleFlip}>
                      <div
                        className={`transform-style-preserve-3d absolute h-full w-full transition-transform duration-500 ${
                          isFlipped ? 'rotate-y-180' : ''
                        }`}
                      >
                        {/* Front of card */}
                        <div className="absolute h-full w-full rounded-xl border-2 border-blue-400 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg backface-hidden">
                          {renderCardContent(currentFlashcards[currentCardIndex], 'front')}
                        </div>

                        {/* Back of card */}
                        <div className="absolute h-full w-full rotate-y-180 rounded-xl border-2 text-white shadow-lg backface-hidden">
                          {renderCardContent(currentFlashcards[currentCardIndex], 'back')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Answer Text - Only show when flipped and has image */}
                  {isFlipped && currentFlashcards[currentCardIndex]?.image_public_url && (
                    <div className="mb-4 text-center">
                      <h3 className="text-foreground mb-3 text-lg font-semibold">
                        {currentFlashcards[currentCardIndex].reveal_text}
                      </h3>
                      <div className="bg-background border-border rounded-lg border-2 p-4">
                        <h4 className="text-muted-foreground mb-2 text-sm font-medium">Answer</h4>
                        <p className="text-foreground text-sm leading-relaxed">
                          {currentFlashcards[currentCardIndex].explanation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      onClick={handlePrevious}
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 rounded-full p-0 shadow-sm"
                      disabled={currentFlashcards.length <= 1}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </Button>

                    <span className="text-muted-foreground bg-background rounded-full px-4 py-2 text-sm font-medium">
                      {currentCardIndex + 1} of {currentFlashcards.length}
                    </span>

                    <Button
                      onClick={handleNext}
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 rounded-full p-0 shadow-sm"
                      disabled={currentFlashcards.length <= 1}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-muted rounded-xl p-4">
                <div className="text-foreground text-sm leading-relaxed">
                  <p>The flashcards will be generated based on the topic and your requirements.</p>
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
                onChange={e => setCurrentMessage(e.target.value)}
                placeholder="e.g., Create flashcards with images showing the water cycle stages, or include diagrams for better understanding"
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
                      Generate Flashcards
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
                disabled={saveFlashcardsMutation.isPending || !generatedFlashcards}
              >
                {saveFlashcardsMutation.isPending ? (
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

export default FlashcardDialog
