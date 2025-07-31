import { useNavigate } from 'react-router'
import { useTitle } from '../hooks/use-title'
import { useState, useEffect } from 'react'
import { useCreateOrUpdateClassroom } from '../mutations/classroom-mutations'
import { useAllClassrooms } from '../queries/classroom-queries'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import Loading from '@/components/loading'
import Header from '../components/header'
import BottomNav from '../components/bottom-nav'
import ClassroomSelector from '../components/classroom-selector'
import CreateClassroomDialog from '../components/modals/create-classroom-dialog'
import { useSearchParams } from 'react-router'

export default function Classrooms() {
  useTitle('Classrooms')
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const classroomIdParam = searchParams.get('classroomId')
  const { data: classrooms, isLoading: isLoadingClassrooms } = useAllClassrooms()
  const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(
    classroomIdParam ? parseInt(classroomIdParam) : null,
  )
  const [showCreateDialog, setShowCreateDialog] = useState(false)

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

  // Fetch latest classroom (keeping for potential future use)

  // Get selected classroom
  const selectedClassroom = classrooms?.find(c => c.id === selectedClassroomId)

  // Initialize selected classroom when classrooms data is loaded
  useEffect(() => {
    if (classrooms && classrooms.length > 0) {
      // Check if topicIdParam is present and valid
      const classroomIdFromUrl = classroomIdParam ? parseInt(classroomIdParam) : null
      const classroomExists = classroomIdFromUrl && classrooms.some(c => c.id === classroomIdFromUrl)
      if (classroomIdFromUrl && classroomExists) {
        setSelectedClassroomId(classroomIdFromUrl)
      } else if (selectedClassroomId === null) {
        setSelectedClassroomId(classrooms[0].id)
        setSearchParams({ classroomId: classrooms[0].id.toString() })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classrooms])

  // Sync selectedClassroomId with URL
  useEffect(() => {
    if (selectedClassroomId) {
      setSearchParams({ classroomId: selectedClassroomId.toString() })
    } else {
      setSearchParams({})
    }
  }, [selectedClassroomId, setSearchParams])

  // Pre-populate state from selected classroom
  useEffect(() => {
    if (selectedClassroom) {
      setGradeConfig({
        location: selectedClassroom.location || '',
        language: selectedClassroom.language || '',
      })
      setSelectedGrades(
        (selectedClassroom.grades || [])
          .map(g => {
            const gradeObj = grades.find(gr => gr.name === g.name)
            return gradeObj ? { gradeId: gradeObj.id, specialInstructions: g.special_instructions || '' } : null
          })
          .filter(Boolean) as { gradeId: number; specialInstructions: string }[],
      )
    }
  }, [selectedClassroom])

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
  // const handleInputChange = (gradeId: number, field: 'specialInstructions', value: string) => {
  //   setSelectedGrades(prev => prev.map(g => (g.gradeId === gradeId ? { ...g, [field]: value } : g)))
  // }

  // Handle config input changes
  const handleConfigChange = (field: 'location' | 'language', value: string) => {
    setGradeConfig(prev => ({ ...prev, [field]: value }))
  }

  // Validation: at least one grade, and config fields must be filled
  const allValid = selectedGrades.length > 0 && gradeConfig.location.trim() && gradeConfig.language.trim()

  // Prepare payload for API
  const getPayload = () => ({
    ...(selectedClassroom?.id ? { id: selectedClassroom.id } : {}),
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
          navigate(`/classrooms/${selectedClassroomId}/topics`)
        },
      })
    }
  }

  if (isLoadingClassrooms) {
    return <Loading message="Loading classrooms..." />
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Header title="Classrooms" onBack={() => navigate('/')} />
      <div className="px-4 py-3">
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Classrooms</h2>
            <Button onClick={() => setShowCreateDialog(true)} className="rounded-xl px-4 py-2 text-base font-medium">
              + Create Classroom
            </Button>
          </div>

          <ClassroomSelector
            selectedClassroomId={selectedClassroomId}
            onClassroomChange={id => setSelectedClassroomId(id)}
          />

          {isLoadingClassrooms && <div>Loading classrooms...</div>}
          {!isLoadingClassrooms && classrooms && classrooms.length === 0 && (
            <div className="text-muted-foreground py-8 text-center">
              No classrooms found. Please create a classroom.
            </div>
          )}

          {/* Selected Classroom Details */}
          {selectedClassroom && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Classroom Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Location</label>
                      <p className="text-base text-neutral-800">{selectedClassroom.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Language</label>
                      <p className="text-base text-neutral-800">{selectedClassroom.language}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Grades</label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedClassroom.grades.map(grade => (
                          <span
                            key={grade.id}
                            className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium"
                          >
                            {grade.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Edit Classroom Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Edit Classroom</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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

                    {/* Grade Selection Cards */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-600">Select Grades</label>
                      <div className="space-y-3">
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
                    </div>

                    {/* Input fields for each selected grade (special instructions only) in order of selection grade id */}
                    {/* {selectedGrades.length > 0 && (
                      <div className="space-y-3">
                        {selectedGrades
                          .sort((a, b) => a.gradeId - b.gradeId)
                          .map(g => {
                            const gradeName = grades.find(gr => gr.id === g.gradeId)?.name || `Grade ${g.gradeId}`
                            return (
                              <div key={g.gradeId}>
                                <label
                                  className="mb-1.5 block text-sm font-medium text-neutral-600"
                                  htmlFor={`instructions-${g.gradeId}`}
                                >
                                  {gradeName} Special Instructions (optional)
                                </label>
                                <textarea
                                  id={`instructions-${g.gradeId}`}
                                  className="focus:border-primary focus:ring-primary w-full rounded-lg border border-neutral-200 px-3 py-2 text-neutral-800 focus:ring-2 focus:outline-none"
                                  value={g.specialInstructions}
                                  onChange={e => handleInputChange(g.gradeId, 'specialInstructions', e.target.value)}
                                  rows={3}
                                />
                              </div>
                            )
                          })}
                      </div>
                    )} */}

                    {isError && (
                      <div className="text-center text-sm text-red-600">
                        {(error as Error)?.message || 'Failed to save classroom.'}
                      </div>
                    )}

                    <div className="pt-4">
                      <Button disabled={!allValid || isPending} onClick={handleContinue} size="xl" className="w-full">
                        <span className="text-base font-medium">{isPending ? 'Saving...' : 'Save Changes'}</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <CreateClassroomDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <BottomNav />
    </div>
  )
}
