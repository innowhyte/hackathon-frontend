import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface SaveVideoRequest {
  topic_id: string
  day_id: string
  video_url: string
}

const saveVideo = async (data: SaveVideoRequest) => {
  const response = await fetch(
    `${API_BASE_URL}/api/topics/${data.topic_id}/days/${data.day_id}/class-materials/video`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        video_url: data.video_url,
      }),
    },
  )

  if (response.status !== 201) {
    throw new Error('Video could not be saved. Please try again.')
  }

  return {
    success: true,
    message: 'Video saved successfully',
  }
}

// Save video
export const useSaveVideo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveVideo,
    onSuccess: (_data, variables) => {
      // Convert topic_id to number to match the query key format
      const topicId = typeof variables.topic_id === 'number' ? variables.topic_id : parseInt(variables.topic_id, 10)
      const day = variables.day_id.toString()

      // Invalidate the specific video query
      queryClient.invalidateQueries({ queryKey: ['video', topicId, day] })

      // Also invalidate all video queries to be safe
      queryClient.invalidateQueries({ queryKey: ['video'] })
    },
  })
}
