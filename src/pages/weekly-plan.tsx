import { useNavigate } from 'react-router'
import { useContext } from 'react'
import { AppContext } from '../context/app-context'
import BottomNav from '../components/bottom-nav'
import Header from '../components/header'
import { Button } from '../components/ui/button'
import AIHelpDialog from '../components/modals/ai-help-dialog'

export default function WeeklyPlan() {
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

  return (
    <div className="bg-background min-h-screen pb-20">
      <Header title="Sahayak" onBack={() => navigate('/setup')} />
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <h2 className="text-foreground mb-2 text-center text-2xl font-semibold">Weekly Lesson Plan</h2>
          <p className="text-muted-foreground mb-8 text-center">Topic: {topic}</p>

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
        </div>
      </div>
      <AIHelpDialog />
      <BottomNav />
    </div>
  )
}
