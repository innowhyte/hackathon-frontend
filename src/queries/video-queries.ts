import { useQuery } from '@tanstack/react-query'
import type { VideoGeneration } from '@/hooks/use-video-generation'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Get saved video by topic and day
export const useVideo = (topic_id: number, day_id: string) => {
  return useQuery({
    queryKey: ['video', topic_id.toString(), day_id],
    queryFn: async (): Promise<VideoGeneration | null> => {
      const response = await fetch(`${API_BASE_URL}/api/topics/${topic_id}/days/${day_id}/class-materials/video`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null // No video found
        }
        throw new Error('Failed to fetch video')
      }

      return response.json()
    },
    enabled: !!topic_id && !!day_id,
  })
}
