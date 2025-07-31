import { useQuery } from '@tanstack/react-query'

export interface ClassroomGrade {
  id: number
  name: string
  special_instructions?: string
}

export interface Classroom {
  id: number
  location: string
  language: string
  grades: ClassroomGrade[]
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const fetchClassroomById = async (classroomId: string | undefined): Promise<Classroom | null> => {
  if (!classroomId) {
    return null
  }
  const response = await fetch(`${API_BASE_URL}/api/classrooms/${classroomId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch classrooms')
  }
  return response.json()
}

const fetchAllClassrooms = async (): Promise<Classroom[]> => {
  const response = await fetch(`${API_BASE_URL}/api/classrooms`)
  if (!response.ok) {
    throw new Error('Failed to fetch classrooms')
  }
  const data = await response.json()
  return Array.isArray(data) ? data : []
}

export const useClassroomById = (classroomId: string | undefined) => {
  return useQuery({
    queryKey: ['classroomById', classroomId],
    queryFn: () => fetchClassroomById(classroomId),
    enabled: !!classroomId,
  })
}

export const useAllClassrooms = () => {
  return useQuery({
    queryKey: ['allClassrooms'],
    queryFn: fetchAllClassrooms,
  })
}
