import { useState, useCallback } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import type { Classroom } from '@/queries/classroom-queries'

export interface VideoGenerationState {
  isGenerating: boolean
  progress: string
  videoUrl: string
  error: string | null
}

export interface VideoGeneration {
  video_url: string
}

export interface VideoGenerationOptions {
  latestClassroom: Classroom
  day_id: string
  topic_id: string
  teacher_requirements?: string
  thread_id: string
  onProgress?: (progress: string) => void
  onVideoGenerated?: (video: VideoGeneration) => void
  onError?: (error: string) => void
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useVideoGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState('')
  const [videoObj, setVideoObj] = useState<VideoGeneration | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortController = new AbortController()

  const generateVideo = useCallback(async (options: VideoGenerationOptions) => {
    if (isGenerating) return

    let isMounted = true

    const {
      latestClassroom,
      day_id,
      topic_id,
      teacher_requirements,
      thread_id,
      onProgress,
      onVideoGenerated,
      onError,
    } = options

    // Reset state
    setIsGenerating(true)
    setProgress('')
    setVideoObj(null)
    setError(null)

    await fetchEventSource(`${API_BASE_URL}/api/topics/${topic_id}/days/${day_id}/video`, {
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
              const videoObj = JSON.parse(data)
              setVideoObj(videoObj)
              onVideoGenerated?.(videoObj)
            } catch (e) {
              setError('Failed to parse video data')
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
    setVideoObj(null)
    setError(null)
  }, [])

  return {
    isGenerating,
    progress,
    videoObj,
    error,
    generateVideo,
    cancelGeneration,
    reset,
  }
}
