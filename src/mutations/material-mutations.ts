import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const deleteMaterial = async ({ topicId, materialId }: { topicId: number; materialId: number }) => {
  const response = await fetch(`${API_BASE_URL}/api/topics/${topicId}/teaching-materials/${materialId}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete material')
  }
  return true
}

const addMaterial = async ({ topicId, file, link }: { topicId: number; file?: File; link?: string }) => {
  const formData = new FormData()
  if (file) {
    formData.append('image', file)
  }
  if (link) {
    formData.append('link', link)
  }

  const response = await fetch(`${API_BASE_URL}/api/topics/${topicId}/teaching-materials/`, {
    method: 'POST',
    body: formData,
  })
  if (!response.ok) {
    throw new Error('Failed to add material')
  }
  return response.json()
}

export const useDeleteMaterialMutation = (topicId: number | null) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ materialId }: { materialId: number }) => {
      if (!topicId) throw new Error('No topicId provided')
      return deleteMaterial({ topicId, materialId })
    },
    onSuccess: () => {
      if (topicId) {
        queryClient.invalidateQueries({ queryKey: ['topic-materials', topicId] })
      }
    },
  })
}

export const useAddMaterialMutation = (topicId: number | null) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ file, link }: { file?: File; link?: string }) => {
      if (!topicId) throw new Error('No topicId provided')
      if (!file && !link) throw new Error('Either file or link must be provided')
      return addMaterial({ topicId, file, link })
    },
    onSuccess: () => {
      if (topicId) {
        queryClient.invalidateQueries({ queryKey: ['topic-materials', topicId] })
      }
    },
  })
}
