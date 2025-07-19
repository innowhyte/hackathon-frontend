import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'

const FlashcardDialog = () => {
  const context = useContext(AppContext)

  if (!context) {
    return null
  }

  const {
    showFlashcardDialog,
    setShowFlashcardDialog,
    currentCardIndex,
    setCurrentCardIndex,
    showDescription,
    setShowDescription,
    flashcardData,
  } = context

  if (!showFlashcardDialog) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-neutral-98 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <h2 className="text-lg font-semibold text-neutral-800">Flashcards</h2>
          <button
            onClick={() => setShowFlashcardDialog(false)}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
          >
            <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col items-center p-6">
          <div className="mb-4 text-sm text-neutral-600">
            {currentCardIndex + 1} of {flashcardData.length}
          </div>
          <div className="mb-6 w-full max-w-xs">
            <img
              src={flashcardData[currentCardIndex].image}
              alt={flashcardData[currentCardIndex].title}
              className="h-64 w-full rounded-lg border border-neutral-200 bg-neutral-50 object-contain"
            />
          </div>
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="bg-primary-90 text-primary-10 hover:bg-primary-100 mb-4 flex items-center rounded-lg px-4 py-2 transition-colors duration-200"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {showDescription ? 'Hide' : 'Show'} Answer
          </button>
          {showDescription && (
            <div className="bg-primary-90 mb-6 w-full rounded-xl p-4">
              <h3 className="mb-4 text-center text-xl font-semibold text-neutral-800">
                {flashcardData[currentCardIndex].title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-700">{flashcardData[currentCardIndex].description}</p>
            </div>
          )}
          <div className="flex w-full max-w-xs items-center justify-between">
            <button
              onClick={() => {
                setCurrentCardIndex(prev => (prev > 0 ? prev - 1 : flashcardData.length - 1))
                setShowDescription(false)
              }}
              className="rounded-full bg-neutral-100 p-3 transition-colors duration-200 hover:bg-neutral-200"
              disabled={flashcardData.length <= 1}
            >
              <svg className="h-5 w-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => {
                setCurrentCardIndex(prev => (prev < flashcardData.length - 1 ? prev + 1 : 0))
                setShowDescription(false)
              }}
              className="rounded-full bg-neutral-100 p-3 transition-colors duration-200 hover:bg-neutral-200"
              disabled={flashcardData.length <= 1}
            >
              <svg className="h-5 w-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlashcardDialog
