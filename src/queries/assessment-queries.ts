import { useQuery } from '@tanstack/react-query'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface MCQQuestion {
  question: string
  options: string[]
  answer: string
}

export interface PassageReadingContent {
  passage: string
  challenges: string[]
}

export interface PassageCompletionContent {
  passage: string
  expected_answers: string[]
}

export interface MCQContent {
  mcqs: MCQQuestion[]
}

export interface Assessment {
  id: number
  assessment_type: 'mcq' | 'passage_reading' | 'passage_completion'
  content: MCQContent | PassageReadingContent | PassageCompletionContent
  attributes: {
    pdf_url?: string
  } | null
  answer_key: any
  grade_id: number
  topic_id: number
  topic_name: string
  grade_name: string
}

const fetchAssessmentsByTopicGrade = async (topic_id: string, grade_id: string): Promise<Assessment[]> => {
  const response = await fetch(`${API_BASE_URL}/api/topics/${topic_id}/grades/${grade_id}/assessments/`)

  if (response.status === 404) {
    return []
  }

  if (!response.ok) {
    throw new Error('Failed to fetch assessments')
  }

  return response.json()
}

export const useAssessmentsByTopicGrade = (topic_id: string, grade_id: string) => {
  return useQuery({
    queryKey: ['assessments', topic_id, grade_id],
    queryFn: () => fetchAssessmentsByTopicGrade(topic_id, grade_id),
    enabled: !!topic_id && !!grade_id,
  })
}

// New: Fetch assessment details by ID
const fetchAssessmentDetails = async (
  topic_id: string,
  grade_id: string,
  assessment_id: string,
): Promise<Assessment> => {
  const response = await fetch(`${API_BASE_URL}/api/topics/${topic_id}/grades/${grade_id}/assessments/${assessment_id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch assessment details')
  }

  return response.json()
}

export const useAssessmentDetails = (
  topic_id: string | null,
  grade_id: string | null,
  assessment_id: string | null,
) => {
  return useQuery({
    queryKey: ['assessmentDetails', topic_id, grade_id, assessment_id],
    queryFn: () => fetchAssessmentDetails(topic_id!, grade_id!, assessment_id!),
    enabled: !!topic_id && !!grade_id && !!assessment_id,
  })
}

export function useStudentAssessmentEvaluation(
  studentId: number | string | undefined,
  assessmentId: number | string | undefined,
) {
  return useQuery({
    queryKey: ['student-evaluation', studentId, assessmentId],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/students/${studentId}/assessments/${assessmentId}/evaluation`,
      )
      if (!res.ok) throw new Error('Failed to fetch evaluation result')
      return res.json()
    },
    enabled: !!studentId && !!assessmentId,
  })
}
