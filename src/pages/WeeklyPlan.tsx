import { useNavigate } from 'react-router'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import BottomNav from '../components/BottomNav'
import Header from '../components/Header'
import AIHelpDialog from '../components/modals/AIHelpDialog'

const WeeklyPlan = () => {
  const context = useContext(AppContext)
  const navigate = useNavigate()

  if (!context) {
    return <div>Loading...</div>
  }

  const { topic, lessonPlan, setSelectedDay } = context

  const handleDaySelect = (day: number) => {
    setSelectedDay(day)
    navigate(`/day/${day}`)
  }

  const handleOpenTopicAssessment = () => {
    navigate('/assessment')
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Header title="Sahayak" onBack={() => navigate('/setup')} />
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <h2 className="text-foreground mb-2 text-center text-2xl font-semibold">Weekly Lesson Plan</h2>
          <p className="text-muted-foreground mb-8 text-center">Topic: {topic}</p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {lessonPlan.map((dayPlan: any) => (
              <button
                key={dayPlan.day}
                onClick={() => handleDaySelect(dayPlan.day)}
                className="hover:bg-secondary border-border bg-card flex w-full flex-col items-start justify-start rounded-2xl border p-6 text-left shadow-md transition-all duration-200"
              >
                <div className="text-primary-40 mb-3 text-xl font-medium">Day {dayPlan.day}</div>
                <div className="text-muted-foreground line-clamp-3 text-sm">
                  {dayPlan.whole_class_introduction_plan.substring(0, 100)}...
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {dayPlan.grade_plans.map((gradePlan: any, idx: number) => (
                    <span key={idx} className="bg-secondary rounded-full px-2 py-1 text-xs">
                      {gradePlan.grade}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8">
            <button
              onClick={handleOpenTopicAssessment}
              className="bg-primary hover:bg-accent text-primary-foreground border-primary flex w-full flex-col items-center justify-center rounded-2xl border p-8 text-xl font-medium shadow-md transition-all duration-200"
            >
              <svg className="mb-3 h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Assessments
            </button>
          </div>
        </div>
      </div>
      <AIHelpDialog />
      <BottomNav />
    </div>
  )
}

export default WeeklyPlan
