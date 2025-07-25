import { useNavigate, useParams, useSearchParams } from 'react-router'
import { useTitle } from '../hooks/use-title'
import { useState } from 'react'
import Header from '../components/header'
import { Button } from '../components/ui/button'
import AIHelpDialog from '../components/modals/ai-help-dialog'
import BlackboardDialog from '../components/modals/blackboard-dialog'
import VideoDialog from '../components/modals/video-dialog'
import StoryDialog from '../components/modals/story-dialog'
import FlashcardDialog from '../components/modals/flashcard-dialog'
import GamifiedDialog from '../components/modals/gamified-dialog'
import QuestionPromptsDialog from '../components/modals/question-prompts-dialog'
import { useLatestClassroom } from '@/queries/classroom-queries'
import TopicSelector from '../components/topic-selector'
import { useAllTopics } from '../queries/topic-queries'
import Loading from '@/components/loading'

export default function WholeClassMaterials() {
  const { day } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const topicIdParam = searchParams.get('topicId')
  const topicId = topicIdParam ? parseInt(topicIdParam) : null
  useTitle(`Day ${day} | Teaching Materials`)
  const navigate = useNavigate()
  const [showStoryDialog, setShowStoryDialog] = useState(false)
  const [showBlackboardDialog, setShowBlackboardDialog] = useState(false)
  const [showFlashcardDialog, setShowFlashcardDialog] = useState(false)
  const [showGamifiedDialog, setShowGamifiedDialog] = useState(false)
  const [showQuestionPromptsDialog, setShowQuestionPromptsDialog] = useState(false)
  const [showVideoDialog, setShowVideoDialog] = useState(false)
  const [showAIHelpDialog, setShowAIHelpDialog] = useState(false)
  const { data: latestClassroom, isLoading: isLoadingClassroom } = useLatestClassroom()
  const { data: topics, isLoading: isLoadingTopics } = useAllTopics()

  if (isLoadingClassroom) {
    return <Loading message="Loading classroom..." />
  }

  if (!latestClassroom) {
    return <div>No classroom found</div>
  }

  if (isLoadingTopics) {
    return <Loading message="Loading topics..." />
  }

  // Get lesson plan from selected topic
  const selectedTopic = topics?.find(t => t.id === topicId)
  const lessonPlan = selectedTopic?.weekly_plan || {}

  const selectedDay = parseInt(day || '1')
  const currentDayPlan = lessonPlan ? lessonPlan[`day_${selectedDay}`] : undefined

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
    {
      id: 'video',
      title: 'Video',
      description: 'Generate a video for the lesson',
      icon: '🎥',
      color: 'bg-red-500',
      onClick: () => setShowVideoDialog(true),
    },
  ]

  return (
    <div className="bg-background min-h-screen">
      <Header
        title="Teaching Materials"
        onBack={() => {
          if (topicId) {
            navigate(`/day/${day}?topicId=${topicId}`)
          } else {
            navigate(`/day/${day}`)
          }
        }}
        showAIHelp={true}
        onShowAIHelp={() => setShowAIHelpDialog(true)}
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

          {/* Lesson Content */}
          {topicId && currentDayPlan && (
            <div className="mb-8 w-full rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
              <h3 className="mb-4 text-xl font-medium text-neutral-800">What to teach in class:</h3>
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-sm leading-relaxed text-neutral-700">
                  {currentDayPlan.whole_class_introduction_plan}
                </p>
              </div>
            </div>
          )}

          {/* Activity Options */}
          {topicId && (
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
          )}
        </div>
      </div>

      {/* Dialogs */}
      <AIHelpDialog showAIHelpDialog={showAIHelpDialog} setShowAIHelpDialog={setShowAIHelpDialog} />
      {topicId && day && (
        <BlackboardDialog
          topic_id={topicId}
          day_id={day}
          showBlackboardDialog={showBlackboardDialog}
          setShowBlackboardDialog={setShowBlackboardDialog}
          latestClassroom={latestClassroom}
        />
      )}
      {topicId && day && (
        <StoryDialog
          topic_id={topicId.toString()}
          day_id={day?.toString()}
          showStoryDialog={showStoryDialog}
          setShowStoryDialog={setShowStoryDialog}
          latestClassroom={latestClassroom}
        />
      )}
      {topicId && day && (
        <FlashcardDialog
          topic_id={topicId}
          day_id={day}
          showFlashcardDialog={showFlashcardDialog}
          setShowFlashcardDialog={setShowFlashcardDialog}
          latestClassroom={latestClassroom}
        />
      )}
      {topicId && day && (
        <GamifiedDialog
          topic_id={topicId}
          day_id={day}
          showGamifiedDialog={showGamifiedDialog}
          setShowGamifiedDialog={setShowGamifiedDialog}
          latestClassroom={latestClassroom}
        />
      )}
      {topicId && day && (
        <QuestionPromptsDialog
          topic_id={topicId}
          day_id={day}
          showQuestionPromptsDialog={showQuestionPromptsDialog}
          setShowQuestionPromptsDialog={setShowQuestionPromptsDialog}
          latestClassroom={latestClassroom}
        />
      )}
      {topicId && day && (
        <VideoDialog
          topic_id={topicId}
          day_id={day}
          showVideoDialog={showVideoDialog}
          setShowVideoDialog={setShowVideoDialog}
          latestClassroom={latestClassroom}
        />
      )}
    </div>
  )
}
