import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'

const StoryDialog = () => {
  const context = useContext(AppContext)

  if (!context) {
    return null
  }

  const { showStoryDialog, setShowStoryDialog, storyPrompt, setStoryPrompt } = context

  if (!showStoryDialog) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-neutral-98 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <h2 className="text-lg font-semibold text-neutral-800">Story Based Learning</h2>
          <button
            onClick={() => setShowStoryDialog(false)}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
          >
            <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col p-6">
          <div className="bg-primary-90 mb-6 rounded-xl p-4">
            <h3 className="text-primary-10 mb-3 text-lg font-medium">Story</h3>
            <div className="scrollbar-thin scrollbar-thumb-primary-40 scrollbar-track-primary-80 max-h-64 overflow-y-auto pr-2">
              <p className="text-sm leading-relaxed text-neutral-700">
                Our story begins in the bustling city of Bengaluru, right in the heart of Cubbon Park. Imagine a tiny,
                adventurous water droplet named Droplet. Droplet loved his life in a small puddle near a vibrant
                flowerbed. One morning, as the Bengaluru sun began to climb high in the sky, Droplet felt something
                peculiar. The air around him was getting warmer and warmer.
                <br />
                "Woah, it's getting toasty!" Droplet exclaimed. He noticed his friends, other little water droplets in
                the puddle, were also feeling the heat. As the sun's rays intensified, Droplet felt himself getting
                lighter and lighter. He was no longer a liquid! He was transforming into something invisible, something
                airy. It was like he was floating upwards, becoming a tiny puff of mist.
                <br />
                "This is amazing!" Droplet thought. He was no longer bound to the ground. He was rising, higher and
                higher, leaving the park behind. This incredible journey, where the sun's warm hug turned him from
                liquid water into an invisible gas called water vapor, was just the beginning of his grand adventure. He
                was *evaporating*!
              </p>
            </div>
          </div>
          <div className="bg-neutral-98 mb-4 flex w-full items-center rounded-xl border border-neutral-200 px-4 py-3">
            <input
              type="text"
              value={storyPrompt}
              onChange={e => setStoryPrompt(e.target.value)}
              placeholder="Type to customize the story..."
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
            disabled={!storyPrompt.trim()}
          >
            Edit Story
          </button>
        </div>
      </div>
    </div>
  )
}

export default StoryDialog
