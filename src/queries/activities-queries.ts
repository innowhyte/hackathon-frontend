import { useQuery } from '@tanstack/react-query'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface Activity {
  name: string
  description: string
  materials_required: string[]
  purpose: string
  modes_of_interaction: string
  modalities: string[]
}

export interface Activities {
  id: string
  day_id: string
  grade_id: string
  topic_id: string
  activities: Activity[]
}

const fetchActivitiesByDayGradeTopic = async (
  day_id: string,
  grade_id: string,
  topic_id: string,
): Promise<Activities | null> => {
  const response = await fetch(`${API_BASE_URL}/api/days/${day_id}/grades/${grade_id}/topics/${topic_id}/activities`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to fetch activities')
  }

  return response.json()
}

export const useActivitiesByDayGradeTopic = (day_id: string, grade_id: string, topic_id: string) => {
  return useQuery({
    queryKey: ['activities', day_id, grade_id, topic_id],
    queryFn: () => fetchActivitiesByDayGradeTopic(day_id, grade_id, topic_id),
    enabled: !!day_id && !!grade_id && !!topic_id,
  })
}
