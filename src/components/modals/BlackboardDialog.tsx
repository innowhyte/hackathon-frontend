import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'

const BlackboardDialog = () => {
  const context = useContext(AppContext)

  if (!context) {
    return null
  }

  const { showBlackboardDialog, setShowBlackboardDialog, blackboardPrompt, setBlackboardPrompt } = context

  if (!showBlackboardDialog) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-neutral-98 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <h2 className="text-lg font-semibold text-neutral-800">Blackboard Drawing</h2>
          <button
            onClick={() => setShowBlackboardDialog(false)}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
          >
            <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col items-center p-6">
          <img
            src="/assets/black_board_drawing.jpg"
            alt="Blackboard Drawing"
            className="mb-6 w-full max-w-xs rounded-lg border border-neutral-200 bg-neutral-100 object-contain"
            style={{ background: '#222' }}
          />
          <div className="bg-neutral-98 mb-4 flex w-full items-center rounded-xl border border-neutral-200 px-4 py-3">
            <input
              type="text"
              value={blackboardPrompt}
              onChange={e => setBlackboardPrompt(e.target.value)}
              placeholder="Type to edit the image using a prompt..."
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
            className={`bg-primary-40 hover:shadow-elevation-3 active:shadow-elevation-1 text-primary-100 shadow-elevation-2 w-full rounded-2xl px-6 py-3 font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50`}
            disabled={!blackboardPrompt.trim()}
          >
            Update Drawing
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlackboardDialog
