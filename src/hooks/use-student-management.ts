import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'
import { useStudentsWithFeedback, getFeedbackCount } from '../queries/student-queries'
import {
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  usePostStudentFeedback,
} from '../mutations/student-mutations'
import { useLatestClassroom } from '../queries/classroom-queries'

interface Student {
  id: number
  name: string
}

interface Grade {
  id: number
  name: string
}

export const useStudentManagement = (initialGradeId?: number) => {
  const navigate = useNavigate()

  // Grade selection state
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null)

  // Modal states
  const [showAddStudentModal, setShowAddStudentModal] = useState(false)
  const [showEditStudentModal, setShowEditStudentModal] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  // Selected student states
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | null>(null)
  const [selectedStudentForFeedback, setSelectedStudentForFeedback] = useState<Student | null>(null)

  // API queries and mutations
  const { data: latestClassroom, isLoading: isLoadingClassroom } = useLatestClassroom()

  // Initialize selected grade when classroom data is loaded and initial grade ID is provided
  useEffect(() => {
    if (latestClassroom && initialGradeId && !selectedGrade) {
      const grade = latestClassroom.grades.find(g => g.id === initialGradeId)
      if (grade) {
        setSelectedGrade({ id: grade.id, name: grade.name })
      }
    }
  }, [latestClassroom, initialGradeId, selectedGrade])

  const {
    students,
    feedback,
    isLoading,
    error,
    isStudentsLoading,
    isFeedbackLoading,
    refetchStudents,
    refetchFeedback,
  } = useStudentsWithFeedback(selectedGrade?.id || null)

  const createStudentMutation = useCreateStudent()
  const updateStudentMutation = useUpdateStudent()
  const deleteStudentMutation = useDeleteStudent()
  const postFeedbackMutation = usePostStudentFeedback()

  // Grade selection handlers
  const handleGradeChange = (gradeId: number) => {
    const grade = latestClassroom?.grades.find(g => g.id === gradeId)
    if (grade) {
      setSelectedGrade({ id: grade.id, name: grade.name })
    }
  }

  // Student CRUD handlers
  const handleAddStudent = (studentName: string) => {
    if (selectedGrade) {
      createStudentMutation.mutate(
        {
          name: studentName,
          grade_id: selectedGrade.id,
        },
        {
          onSuccess: () => {
            toast.success('Student added successfully')
            setShowAddStudentModal(false)
          },
          onError: () => {
            toast.error('Failed to add student')
          },
        },
      )
    }
  }

  const handleOpenEditModal = (student: Student) => {
    setSelectedStudentForEdit(student)
    setShowEditStudentModal(true)
  }

  const handleSaveEdit = (studentId: number, newName: string) => {
    if (selectedGrade) {
      updateStudentMutation.mutate(
        {
          id: studentId,
          name: newName,
          grade_id: selectedGrade.id,
        },
        {
          onSuccess: () => {
            toast.success('Student updated successfully')
            setShowEditStudentModal(false)
          },
          onError: () => {
            toast.error('Failed to update student')
          },
        },
      )
    }
  }

  const handleRemoveStudent = (studentId: number) => {
    deleteStudentMutation.mutate(studentId, {
      onSuccess: () => {
        toast.success('Student removed successfully')
      },
      onError: () => {
        toast.error('Failed to remove student')
      },
    })
  }

  // Feedback handlers
  const handleOpenFeedbackModal = (student: Student) => {
    setSelectedStudentForFeedback(student)
    setShowFeedbackModal(true)
  }

  const handleSaveFeedback = (studentId: number, feedbackData: { text: string; date: string }) => {
    postFeedbackMutation.mutate(
      { studentId, feedback: feedbackData },
      {
        onSuccess: () => {
          toast.success('Feedback added successfully')
          // Manually refetch feedback data to ensure UI updates
          refetchFeedback()
        },
        onError: () => {
          toast.error('Failed to add feedback')
        },
      },
    )
  }

  const handleDeleteFeedback = () => {
    // TODO: Implement when API supports it
  }

  // Utility functions
  const getStudentFeedbackCount = (studentId: number) => {
    return getFeedbackCount(studentId, feedback)
  }

  const getStudentFeedback = (studentId: number) => {
    return feedback[studentId] || []
  }

  return {
    // State
    selectedGrade,
    showAddStudentModal,
    showEditStudentModal,
    showFeedbackModal,
    selectedStudentForEdit,
    selectedStudentForFeedback,

    // Data
    latestClassroom,
    students,
    feedback,
    isLoading,
    error,
    isStudentsLoading,
    isFeedbackLoading,
    isLoadingClassroom,

    // Mutations
    createStudentMutation,
    updateStudentMutation,
    deleteStudentMutation,
    postFeedbackMutation,

    // Handlers
    handleGradeChange,
    handleAddStudent,
    handleOpenEditModal,
    handleSaveEdit,
    handleRemoveStudent,
    handleOpenFeedbackModal,
    handleSaveFeedback,
    handleDeleteFeedback,

    // Modal setters
    setShowAddStudentModal,
    setShowEditStudentModal,
    setShowFeedbackModal,

    // Utility functions
    getStudentFeedbackCount,
    getStudentFeedback,

    // Refetch functions
    refetchStudents,
    refetchFeedback,

    // Navigation
    navigate,
  }
}
