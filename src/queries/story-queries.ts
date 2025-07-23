import { useQuery } from '@tanstack/react-query'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface Story {
  story: string
}

const fetchStoryByTopicId = async (topic_id: string): Promise<Story | null> => {
  const response = await fetch(`${API_BASE_URL}/api/${topic_id}/story`)
  if (!response.ok) {
    if (response.status === 404) return null
    throw new Error('Failed to fetch story')
  }
  return response.json()
}

export const useStoryByTopicId = (topic_id: string | null) => {
  return useQuery({
    queryKey: ['story', topic_id],
    queryFn: () => fetchStoryByTopicId(topic_id!),
    enabled: !!topic_id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
