import { useNavigate } from 'react-router'
import { useTitle } from '../hooks/use-title'
import BottomNav from '../components/bottom-nav'
import Header from '../components/header'
import { Button } from '../components/ui/button'
import AIHelpDialog from '../components/modals/ai-help-dialog'
import TopicSelector from '../components/topic-selector'
import { useAllTopics } from '../queries/topic-queries'
import EmptyWeeklyPlan from '@/components/empty-weekly-plan'
import { useSearchParams } from 'react-router'
import Loading from '@/components/loading'
import { useCreateWeeklyPlan } from '../mutations/topic-mutations'
import { Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'

export default function WeeklyPlan() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const topicIdParam = searchParams.get('topicId')
  const topicId = topicIdParam ? parseInt(topicIdParam) : null
  const [showAIHelpDialog, setShowAIHelpDialog] = useState(false)
  const { data: topics, isLoading: isLoadingTopics } = useAllTopics()
  const { mutate: createWeeklyPlan, isPending: isCreatingWeeklyPlan } = useCreateWeeklyPlan()
  const [threadId, setThreadId] = useState<string | null>(null)

  // Get lesson plan from selected topic
  const selectedTopic = topics?.find(t => t.id === topicId)
  const lessonPlan = selectedTopic?.weekly_plan || {}
  const hasLessonPlan = lessonPlan && Object.keys(lessonPlan).length > 0
  useTitle(`Weekly Plan ${selectedTopic?.name ? `| ${selectedTopic?.name}` : ' | Select a Topic'}`)

  // Generate a new threadId when topicId changes
  useEffect(() => {
    if (topicId) {
      setThreadId(crypto.randomUUID())
    } else {
      setThreadId(null)
    }
  }, [topicId])

  if (isLoadingTopics) {
    return <Loading message="Loading topics..." />
  }

  const handleDaySelect = (day: number) => {
    if (topicId) {
      navigate(`/day/${day}?topicId=${topicId}`)
    } else {
      navigate(`/day/${day}`)
    }
  }

  const handleCreateWeeklyPlan = () => {
    if (!topicId) return
    createWeeklyPlan(topicId, {
      onSuccess: () => {
        toast.success('Weekly lesson plan created successfully!')
      },
      onError: () => {
        toast.error('Failed to create weekly lesson plan.')
      },
    })
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Header
        title="Weekly Lesson Plan"
        onBack={() => navigate('/create-topic')}
        showAIHelp={!!topicId}
        onShowAIHelp={() => setShowAIHelpDialog(true)}
      />
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
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

          {topicId && hasLessonPlan ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {Object.entries(lessonPlan).map(([dayKey, dayPlan]: [string, any]) => (
                <Button
                  key={dayKey}
                  onClick={() => handleDaySelect(Number(dayKey.replace('day_', '')))}
                  variant="outline"
                  size="lg"
                  className="hover:bg-secondary border-border bg-card flex h-auto min-h-[160px] w-full flex-col items-start justify-start rounded-2xl border p-4 text-left break-words shadow-md transition-all duration-200 hover:shadow-lg sm:p-6"
                >
                  <div className="text-primary mb-3 text-xl font-medium">Day {dayKey.replace('day_', '')}</div>
                  <div className="text-muted-foreground w-full overflow-hidden text-sm leading-relaxed">
                    <p className="overflow-hidden break-words">
                      {typeof dayPlan.whole_class_introduction_plan === 'string'
                        ? dayPlan.whole_class_introduction_plan.length > 50
                          ? `${dayPlan.whole_class_introduction_plan.substring(0, 50)}...`
                          : dayPlan.whole_class_introduction_plan
                        : 'No introduction plan available.'}
                    </p>
                  </div>
                  <div className="mt-4 flex w-full flex-wrap gap-1">
                    {Object.entries(dayPlan)
                      .filter(([key]) => key.startsWith('grade_'))
                      .map(([gradeKey, _], idx) => (
                        <span
                          key={idx}
                          className="bg-secondary flex-shrink-0 rounded-full px-2 py-1 text-xs whitespace-nowrap"
                        >
                          {gradeKey.replace('grade_', 'Grade ')}
                        </span>
                      ))}
                  </div>
                </Button>
              ))}
            </div>
          ) : topicId ? (
            <div className="flex flex-col items-center justify-center space-y-6 py-12">
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-semibold">No Weekly Plan Available</h3>
                <p className="text-muted-foreground">This topic doesn't have a weekly lesson plan yet.</p>
              </div>
              <Button
                onClick={handleCreateWeeklyPlan}
                size="lg"
                className="rounded-xl px-6 py-3 text-base font-medium shadow-md transition-all duration-300 hover:shadow-lg"
                disabled={isCreatingWeeklyPlan}
              >
                {isCreatingWeeklyPlan ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Generating Weekly Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Create Weekly Lesson Plan
                  </>
                )}
              </Button>
            </div>
          ) : (
            <EmptyWeeklyPlan title="No Topic Selected" description="Please select a topic above to see a weekly plan" />
          )}
        </div>
      </div>
      <AIHelpDialog
        showAIHelpDialog={showAIHelpDialog}
        setShowAIHelpDialog={setShowAIHelpDialog}
        topicId={topicId ? topicId.toString() : ''}
        threadId={threadId || ''}
      />
      <BottomNav />
    </div>
  )
}
