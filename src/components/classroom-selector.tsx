import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useAllClassrooms } from '../queries/classroom-queries'

interface ClassroomSelectorProps {
  selectedClassroomId: number | null
  onClassroomChange: (classroomId: number) => void
}

export default function ClassroomSelector({ selectedClassroomId, onClassroomChange }: ClassroomSelectorProps) {
  const { data: classrooms, isLoading, error } = useAllClassrooms()

  return (
    <div className="mb-4">
      <Select
        value={selectedClassroomId?.toString() || ''}
        onValueChange={value => onClassroomChange(Number(value))}
        disabled={isLoading}
      >
        <SelectTrigger className="border-border focus:border-primary h-14! w-full rounded-xl border-2 text-base transition-colors focus:ring-0 focus:outline-none disabled:opacity-50">
          <SelectValue placeholder={isLoading ? 'Loading classrooms...' : 'Select a classroom'} />
        </SelectTrigger>
        <SelectContent>
          {classrooms && classrooms.length > 0 ? (
            classrooms.map(classroom => (
              <SelectItem key={classroom.id} value={classroom.id.toString()} className="h-10!">
                {classroom.name}
              </SelectItem>
            ))
          ) : (
            <span className="block px-4 py-2 text-sm text-neutral-500">
              {isLoading ? 'Loading classrooms...' : error ? 'Error loading classrooms' : 'No classrooms found.'}
            </span>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
