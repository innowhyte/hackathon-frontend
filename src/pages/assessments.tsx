import { useNavigate, useSearchParams } from 'react-router'
import { useTitle } from '../hooks/use-title'
import { useEffect, useState } from 'react'
import BottomNav from '../components/bottom-nav'
import Header from '../components/header'
import { Button } from '../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import AIHelpDialog from '../components/modals/ai-help-dialog'
import { useLatestClassroom } from '../queries/classroom-queries'
import { useAllTopics } from '../queries/topic-queries'
import { useAssessmentsByTopicGrade } from '../queries/assessment-queries'
import { useGenerateAssessment, useDeleteAssessment } from '../mutations/assessment-mutations'
import TopicSelector from '../components/topic-selector'
import Loading from '@/components/loading'
import AssessmentTypeSelector from '../components/assessment-type-selector'
import { assessmentTypeConfig } from '@/lib/assessment-config'
import EmptyWeeklyPlan from '@/components/empty-weekly-plan'
import { toast } from 'sonner'

export default function TopicAssessment() {
  const [searchParams, setSearchParams] = useSearchParams()
  const topicIdParam = searchParams.get('topicId')
  const topicId = topicIdParam ? parseInt(topicIdParam) : null
  const [selectedGradeForAssessment, setSelectedGradeForAssessment] = useState<number | null>(null)
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<string | null>(null)
  const [assessmentOptions] = useState({
    mcq: { numberOfQuestions: 5, answerType: 'mcq' as const },
    passage_reading: { numberOfWords: 100, difficultyLevel: 'medium' as const },
    passage_completion: { projectType: 'poster' as const },
  })
  const [showAIHelpDialog, setShowAIHelpDialog] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)

  const navigate = useNavigate()
  const { data: latestClassroom, isLoading: isLoadingClassroom } = useLatestClassroom()
  const { data: topics, isLoading: isLoadingTopics } = useAllTopics()
  const { data: apiAssessments } = useAssessmentsByTopicGrade(
    topicId?.toString() || '',
    selectedGradeForAssessment?.toString() || '',
  )
  const generateAssessmentMutation = useGenerateAssessment()
  const deleteAssessmentMutation = useDeleteAssessment()

  // Get selected topic
  const selectedTopic = topics?.find(t => t.id === topicId)

  useEffect(() => {
    if (topicId) {
      setThreadId(crypto.randomUUID())
    } else {
      setThreadId(null)
    }
  }, [topicId])

  useTitle(`Topic Assessment ${selectedTopic?.name ? `| ${selectedTopic?.name}` : ' | Select a Topic'}`)

  if (isLoadingClassroom || isLoadingTopics) {
    return <Loading message="Loading..." />
  }

  const selectedGrades = latestClassroom?.grades || []

  const handleGenerateAssessment = () => {
    if (selectedGradeForAssessment && selectedAssessmentType && selectedTopic) {
      const currentOptions = assessmentOptions[selectedAssessmentType as keyof typeof assessmentOptions]

      generateAssessmentMutation.mutate(
        {
          topic_id: selectedTopic.id.toString(),
          grade_id: selectedGradeForAssessment.toString(),
          assessment_type: selectedAssessmentType as 'mcq' | 'passage_reading' | 'passage_completion',
          options: currentOptions,
        },
        {
          onSuccess: () => {
            toast.success('Assessment generated successfully')
          },
          onError: error => {
            console.error('Failed to generate assessment:', error)
            toast.error('Failed to generate assessment')
          },
        },
      )
    }
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Header
        title="Topic Assessment"
        onBack={() => {
          if (topicId) {
            navigate(`/weekly-plan?topicId=${topicId}`)
          } else {
            navigate('/weekly-plan')
          }
        }}
        showAIHelp={!!topicId}
        onShowAIHelp={() => setShowAIHelpDialog(true)}
      />

      <div className="p-4">
        <div className="mx-auto max-w-md space-y-6">
          <TopicSelector
            selectedTopicId={topicId}
            onTopicChange={topicId => {
              if (topicId) {
                setSearchParams({ topicId: topicId.toString() })
              } else {
                setSearchParams({})
              }
            }}
          />
          {!selectedTopic && (
            <EmptyWeeklyPlan
              title="Select a topic to generate assessments"
              description="Select a topic to generate assessments based on your selected grades."
            />
          )}

          {/* Grade Selection */}
          {selectedTopic && (
            <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-base font-medium text-neutral-800">Select Grade for Assessment</h2>
              <div className="flex gap-2">
                {selectedGrades.length > 0 ? (
                  selectedGrades.map(g => (
                    <Button
                      key={g.id}
                      onClick={() => setSelectedGradeForAssessment(g.id)}
                      variant={selectedGradeForAssessment === g.id ? 'default' : 'outline'}
                      className="flex-1 py-2 text-sm"
                    >
                      {g.name}
                    </Button>
                  ))
                ) : (
                  <span className="text-sm text-neutral-500">No grades found. Please set up grades first.</span>
                )}
              </div>
            </div>
          )}

          {/* Assessment Type Selection */}
          {selectedGradeForAssessment && selectedTopic && (
            <AssessmentTypeSelector
              selectedType={selectedAssessmentType}
              onTypeSelect={setSelectedAssessmentType}
              config={assessmentTypeConfig}
            />
          )}

          {/* Options Section
          {selectedAssessmentType && selectedTopic && (
            <AssessmentOptionsSelector
              selectedType={selectedAssessmentType}
              options={assessmentOptions}
              onOptionsChange={setAssessmentOptions}
              config={assessmentOptionsConfig}
            />
          )} */}

          {selectedAssessmentType && selectedTopic && selectedGradeForAssessment && (
            <Button
              onClick={handleGenerateAssessment}
              className="bg-primary hover:bg-primary/90 w-full text-white"
              disabled={
                !selectedGradeForAssessment ||
                !selectedAssessmentType ||
                !selectedTopic ||
                generateAssessmentMutation.isPending
              }
            >
              {generateAssessmentMutation.isPending ? 'Generating...' : 'Generate Assessment'}
            </Button>
          )}

          {/* Saved Assessments */}
          {selectedTopic && (
            <div>
              <h2 className="mb-3 text-base font-medium text-neutral-800">Saved Assessments</h2>
              <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                {apiAssessments && apiAssessments.length > 0 ? (
                  <div className="space-y-3">
                    {apiAssessments.map((assessment: any) => (
                      <div key={assessment.id} className="rounded-lg border border-neutral-200 p-3">
                        <div className="mb-3">
                          <div className="mb-2">
                            <h4 className="font-medium text-neutral-800">
                              {assessment.assessment_type === 'mcq' && 'Multiple Choice Questions'}
                              {assessment.assessment_type === 'passage_reading' && 'Passage Reading'}
                              {assessment.assessment_type === 'passage_completion' && 'Passage Completion'}
                            </h4>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-neutral-600">
                            <span>
                              {latestClassroom?.grades?.find(g => g.id === assessment.grade_id)?.name ||
                                `Grade ${assessment.grade_id}`}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {assessment.attributes?.pdf_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => window.open(assessment.attributes.pdf_url, '_blank')}
                              >
                                View PDF
                              </Button>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-neutral-100 text-xs text-neutral-800 hover:bg-neutral-200"
                              >
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(
                                    `/grade/${assessment.grade_id}/assessment/${assessment.id}/conduct?topicId=${selectedTopic.id}`,
                                  )
                                }
                              >
                                View Assessment
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  // Handle edit functionality
                                  console.log('Edit assessment:', assessment.id)
                                }}
                                disabled={true}
                              >
                                Edit Assessment
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  if (selectedTopic && selectedGradeForAssessment) {
                                    deleteAssessmentMutation.mutate(
                                      {
                                        topic_id: selectedTopic.id.toString(),
                                        grade_id: selectedGradeForAssessment.toString(),
                                        assessment_id: assessment.id.toString(),
                                      },
                                      {
                                        onSuccess: () => {
                                          toast.success('Assessment deleted successfully')
                                        },
                                        onError: error => {
                                          console.error('Failed to delete assessment:', error)
                                          toast.error('Failed to delete assessment')
                                        },
                                      },
                                    )
                                  }
                                }}
                                disabled={deleteAssessmentMutation.isPending}
                              >
                                {deleteAssessmentMutation.isPending ? 'Deleting...' : 'Delete Assessment'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-sm text-neutral-500">No saved assessments for {selectedTopic.name}.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <AIHelpDialog
        showAIHelpDialog={showAIHelpDialog}
        setShowAIHelpDialog={setShowAIHelpDialog}
        topicId={topicId?.toString() || ''}
        threadId={threadId || ''}
      />
      <BottomNav />
    </div>
  )
}
