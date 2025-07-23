import { Button } from './ui/button'
import { MessageSquareIcon, EditIcon, Trash2Icon } from 'lucide-react'

interface Student {
  id: number
  name: string
}

interface StudentCardProps {
  student: Student
  feedbackCount: number
  onOpenFeedback: (student: Student) => void
  onOpenEdit: (student: Student) => void
  onRemove: (studentId: number) => void
  isRemoving?: boolean
}

export default function StudentCard({
  student,
  feedbackCount,
  onOpenFeedback,
  onOpenEdit,
  onRemove,
  isRemoving = false,
}: StudentCardProps) {
  return (
    <div className="hover:bg-muted/50 flex items-center justify-between p-4 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium">
          {student.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-foreground font-medium">{student.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => onOpenFeedback(student)}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary hover:bg-primary/10 border-border hover:border-primary relative h-8 w-8 rounded-lg border p-0 transition-colors"
          title="Add Feedback"
        >
          <MessageSquareIcon className="h-4 w-4" />
          {feedbackCount > 0 && (
            <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs font-medium">
              {feedbackCount}
            </span>
          )}
        </Button>
        <Button
          onClick={() => onOpenEdit(student)}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary hover:bg-primary/10 border-border hover:border-primary h-8 w-8 rounded-lg border p-0 transition-colors"
          title="Edit Student"
        >
          <EditIcon className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => onRemove(student.id)}
          variant="ghost"
          size="sm"
          disabled={isRemoving}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-border hover:border-destructive h-8 w-8 rounded-lg border p-0 transition-colors disabled:opacity-50"
          title="Remove Student"
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
