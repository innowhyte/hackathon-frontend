import { useState, useCallback } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'

export interface AIHelpAnswerState {
  isGenerating: boolean
  progress: string
  answer: string
  error: string | null
}

export interface AIHelpAnswerOptions {
  topic_id: string
  thread_id: string
  question: string
  onProgress?: (progress: string) => void
  onAnswer?: (answer: string) => void
  onError?: (error: string) => void
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useAIHelpAnswer = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState<string | null>(null)
  const abortController = new AbortController()

  const generateAnswer = useCallback(async (options: AIHelpAnswerOptions) => {
    if (isGenerating) return

    let isMounted = true
    const { topic_id, thread_id, question, onProgress, onAnswer, onError } = options

    setIsGenerating(true)
    setProgress('')
    setAnswer('')
    setError(null)

    await fetchEventSource(`${API_BASE_URL}/api/topics/${topic_id}/teaching-materials/answer`, {
      signal: abortController.signal,
      openWhenHidden: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        thread_id,
        question,
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
              const parsedData = JSON.parse(data)
              const answerText = parsedData.answer || data
              setAnswer(answerText)
              onAnswer?.(answerText)
            } catch {
              // If parsing fails, use data as-is
              setAnswer(data)
              onAnswer?.(data)
            }
            break
          case 'error':
            setError(data)
            onError?.(data)
            break
          default:
            // Unknown event type
            break
        }
      },
      onclose() {
        if (!isMounted) return
        setIsGenerating(false)
      },
      onerror(err) {
        let errorMessage = err.message || 'Failed to generate answer'
        setError(errorMessage)
        onError?.(errorMessage)
        setIsGenerating(false)
        abortController.abort()
        throw err
      },
      async onopen(response) {
        if (!isMounted) return
        if (response.ok) {
          // Stream opened
        } else {
          setError(`Failed to start answer generation: HTTP ${response.status}`)
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
    setAnswer('')
    setError(null)
  }, [])

  return {
    isGenerating,
    progress,
    answer,
    error,
    generateAnswer,
    cancelGeneration,
    reset,
  }
}
