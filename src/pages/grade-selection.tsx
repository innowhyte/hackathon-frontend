import { useNavigate } from 'react-router'
import { useContext } from 'react'
import { AppContext } from '../context/app-context'
import { Button } from '../components/ui/button'

export default function GradeSelection() {
  const context = useContext(AppContext)
  const navigate = useNavigate()

  if (!context) {
    return <div>Loading...</div>
  }

  const { selectedGrades, setSelectedGrades, grades } = context

  const handleGradeSelect = (gradeId: number) => {
    setSelectedGrades((prev: number[]) => {
      if (prev.includes(gradeId)) {
        return prev.filter(id => id !== gradeId)
      } else {
        return [...prev, gradeId]
      }
    })
  }

  const handleContinue = () => {
    if (selectedGrades.length > 0) {
      navigate('/setup')
    }
  }
  const isGradeSelected = (gradeId: number) => selectedGrades.includes(gradeId)

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* App Title */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-medium text-black">Sahayak</h1>
          <p className="text-lg font-normal text-black">Teaching Assistant</p>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="mb-2 text-xl font-semibold text-black">Select all grade levels that apply</h2>
        </div>

        {/* Grade Selection Cards */}
        <div className="mb-6 space-y-3">
          {grades.map(grade => (
            <Button
              key={grade.id}
              onClick={() => handleGradeSelect(grade.id)}
              variant={isGradeSelected(grade.id) ? 'default' : 'outline'}
              size="lg"
              className={`shadow-elevation-1 hover:shadow-elevation-2 h-auto w-full rounded-3xl p-4 text-left transition-all duration-300 ${
                isGradeSelected(grade.id)
                  ? 'bg-secondary border-primary border-2 text-black'
                  : 'border-secondary hover:bg-secondary/50 bg-background border-2 text-black'
              }`}
            >
              <div className="relative flex w-full items-center">
                <span className="flex-1 text-center">{grade.name}</span>
                {isGradeSelected(grade.id) && (
                  <div className="bg-primary absolute right-0 flex h-6 w-6 items-center justify-center rounded-full">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </Button>
          ))}
        </div>

        {/* Selection Summary */}
        {selectedGrades.length > 0 && (
          <div className="mb-6 text-center">
            <p className="bg-neutral-96 inline-block rounded-full px-4 py-2 text-sm font-medium text-neutral-50">
              {selectedGrades.length} grade{selectedGrades.length > 1 ? 's' : ''} selected
            </p>
          </div>
        )}

        <div className="mt-8">
          <Button disabled={selectedGrades.length === 0} onClick={handleContinue} size="xl" className="w-full">
            <span className="text-base font-medium">Continue</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
