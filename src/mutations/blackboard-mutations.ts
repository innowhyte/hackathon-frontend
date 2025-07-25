import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { BlackboardDrawing } from '@/hooks/use-blackboard-generation'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface SaveBlackboardDrawingRequest {
  topic_id: string
  day_id: string
  image_url: string
}

const saveBlackboardDrawing = async (data: SaveBlackboardDrawingRequest) => {
  const response = await fetch(
    `${API_BASE_URL}/api/topics/${data.topic_id}/days/${data.day_id}/class-materials/blackboard_drawing`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        image_url: data.image_url,
      }),
    },
  )

  if (response.status !== 201) {
    throw new Error('Blackboard drawing could not be saved. Please try again.')
  }

  return {
    success: true,
    message: 'Blackboard drawing saved successfully',
  }
}

// Save blackboard drawing
export const useSaveBlackboardDrawing = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveBlackboardDrawing,
    onSuccess: (_data, variables) => {
      // Convert topic_id to number to match the query key format
      const topicId = typeof variables.topic_id === 'number' ? variables.topic_id : parseInt(variables.topic_id, 10)
      const day = variables.day_id.toString()

      // Invalidate the specific blackboard drawing query
      queryClient.invalidateQueries({ queryKey: ['blackboard-drawing', topicId, day] })

      // Also invalidate all blackboard drawing queries to be safe
      queryClient.invalidateQueries({ queryKey: ['blackboard-drawing'] })
    },
  })
}
