import { Button } from './ui/button'
import { UsersIcon, UserPlusIcon } from 'lucide-react'
import StudentCard from './student-card'

interface Student {
  id: number
  name: string
}

interface StudentsListProps {
  students: Student[]
  feedback: Record<number, any[]>
  selectedGrade: { id: number; name: string }
  isLoading: boolean
  isFeedbackLoading: boolean
  error: any
  onAddStudent: () => void
  onOpenFeedback: (student: Student) => void
  onOpenEdit: (student: Student) => void
  onRemoveStudent: (studentId: number) => void
  isRemoving?: boolean
  isAdding?: boolean
}

export default function StudentsList({
  students,
  feedback,
  selectedGrade,
  isLoading,
  isFeedbackLoading,
  error,
  onAddStudent,
  onOpenFeedback,
  onOpenEdit,
  onRemoveStudent,
  isRemoving = false,
  isAdding = false,
}: StudentsListProps) {
  const getFeedbackCount = (studentId: number) => {
    return feedback[studentId]?.length || 0
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
              <UsersIcon className="text-primary h-5 w-5" />
            </div>
            <div>
              <h2 className="text-foreground text-xl font-semibold">{selectedGrade.name}</h2>
            </div>
          </div>
          <Button
            disabled
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 rounded-xl px-6 font-medium disabled:opacity-50"
          >
            <UserPlusIcon className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>

        <div className="bg-card border-border rounded-xl border shadow-sm">
          <div className="p-8 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
              <UsersIcon className="text-muted-foreground h-6 w-6" />
            </div>
            <p className="text-muted-foreground">Loading students...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
              <UsersIcon className="text-primary h-5 w-5" />
            </div>
            <div>
              <h2 className="text-foreground text-xl font-semibold">{selectedGrade.name}</h2>
            </div>
          </div>
          <Button
            onClick={onAddStudent}
            disabled={isAdding}
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 rounded-xl px-6 font-medium disabled:opacity-50"
          >
            <UserPlusIcon className="mr-2 h-4 w-4" />
            {isAdding ? 'Adding...' : 'Add Student'}
          </Button>
        </div>

        <div className="bg-card border-border rounded-xl border shadow-sm">
          <div className="p-8 text-center">
            <div className="bg-destructive/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
              <UsersIcon className="text-destructive h-6 w-6" />
            </div>
            <p className="text-destructive">Failed to load students</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
            <UsersIcon className="text-primary h-5 w-5" />
          </div>
          <div>
            <h2 className="text-foreground text-xl font-semibold">{selectedGrade.name}</h2>
            <p className="text-muted-foreground text-sm">
              {students.length || 0} students
              {isFeedbackLoading && ' • Loading feedback...'}
            </p>
          </div>
        </div>
        <Button
          onClick={onAddStudent}
          disabled={isAdding}
          className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 rounded-xl px-6 font-medium disabled:opacity-50"
        >
          <UserPlusIcon className="mr-2 h-4 w-4" />
          {isAdding ? 'Adding...' : 'Add Student'}
        </Button>
      </div>

      <div className="bg-card border-border rounded-xl border shadow-sm">
        {students.length > 0 ? (
          <div className="divide-border divide-y">
            {students.map(student => (
              <StudentCard
                key={student.id}
                student={student}
                feedbackCount={getFeedbackCount(student.id)}
                onOpenFeedback={onOpenFeedback}
                onOpenEdit={onOpenEdit}
                onRemove={onRemoveStudent}
                isRemoving={isRemoving}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
              <UsersIcon className="text-muted-foreground h-6 w-6" />
            </div>
            <h3 className="text-foreground mb-2 text-lg font-medium">No students yet</h3>
            <p className="text-muted-foreground mb-4 text-sm">Start by adding students to this grade level</p>
            <Button
              onClick={onAddStudent}
              disabled={isAdding}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <UserPlusIcon className="mr-2 h-4 w-4" />
              {isAdding ? 'Adding...' : 'Add First Student'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
