import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface Grade {
  id: number
  name: string
}

interface GradeSelectorProps {
  selectedGrade: Grade | null
  grades: Grade[]
  onGradeChange: (gradeId: number) => void
  isLoading?: boolean
}

export default function GradeSelector({ selectedGrade, grades, onGradeChange, isLoading }: GradeSelectorProps) {
  return (
    <div className="mb-8">
      <label className="text-foreground mb-3 block text-sm font-medium">Select Grade</label>
      <Select
        value={selectedGrade?.id.toString()}
        onValueChange={value => onGradeChange(Number(value))}
        disabled={isLoading}
      >
        <SelectTrigger className="border-border focus:border-primary h-14! w-full rounded-xl border-2 text-base transition-colors focus:ring-0 focus:outline-none disabled:opacity-50">
          <SelectValue placeholder={isLoading ? 'Loading grades...' : 'Select a grade'} />
        </SelectTrigger>
        <SelectContent>
          {grades && grades.length > 0 ? (
            grades.map(grade => (
              <SelectItem key={grade.id} value={grade.id.toString()} className="h-10!">
                {grade.name}
              </SelectItem>
            ))
          ) : (
            <span className="block px-4 py-2 text-sm text-neutral-500">
              {isLoading ? 'Loading grades...' : 'No grades found. Please set up grades first.'}
            </span>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
