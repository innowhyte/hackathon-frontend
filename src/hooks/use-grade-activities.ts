import { useState, useCallback } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'

export interface GradeActivitiesGenerationState {
  isGenerating: boolean
  progress: string
  activities: any[]
  error: string | null
}

export interface GradeActivitiesGenerationOptions {
  day_id: string
  grade_id: string
  topic_id: string
  thread_id: string
  modes_of_interaction: string
  modalities: string[]
  teacher_requirements: string
  onProgress?: (progress: string) => void
  onActivitiesGenerated?: (activities: any[]) => void
  onError?: (error: string) => void
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useGradeActivitiesGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState('')
  const [activities, setActivities] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const abortController = new AbortController()

  const generateActivities = useCallback(async (options: GradeActivitiesGenerationOptions) => {
    if (isGenerating) return

    let isMounted = true

    const {
      day_id,
      grade_id,
      topic_id,
      thread_id,
      modes_of_interaction,
      modalities,
      teacher_requirements,
      onProgress,
      onActivitiesGenerated,
      onError,
    } = options

    setIsGenerating(true)
    setProgress('')
    setActivities([])
    setError(null)

    await fetchEventSource(`${API_BASE_URL}/api/days/${day_id}/grades/${grade_id}/topics/${topic_id}/activities`, {
      signal: abortController.signal,
      openWhenHidden: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        thread_id,
        modes_of_interaction,
        modalities,
        teacher_requirements,
      }),
      onmessage(event) {
        const { event: eventType, data } = event
        switch (eventType) {
          case 'progress':
            setProgress(data)
            onProgress?.(data)
            break
          case 'data':
            try {
              const activitiesData = JSON.parse(data)
              setActivities(activitiesData)
              onActivitiesGenerated?.(activitiesData)
            } catch (e) {
              setError('Failed to parse activities data')
              onError?.('Failed to parse activities data')
            }
            break
          case 'error':
            setError(data)
            onError?.(data)
            break
          default:
            // Handle any other event types
            console.log('Unknown event type:', eventType, data)
        }
      },
      onclose() {
        if (!isMounted) return
        setIsGenerating(false)
      },
      onerror(err) {
        let errorMessage = err.message || 'Failed to generate activities'
        setError(errorMessage)
        onError?.(errorMessage)
        abortController.abort()
      },
      async onopen(response) {
        if (!isMounted) return
        if (response.ok) {
          console.log('Activities generation stream opened successfully')
        } else {
          setError(`Failed to start activities generation: HTTP ${response.status}`)
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
    setActivities([])
    setError(null)
  }, [])

  return {
    isGenerating,
    progress,
    activities,
    error,
    generateActivities,
    cancelGeneration,
    reset,
  }
}
