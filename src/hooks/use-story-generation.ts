import { useState, useCallback } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import type { Classroom } from '@/queries/classroom-queries'

export interface StoryGenerationState {
  isGenerating: boolean
  progress: string
  story: string
  idea: string
  error: string | null
}

export interface StoryGenerationOptions {
  latestClassroom: Classroom
  day_id: string
  topic_id: string
  context: string // This will be mapped to teacher_requirements
  thread_id: string
  onProgress?: (progress: string) => void
  onStoryGenerated?: (story: string) => void
  onError?: (error: string) => void
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useStoryGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState('')
  const [story, setStory] = useState('')
  const [idea, setIdea] = useState('')
  const [error, setError] = useState<string | null>(null)
  const abortController = new AbortController()

  const generateStory = useCallback(async (options: StoryGenerationOptions) => {
    if (isGenerating) return

    let isMounted = true

    const { latestClassroom, day_id, topic_id, context, thread_id, onProgress, onStoryGenerated, onError } = options

    // Reset state
    setIsGenerating(true)
    setProgress('')
    setStory('')
    setIdea('')
    setError(null)

    await fetchEventSource(`${API_BASE_URL}/api/day/${day_id}/topic/${topic_id}/class-materials/story`, {
      signal: abortController.signal,
      openWhenHidden: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        thread_id,
        classroom_id: String(latestClassroom.id),
        teacher_requirements: context || undefined,
      }),
      onmessage(event) {
        const { event: eventType, data } = event

        switch (eventType) {
          case 'progress':
            const progressMessage = data
            setProgress(progressMessage)
            onProgress?.(progressMessage)
            break

          case 'idea':
            const ideaData = data
            setIdea(ideaData)
            break

          case 'data':
            const storyData = data
            setStory(storyData)
            onStoryGenerated?.(storyData)
            break

          case 'error':
            const errorMessage = data
            setError(errorMessage)
            onError?.(errorMessage)
            break

          default:
            // Handle any other event types
            console.log('Unknown event type:', eventType, data)
        }
      },
      onclose() {
        if (!isMounted) return
        // Connection closed
        setIsGenerating(false)
      },
      onerror(err) {
        // Network or other errors
        let errorMessage = err.message || 'Failed to generate story'

        setError(errorMessage)
        onError?.(errorMessage)

        // Abort the connection to prevent infinite retries
        abortController.abort()
      },
      // Handle HTTP errors
      // eslint-disable-next-line @typescript-eslint/require-await
      async onopen(response) {
        if (!isMounted) return
        if (response.ok) {
          console.log('Story generation stream opened successfully')
        } else {
          console.error('Story generation stream failed with status:', response.status)
          setError(`Failed to start story generation: HTTP ${response.status}`)
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
    setStory('')
    setIdea('')
    setError(null)
  }, [])

  return {
    isGenerating,
    progress,
    story,
    idea,
    error,
    generateStory,
    cancelGeneration,
    reset,
  }
}
