import { useNavigate, useParams, useSearchParams } from 'react-router'
import { useTitle } from '../hooks/use-title'
import { useState, useEffect } from 'react'
import Header from '../components/header'
import { Button } from '../components/ui/button'
import AIHelpDialog from '../components/modals/ai-help-dialog'
import { useGradeActivitiesGeneration } from '../hooks/use-grade-activities'
import { useActivitiesByDayGradeTopic, type Activity } from '../queries/activities-queries'
import { useSaveActivities } from '../mutations/activities-mutations'
import { toast } from 'sonner'
import { Loader2, Send, Save } from 'lucide-react'
import { Badge } from '../components/ui/badge'

const modeOfInteractionOptions = [
  { id: 'independent', label: 'Work independently' },
  { id: 'peer', label: 'Work with each other' },
  { id: 'teacher', label: 'Work with the teacher' },
]

const modalityOptions = [
  { id: 'visual', label: 'Visual' },
  { id: 'auditory', label: 'Auditory' },
  { id: 'kinesthetic', label: 'Activity based' },
  { id: 'paper', label: 'Paper/Slate based' },
]

export default function GradeActivities() {
  const { day, gradeId, classroomId } = useParams<{ day: string; gradeId: string; classroomId: string }>()
  const [searchParams] = useSearchParams()
  const topicIdParam = searchParams.get('topicId')
  const topicId = topicIdParam ? parseInt(topicIdParam) : null
  useTitle(`Day ${day} | Activities`)
  const navigate = useNavigate()

  // Activities generation hook
  const { isGenerating, progress, generateActivities, reset } = useGradeActivitiesGeneration()

  // Activities query and mutation
  const { data: fetchedActivities, isLoading: isActivitiesLoading } = useActivitiesByDayGradeTopic(
    day || '',
    gradeId || '',
    topicId?.toString() || '',
  )
  const saveActivitiesMutation = useSaveActivities()

  // State for activities generation
  const [generatedActivities, setGeneratedActivities] = useState<Activity[]>([])
  const [teacher_requirements, setTeacherRequirements] = useState('')
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [modalities, setModalities] = useState<string[]>([])
  const [modes_of_interaction, setModesOfInteraction] = useState<string>('')
  const [showAIHelpDialog, setShowAIHelpDialog] = useState(false)

  // Separate effect for cleanup when no data
  useEffect(() => {
    if (!fetchedActivities) {
      setModalities([])
      setModesOfInteraction('')
      setGeneratedActivities([])
      setTeacherRequirements('')
      setCarouselIndex(0)
      reset()
    }
  }, [fetchedActivities, reset])

  // Reset carousel index when activities change
  useEffect(() => {
    setCarouselIndex(0)
  }, [generatedActivities, fetchedActivities])

  const handleModeSelect = (modeId: string) => {
    setModesOfInteraction(modeId)
  }

  const handleModalityToggle = (modalityId: string) => {
    setModalities(prev => {
      const current = prev || []
      const newModalities = current.includes(modalityId)
        ? current.filter((id: string) => id !== modalityId)
        : [...current, modalityId]
      return newModalities
    })
  }

  // Get mode label for API
  const selectedMode = modeOfInteractionOptions.find(option => option.id === modes_of_interaction)
  const modes_of_interaction_label = selectedMode?.label || ''

  // Get modality labels for API
  const modalitiesForApi = (modalities || []).map(modalityId => {
    const modality = modalityOptions.find(option => option.id === modalityId)
    return modality?.label || modalityId
  })

  const handleGenerateActivities = async () => {
    // Generate activities
    await generateActivities({
      previous_activities:
        generatedActivities?.length > 0
          ? generatedActivities
          : fetchedActivities?.activities && fetchedActivities?.activities.length > 0
            ? fetchedActivities?.activities
            : null,
      day_id: day as string,
      grade_id: gradeId as string,
      topic_id: topicId?.toString() || '',
      modes_of_interaction: modes_of_interaction_label,
      modalities: modalitiesForApi,
      teacher_requirements,
      onActivitiesGenerated: (activitiesData: Activity[]) => {
        setGeneratedActivities(activitiesData)
        setCarouselIndex(0)
        setTeacherRequirements('')
      },
      onError: errorMessage => {
        console.error('Error:', errorMessage)
        toast.error('Failed to generate activities')
      },
    })
  }

  const handleSaveToDatabase = () => {
    if (!generatedActivities.length) return
    saveActivitiesMutation.mutate(
      {
        day_id: day as string,
        grade_id: gradeId as string,
        topic_id: topicId?.toString() || '',
        modes_of_interaction: modes_of_interaction,
        modalities: modalities,
        activities: generatedActivities,
      },
      {
        onSuccess: () => {
          toast.success('Activities saved!')
        },
        onError: () => {
          toast.error('Failed to save activities')
        },
      },
    )
  }

  const handlePrevious = () => {
    const activities = generatedActivities.length > 0 ? generatedActivities : fetchedActivities?.activities || []
    setCarouselIndex((carouselIndex - 1 + activities.length) % activities.length)
  }

  const handleNext = () => {
    const activities = generatedActivities.length > 0 ? generatedActivities : fetchedActivities?.activities || []
    setCarouselIndex((carouselIndex + 1) % activities.length)
  }

  return (
    <div className="bg-background min-h-screen">
      <Header
        title={`Day ${day} Activities`}
        onBack={() => {
          if (classroomId) {
            if (topicId) {
              navigate(`/classrooms/${classroomId}/day/${day}?topicId=${topicId}`)
            } else {
              navigate(`/classrooms/${classroomId}/day/${day}`)
            }
          } else {
            if (topicId) {
              navigate(`/day/${day}?topicId=${topicId}`)
            } else {
              navigate(`/day/${day}`)
            }
          }
        }}
      />
      <div className="mb-4 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Mode of Interaction */}
          <div className="mb-8">
            <h3 className="mb-3 text-base font-medium text-neutral-800">Mode of Interaction</h3>
            <div className="flex flex-wrap gap-3">
              {modeOfInteractionOptions.map(option => {
                const selected = modes_of_interaction === option.id
                return (
                  <Button
                    key={option.id}
                    onClick={() => handleModeSelect(option.id)}
                    variant={selected ? 'default' : 'outline'}
                    size="sm"
                    className={`flex items-center gap-2 rounded-xl border-2 px-5 py-2 text-base font-medium transition-all duration-200 ${selected ? 'bg-primary border-primary text-primary-foreground' : 'text-neutral-30 border-neutral-80 hover:border-primary hover:text-primary bg-white'}`}
                    style={{ minWidth: 'fit-content' }}
                  >
                    {selected && (
                      <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        />
                      </svg>
                    )}
                    {option.label}
                  </Button>
                )
              })}
            </div>
          </div>
          {/* Modality */}
          <div className="mb-8">
            <h3 className="mb-3 text-base font-medium text-neutral-800">
              Modality <span className="text-xs text-neutral-500">(Select all that apply)</span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {modalityOptions.map(option => {
                const selected = modalities.includes(option.id)
                return (
                  <Button
                    key={option.id}
                    onClick={() => handleModalityToggle(option.id)}
                    variant={selected ? 'secondary' : 'outline'}
                    size="sm"
                    className={`flex items-center gap-2 rounded-xl border-2 px-5 py-2 text-base font-medium transition-all duration-200 ${selected ? 'bg-secondary-90 text-secondary-40 border-secondary-40' : 'text-neutral-30 border-neutral-80 hover:border-secondary-40 hover:text-secondary-40 bg-white'}`}
                    style={{ minWidth: 'fit-content' }}
                  >
                    {selected && (
                      <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        />
                      </svg>
                    )}
                    {option.label}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Activities Display */}
          <div className="mb-6">
            {isActivitiesLoading ? (
              <div className="bg-muted rounded-xl p-4 text-center text-sm">Loading activities...</div>
            ) : generatedActivities.length > 0 ? (
              <div className="bg-muted rounded-xl p-4">
                <h4 className="text-foreground mb-3 flex items-center text-lg font-medium">
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Generated Activities
                </h4>
                <div className="relative w-full">
                  <div className="mb-6 min-h-[180px] rounded-2xl bg-white/90 p-6 shadow-lg">
                    <h4 className="mb-4 text-xl font-semibold text-neutral-800">
                      {generatedActivities[carouselIndex]?.name}
                    </h4>
                    <div className="space-y-4">
                      {generatedActivities[carouselIndex]?.purpose && (
                        <div>
                          <h5 className="mb-2 text-sm font-semibold text-neutral-700">Purpose</h5>
                          <p className="text-sm leading-relaxed text-neutral-600">
                            {generatedActivities[carouselIndex].purpose}
                          </p>
                        </div>
                      )}
                      {generatedActivities[carouselIndex]?.materials_required &&
                        generatedActivities[carouselIndex].materials_required.length > 0 && (
                          <div>
                            <h5 className="mb-2 text-sm font-semibold text-neutral-700">Materials Required</h5>
                            <p className="text-sm leading-relaxed text-neutral-600">
                              {generatedActivities[carouselIndex].materials_required.join(', ')}
                            </p>
                          </div>
                        )}
                      <div>
                        <h5 className="mb-2 text-sm font-semibold text-neutral-700">Instructions</h5>
                        <p className="text-sm leading-relaxed text-neutral-600">
                          {generatedActivities[carouselIndex]?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Carousel Navigation */}
                  <div className="flex w-full items-center justify-between px-4">
                    <Button
                      onClick={handlePrevious}
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-neutral-200 p-2 hover:bg-neutral-300"
                      aria-label="Previous"
                    >
                      <svg className="h-5 w-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </Button>
                    <span className="text-sm text-neutral-500">
                      {carouselIndex + 1} / {generatedActivities.length}
                    </span>
                    <Button
                      onClick={handleNext}
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-neutral-200 p-2 hover:bg-neutral-300"
                      aria-label="Next"
                    >
                      <svg className="h-5 w-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ) : fetchedActivities && fetchedActivities.activities && fetchedActivities.activities.length > 0 ? (
              <div className="bg-muted rounded-xl">
                <h4 className="text-foreground flex items-center px-4 py-2 text-lg font-medium">
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Saved Activities
                </h4>
                <div className="relative w-full p-2">
                  <div className="mb-2 flex justify-between px-4">
                    <div className="flex items-center gap-2">
                      {fetchedActivities.activities[carouselIndex]?.modes_of_interaction && (
                        <Badge variant="secondary" className="bg-primary text-secondaryn">
                          {
                            modeOfInteractionOptions.find(
                              option => option.id === fetchedActivities.activities[carouselIndex].modes_of_interaction,
                            )?.label
                          }
                        </Badge>
                      )}
                      {fetchedActivities.activities[carouselIndex]?.modalities &&
                        fetchedActivities.activities[carouselIndex]?.modalities.map(
                          (modality: string, index: number) => (
                            <Badge key={index} variant="secondary" className="bg-secondary text-primary">
                              {modalityOptions.find(option => option.id === modality)?.label}
                            </Badge>
                          ),
                        )}
                    </div>
                  </div>
                  <div className="mb-6 min-h-[180px] rounded-2xl bg-white/90 p-4 shadow-lg">
                    <h4 className="mb-4 text-xl font-semibold text-neutral-800">
                      {fetchedActivities.activities[carouselIndex]?.name}
                    </h4>
                    <div className="space-y-4">
                      {fetchedActivities.activities[carouselIndex]?.purpose && (
                        <div>
                          <h5 className="mb-2 text-sm font-semibold text-neutral-700">Purpose</h5>
                          <p className="text-sm leading-relaxed text-neutral-600">
                            {fetchedActivities.activities[carouselIndex].purpose}
                          </p>
                        </div>
                      )}
                      {fetchedActivities.activities[carouselIndex]?.materials_required &&
                        fetchedActivities.activities[carouselIndex].materials_required.length > 0 && (
                          <div>
                            <h5 className="mb-2 text-sm font-semibold text-neutral-700">Materials Required</h5>
                            <p className="text-sm leading-relaxed text-neutral-600">
                              {fetchedActivities.activities[carouselIndex].materials_required.join(', ')}
                            </p>
                          </div>
                        )}
                      <div>
                        <h5 className="mb-2 text-sm font-semibold text-neutral-700">Instructions</h5>
                        <p className="text-sm leading-relaxed text-neutral-600">
                          {fetchedActivities.activities[carouselIndex]?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Carousel Navigation */}
                  <div className="flex w-full items-center justify-between px-4">
                    <Button
                      onClick={handlePrevious}
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-neutral-200 p-2 hover:bg-neutral-300"
                      aria-label="Previous"
                    >
                      <svg className="h-5 w-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </Button>
                    <span className="text-sm text-neutral-500">
                      {carouselIndex + 1} / {fetchedActivities.activities.length}
                    </span>
                    <Button
                      onClick={handleNext}
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-neutral-200 p-2 hover:bg-neutral-300"
                      aria-label="Next"
                    >
                      <svg className="h-5 w-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-muted rounded-xl p-4">
                <div className="text-foreground scrollbar-thin scrollbar-thumb-secondary scrollbar-track-muted max-h-64 overflow-y-auto pr-2 text-sm leading-relaxed">
                  <p>Activities will be generated based on the selected mode and modalities.</p>
                </div>
              </div>
            )}
          </div>

          {/* Progress Display */}
          {isGenerating && progress && (
            <div className="bg-muted mb-4 flex items-center gap-2 rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">{progress}</span>
            </div>
          )}

          {/* Input Area */}
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={teacher_requirements}
                onChange={e => {
                  setTeacherRequirements(e.target.value)
                }}
                placeholder="Type your activity request or customization here..."
                rows={3}
                className="border-border focus:border-secondary text-foreground w-full resize-none rounded-2xl border-2 p-4 pr-4 transition-colors duration-200 focus:ring-0 focus:outline-none"
                disabled={isGenerating}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1">
              <Button
                onClick={handleGenerateActivities}
                variant="secondary"
                className="flex-1 rounded-3xl px-6 py-4 font-medium transition-all duration-300"
                disabled={isGenerating || !modes_of_interaction || !modalities?.length}
              >
                <span className="flex items-center justify-center">
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Generate Activities
                    </>
                  )}
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={handleSaveToDatabase}
                className="rounded-3xl px-6 py-4"
                disabled={saveActivitiesMutation.isPending || !generatedActivities.length}
              >
                {saveActivitiesMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <AIHelpDialog
        showAIHelpDialog={showAIHelpDialog}
        setShowAIHelpDialog={setShowAIHelpDialog}
        topicId={topicId?.toString()}
      />
    </div>
  )
}
