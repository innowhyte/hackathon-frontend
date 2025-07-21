import { useContext } from 'react'
import { AppContext } from '../../context/app-context'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'

const StoryDialog = () => {
  const context = useContext(AppContext)

  if (!context) {
    return null
  }

  const { showStoryDialog, setShowStoryDialog, storyPrompt, setStoryPrompt } = context

  const handleStorySubmit = () => {
    if (storyPrompt.trim()) {
      // Handle story generation logic here
      console.log('Generating story with prompt:', storyPrompt)
    }
  }

  return (
    <Dialog
      open={showStoryDialog}
      onOpenChange={open => {
        setShowStoryDialog(open)
        if (!open) {
          setStoryPrompt('')
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <svg className="text-secondary mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Story-Based Learning Generator
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-0">
          <div className="mb-6">
            <div className="bg-muted mb-4 rounded-xl p-4">
              <h4 className="text-foreground mb-3 flex items-center text-lg font-medium">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Sample Story
              </h4>
              <div className="text-foreground scrollbar-thin scrollbar-thumb-secondary scrollbar-track-muted max-h-64 overflow-y-auto pr-2 text-sm leading-relaxed">
                <p>
                  Our story begins in the bustling city of Bengaluru, right in the heart of Cubbon Park. Imagine a tiny,
                  adventurous water droplet named Droplet. Droplet loved his life in a small puddle near a vibrant
                  flowerbed. One morning, as the Bengaluru sun began to climb high in the sky, Droplet felt something
                  peculiar. The air around him was getting warmer and warmer.
                </p>
                <p className="mt-2">
                  "Woah, it's getting toasty!" Droplet exclaimed. He noticed his friends, other little water droplets in
                  the puddle, were also feeling the heat. As the sun's rays intensified, Droplet felt himself getting
                  lighter and lighter. He was no longer a liquid! He was transforming into something invisible,
                  something airy. It was like he was floating upwards, becoming a tiny puff of mist.
                </p>
                <p className="mt-2">
                  "This is amazing!" Droplet thought. He was no longer bound to the ground. He was rising, higher and
                  higher, leaving the park behind. This incredible journey, where the sun's warm hug turned him from
                  liquid water into an invisible gas called water vapor, was just the beginning of his grand adventure.
                  He was *evaporating*!
                </p>
              </div>
            </div>
            <label className="text-muted-foreground mb-3 block text-sm font-medium">
              Customize the story for your lesson:
            </label>
            <div className="relative">
              <textarea
                value={storyPrompt}
                onChange={e => setStoryPrompt(e.target.value)}
                placeholder="e.g., Make the story more focused on the water cycle stages, or change the setting to a local landmark"
                rows={4}
                className="border-border focus:border-secondary text-foreground w-full resize-none rounded-2xl border-2 p-4 transition-colors duration-200 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
          <Button
            onClick={handleStorySubmit}
            variant="secondary"
            className="w-full rounded-3xl px-6 py-4 font-medium transition-all duration-300"
            disabled={!storyPrompt.trim()}
          >
            <span className="flex items-center justify-center">
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Generate Story
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default StoryDialog
