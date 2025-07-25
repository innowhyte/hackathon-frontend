import { useQuery } from '@tanstack/react-query'
import type { BlackboardDrawing } from '@/hooks/use-blackboard-generation'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Get saved blackboard drawing by topic and day
export const useBlackboardDrawing = (topic_id: number, day_id: string) => {
  return useQuery({
    queryKey: ['blackboard-drawing', topic_id.toString(), day_id],
    queryFn: async (): Promise<BlackboardDrawing | null> => {
      const response = await fetch(
        `${API_BASE_URL}/api/topics/${topic_id}/days/${day_id}/class-materials/blackboard_drawing`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (!response.ok) {
        if (response.status === 404) {
          return null // No blackboard drawing found
        }
        throw new Error('Failed to fetch blackboard drawing')
      }

      return response.json()
    },
    enabled: !!topic_id && !!day_id,
  })
}
