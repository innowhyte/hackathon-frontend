import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface ClassroomGrade {
  name: string
  special_instructions?: string
}

export interface CreateOrUpdateClassroomRequest {
  id?: number
  location: string
  language: string
  grades: ClassroomGrade[]
}

export interface Classroom {
  id: number
  location: string
  language: string
  grades: ClassroomGrade[]
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const createOrUpdateClassroom = async (data: CreateOrUpdateClassroomRequest): Promise<Classroom> => {
  const { id, ...rest } = data
  const url = id ? `${API_BASE_URL}/api/classrooms/${id}` : `${API_BASE_URL}/api/classrooms`
  const method = id ? 'PUT' : 'POST'
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rest),
  })

  if (!response.ok) {
    throw new Error(id ? 'Failed to update classroom' : 'Failed to create classroom')
  }

  return response.json()
}

export const useCreateOrUpdateClassroom = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createOrUpdateClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['latestClassroom'] })
      queryClient.invalidateQueries({ queryKey: ['allClassrooms'] })
    },
  })
}
