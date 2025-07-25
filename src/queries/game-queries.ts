import { useQuery } from '@tanstack/react-query'
import type { Game } from '@/hooks/use-game-generation'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Get saved game by topic and day
export const useGame = (topic_id: number, day_id: string) => {
  return useQuery({
    queryKey: ['game', topic_id.toString(), day_id],
    queryFn: async (): Promise<Game | null> => {
      const response = await fetch(`${API_BASE_URL}/api/topics/${topic_id}/days/${day_id}/class-materials/game`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null // No game found
        }
        throw new Error('Failed to fetch game')
      }

      return response.json()
    },
    enabled: !!topic_id && !!day_id,
  })
}
