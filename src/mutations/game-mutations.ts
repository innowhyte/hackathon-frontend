import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Game } from '@/hooks/use-game-generation'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface SaveGameRequest {
  topic_id: string
  day_id: string
  name: string
  description: string
  materials_required: string[]
  rules: string[]
  game_play: string
  game_purpose: string
}

const saveGame = async (data: SaveGameRequest) => {
  const response = await fetch(`${API_BASE_URL}/api/topics/${data.topic_id}/days/${data.day_id}/class-materials/game`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      materials_required: data.materials_required,
      rules: data.rules,
      game_play: data.game_play,
      game_purpose: data.game_purpose,
    }),
  })

  if (response.status !== 201) {
    throw new Error('Game could not be saved. Please try again.')
  }

  return {
    success: true,
    message: 'Game saved successfully',
  }
}

// Save game
export const useSaveGame = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveGame,
    onSuccess: (_data, variables) => {
      // Convert topic_id to number to match the query key format
      const topicId = typeof variables.topic_id === 'number' ? variables.topic_id : parseInt(variables.topic_id, 10)
      const day = variables.day_id.toString()

      // Invalidate the specific game query
      queryClient.invalidateQueries({ queryKey: ['game', topicId, day] })

      // Also invalidate all game queries to be safe
      queryClient.invalidateQueries({ queryKey: ['game'] })
    },
  })
}
