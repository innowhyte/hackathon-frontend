import { useParams, useNavigate } from 'react-router'
import { useTitle } from '../hooks/use-title'
import { Users } from 'lucide-react'
import Header from '../components/header'
import { Button } from '../components/ui/button'
import AIHelpDialog from '../components/modals/ai-help-dialog'
import BottomNav from '../components/bottom-nav'
import TopicSelector from '../components/topic-selector'
import { useAllTopics } from '../queries/topic-queries'
import EmptyWeeklyPlan from '@/components/empty-weekly-plan'
import { useSearchParams } from 'react-router'
import Loading from '@/components/loading'
import { useLatestClassroom } from '@/queries/classroom-queries'
import { useUpdateDayPlanMutation } from '../mutations/topic-mutations'
import { Edit2, X, Check } from 'lucide-react'
import React from 'react'

export default function DayLesson() {
  const { day } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const topicIdParam = searchParams.get('topicId')
  const topicId = topicIdParam ? parseInt(topicIdParam) : null
  const navigate = useNavigate()

  const { data: latestClassroom, isLoading: isLoadingClassroom } = useLatestClassroom()
  const { data: topics, isLoading: isLoadingTopics } = useAllTopics()
  const selectedTopic = topics?.find(t => t.id === topicId)

  const { mutate: updateDayPlan, isPending } = useUpdateDayPlanMutation()
  const [editSection, setEditSection] = React.useState<null | 'whole_class' | number>(null)
  const [editValue, setEditValue] = React.useState('')

  useTitle(`Day ${day} ${selectedTopic?.name ? `| ${selectedTopic?.name}` : ' | Select a Topic'}`)

  if (isLoadingClassroom || isLoadingTopics) {
    return <Loading message="Loading..." />
  }

  // Get lesson plan from selected topic
  const selectedDay = parseInt(day || '1')
  const lessonPlan = selectedTopic?.weekly_plan || {}
  const currentDayPlan = lessonPlan[`day_${selectedDay}`]

  const handleGradeActivitiesClick = (gradeId: number) => {
    if (topicId) {
      navigate(`/day/${selectedDay}/grade/${gradeId}/activities?topicId=${topicId}`)
    } else {
      navigate(`/day/${selectedDay}/grade/${gradeId}/activities`)
    }
  }

  const handleEdit = (section: 'whole_class' | number, value: string) => {
    setEditSection(section)
    setEditValue(value)
  }

  const handleCancel = () => {
    setEditSection(null)
    setEditValue('')
  }

  const handleSave = () => {
    if (!selectedTopic || !currentDayPlan) return
    const dayPlan = { ...currentDayPlan }
    if (editSection === 'whole_class') {
      dayPlan.whole_class_introduction_plan = editValue
    } else if (typeof editSection === 'number') {
      dayPlan[`grade_${editSection}`] = editValue
    }
    updateDayPlan(
      {
        topicId: selectedTopic.id,
        dayNumber: selectedDay,
        dayPlan,
      },
      {
        onSuccess: () => {
          console.log('Day plan updated')
          setEditSection(null)
          setEditValue('')
          // topics will be revalidated by mutation's onSuccess (query invalidation)
        },
      },
    )
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Header
        title={`Day ${selectedDay} Lesson Plan`}
        onBack={() => {
          if (topicId) {
            navigate(`/weekly-plan?topicId=${topicId}`)
          } else {
            navigate('/weekly-plan')
          }
        }}
      />

      <div className="p-6">
        <div className="mx-auto max-w-4xl">
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

          {topicId && currentDayPlan ? (
            <div className="space-y-6">
              {/* Whole Class Introduction */}
              <div className="w-full rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-medium text-neutral-800">Whole Class Introduction</h3>
                  <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full p-1">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="bg-secondary relative rounded-xl p-4">
                  {editSection !== 'whole_class' && (
                    <button
                      className="hover:bg-primary/10 absolute top-2 right-2 z-10 rounded-full bg-white p-1 shadow transition"
                      onClick={() => handleEdit('whole_class', currentDayPlan.whole_class_introduction_plan || '')}
                      aria-label="Edit Whole Class Introduction"
                    >
                      <Edit2 className="text-primary h-5 w-5" />
                    </button>
                  )}
                  {editSection === 'whole_class' ? (
                    <textarea
                      className="focus:ring-primary w-full rounded-lg border border-neutral-300 p-2 text-sm text-neutral-700 focus:ring-2 focus:outline-none disabled:bg-neutral-100 disabled:opacity-60"
                      rows={3}
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      disabled={isPending}
                    />
                  ) : (
                    <p className="text-sm leading-relaxed text-neutral-700">
                      {currentDayPlan.whole_class_introduction_plan as string}
                    </p>
                  )}
                </div>
                {editSection === 'whole_class' && (
                  <div className="mt-4 mb-4 flex justify-center gap-2">
                    <Button
                      variant="default"
                      onClick={handleSave}
                      className="flex items-center gap-1"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                      ) : (
                        <Check className="h-4 w-4" />
                      )}{' '}
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="flex items-center gap-1"
                      disabled={isPending}
                    >
                      <X className="h-4 w-4" /> Cancel
                    </Button>
                  </div>
                )}
                <div className="mt-4">
                  <Button
                    onClick={() => {
                      if (topicId) {
                        navigate(`/day/${selectedDay}/materials?topicId=${topicId}`)
                      } else {
                        navigate(`/day/${selectedDay}/materials`)
                      }
                    }}
                    className="w-full rounded-xl px-4 py-3 font-medium transition-all duration-200"
                  >
                    Generate Teaching Materials
                  </Button>
                </div>
              </div>
              {/* Grade Activities */}
              {latestClassroom?.grades.map((grade: any, index: number) => {
                const gradeNumber = parseInt(grade.name.replace('Grade ', ''))
                return (
                  <div
                    key={index}
                    className="w-full rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xl font-medium text-neutral-800">{grade.name} Activities</h3>
                      <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
                        <span className="material-symbols-outlined text-white">cognition</span>
                      </div>
                    </div>
                    <div className="bg-secondary relative mb-4 rounded-xl p-4">
                      <h4 className="text-primary-10 mb-2 text-sm font-medium">Learning Objective:</h4>
                      {editSection !== gradeNumber && (
                        <button
                          className="hover:bg-primary/10 absolute top-2 right-2 z-10 rounded-full bg-white p-1 shadow transition"
                          onClick={() => handleEdit(gradeNumber, currentDayPlan[`grade_${gradeNumber}`] || '')}
                          aria-label={`Edit ${grade.name} Activities`}
                        >
                          <Edit2 className="text-primary h-5 w-5" />
                        </button>
                      )}
                      {editSection === gradeNumber ? (
                        <textarea
                          className="focus:ring-primary w-full rounded-lg border border-neutral-300 p-2 text-sm text-neutral-700 focus:ring-2 focus:outline-none disabled:bg-neutral-100 disabled:opacity-60"
                          rows={3}
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          disabled={isPending}
                        />
                      ) : (
                        <p className="text-sm leading-relaxed text-neutral-700">
                          {currentDayPlan[`grade_${gradeNumber}` as keyof typeof currentDayPlan]}
                        </p>
                      )}
                    </div>
                    {editSection === gradeNumber && (
                      <div className="mt-4 mb-4 flex justify-center gap-2">
                        <Button
                          variant="default"
                          onClick={handleSave}
                          className="flex items-center gap-1"
                          disabled={isPending}
                        >
                          {isPending ? (
                            <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              />
                            </svg>
                          ) : (
                            <Check className="h-4 w-4" />
                          )}{' '}
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          className="flex items-center gap-1"
                          disabled={isPending}
                        >
                          <X className="h-4 w-4" /> Cancel
                        </Button>
                      </div>
                    )}
                    <Button
                      onClick={() => handleGradeActivitiesClick(grade.id)}
                      className="w-full rounded-xl px-4 py-3 font-medium transition-all duration-200"
                    >
                      Create Grade Activities
                    </Button>
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyWeeklyPlan title="No Topic Selected" description="Please select a topic above to see a lesson plan" />
          )}
        </div>
      </div>
      <AIHelpDialog />
      <BottomNav />
    </div>
  )
}
