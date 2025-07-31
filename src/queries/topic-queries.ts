import { useQuery } from '@tanstack/react-query'

export interface Topic {
  id: number
  name: string
  weekly_plan: any
  activities: any
  whole_class_introduction_materials: any
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const fetchAllTopics = async (classroomId: string | undefined): Promise<Topic[]> => {
  if (!classroomId) {
    return []
  }
  const response = await fetch(`${API_BASE_URL}/api/classrooms/${classroomId}/topics`)

  if (!response.ok) {
    throw new Error('Failed to fetch topics')
  }

  return response.json()
}

export const useAllTopics = (classroomId: string | undefined) => {
  return useQuery({
    queryKey: ['topics', classroomId],
    queryFn: () => fetchAllTopics(classroomId),
    enabled: !!classroomId,
  })
}
