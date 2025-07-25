import { useState, useCallback } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import type { Classroom } from '@/queries/classroom-queries'

export interface QuestionPromptsGenerationState {
  isGenerating: boolean
  progress: string
  questionPrompts: QuestionPrompt[]
  error: string | null
}

export interface QuestionPrompt {
  question: string
  purpose: string
  connection: string
}

export interface QuestionPromptsResponse {
  question_prompts: QuestionPrompt[]
}

export interface QuestionPromptsGenerationOptions {
  latestClassroom: Classroom
  day_id: string
  topic_id: string
  teacher_requirements?: string
  thread_id: string
  previous_question_prompts?: QuestionPromptsResponse | null
  onProgress?: (progress: string) => void
  onQuestionPromptsGenerated?: (questionPrompts: QuestionPromptsResponse) => void
  onError?: (error: string) => void
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useQuestionPromptsGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState('')
  const [questionPromptsObj, setQuestionPromptsObj] = useState<QuestionPromptsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortController = new AbortController()

  const generateQuestionPrompts = useCallback(async (options: QuestionPromptsGenerationOptions) => {
    if (isGenerating) return

    let isMounted = true

    const {
      latestClassroom,
      day_id,
      topic_id,
      teacher_requirements,
      thread_id,
      previous_question_prompts,
      onProgress,
      onQuestionPromptsGenerated,
      onError,
    } = options

    // Reset state
    setIsGenerating(true)
    setProgress('')
    setQuestionPromptsObj(null)
    setError(null)

    await fetchEventSource(`${API_BASE_URL}/api/topics/${topic_id}/days/${day_id}/question-prompts`, {
      signal: abortController.signal,
      openWhenHidden: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        classroom_id: String(latestClassroom.id),
        teacher_requirements: teacher_requirements || undefined,
        previous_question_prompts: previous_question_prompts || undefined,
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
              const questionPromptsObj = JSON.parse(data)
              setQuestionPromptsObj(questionPromptsObj)
              onQuestionPromptsGenerated?.(questionPromptsObj)
            } catch (e) {
              setError('Failed to parse question prompts data')
              onError?.('Failed to parse question prompts data')
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
        let errorMessage = err.message || 'Failed to generate question prompts'
        setError(errorMessage)
        onError?.(errorMessage)
        setIsGenerating(false)
        abortController.abort()
        throw err
      },
      async onopen(response) {
        if (!isMounted) return
        if (response.ok) {
          console.log('Question prompts generation stream opened successfully')
        } else {
          console.error('Question prompts generation stream failed with status:', response.status)
          setError(`Failed to start question prompts generation: HTTP ${response.status}`)
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
    setQuestionPromptsObj(null)
    setError(null)
  }, [])

  return {
    isGenerating,
    progress,
    questionPromptsObj,
    error,
    generateQuestionPrompts,
    cancelGeneration,
    reset,
  }
}
