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

export interface Story {
  story: string
  idea: string
}

export interface StoryGenerationOptions {
  latestClassroom: Classroom
  day_id: string
  topic_id: string
  teacher_requirements: string // This will be mapped to teacher_requirements
  thread_id: string
  previous_story?: Story | null
  onProgress?: (progress: string) => void
  onStoryGenerated?: (story: Story) => void
  onError?: (error: string) => void
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useStoryGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState('')
  const [storyObj, setStoryObj] = useState<Story | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortController = new AbortController()

  const generateStory = useCallback(async (options: StoryGenerationOptions) => {
    if (isGenerating) return

    let isMounted = true

    const {
      latestClassroom,
      day_id,
      topic_id,
      teacher_requirements,
      thread_id,
      onProgress,
      onStoryGenerated,
      onError,
    } = options

    // Reset state
    setIsGenerating(true)
    setProgress('')
    setStoryObj(null)
    setError(null)

    // /api/topics/{topic_id}/days/{day_number}/story
    await fetchEventSource(`${API_BASE_URL}/api/topics/${topic_id}/days/${day_id}/story`, {
      signal: abortController.signal,
      openWhenHidden: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        classroom_id: String(latestClassroom.id),
        previous_story: options.previous_story ? options.previous_story : undefined,
        teacher_requirements: teacher_requirements || undefined,
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
              const storyObj = JSON.parse(data)
              setStoryObj(storyObj)
              onStoryGenerated?.(storyObj)
            } catch (e) {
              setError('Failed to parse story data')
              onError?.('Failed to parse story data')
            }
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
        setIsGenerating(false)
        // Abort the connection to prevent infinite retries
        abortController.abort()
        throw err // Prevent infinite retry loop
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
    setStoryObj(null)
    setError(null)
  }, [])

  return {
    isGenerating,
    progress,
    storyObj,
    error,
    generateStory,
    cancelGeneration,
    reset,
  }
}
