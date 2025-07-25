import { useState, useCallback } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import type { Classroom } from '@/queries/classroom-queries'

export interface GameGenerationState {
  isGenerating: boolean
  progress: string
  game: Game | null
  error: string | null
}

export interface Game {
  name: string
  description: string
  materials_required: string[]
  rules: string[]
  game_play: string
  game_purpose: string
}

export interface GameGenerationOptions {
  latestClassroom: Classroom
  day_id: string
  topic_id: string
  teacher_requirements?: string
  thread_id: string
  previous_game?: Game | null
  onProgress?: (progress: string) => void
  onGameGenerated?: (game: Game) => void
  onError?: (error: string) => void
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useGameGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState('')
  const [gameObj, setGameObj] = useState<Game | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortController = new AbortController()

  const generateGame = useCallback(async (options: GameGenerationOptions) => {
    if (isGenerating) return

    let isMounted = true

    const {
      latestClassroom,
      day_id,
      topic_id,
      teacher_requirements,
      thread_id,
      previous_game,
      onProgress,
      onGameGenerated,
      onError,
    } = options

    // Reset state
    setIsGenerating(true)
    setProgress('')
    setGameObj(null)
    setError(null)

    await fetchEventSource(`${API_BASE_URL}/api/topics/${topic_id}/days/${day_id}/game`, {
      signal: abortController.signal,
      openWhenHidden: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        classroom_id: String(latestClassroom.id),
        teacher_requirements: teacher_requirements || undefined,
        previous_game: previous_game || undefined,
        thread_id,
      }),
      onmessage(event) {
        const { event: eventType, data } = event

        switch (eventType) {
          case 'progress':
            const progressMessage = data
            setProgress(progressMessage)
            onProgress?.(progressMessage)
            break

          case 'data':
            try {
              const gameObj = JSON.parse(data)
              setGameObj(gameObj)
              onGameGenerated?.(gameObj)
            } catch (e) {
              setError('Failed to parse game data')
              onError?.('Failed to parse game data')
            }
            break

          case 'error':
            const errorMessage = data
            setError(errorMessage)
            onError?.(errorMessage)
            break

          default:
            console.log('Unknown event type:', eventType, data)
        }
      },
      onclose() {
        if (!isMounted) return
        setIsGenerating(false)
      },
      onerror(err) {
        let errorMessage = err.message || 'Failed to generate game'
        setError(errorMessage)
        onError?.(errorMessage)
        setIsGenerating(false)
        abortController.abort()
        throw err
      },
      async onopen(response) {
        if (!isMounted) return
        if (response.ok) {
          console.log('Game generation stream opened successfully')
        } else {
          console.error('Game generation stream failed with status:', response.status)
          setError(`Failed to start game generation: HTTP ${response.status}`)
          setIsGenerating(false)
          abortController.abort()
          throw new Error(`HTTP ${response.status}`)
        }
      },
    })
  }, [])

  const cancelGeneration = useCallback(() => {
    abortController.abort()
  }, [])

  const reset = useCallback(() => {
    setIsGenerating(false)
    setProgress('')
    setGameObj(null)
    setError(null)
  }, [])

  return {
    isGenerating,
    progress,
    gameObj,
    error,
    generateGame,
    cancelGeneration,
    reset,
  }
}
