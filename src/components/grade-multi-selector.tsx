import MultipleSelector from './ui/multiselect'
import type { Option } from './ui/multiselect'

interface Grade {
  id: number
  name: string
}

interface GradeMultiSelectorProps {
  selectedGrades: Grade[]
  grades: Grade[]
  onGradeChange: (grades: Grade[]) => void
  isLoading?: boolean
  disabled?: boolean
}

export default function GradeMultiSelector({
  selectedGrades,
  grades,
  onGradeChange,
  isLoading = false,
  disabled = false,
}: GradeMultiSelectorProps) {
  // Convert grades to Option format for MultipleSelector
  const gradeOptions: Option[] = grades.map(grade => ({
    value: grade.id.toString(),
    label: grade.name,
  }))

  // Convert selected grades to Option format
  const selectedOptions: Option[] = selectedGrades.map(grade => ({
    value: grade.id.toString(),
    label: grade.name,
  }))

  const handleChange = (options: Option[]) => {
    // Convert back to Grade format
    const selectedGradeIds = options.map(option => parseInt(option.value))
    const newSelectedGrades = grades.filter(grade => selectedGradeIds.includes(grade.id))
    onGradeChange(newSelectedGrades)
  }

  return (
    <div className="mb-4">
      <label className="text-foreground mb-3 block text-sm font-medium">Select Grades</label>
      <MultipleSelector
        value={selectedOptions}
        defaultOptions={gradeOptions}
        onChange={handleChange}
        placeholder={isLoading ? 'Loading grades...' : 'Select grades'}
        disabled={disabled || isLoading}
        emptyIndicator={
          <div className="py-4 text-center">
            <p className="text-muted-foreground text-sm">No grades available</p>
          </div>
        }
        className="w-full"
      />
    </div>
  )
}
