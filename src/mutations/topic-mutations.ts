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

const createTopic = async ({ data, classroomId }: { data: CreateTopicInput; classroomId: string }): Promise<Topic> => {
  const response = await fetch(`${API_BASE_URL}/api/classrooms/${classroomId}/topics`, {
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
    mutationFn: ({ data, classroomId }: { data: CreateTopicInput; classroomId: string }) =>
      createTopic({ data, classroomId }),
    onSuccess: (_, { classroomId }) => {
      queryClient.invalidateQueries({ queryKey: ['topics', classroomId] })
    },
  })
}

export function useCreateWeeklyPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ topicId, classroomId }: { topicId: number; classroomId: string }) => {
      const res = await fetch(`${API_BASE_URL}/api/classrooms/${classroomId}/topics/${topicId}/weekly-plan`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
        },
      })
      if (!res.ok) throw new Error('Failed to create weekly plan')
      return res.json()
    },
    onSuccess: (_, { classroomId }) => {
      queryClient.invalidateQueries({ queryKey: ['topics', classroomId] })
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
      classroomId,
    }: {
      topicId: number
      dayNumber: number
      dayPlan: Record<string, any>
      classroomId: string
    }) => {
      const res = await fetch(
        `${API_BASE_URL}/api/classrooms/${classroomId}/topics/${topicId}/weekly-plan/days/${dayNumber}`,
        {
          method: 'PATCH',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ day_plan: dayPlan }),
        },
      )
      if (!res.ok) throw new Error('Failed to update day plan')
      return {
        success: true,
      }
    },
    onSuccess: (_, { topicId, classroomId }) => {
      console.log('Day plan updated')
      queryClient.invalidateQueries({ queryKey: ['topics', classroomId] })
      queryClient.invalidateQueries({ queryKey: ['topic', topicId] })
    },
  })
}
