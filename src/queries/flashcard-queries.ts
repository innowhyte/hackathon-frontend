import { useQuery } from '@tanstack/react-query'
import type { FlashcardResponse } from '@/hooks/use-flashcard-generation'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Get saved flashcards by topic and day
export const useFlashcards = (topic_id: number, day_id: string) => {
  return useQuery({
    queryKey: ['flashcards', topic_id.toString(), day_id],
    queryFn: async (): Promise<FlashcardResponse | null> => {
      const response = await fetch(`${API_BASE_URL}/api/topics/${topic_id}/days/${day_id}/class-materials/flashcards`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null // No flashcards found
        }
        throw new Error('Failed to fetch flashcards')
      }

      return response.json()
    },
    enabled: !!topic_id && !!day_id,
  })
}
