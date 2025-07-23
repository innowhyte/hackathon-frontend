import { useNavigate } from 'react-router'
import { useTitle } from '../hooks/use-title'
import BottomNav from '../components/bottom-nav'
import Header from '../components/header'
import { Button } from '../components/ui/button'
import AIHelpDialog from '../components/modals/ai-help-dialog'
import TopicSelector from '../components/topic-selector'
import { useAllTopics } from '../queries/topic-queries'
import EmptyWeeklyPlan from '@/components/empty-weekly-plan'
import { data } from '@/lib/data'
import { useSearchParams } from 'react-router'
import Loading from '@/components/loading'

export default function WeeklyPlan() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const topicIdParam = searchParams.get('topicId')
  const topicId = topicIdParam ? parseInt(topicIdParam) : null

  const { data: topics, isLoading: isLoadingTopics } = useAllTopics()

  // Get lesson plan from selected topic
  const selectedTopic = topics?.find(t => t.id === topicId)
  const lessonPlan = data[selectedTopic?.name as keyof typeof data]?.outputs || []

  useTitle(`Weekly Plan ${selectedTopic?.name ? `| ${selectedTopic?.name}` : ' | Select a Topic'}`)

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

  return (
    <div className="bg-background min-h-screen pb-20">
      <Header title="Weekly Lesson Plan" onBack={() => navigate('/create-topic')} />
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

          {topicId && lessonPlan.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {lessonPlan.map((dayPlan: any) => (
                <Button
                  key={dayPlan.day}
                  onClick={() => handleDaySelect(dayPlan.day)}
                  variant="outline"
                  size="lg"
                  className="hover:bg-secondary border-border bg-card flex h-auto min-h-[160px] w-full flex-col items-start justify-start rounded-2xl border p-4 text-left break-words shadow-md transition-all duration-200 hover:shadow-lg sm:p-6"
                >
                  <div className="text-primary-40 mb-3 text-xl font-medium">Day {dayPlan.day}</div>
                  <div className="text-muted-foreground w-full overflow-hidden text-sm leading-relaxed">
                    <p className="overflow-hidden break-words">
                      {dayPlan.whole_class_introduction_plan.length > 50
                        ? `${dayPlan.whole_class_introduction_plan.substring(0, 50)}...`
                        : dayPlan.whole_class_introduction_plan}
                    </p>
                  </div>
                  <div className="mt-4 flex w-full flex-wrap gap-1">
                    {dayPlan.grade_plans.map((gradePlan: any, idx: number) => (
                      <span
                        key={idx}
                        className="bg-secondary flex-shrink-0 rounded-full px-2 py-1 text-xs whitespace-nowrap"
                      >
                        {gradePlan.grade}
                      </span>
                    ))}
                  </div>
                </Button>
              ))}
            </div>
          ) : topicId ? (
            <div className="text-muted-foreground text-center">
              <p>No lesson plan available for this topic.</p>
            </div>
          ) : (
            <EmptyWeeklyPlan title="No Topic Selected" description="Please select a topic above to see a weekly plan" />
          )}
        </div>
      </div>
      <AIHelpDialog />
      <BottomNav />
    </div>
  )
}
