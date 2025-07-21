import { useContext } from 'react'
import { AppContext } from '../../context/app-context'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'

const AIHelpDialog = () => {
  const context = useContext(AppContext)

  if (!context) {
    return null
  }

  const { showAIHelpDialog, setShowAIHelpDialog, aiHelpPrompt, setAiHelpPrompt, aiHelpResponse, setAiHelpResponse } =
    context

  const handleAIHelpSubmit = () => {
    if (aiHelpPrompt.trim()) {
      const responses = {
        default: `Thank you for your question about "${aiHelpPrompt}". Here are some suggestions to help you address this student concern:\n\n1. **Break it down**: Start with the most basic concepts and build up gradually. Use simple language and relatable examples.\n\n2. **Use visual aids**: Create diagrams, drawings, or use physical objects to make abstract concepts more concrete.\n\n3. **Interactive approach**: Ask the student questions to gauge their understanding and adjust your explanation accordingly.\n\n4. **Real-world connections**: Connect the topic to things the student already knows or experiences in daily life.\n\n5. **Practice together**: Work through examples step by step with the student before asking them to try independently.\n\nWould you like me to provide more specific strategies for this particular situation?`,
        math: `For mathematical concepts, I recommend:\n\n• Start with concrete examples using objects they can touch and count\n• Use visual representations like drawings or charts\n• Break complex problems into smaller, manageable steps\n• Encourage the student to explain their thinking process\n• Provide plenty of practice with similar problems\n• Connect math to real-life situations they can relate to\n\nRemember to be patient and celebrate small victories to build their confidence!`,
        science: `For science topics, try these approaches:\n\n• Begin with hands-on experiments or demonstrations\n• Use analogies to compare new concepts with familiar things\n• Encourage questions and curiosity\n• Show real-world applications of the scientific concepts\n• Use storytelling to make the content more engaging\n• Break down complex processes into simple steps\n\nScience is best learned through exploration and discovery!`,
      }

      let response = responses.default
      if (
        aiHelpPrompt.toLowerCase().includes('math') ||
        aiHelpPrompt.toLowerCase().includes('calculation') ||
        aiHelpPrompt.toLowerCase().includes('number')
      ) {
        response = responses.math
      } else if (
        aiHelpPrompt.toLowerCase().includes('science') ||
        aiHelpPrompt.toLowerCase().includes('experiment') ||
        aiHelpPrompt.toLowerCase().includes('nature')
      ) {
        response = responses.science
      }

      setAiHelpResponse(response)
    }
  }

  return (
    <Dialog
      open={showAIHelpDialog}
      onOpenChange={open => {
        setShowAIHelpDialog(open)
        if (!open) {
          setAiHelpResponse('')
          setAiHelpPrompt('')
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
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            AI Teaching Assistant
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-0">
          <div className="mb-6">
            <label className="text-muted-foreground mb-3 block text-sm font-medium">
              Describe the student's doubt or question:
            </label>
            <div className="relative">
              <textarea
                value={aiHelpPrompt}
                onChange={e => setAiHelpPrompt(e.target.value)}
                placeholder="e.g., A student is confused about how to explain the concept of photosynthesis to a 3rd grader. How can I make it simpler?"
                rows={5}
                className="border-border focus:border-secondary text-foreground w-full resize-none rounded-2xl border-2 p-4 transition-colors duration-200 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
          <Button
            onClick={handleAIHelpSubmit}
            variant="secondary"
            className="w-full rounded-3xl px-6 py-4 font-medium transition-all duration-300"
            disabled={!aiHelpPrompt.trim()}
          >
            <span className="flex items-center justify-center">
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              Submit
            </span>
          </Button>
          {aiHelpResponse && (
            <div className="bg-muted border-secondary mt-6 rounded-2xl border-l-4 p-4">
              <h4 className="text-foreground mb-3 flex items-center text-lg font-medium">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Assistant Response
              </h4>
              <div className="text-foreground scrollbar-thin scrollbar-thumb-secondary scrollbar-track-muted max-h-64 overflow-y-auto pr-2 text-sm leading-relaxed whitespace-pre-line">
                {aiHelpResponse}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AIHelpDialog
