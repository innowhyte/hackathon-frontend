import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface SaveStoryInput {
  topic_id: string
  story: string
}

const saveStory = async ({ topic_id, story }: SaveStoryInput): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/${topic_id}/save-story`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ story }),
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
      queryClient.invalidateQueries({ queryKey: ['story', variables.topic_id] })
    },
  })
}
