import { useParams, useNavigate } from 'react-router'
import { useTitle } from '../hooks/use-title'
import { Users } from 'lucide-react'
import Header from '../components/header'
import { Button } from '../components/ui/button'
import AIHelpDialog from '../components/modals/ai-help-dialog'
import BottomNav from '../components/bottom-nav'
import TopicSelector from '../components/topic-selector'
import { useAllTopics } from '../queries/topic-queries'
import { data } from '../lib/data'
import EmptyWeeklyPlan from '@/components/empty-weekly-plan'
import { useSearchParams } from 'react-router'
import Loading from '@/components/loading'
import { useLatestClassroom } from '@/queries/classroom-queries'

export default function DayLesson() {
  const { day } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const topicIdParam = searchParams.get('topicId')
  const topicId = topicIdParam ? parseInt(topicIdParam) : null
  const navigate = useNavigate()

  const { data: latestClassroom, isLoading: isLoadingClassroom } = useLatestClassroom()
  const { data: topics, isLoading: isLoadingTopics } = useAllTopics()
  const selectedTopic = topics?.find(t => t.id === topicId)

  useTitle(`Day ${day} ${selectedTopic?.name ? `| ${selectedTopic?.name}` : ' | Select a Topic'}`)

  if (isLoadingClassroom || isLoadingTopics) {
    return <Loading message="Loading..." />
  }

  // Get lesson plan from selected topic
  const lessonPlan = data[selectedTopic?.name as keyof typeof data]?.outputs || {}
  const selectedDay = parseInt(day || '1')
  const currentDayPlan = lessonPlan[`day_${selectedDay}` as keyof typeof lessonPlan]

  const handleGradeActivitiesClick = (gradeId: number) => {
    if (topicId) {
      navigate(`/day/${selectedDay}/grade/${gradeId}/generate-activities?topicId=${topicId}`)
    } else {
      navigate(`/day/${selectedDay}/grade/${gradeId}/generate-activities`)
    }
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
              <div className="w-full rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-medium text-neutral-800">Whole Class Introduction</h3>
                  <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full p-1">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="bg-secondary rounded-xl p-4">
                  <p className="text-sm leading-relaxed text-neutral-700">
                    {currentDayPlan.whole_class_introduction_plan as string}
                  </p>
                </div>
                <div className="mt-4">
                  <Button
                    onClick={() => {
                      if (topicId) {
                        navigate(`/day/${selectedDay}/activities?topicId=${topicId}`)
                      } else {
                        navigate(`/day/${selectedDay}/activities`)
                      }
                    }}
                    className="w-full rounded-xl px-4 py-3 font-medium transition-all duration-200"
                  >
                    Generate Teaching Materials
                  </Button>
                </div>
              </div>

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
                    <div className="bg-secondary mb-4 rounded-xl p-4">
                      <h4 className="text-primary-10 mb-2 text-sm font-medium">Learning Objective:</h4>
                      <p className="text-sm leading-relaxed text-neutral-700">
                        {currentDayPlan[`grade_${gradeNumber}` as keyof typeof currentDayPlan]}
                      </p>
                    </div>
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
