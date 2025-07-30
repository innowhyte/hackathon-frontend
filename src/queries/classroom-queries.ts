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

const fetchLatestClassroom = async (): Promise<Classroom | null> => {
  const response = await fetch(`${API_BASE_URL}/api/classrooms`)
  if (!response.ok) {
    throw new Error('Failed to fetch classrooms')
  }
  const data = await response.json()
  if (!Array.isArray(data) || data.length === 0) return null
  return data[data.length - 1]
}

export const useLatestClassroom = () => {
  return useQuery({
    queryKey: ['latestClassroom'],
    queryFn: fetchLatestClassroom,
  })
}
