import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface GenerateAssessmentInput {
  topic_id: string
  grade_id: string
  assessment_type: 'mcq' | 'passage_reading' | 'passage_completion'
  options: {
    answerType?: 'mcq' | 'true_false'
    numberOfQuestions?: number
    numberOfWords?: number
    difficultyLevel?: 'easy' | 'medium' | 'hard'
    projectType?: string
  }
}

export interface Assessment {
  id: number
  assessment_type: 'mcq' | 'passage_reading' | 'passage_completion'
  content: any
  attributes: {
    pdf_url?: string
  } | null
  answer_key: any
  grade_id: number
  topic_id: number
}

const generateAssessment = async (data: GenerateAssessmentInput): Promise<Assessment> => {
  const response = await fetch(`${API_BASE_URL}/api/topics/${data.topic_id}/grades/${data.grade_id}/assessments/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      assessment_type: data.assessment_type,
      options: data.options,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to generate assessment')
  }

  return response.json()
}

export const useGenerateAssessment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: generateAssessment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['assessments', variables.topic_id, variables.grade_id],
      })
    },
  })
}

export interface DeleteAssessmentInput {
  topic_id: string
  grade_id: string
  assessment_id: string
}

const deleteAssessment = async (data: DeleteAssessmentInput): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/api/topics/${data.topic_id}/grades/${data.grade_id}/assessments/${data.assessment_id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  if (!response.ok) {
    throw new Error('Failed to delete assessment')
  }
}

export const useDeleteAssessment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAssessment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['assessments', variables.topic_id, variables.grade_id],
      })
    },
  })
}

export function useEvaluateMcqAssessment(studentId: number, assessmentId: number) {
  return useMutation({
    mutationFn: async (images: File[]) => {
      const formData = new FormData()
      images.forEach((image, idx) => {
        formData.append('images', image)
      })
      // /api/students/{student_id}/mcq-evaluations/{assessment_id}
      const response = await fetch(`${API_BASE_URL}/api/students/${studentId}/mcq-evaluations/${assessmentId}`, {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        throw new Error('Failed to evaluate MCQ assessment')
      }
      return response.json()
    },
  })
}

export function useEvaluateOralAssessment(studentId: number, assessmentId: number) {
  return useMutation({
    mutationFn: async (audioBlob: Blob) => {
      const formData = new FormData()
      formData.append('audio', audioBlob)
      const response = await fetch(`${API_BASE_URL}/api/students/${studentId}/oral-evaluations/${assessmentId}`, {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        throw new Error('Failed to evaluate oral assessment')
      }
      return response.json()
    },
  })
}
