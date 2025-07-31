import { Building2Icon } from 'lucide-react'
import { Button } from './ui/button'

interface EmptyClassroomsStateProps {
  onCreateClassroom: () => void
}

export default function EmptyClassroomsState({ onCreateClassroom }: EmptyClassroomsStateProps) {
  return (
    <div className="py-12 text-center">
      <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
        <Building2Icon className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="text-foreground mb-2 text-xl font-semibold">No Classrooms Found</h3>
      <p className="text-muted-foreground mb-6">
        Create your first classroom to get started with managing students and materials
      </p>
      <Button onClick={onCreateClassroom} className="rounded-xl px-6 py-2 text-base font-medium">
        + Create Classroom
      </Button>
    </div>
  )
}
