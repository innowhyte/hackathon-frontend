import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface SaveStoryInput {
  topic_id: string | number
  day_id: string | number
  idea: string
  story: string
}

const saveStory = async ({ topic_id, day_id, idea, story }: SaveStoryInput) => {
  const response = await fetch(`${API_BASE_URL}/api/topics/${topic_id}/days/${day_id}/class-materials/story`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({ idea, story }),
  })
  if (response.status !== 201) {
    throw new Error('Story could not be saved. Please try again.')
  }
  return {
    success: true,
    message: 'Story saved successfully',
  }
}

export const useSaveStory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveStory,
    onSuccess: (_data, variables) => {
      // Convert topic_id to number to match the query key format
      const topicId =
        typeof variables.topic_id === 'number' ? variables.topic_id : parseInt(variables.topic_id.toString(), 10)
      const day = variables.day_id.toString()

      // Invalidate the specific story query
      queryClient.invalidateQueries({ queryKey: ['story', topicId, day] })

      // Also invalidate all story queries to be safe
      queryClient.invalidateQueries({ queryKey: ['story'] })
    },
  })
}
