import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'

const QuestionPromptsDialog = () => {
  const context = useContext(AppContext)

  if (!context) {
    return null
  }

  const {
    showQuestionPromptsDialog,
    setShowQuestionPromptsDialog,
    questionPromptsPrompt,
    setQuestionPromptsPrompt,
    topic,
  } = context

  if (!showQuestionPromptsDialog) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-neutral-98 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <h2 className="text-lg font-semibold text-neutral-800">Question Prompts</h2>
          <button
            onClick={() => setShowQuestionPromptsDialog(false)}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
          >
            <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <div className="bg-primary-90 mb-6 rounded-xl p-4">
            <h3 className="mb-3 text-lg font-medium text-neutral-800">Sample Question Prompts:</h3>
            <div className="space-y-2 text-sm text-neutral-700">
              <p>• "What do you already know about {topic}?"</p>
              <p>• "How do you think {topic} affects our daily lives?"</p>
              <p>• "What questions do you have about {topic}?"</p>
              <p>• "Can you think of examples of {topic} in your community?"</p>
              <p>• "What would happen if we didn't have {topic}?"</p>
            </div>
          </div>
          <div className="bg-neutral-98 mb-4 flex w-full items-center rounded-xl border border-neutral-200 px-4 py-3">
            <input
              type="text"
              value={questionPromptsPrompt}
              onChange={e => setQuestionPromptsPrompt(e.target.value)}
              placeholder="Type to customize the question prompts..."
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
            className={`bg-secondary-40 hover:shadow-elevation-3 active:shadow-elevation-1 text-secondary-100 shadow-elevation-2 w-full rounded-2xl px-6 py-3 font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50`}
            disabled={!questionPromptsPrompt.trim()}
          >
            Update Prompts
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuestionPromptsDialog
