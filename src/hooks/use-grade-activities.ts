import { useState, useCallback } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import type { Activity } from '@/queries/activities-queries'

export interface GradeActivitiesGenerationState {
  isGenerating: boolean
  progress: string
  activities: Activity[]
  error: string | null
}

export interface GradeActivitiesGenerationOptions {
  previous_activities?: Activity[] | null
  day_id: string
  grade_id: string
  topic_id: string
  modes_of_interaction: string
  modalities: string[]
  teacher_requirements: string
  onProgress?: (progress: string) => void
  onActivitiesGenerated?: (activities: Activity[]) => void
  onError?: (error: string) => void
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useGradeActivitiesGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState('')
  const [activities, setActivities] = useState<Activity[]>([])
  const [error, setError] = useState<string | null>(null)
  const abortController = new AbortController()

  const generateActivities = useCallback(async (options: GradeActivitiesGenerationOptions) => {
    if (isGenerating) return

    let isMounted = true

    const {
      previous_activities,
      day_id,
      grade_id,
      topic_id,
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
        previous_activities: previous_activities ? { activities: previous_activities } : null,
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
        setIsGenerating(false)
        abortController.abort()
        throw 'Failed to generate activities' // Prevent infinite retry loop
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
