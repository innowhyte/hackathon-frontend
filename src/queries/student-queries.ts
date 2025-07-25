import { useQuery } from '@tanstack/react-query'
import type { Student } from '../mutations/student-mutations'

// API functions
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const fetchStudentsByGrade = async (gradeId: number): Promise<Student[]> => {
  const response = await fetch(`${API_BASE_URL}/api/students/grade/${gradeId}`)

  if (!response.ok) {
    throw new Error('Failed to fetch students')
  }

  return response.json()
}

const fetchAllStudents = async (): Promise<Student[]> => {
  const response = await fetch(`${API_BASE_URL}/api/students`)

  if (!response.ok) {
    throw new Error('Failed to fetch students')
  }

  return response.json()
}

// New: Fetch student by ID
const fetchStudentById = async (studentId: number): Promise<Student> => {
  const response = await fetch(`${API_BASE_URL}/api/students/${studentId}`)

  if (!response.ok) {
    throw new Error('Failed to fetch student')
  }

  return response.json()
}

// Queries
export const useStudentsByGrade = (gradeId: number | null) => {
  return useQuery({
    queryKey: ['students', gradeId],
    queryFn: () => fetchStudentsByGrade(gradeId!),
    enabled: !!gradeId, // Only run query if gradeId is provided
  })
}

export const useAllStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: fetchAllStudents,
  })
}

// New: Hook to fetch student by ID
export const useStudentById = (studentId: number | null) => {
  return useQuery({
    queryKey: ['student', studentId],
    queryFn: () => fetchStudentById(studentId!),
    enabled: !!studentId,
  })
}

// Feedback API
export interface Feedback {
  id: string
  text: string
  date: string
}

const fetchStudentFeedback = async (studentId: number): Promise<Feedback[]> => {
  const response = await fetch(`${API_BASE_URL}/api/students/${studentId}/feedback`)
  if (!response.ok) {
    throw new Error('Failed to fetch feedback')
  }
  const data = await response.json()
  // Ensure each feedback has an id as string
  return (data.feedback || []).map((f: any) => ({
    id: String(f.id),
    text: f.text,
    date: f.date,
  }))
}

// New: Fetch feedback for all students in a grade
const fetchAllStudentsFeedback = async (studentIds: number[]): Promise<Record<number, Feedback[]>> => {
  if (studentIds.length === 0) return {}

  const promises = studentIds.map(async studentId => {
    try {
      const feedback = await fetchStudentFeedback(studentId)
      return { studentId, feedback }
    } catch (error) {
      console.error(`Failed to fetch feedback for student ${studentId}:`, error)
      return { studentId, feedback: [] }
    }
  })

  const results = await Promise.all(promises)
  return results.reduce(
    (acc, { studentId, feedback }) => {
      acc[studentId] = feedback
      return acc
    },
    {} as Record<number, Feedback[]>,
  )
}

export const useStudentFeedback = (studentId: number | null) => {
  return useQuery({
    queryKey: ['studentFeedback', studentId],
    queryFn: () => fetchStudentFeedback(studentId!),
    enabled: !!studentId,
  })
}

// New: Hook to get feedback for all students in a grade
export const useAllStudentsFeedback = (studentIds: number[]) => {
  return useQuery({
    queryKey: ['allStudentsFeedback', studentIds],
    queryFn: () => fetchAllStudentsFeedback(studentIds),
    enabled: studentIds.length > 0,
  })
}

// New: Combined hook for students with their feedback
export const useStudentsWithFeedback = (gradeId: number | null) => {
  const studentsQuery = useStudentsByGrade(gradeId)
  const studentIds = studentsQuery.data?.map(student => student.id) || []
  const feedbackQuery = useAllStudentsFeedback(studentIds)

  return {
    students: studentsQuery.data || [],
    feedback: feedbackQuery.data || {},
    isLoading: studentsQuery.isLoading || feedbackQuery.isLoading,
    error: studentsQuery.error || feedbackQuery.error,
    isStudentsLoading: studentsQuery.isLoading,
    isFeedbackLoading: feedbackQuery.isLoading,
    // Add refetch functions for manual refresh
    refetchStudents: studentsQuery.refetch,
    refetchFeedback: feedbackQuery.refetch,
  }
}

// Utility function to get feedback count for a student
export const getFeedbackCount = (studentId: number, feedbackData: Record<number, Feedback[]>): number => {
  return feedbackData[studentId]?.length || 0
}

// Student Report API
const fetchStudentReport = async (studentId: number) => {
  const response = await fetch(`${API_BASE_URL}/api/students/${studentId}/report`)
  if (!response.ok) {
    throw new Error('Failed to fetch student report')
  }
  return response.json()
}

export const useStudentReport = (studentId: number | null) => {
  return useQuery({
    queryKey: ['studentReport', studentId],
    queryFn: () => fetchStudentReport(studentId!),
    enabled: !!studentId, // Only run query if studentId is provided
  })
}
