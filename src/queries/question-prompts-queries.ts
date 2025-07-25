import { useQuery } from '@tanstack/react-query'
import type { QuestionPromptsResponse } from '@/hooks/use-question-prompts-generation'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Get saved question prompts by topic and day
export const useQuestionPrompts = (topic_id: number, day_id: string) => {
  return useQuery({
    queryKey: ['question-prompts', topic_id.toString(), day_id],
    queryFn: async (): Promise<QuestionPromptsResponse | null> => {
      const response = await fetch(
        `${API_BASE_URL}/api/topics/${topic_id}/days/${day_id}/class-materials/question_prompts`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (!response.ok) {
        if (response.status === 404) {
          return null // No question prompts found
        }
        throw new Error('Failed to fetch question prompts')
      }

      return response.json()
    },
    enabled: !!topic_id && !!day_id,
  })
}
