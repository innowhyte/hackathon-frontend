import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface SaveStoryInput {
  day_id: string
  topic_id: string
  story: string
  idea: string
}

const saveStory = async ({ day_id, topic_id, story, idea }: SaveStoryInput): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/day/${day_id}/topic/${topic_id}/class-materials/story`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ story, idea }),
  })
  if (!response.ok) {
    throw new Error('Failed to save story')
  }
}

export const useSaveStory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveStory,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['story', variables.day_id, variables.topic_id] })
    },
  })
}
