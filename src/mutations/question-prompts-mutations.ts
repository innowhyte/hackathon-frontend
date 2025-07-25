import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { QuestionPromptsResponse } from '@/hooks/use-question-prompts-generation'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface SaveQuestionPromptsRequest {
  topic_id: string
  day_id: string
  question_prompts: QuestionPromptsResponse['question_prompts']
}

const saveQuestionPrompts = async (data: SaveQuestionPromptsRequest) => {
  const response = await fetch(
    `${API_BASE_URL}/api/topics/${data.topic_id}/days/${data.day_id}/class-materials/question_prompts`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        question_prompts: data.question_prompts,
      }),
    },
  )

  if (response.status !== 201) {
    throw new Error('Question prompts could not be saved. Please try again.')
  }

  return {
    success: true,
    message: 'Question prompts saved successfully',
  }
}

// Save question prompts
export const useSaveQuestionPrompts = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveQuestionPrompts,
    onSuccess: (_data, variables) => {
      // Convert topic_id to number to match the query key format
      const topicId = typeof variables.topic_id === 'number' ? variables.topic_id : parseInt(variables.topic_id, 10)
      const day = variables.day_id.toString()

      // Invalidate the specific question prompts query
      queryClient.invalidateQueries({ queryKey: ['question-prompts', topicId, day] })

      // Also invalidate all question prompts queries to be safe
      queryClient.invalidateQueries({ queryKey: ['question-prompts'] })
    },
  })
}
