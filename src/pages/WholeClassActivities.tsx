import { useNavigate, useParams } from 'react-router'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import Header from '../components/Header'
import AIHelpDialog from '../components/modals/AIHelpDialog'
import BlackboardDialog from '../components/modals/BlackboardDialog'
import StoryDialog from '../components/modals/StoryDialog'
import FlashcardDialog from '../components/modals/FlashcardDialog'
import GamifiedDialog from '../components/modals/GamifiedDialog'
import QuestionPromptsDialog from '../components/modals/QuestionPromptsDialog'

const WholeClassActivities = () => {
  const { day } = useParams()
  const context = useContext(AppContext)
  const navigate = useNavigate()

  if (!context) {
    return <div>Loading...</div>
  }

  const {
    lessonPlan,
    topic,
    setShowAIHelpDialog,
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
      <Header title="Generate Teaching Materials" onBack={() => navigate(`/day/${day}`)} />

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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activityOptions.map(option => (
                <button
                  key={option.id}
                  onClick={option.onClick}
                  className="group flex flex-col items-center rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-xl"
                >
                  <div
                    className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${option.color} text-2xl text-white shadow-lg`}
                  >
                    {option.icon}
                  </div>
                  <h4 className="group-hover:text-primary mb-2 text-center text-lg font-semibold text-neutral-800">
                    {option.title}
                  </h4>
                  <p className="text-center text-sm text-neutral-600">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* AI Help Section */}
          <div className="w-full rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
            <h3 className="mb-4 text-xl font-medium text-neutral-800">Need Help?</h3>
            <p className="mb-4 text-sm text-neutral-600">
              Get AI assistance for creating engaging whole class activities and materials.
            </p>
            <button
              onClick={() => setShowAIHelpDialog(true)}
              className="bg-primary hover:bg-primary/90 w-full rounded-xl px-4 py-3 font-medium text-white transition-all duration-200"
            >
              Get AI Help
            </button>
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

export default WholeClassActivities
