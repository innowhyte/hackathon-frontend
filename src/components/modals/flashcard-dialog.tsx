import { useContext, useState } from 'react'
import { AppContext } from '../../context/app-context'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'

const FlashcardDialog = () => {
  const context = useContext(AppContext)
  const [isFlipped, setIsFlipped] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  if (!context) {
    return null
  }

  const { showFlashcardDialog, setShowFlashcardDialog, flashcardPrompt, setFlashcardPrompt } = context

  const handleFlashcardSubmit = () => {
    if (flashcardPrompt.trim()) {
      // Handle flashcard generation logic here
      console.log('Generating flashcards with prompt:', flashcardPrompt)
    }
  }

  // Sample flashcard data with images - in a real app, this would come from the API
  const sampleFlashcards = [
    {
      front: {
        text: 'What is evaporation?',
        image: null,
      },
      back: {
        text: 'The process where liquid water turns into water vapor due to heat from the sun.',
        image: null,
      },
    },
    {
      front: {
        text: 'Where does evaporation happen?',
        image: null,
      },
      back: {
        text: 'Everywhere! From puddles, lakes, oceans, and even your wet clothes when they dry.',
        image: null,
      },
    },
    {
      front: {
        text: 'What causes evaporation?',
        image: null,
      },
      back: {
        text: 'Heat from the sun makes water molecules move faster and escape into the air as water vapor.',
        image: null,
      },
    },
    {
      front: {
        text: 'What is condensation?',
        image: null,
      },
      back: {
        text: 'The process where water vapor cools down and turns back into liquid water droplets.',
        image: null,
      },
    },
    {
      front: {
        text: 'What is precipitation?',
        image: null,
      },
      back: {
        text: 'Water that falls from clouds as rain, snow, sleet, or hail.',
        image: null,
      },
    },
    // Example with image in question
    {
      front: {
        text: 'What stage of the water cycle is shown in this image?',
        image: '/assets/water_cycle_evaporation.jpg', // Placeholder path
      },
      back: {
        text: 'This shows evaporation - water turning into vapor due to heat from the sun.',
        image: null,
      },
    },
    // Example with image in answer
    {
      front: {
        text: 'What is the water cycle?',
        image: null,
      },
      back: {
        text: "The continuous movement of water on, above, and below the Earth's surface.",
        image: '/assets/water_cycle_diagram.jpg', // Placeholder path
      },
    },
  ]

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentCardIndex(prev => (prev + 1) % sampleFlashcards.length)
  }

  const handlePrevious = () => {
    setIsFlipped(false)
    setCurrentCardIndex(prev => (prev - 1 + sampleFlashcards.length) % sampleFlashcards.length)
  }

  const currentCard = sampleFlashcards[currentCardIndex]

  const renderCardContent = (side: 'front' | 'back') => {
    const content = side === 'front' ? currentCard.front : currentCard.back
    const hasImage = content.image && content.image !== null
    const hasText = content.text && content.text.trim() !== ''

    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-4 sm:p-6">
        {hasImage && (
          <div className="mb-3 flex w-full justify-center sm:mb-4">
            <div className="relative flex h-20 w-28 items-center justify-center overflow-hidden rounded-lg bg-gray-200 shadow-sm sm:h-28 sm:w-36">
              {/* Placeholder for actual image */}
              <div className="text-center text-xs text-gray-500">
                <svg
                  className="mx-auto mb-1 h-8 w-8 sm:mb-2 sm:h-10 sm:w-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Image
              </div>
            </div>
          </div>
        )}

        {hasText && (
          <div className="flex flex-1 flex-col justify-center text-center">
            <h3 className="mb-2 text-lg font-semibold text-white/90 sm:mb-3 sm:text-xl">
              {side === 'front' ? 'Question' : 'Answer'}
            </h3>
            <p className="mx-auto max-w-xs px-2 text-sm leading-relaxed text-white/95 sm:text-base">{content.text}</p>
          </div>
        )}

        {!hasText && !hasImage && (
          <div className="text-center text-white/60">
            <p>No content available</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog
      open={showFlashcardDialog}
      onOpenChange={open => {
        setShowFlashcardDialog(open)
        if (!open) {
          setFlashcardPrompt('')
          setIsFlipped(false)
          setCurrentCardIndex(0)
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex-shrink-0 pb-3 sm:pb-4">
          <DialogTitle className="text-lg sm:text-xl">
            <svg
              className="text-secondary mr-2 h-5 w-5 sm:mr-3 sm:h-6 sm:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Interactive Flashcards
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6">
          {/* Flashcard Display */}
          <div className="mt-4 mb-6 flex justify-center sm:mt-6 sm:mb-8">
            <div className="perspective-1000 relative h-56 w-72 cursor-pointer sm:h-64 sm:w-80" onClick={handleFlip}>
              <div
                className={`transform-style-preserve-3d absolute h-full w-full transition-transform duration-500 ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front of card */}
                <div className="absolute h-full w-full rounded-xl border-2 border-blue-400 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg backface-hidden">
                  {renderCardContent('front')}
                </div>

                {/* Back of card */}
                <div className="absolute h-full w-full rotate-y-180 rounded-xl border-2 border-green-400 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg backface-hidden">
                  {renderCardContent('back')}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mb-6 flex items-center justify-center gap-4 sm:mb-8 sm:gap-6">
            <Button
              onClick={handlePrevious}
              variant="outline"
              size="sm"
              className="h-10 w-10 rounded-full p-0 shadow-sm sm:h-12 sm:w-12"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>

            <span className="text-muted-foreground bg-muted rounded-full px-3 py-1 text-sm font-medium sm:px-4 sm:py-2">
              {currentCardIndex + 1} of {sampleFlashcards.length}
            </span>

            <Button
              onClick={handleNext}
              variant="outline"
              size="sm"
              className="h-10 w-10 rounded-full p-0 shadow-sm sm:h-12 sm:w-12"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>

          <label className="text-muted-foreground mb-3 block text-sm font-medium sm:mb-4">
            Customize the flashcard content (text and images):
          </label>
          <div className="relative">
            <textarea
              value={flashcardPrompt}
              onChange={e => setFlashcardPrompt(e.target.value)}
              placeholder="e.g., Create flashcards with images showing the water cycle stages, or include diagrams for better understanding"
              rows={3}
              className="border-border focus:border-secondary text-foreground w-full resize-none rounded-2xl border-2 p-3 text-sm shadow-sm transition-colors duration-200 focus:ring-0 focus:outline-none sm:p-4 sm:text-base"
            />
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-border flex-shrink-0 border-t px-4 pt-3 pb-4 sm:px-6 sm:pt-4 sm:pb-6">
          <Button
            onClick={handleFlashcardSubmit}
            variant="secondary"
            className="w-full rounded-3xl px-4 py-3 text-sm font-medium shadow-sm transition-all duration-300 sm:px-6 sm:py-4 sm:text-base"
            disabled={!flashcardPrompt.trim()}
          >
            <span className="flex items-center justify-center">
              <svg className="mr-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Generate New Flashcards
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FlashcardDialog
