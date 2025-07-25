import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { FlashcardResponse } from '@/hooks/use-flashcard-generation'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface SaveFlashcardsRequest {
  topic_id: string
  day_id: string
  flash_cards: FlashcardResponse['flash_cards']
}

const saveFlashcards = async (data: SaveFlashcardsRequest) => {
  const response = await fetch(
    `${API_BASE_URL}/api/topics/${data.topic_id}/days/${data.day_id}/class-materials/flashcards`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        flash_cards: data.flash_cards,
      }),
    },
  )

  if (response.status !== 201) {
    throw new Error('Flashcards could not be saved. Please try again.')
  }

  return {
    success: true,
    message: 'Flashcards saved successfully',
  }
}

// Save flashcards
export const useSaveFlashcards = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveFlashcards,
    onSuccess: (_data, variables) => {
      // Convert topic_id to number to match the query key format
      const topicId = typeof variables.topic_id === 'number' ? variables.topic_id : parseInt(variables.topic_id, 10)
      const day = variables.day_id.toString()

      // Invalidate the specific flashcards query
      queryClient.invalidateQueries({ queryKey: ['flashcards', topicId, day] })

      // Also invalidate all flashcards queries to be safe
      queryClient.invalidateQueries({ queryKey: ['flashcards'] })
    },
  })
}
