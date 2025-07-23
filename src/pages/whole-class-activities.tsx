import { useNavigate, useParams } from 'react-router'
import { useTitle } from '../hooks/use-title'
import { useContext } from 'react'
import { AppContext } from '../context/app-context'
import Header from '../components/header'
import { Button } from '../components/ui/button'
import AIHelpDialog from '../components/modals/ai-help-dialog'
import BlackboardDialog from '../components/modals/blackboard-dialog'
import StoryDialog from '../components/modals/story-dialog'
import FlashcardDialog from '../components/modals/flashcard-dialog'
import GamifiedDialog from '../components/modals/gamified-dialog'
import QuestionPromptsDialog from '../components/modals/question-prompts-dialog'

export default function WholeClassActivities() {
  const { day } = useParams()
  useTitle(`Day ${day} | Whole Class Activities`)
  const context = useContext(AppContext)
  const navigate = useNavigate()

  if (!context) {
    return <div>Loading...</div>
  }

  const {
    lessonPlan,
    topic,
    setShowBlackboardDialog,
    setShowStoryDialog,
    setShowFlashcardDialog,
    setShowGamifiedDialog,
    setShowQuestionPromptsDialog,
  } = context

  const selectedDay = parseInt(day || '1')
  const currentDayPlan = lessonPlan.find((d: any) => d.day === selectedDay)

  const activityOptions = [
    {
      id: 'blackboard',
      title: 'Blackboard drawings',
      description: 'Generate visual diagrams and drawings for the blackboard',
      icon: '✏️',
      color: 'bg-blue-500',
      onClick: () => setShowBlackboardDialog(true),
    },
    {
      id: 'story',
      title: 'Story based',
      description: 'Create engaging stories related to the lesson topic',
      icon: '📖',
      color: 'bg-green-500',
      onClick: () => setShowStoryDialog(true),
    },
    {
      id: 'flashcards',
      title: 'Flash cards',
      description: 'Generate interactive flash cards for learning',
      icon: '🃏',
      color: 'bg-purple-500',
      onClick: () => setShowFlashcardDialog(true),
    },
    {
      id: 'gamified',
      title: 'Gamified activities',
      description: 'Create fun, game-based learning activities',
      icon: '😊',
      color: 'bg-orange-500',
      onClick: () => setShowGamifiedDialog(true),
    },
    {
      id: 'questions',
      title: 'Question prompts',
      description: 'Generate thought-provoking questions for discussion',
      icon: '❓',
      color: 'bg-red-500',
      onClick: () => setShowQuestionPromptsDialog(true),
    },
  ]

  return (
    <div className="bg-background min-h-screen">
      <Header title="Generate Teaching Materials" onBack={() => navigate(`/day/${day}`)} showAIHelp={true} />

      <div className="p-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-2 text-center text-2xl font-semibold text-neutral-800">{topic}</h2>

          {/* Lesson Content */}
          <div className="mb-8 w-full rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
            <h3 className="mb-4 text-xl font-medium text-neutral-800">What to teach in class:</h3>
            {currentDayPlan && (
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-sm leading-relaxed text-neutral-700">
                  {currentDayPlan.whole_class_introduction_plan}
                </p>
              </div>
            )}
          </div>

          {/* Activity Options */}
          <div className="mb-8">
            <h3 className="mb-6 text-xl font-medium text-neutral-800">Generate any of the following:</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {activityOptions.map(option => (
                <Button
                  key={option.id}
                  onClick={option.onClick}
                  variant="outline"
                  size="lg"
                  className="group flex h-auto flex-col items-center rounded-2xl border border-neutral-200 bg-white/80 p-4 break-words shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-xl sm:p-6"
                >
                  {option.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AIHelpDialog />
      <BlackboardDialog />
      <StoryDialog />
      <FlashcardDialog />
      <GamifiedDialog />
      <QuestionPromptsDialog />
    </div>
  )
}
