import { useNavigate } from 'react-router'
import { useTitle } from '../hooks/use-title'
import { useState, useEffect } from 'react'
import { useCreateOrUpdateClassroom } from '../mutations/classroom-mutations'
import { useLatestClassroom } from '../queries/classroom-queries'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function GradeSelection() {
  useTitle('Grade Selection')
  const navigate = useNavigate()

  // Static grades list (from context previously)
  const grades = [
    { id: 1, name: 'Grade 1' },
    { id: 2, name: 'Grade 2' },
    { id: 3, name: 'Grade 3' },
    { id: 4, name: 'Grade 4' },
    { id: 5, name: 'Grade 5' },
  ]

  // Local state for grade selection and config
  const [selectedGrades, setSelectedGrades] = useState<
    {
      gradeId: number
      specialInstructions: string
    }[]
  >([])
  const [gradeConfig, setGradeConfig] = useState({ location: '', language: '' })

  // Fetch latest classroom
  const { data: latestClassroom, isLoading: isLoadingClassroom } = useLatestClassroom()

  // Pre-populate state from latest classroom
  useEffect(() => {
    if (latestClassroom) {
      setGradeConfig({
        location: latestClassroom.location || '',
        language: latestClassroom.language || '',
      })
      setSelectedGrades(
        (latestClassroom.grades || [])
          .map(g => {
            const gradeObj = grades.find(gr => gr.name === g.name)
            return gradeObj ? { gradeId: gradeObj.id, specialInstructions: g.special_instructions || '' } : null
          })
          .filter(Boolean) as { gradeId: number; specialInstructions: string }[],
      )
    }
  }, [latestClassroom])

  // Mutation for creating/updating classroom
  const { mutate: createOrUpdateClassroom, isPending, isError, error } = useCreateOrUpdateClassroom()

  // Helper to check if a grade is selected
  const isGradeSelected = (gradeId: number) => selectedGrades.some(g => g.gradeId === gradeId)

  // Select or deselect a grade
  const handleGradeSelect = (gradeId: number) => {
    setSelectedGrades(prev => {
      if (prev.some(g => g.gradeId === gradeId)) {
        return prev.filter(g => g.gradeId !== gradeId)
      } else {
        return [...prev, { gradeId, specialInstructions: '' }]
      }
    })
  }

  // Handle input changes for a selected grade
  const handleInputChange = (gradeId: number, field: 'specialInstructions', value: string) => {
    setSelectedGrades(prev => prev.map(g => (g.gradeId === gradeId ? { ...g, [field]: value } : g)))
  }

  // Handle config input changes
  const handleConfigChange = (field: 'location' | 'language', value: string) => {
    setGradeConfig(prev => ({ ...prev, [field]: value }))
  }

  // Validation: at least one grade, and config fields must be filled
  const allValid = selectedGrades.length > 0 && gradeConfig.location.trim() && gradeConfig.language.trim()

  // Prepare payload for API
  const getPayload = () => ({
    ...(latestClassroom?.id ? { id: latestClassroom.id } : {}),
    location: gradeConfig.location,
    language: gradeConfig.language,
    grades: selectedGrades.map(g => ({
      name: grades.find(gr => gr.id === g.gradeId)?.name || `Grade ${g.gradeId}`,
      special_instructions: g.specialInstructions,
    })),
  })

  const handleContinue = () => {
    if (allValid) {
      createOrUpdateClassroom(getPayload(), {
        onSuccess: () => {
          navigate('/setup')
        },
      })
    }
  }

  if (isLoadingClassroom) {
    return <div>Loading previous selection...</div>
  }

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

        {/* Input fields for config (location, language) */}
        <Card className="mb-3">
          <CardHeader>
            <CardTitle>General Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-600" htmlFor="location">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  type="text"
                  required
                  className="focus:border-primary focus:ring-primary w-full rounded-lg border border-neutral-200 px-3 py-2 text-neutral-800 focus:ring-2 focus:outline-none"
                  value={gradeConfig.location}
                  onChange={e => handleConfigChange('location', e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-600" htmlFor="language">
                  Language <span className="text-red-500">*</span>
                </label>
                <input
                  id="language"
                  type="text"
                  required
                  className="focus:border-primary focus:ring-primary w-full rounded-lg border border-neutral-200 px-3 py-2 text-neutral-800 focus:ring-2 focus:outline-none"
                  value={gradeConfig.language}
                  onChange={e => handleConfigChange('language', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input fields for each selected grade (special instructions only) in order of selection grade id */}
        {selectedGrades.length > 0 && (
          <div className="space-y-3">
            {selectedGrades
              .sort((a, b) => a.gradeId - b.gradeId)
              .map(g => {
                const gradeName = grades.find(gr => gr.id === g.gradeId)?.name || `Grade ${g.gradeId}`
                return (
                  <Card key={g.gradeId} className="mb-3">
                    <CardHeader>
                      <CardTitle>{gradeName} Special Instructions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <label
                          className="mb-1.5 block text-sm font-medium text-neutral-600"
                          htmlFor={`instructions-${g.gradeId}`}
                        >
                          Special Instructions (optional)
                        </label>
                        <textarea
                          id={`instructions-${g.gradeId}`}
                          className="focus:border-primary focus:ring-primary w-full rounded-lg border border-neutral-200 px-3 py-2 text-neutral-800 focus:ring-2 focus:outline-none"
                          value={g.specialInstructions}
                          onChange={e => handleInputChange(g.gradeId, 'specialInstructions', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        )}

        {isError && (
          <div className="mb-4 text-center text-sm text-red-600">
            {(error as Error)?.message || 'Failed to save classroom.'}
          </div>
        )}

        <div className="mt-6">
          <Button disabled={!allValid || isPending} onClick={handleContinue} size="xl" className="w-full">
            <span className="text-base font-medium">{isPending ? 'Saving...' : 'Continue'}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
