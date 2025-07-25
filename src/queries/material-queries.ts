import { useQuery } from '@tanstack/react-query'

export interface TopicMaterial {
  content_link: string
  summary: string
  extracted_content: string
  content_metadata: {
    has_diagrams: boolean
  }
  id: number
  topic_id: number
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useTopicMaterials = (topicId: number | null) => {
  return useQuery({
    queryKey: ['topic-materials', topicId],
    queryFn: async () => {
      if (!topicId) return []

      const response = await fetch(`${API_BASE_URL}/api/topics/${topicId}/teaching-materials`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch topic materials')
      }

      return response.json()
    },
    enabled: !!topicId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useIncompleteMaterials = (topicId: number | null, refetchInterval?: number) => {
  return useQuery({
    queryKey: ['incomplete-materials', topicId],
    queryFn: async () => {
      if (!topicId) return []

      const timestamp = new Date().toLocaleTimeString()
      console.log(
        `🌐 [${timestamp}] Fetching incomplete materials for topic ${topicId} (interval: ${refetchInterval}ms)`,
      )

      const response = await fetch(`${API_BASE_URL}/api/topics/${topicId}/teaching-materials/incomplete`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch incomplete materials')
      }

      const data = await response.json()
      const endTimestamp = new Date().toLocaleTimeString()
      console.log(`✅ [${endTimestamp}] Fetched incomplete materials:`, data)

      return data
    },
    enabled: !!topicId,
    refetchInterval: refetchInterval,
    refetchOnWindowFocus: false,
    staleTime: 0,
  })
}
