import { useMutation, useQueryClient } from '@tanstack/react-query'

// Types
export interface Student {
  id: number
  name: string
  grade_id: number
  grade_name?: string // Added to match API response
}

export interface CreateStudentRequest {
  name: string
  grade_id: number
}

export interface UpdateStudentRequest {
  id: number
  name: string
  grade_id: number
}

// API functions
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const createStudent = async (data: CreateStudentRequest): Promise<Student> => {
  const response = await fetch(`${API_BASE_URL}/api/students/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create student')
  }

  return response.json()
}

const updateStudent = async (data: UpdateStudentRequest): Promise<Student> => {
  const response = await fetch(`${API_BASE_URL}/api/students/${data.id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to update student')
  }

  return response.json()
}

const deleteStudent = async (studentId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/students/${studentId}/`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete student')
  }
}

// Generate Report API
const generateStudentReport = async (studentId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/students/${studentId}/report`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to generate student report')
  }

  return response.json()
}

// Feedback API
export interface FeedbackInput {
  text: string
  date: string
}

const postStudentFeedback = async ({ studentId, feedback }: { studentId: number; feedback: FeedbackInput }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const response = await fetch(`${API_BASE_URL}/api/students/${studentId}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedback),
  })
  if (!response.ok) {
    throw new Error('Failed to post feedback')
  }
  return response.json()
}

// Mutations
export const useCreateStudent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createStudent,
    onSuccess: newStudent => {
      // Invalidate and refetch students for the specific grade
      queryClient.invalidateQueries({
        queryKey: ['students', newStudent.grade_id],
      })

      // Update the students cache for the specific grade
      queryClient.setQueryData(['students', newStudent.grade_id], (oldData: Student[] | undefined) => {
        if (!oldData) return [newStudent]
        return [...oldData, newStudent]
      })
    },
  })
}

export const useUpdateStudent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateStudent,
    onSuccess: updatedStudent => {
      // Invalidate and refetch students for the specific grade
      queryClient.invalidateQueries({
        queryKey: ['students', updatedStudent.grade_id],
      })

      // Update the students cache for the specific grade
      queryClient.setQueryData(['students', updatedStudent.grade_id], (oldData: Student[] | undefined) => {
        if (!oldData) return [updatedStudent]
        return oldData.map(student => (student.id === updatedStudent.id ? updatedStudent : student))
      })
    },
  })
}

export const useDeleteStudent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      // Invalidate all students queries since we don't know which grade the student belonged to
      queryClient.invalidateQueries({
        queryKey: ['students'],
      })
    },
  })
}

export const useGenerateStudentReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: generateStudentReport,
    onSuccess: (_data, studentId) => {
      // Invalidate the student report query to refetch the new report
      queryClient.invalidateQueries({
        queryKey: ['studentReport', studentId],
      })
    },
  })
}

export const usePostStudentFeedback = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: postStudentFeedback,
    onSuccess: (_data, variables) => {
      // Invalidate individual student feedback query
      queryClient.invalidateQueries({
        queryKey: ['studentFeedback', variables.studentId],
      })

      // Invalidate all students feedback queries (with any studentIds array)
      queryClient.invalidateQueries({
        queryKey: ['allStudentsFeedback'],
        exact: false,
      })

      // Also invalidate students queries to refresh the combined data
      queryClient.invalidateQueries({
        queryKey: ['students'],
        exact: false,
      })
    },
  })
}
