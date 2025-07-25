import { useQuery } from '@tanstack/react-query'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface Story {
  story: string
  idea: string
}

const fetchStoryByDayAndTopic = async (topic_id: number, day: string): Promise<Story | null> => {
  const response = await fetch(`${API_BASE_URL}/api/topics/${topic_id}/days/${day}/class-materials/story`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to fetch story')
  }

  return response.json()
}

export const useStoryByDayAndTopic = (topic_id: number | null, day: string | null) => {
  return useQuery({
    queryKey: ['story', topic_id, day],
    queryFn: () => fetchStoryByDayAndTopic(topic_id!, day!),
    enabled: topic_id !== null && !!day,
  })
}
