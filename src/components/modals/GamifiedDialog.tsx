import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'

const GamifiedDialog = () => {
  const context = useContext(AppContext)

  if (!context) {
    return null
  }

  const { showGamifiedDialog, setShowGamifiedDialog, gamifiedPrompt, setGamifiedPrompt, topic } = context

  if (!showGamifiedDialog) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-neutral-98 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <h2 className="text-lg font-semibold text-neutral-800">Gamified Activities</h2>
          <button
            onClick={() => setShowGamifiedDialog(false)}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
          >
            <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <div className="bg-secondary-90 mb-6 rounded-xl p-4">
            <h3 className="mb-3 text-lg font-medium text-neutral-800">How to conduct the game in class:</h3>
            <div className="space-y-3 text-sm text-neutral-700">
              <p>
                <strong>1. Setup:</strong> Divide the class into teams of 4-5 students. Each team gets a set of {topic}
                -related cards or materials.
              </p>
              <p>
                <strong>2. Game Rules:</strong> Teams compete to answer questions or complete tasks related to {topic}.
                Points are awarded for correct answers and creative solutions.
              </p>
              <p>
                <strong>3. Rounds:</strong> Play 3-4 rounds with increasing difficulty. Each round focuses on different
                aspects of {topic}.
              </p>
              <p>
                <strong>4. Scoring:</strong> Keep track of points on the board. Bonus points for teamwork and helping
                others.
              </p>
              <p>
                <strong>5. Conclusion:</strong> Announce the winning team and review key learning points from the game.
              </p>
            </div>
          </div>
          <div className="bg-neutral-98 mb-4 flex w-full items-center rounded-xl border border-neutral-200 px-4 py-3">
            <input
              type="text"
              value={gamifiedPrompt}
              onChange={e => setGamifiedPrompt(e.target.value)}
              placeholder="Type to customize the game instructions..."
              className="flex-1 bg-transparent text-base text-neutral-800 outline-none"
            />
            <button className="ml-2 rounded-full p-2 hover:bg-neutral-200">
              <svg className="h-5 w-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          </div>
          <button
            className={`bg-primary hover:shadow-elevation-3 active:shadow-elevation-1 text-primary-foreground shadow-elevation-2 w-full rounded-2xl px-6 py-3 font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50`}
            disabled={!gamifiedPrompt.trim()}
          >
            Update Game
          </button>
        </div>
      </div>
    </div>
  )
}

export default GamifiedDialog
