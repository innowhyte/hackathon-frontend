import { useMutation } from '@tanstack/react-query'

export interface LearningOutcomeInput {
  learning_outcomes: string
  grade_id: number
}

export interface CreateTopicInput {
  name: string
  learning_outcomes: LearningOutcomeInput[]
}

export interface Topic {
  id: number
  name: string
  weekly_plan: any
  activities: any
  whole_class_introduction_materials: any
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const createTopic = async (data: CreateTopicInput): Promise<Topic> => {
  const response = await fetch(`${API_BASE_URL}/api/topics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create topic')
  }

  return response.json()
}

export const useCreateTopic = () => {
  return useMutation({
    mutationFn: createTopic,
  })
}
