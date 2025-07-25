import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { useGameGeneration } from '../../hooks/use-game-generation'
import { Loader2, Send, Save, X } from 'lucide-react'
import type { Classroom } from '@/queries/classroom-queries'
import type { Game } from '@/hooks/use-game-generation'
import { useGame } from '../../queries/game-queries'
import { useSaveGame } from '../../mutations/game-mutations'
import { toast } from 'sonner'

const GamifiedDialog = ({
  topic_id,
  day_id,
  showGamifiedDialog,
  setShowGamifiedDialog,
  latestClassroom,
}: {
  topic_id: number | string
  day_id: string
  showGamifiedDialog: boolean
  setShowGamifiedDialog: (show: boolean) => void
  latestClassroom: Classroom
}) => {
  // Game generation hook
  const { isGenerating, progress, generateGame, cancelGeneration, reset } = useGameGeneration()

  // Game query and mutation
  const { data: fetchedGame, isLoading: isGameLoading } = useGame(
    typeof topic_id === 'number' ? topic_id : parseInt(topic_id, 10),
    day_id.toString(),
  )
  const saveGameMutation = useSaveGame()

  // State for game generation
  const [threadId] = useState(() => crypto.randomUUID())
  const [generatedGame, setGeneratedGame] = useState<Game | null>(null)
  const [currentMessage, setCurrentMessage] = useState('')

  // Reset game when dialog opens
  useEffect(() => {
    if (showGamifiedDialog) {
      setGeneratedGame(null)
      setCurrentMessage('')
      reset()
    }
  }, [showGamifiedDialog, reset])

  const handleSendMessage = async () => {
    const message = currentMessage.trim()

    // Clear input
    setCurrentMessage('')

    // Prepare previous_game if available
    let previous_game: Game | null | undefined = undefined
    if (generatedGame) {
      previous_game = generatedGame
    } else if (fetchedGame) {
      previous_game = fetchedGame
    }

    // Generate game response
    await generateGame({
      latestClassroom,
      day_id: day_id.toString(),
      topic_id: topic_id.toString(),
      teacher_requirements: message,
      thread_id: threadId,
      previous_game: previous_game,
      onGameGenerated: gameObj => {
        setGeneratedGame(gameObj)
      },
      onError: errorMessage => {
        console.error('Error:', errorMessage)
        toast.error('Failed to generate game')
      },
    })
  }

  const handleSaveToDatabase = () => {
    if (!generatedGame) return
    saveGameMutation.mutate(
      {
        day_id: day_id.toString(),
        topic_id: topic_id.toString(),
        name: generatedGame.name,
        description: generatedGame.description,
        materials_required: generatedGame.materials_required,
        rules: generatedGame.rules,
        game_play: generatedGame.game_play,
        game_purpose: generatedGame.game_purpose,
      },
      {
        onSuccess: () => {
          toast.success('Game saved!')
        },
        onError: () => {
          toast.error('Failed to save game')
        },
      },
    )
  }

  const currentGame = generatedGame || fetchedGame

  return (
    <Dialog
      open={showGamifiedDialog}
      onOpenChange={open => {
        setShowGamifiedDialog(open)
      }}
    >
      <DialogContent
        className="max-h-[90vh] overflow-y-auto"
        onInteractOutside={e => {
          e.preventDefault()
        }}
        onEscapeKeyDown={e => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-start">
            <div className="flex items-center justify-start">
              <svg className="text-secondary mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Games
            </div>
          </DialogTitle>
          <DialogDescription className="text-start">Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <div className="p-0">
          {/* Game Display */}
          <div className="mb-6">
            {isGameLoading ? (
              <div className="bg-muted rounded-xl p-4 text-center text-sm">Loading game...</div>
            ) : currentGame ? (
              <div className="bg-muted rounded-xl p-4">
                <h4 className="text-foreground mb-3 flex items-center text-lg font-medium">
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {generatedGame ? 'Generated Game' : 'Saved Game'}: {currentGame.name}
                </h4>
                <div className="text-foreground scrollbar-thin scrollbar-thumb-secondary scrollbar-track-muted max-h-78 overflow-y-auto pr-2 text-sm leading-relaxed">
                  <div className="mb-3">
                    <span className="font-semibold">Description:</span>
                    <p className="mt-1 ml-2">{currentGame.description}</p>
                  </div>
                  <div className="mb-3">
                    <span className="font-semibold">Purpose:</span>
                    <p className="mt-1 ml-2">{currentGame.game_purpose}</p>
                  </div>
                  <div className="mb-3">
                    <span className="font-semibold">Materials Required:</span>
                    <ul className="mt-1 ml-4 list-disc">
                      {currentGame.materials_required &&
                        currentGame.materials_required.map((material, index) => <li key={index}>{material}</li>)}
                    </ul>
                  </div>
                  <div className="mb-3">
                    <span className="font-semibold">Rules:</span>
                    <ul className="mt-1 ml-4 list-decimal">
                      {currentGame.rules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-3">
                    <span className="font-semibold">How to Play:</span>
                    <p className="mt-1 ml-2 whitespace-pre-wrap">{currentGame.game_play}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-muted rounded-xl p-4">
                <div className="text-foreground text-sm leading-relaxed">
                  <p>The game will be generated based on the topic and your requirements.</p>
                </div>
              </div>
            )}
          </div>

          {/* Progress Display */}
          {isGenerating && progress && (
            <div className="bg-muted mb-4 flex items-center gap-2 rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">{progress}</span>
            </div>
          )}

          {/* Input Area */}
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={currentMessage}
                onChange={e => {
                  setCurrentMessage(e.target.value)
                }}
                placeholder="e.g., Make it more interactive with physical movements, or focus on specific learning objectives"
                rows={4}
                className="border-border focus:border-secondary text-foreground w-full resize-none rounded-2xl border-2 p-4 transition-colors duration-200 focus:ring-0 focus:outline-none"
                disabled={isGenerating}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1">
              <Button
                onClick={handleSendMessage}
                variant="secondary"
                className="flex-1 rounded-3xl px-6 py-4 font-medium transition-all duration-300"
                disabled={isGenerating}
              >
                <span className="flex items-center justify-center">
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Generate Game
                    </>
                  )}
                </span>
              </Button>

              {isGenerating && (
                <Button variant="outline" onClick={cancelGeneration} className="rounded-3xl px-4 py-4">
                  <X className="h-5 w-5" />
                </Button>
              )}

              <Button
                variant="outline"
                onClick={handleSaveToDatabase}
                className="rounded-3xl px-6 py-4"
                disabled={saveGameMutation.isPending || !generatedGame}
              >
                {saveGameMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GamifiedDialog
