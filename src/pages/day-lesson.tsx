import { useParams, useNavigate } from 'react-router'
import { useContext } from 'react'
import { AppContext } from '../context/app-context'
import { Users } from 'lucide-react'
import Header from '../components/header'
import { Button } from '../components/ui/button'
import AIHelpDialog from '../components/modals/ai-help-dialog'
import BottomNav from '../components/bottom-nav'

export default function DayLesson() {
  const { day } = useParams()
  const context = useContext(AppContext)
  const navigate = useNavigate()

  if (!context) {
    return <div>Loading...</div>
  }

  const { lessonPlan, topic, setActiveGradeId } = context
  const selectedDay = parseInt(day || '1')

  const currentDayPlan = lessonPlan.find((d: any) => d.day === selectedDay)

  const handleGradeActivitiesClick = (gradeId: number) => {
    setActiveGradeId(gradeId)
    navigate(`/day/${selectedDay}/grade/${gradeId}/activities`)
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Header title={`Day ${selectedDay} Lesson Plan`} onBack={() => navigate('/plan')} />

      <div className="p-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-2 text-center text-2xl font-semibold text-neutral-800">{topic}</h2>
          <div className="space-y-6">
            <div className="w-full rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-medium text-neutral-800">Whole Class Introduction</h3>
                <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full p-1">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              {currentDayPlan && (
                <div className="bg-secondary rounded-xl p-4">
                  <p className="text-sm leading-relaxed text-neutral-700">
                    {currentDayPlan.whole_class_introduction_plan}
                  </p>
                </div>
              )}
              <div className="mt-4">
                <Button
                  onClick={() => navigate(`/day/${selectedDay}/activities`)}
                  className="w-full rounded-xl px-4 py-3 font-medium transition-all duration-200"
                >
                  Generate Teaching Materials
                </Button>
              </div>
            </div>

            {currentDayPlan?.grade_plans.map((gradePlan: any, index: number) => {
              const gradeNumber = parseInt(gradePlan.grade.replace('Grade ', ''))
              return (
                <div
                  key={index}
                  className="w-full rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-medium text-neutral-800">{gradePlan.grade} Activities</h3>
                    <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
                      <span className="material-symbols-outlined text-white">cognition</span>
                    </div>
                  </div>
                  <div className="bg-secondary mb-4 rounded-xl p-4">
                    <h4 className="text-primary-10 mb-2 text-sm font-medium">Learning Objective:</h4>
                    <p className="text-sm leading-relaxed text-neutral-700">{gradePlan.learning_objective}</p>
                  </div>
                  <Button
                    onClick={() => handleGradeActivitiesClick(gradeNumber)}
                    className="w-full rounded-xl px-4 py-3 font-medium transition-all duration-200"
                  >
                    Create Grade Activities
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <AIHelpDialog />
      <BottomNav />
    </div>
  )
}
