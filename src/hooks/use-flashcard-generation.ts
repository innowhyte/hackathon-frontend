import { useState, useCallback } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import type { Classroom } from '@/queries/classroom-queries'

export interface FlashcardGenerationState {
  isGenerating: boolean
  progress: string
  flashCards: FlashCard[]
  error: string | null
}

export interface FlashCard {
  reveal_text: string
  visual_description: string
  explanation: string
  teacher_clue: string
  image_gcs_uri: string
  image_public_url: string
}

export interface FlashcardResponse {
  flash_cards: FlashCard[]
}

export interface FlashcardGenerationOptions {
  latestClassroom: Classroom
  day_id: string
  topic_id: string
  teacher_requirements?: string
  thread_id: string
  onProgress?: (progress: string) => void
  onFlashcardsGenerated?: (flashcards: FlashcardResponse) => void
  onError?: (error: string) => void
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useFlashcardGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState('')
  const [flashcardsObj, setFlashcardsObj] = useState<FlashcardResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortController = new AbortController()

  const generateFlashcards = useCallback(async (options: FlashcardGenerationOptions) => {
    if (isGenerating) return

    let isMounted = true

    const {
      latestClassroom,
      day_id,
      topic_id,
      teacher_requirements,
      thread_id,
      onProgress,
      onFlashcardsGenerated,
      onError,
    } = options

    // Reset state
    setIsGenerating(true)
    setProgress('')
    setFlashcardsObj(null)
    setError(null)

    await fetchEventSource(`${API_BASE_URL}/api/topics/${topic_id}/days/${day_id}/flashcards`, {
      signal: abortController.signal,
      openWhenHidden: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        classroom_id: String(latestClassroom.id),
        teacher_requirements: teacher_requirements || undefined,
        thread_id,
      }),
      onmessage(event) {
        const { event: eventType, data } = event

        switch (eventType) {
          case 'progress':
            const progressMessage = data
            setProgress(progressMessage)
            onProgress?.(progressMessage)
            break

          case 'data':
            try {
              const flashcardsObj = JSON.parse(data)
              setFlashcardsObj(flashcardsObj)
              onFlashcardsGenerated?.(flashcardsObj)
            } catch (e) {
              setError('Failed to parse flashcards data')
              onError?.('Failed to parse flashcards data')
            }
            break

          case 'error':
            const errorMessage = data
            setError(errorMessage)
            onError?.(errorMessage)
            break

          default:
            console.log('Unknown event type:', eventType, data)
        }
      },
      onclose() {
        if (!isMounted) return
        setIsGenerating(false)
      },
      onerror(err) {
        let errorMessage = err.message || 'Failed to generate flashcards'
        setError(errorMessage)
        onError?.(errorMessage)
        setIsGenerating(false)
        abortController.abort()
        throw err
      },
      async onopen(response) {
        if (!isMounted) return
        if (response.ok) {
          console.log('Flashcard generation stream opened successfully')
        } else {
          console.error('Flashcard generation stream failed with status:', response.status)
          setError(`Failed to start flashcard generation: HTTP ${response.status}`)
          setIsGenerating(false)
          abortController.abort()
          throw new Error(`HTTP ${response.status}`)
        }
      },
    })
  }, [])

  const cancelGeneration = useCallback(() => {
    abortController.abort()
  }, [])

  const reset = useCallback(() => {
    setIsGenerating(false)
    setProgress('')
    setFlashcardsObj(null)
    setError(null)
  }, [])

  return {
    isGenerating,
    progress,
    flashcardsObj,
    error,
    generateFlashcards,
    cancelGeneration,
    reset,
  }
}
