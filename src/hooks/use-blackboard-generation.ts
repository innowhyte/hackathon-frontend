import { useState, useCallback } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import type { Classroom } from '@/queries/classroom-queries'

export interface BlackboardGenerationState {
  isGenerating: boolean
  progress: string
  imageUrl: string
  error: string | null
}

export interface BlackboardDrawing {
  image_url: string
}

export interface BlackboardGenerationOptions {
  latestClassroom: Classroom
  day_id: string
  topic_id: string
  teacher_requirements?: string
  thread_id: string
  onProgress?: (progress: string) => void
  onDrawingGenerated?: (drawing: BlackboardDrawing) => void
  onError?: (error: string) => void
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useBlackboardGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState('')
  const [drawingObj, setDrawingObj] = useState<BlackboardDrawing | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortController = new AbortController()

  const generateDrawing = useCallback(async (options: BlackboardGenerationOptions) => {
    if (isGenerating) return

    let isMounted = true

    const {
      latestClassroom,
      day_id,
      topic_id,
      teacher_requirements,
      thread_id,
      onProgress,
      onDrawingGenerated,
      onError,
    } = options

    // Reset state
    setIsGenerating(true)
    setProgress('')
    setDrawingObj(null)
    setError(null)

    await fetchEventSource(`${API_BASE_URL}/api/topics/${topic_id}/days/${day_id}/blackboard-drawing`, {
      signal: abortController.signal,
      openWhenHidden: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        classroom_id: String(latestClassroom.id),
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
              const drawingObj = JSON.parse(data)
              setDrawingObj(drawingObj)
              onDrawingGenerated?.(drawingObj)
            } catch (e) {
              setError('Failed to parse drawing data')
              onError?.('Failed to parse drawing data')
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
        let errorMessage = err.message || 'Failed to generate blackboard drawing'
        setError(errorMessage)
        onError?.(errorMessage)
        setIsGenerating(false)
        abortController.abort()
        throw err
      },
      async onopen(response) {
        if (!isMounted) return
        if (response.ok) {
          console.log('Blackboard drawing generation stream opened successfully')
        } else {
          console.error('Blackboard drawing generation stream failed with status:', response.status)
          setError(`Failed to start blackboard drawing generation: HTTP ${response.status}`)
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
    setDrawingObj(null)
    setError(null)
  }, [])

  return {
    isGenerating,
    progress,
    drawingObj,
    error,
    generateDrawing,
    cancelGeneration,
    reset,
  }
}
