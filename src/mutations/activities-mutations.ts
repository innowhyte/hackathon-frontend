import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Activity } from '../queries/activities-queries'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface SaveActivitiesInput {
  day_id: string
  grade_id: string
  topic_id: string
  modes_of_interaction: string // ID like 'peer', 'independent', 'teacher'
  modalities: string[] // Array of IDs like ['visual', 'auditory']
  activities: Activity[]
}

const saveActivities = async (data: SaveActivitiesInput): Promise<void> => {
  const activities = data.activities.map(activity => ({
    ...activity,
    modes_of_interaction: data.modes_of_interaction,
    modalities: data.modalities,
  }))

  const response = await fetch(
    `${API_BASE_URL}/api/days/${data.day_id}/grades/${data.grade_id}/topics/${data.topic_id}/activities`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        activities: activities,
      }),
    },
  )
  if (!response.ok) {
    throw new Error('Failed to save activities')
  }
}

export const useSaveActivities = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveActivities,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['activities', variables.day_id, variables.grade_id, variables.topic_id],
      })
    },
  })
}
