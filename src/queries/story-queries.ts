import { useQuery } from '@tanstack/react-query'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface Story {
  story: string
}

const fetchStoryByDayAndTopic = async (day_id: string, topic_id: string): Promise<Story | null> => {
  const response = await fetch(`${API_BASE_URL}/api/day/${day_id}/topic/${topic_id}/class-materials/story`)
  if (!response.ok) {
    if (response.status === 404) return null
    throw new Error('Failed to fetch story')
  }
  return response.json()
}

export const useStoryByDayAndTopic = (day_id: string | null, topic_id: string | null) => {
  return useQuery({
    queryKey: ['story', day_id, topic_id],
    queryFn: () => fetchStoryByDayAndTopic(day_id!, topic_id!),
    enabled: !!day_id && !!topic_id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
