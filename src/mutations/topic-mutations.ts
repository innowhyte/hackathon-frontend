import { useMutation, useQueryClient } from '@tanstack/react-query'

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
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] })
    },
  })
}

export function useCreateWeeklyPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (topicId: number) => {
      const res = await fetch(`${API_BASE_URL}/api/topics/${topicId}/weekly-plan`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
        },
      })
      if (!res.ok) throw new Error('Failed to create weekly plan')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] })
    },
  })
}

export function useUpdateDayPlanMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      topicId,
      dayNumber,
      dayPlan,
    }: {
      topicId: number
      dayNumber: number
      dayPlan: Record<string, any>
    }) => {
      const res = await fetch(`http://localhost:8080/api/topics/${topicId}/weekly-plan/days/${dayNumber}`, {
        method: 'PATCH',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ day_plan: dayPlan }),
      })
      if (!res.ok) throw new Error('Failed to update day plan')
      return {
        success: true,
      }
    },
    onSuccess: (_, { topicId }) => {
      console.log('Day plan updated')
      queryClient.invalidateQueries({ queryKey: ['topics'] })
      queryClient.invalidateQueries({ queryKey: ['topic', topicId] })
    },
  })
}
