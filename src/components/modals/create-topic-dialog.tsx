import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { useLatestClassroom } from '@/queries/classroom-queries'
import { useCreateTopic } from '@/mutations/topic-mutations'
import { toast } from 'sonner'
import { PlusIcon } from 'lucide-react'

interface CreateTopicDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CreateTopicDialog = ({ open, onOpenChange }: CreateTopicDialogProps) => {
  const { data: latestClassroom, isLoading: isLoadingClassroom } = useLatestClassroom()
  const { mutate: createTopic, isPending: isCreatingTopic } = useCreateTopic()
  const [topic, setTopic] = useState('')
  const [learningOutcomes, setLearningOutcomes] = useState<Record<string, string>>({})
  const [topicCreatedId, setTopicCreatedId] = useState<number | null>(null)

  const grades = latestClassroom?.grades || []

  const handleLearningOutcomeChange = (gradeName: string, value: string) => {
    setLearningOutcomes(prev => ({ ...prev, [gradeName]: value }))
  }

  const canCreate = () => {
    if (!topic.trim()) return false
    return grades.every(g => learningOutcomes[g.name] && learningOutcomes[g.name].trim())
  }

  const handleCreateTopic = () => {
    if (!canCreate()) return
    const learning_outcomes = grades.map((grade, idx) => ({
      learning_outcomes: learningOutcomes[grade.name] || '',
      grade_id: grade.id ?? idx + 1,
    }))
    createTopic(
      { name: topic, learning_outcomes },
      {
        onSuccess: data => {
          setTopicCreatedId(data.id)
          toast.success('Topic created!')
          setTimeout(() => {
            onOpenChange(false)
            setTopic('')
            setLearningOutcomes({})
            setTopicCreatedId(null)
          }, 1000)
        },
        onError: error => {
          toast.error('Failed to create topic.')
        },
      },
    )
  }

  const handleClose = () => {
    onOpenChange(false)
    setTopic('')
    setLearningOutcomes({})
    setTopicCreatedId(null)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        if (!open) handleClose()
      }}
    >
      <DialogContent className="bg-background">
        <DialogHeader className="border-border border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <PlusIcon className="text-primary mr-2 h-5 w-5" />
              <DialogTitle className="text-foreground text-lg font-semibold">Create New Topic</DialogTitle>
            </div>
          </div>
        </DialogHeader>
        <div className="p-0">
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">Topic Name</label>
            <Input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g., Indian Geography, Mathematical Operations, etc."
              className="border-border focus:border-primary bg-background h-12 rounded-lg border-2 transition-colors focus:ring-0 focus:outline-none"
              disabled={isCreatingTopic || !!topicCreatedId}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">Learning Outcomes by Grade</label>
            <div className="space-y-3">
              {isLoadingClassroom ? (
                <div>Loading grades...</div>
              ) : grades.length === 0 ? (
                <div className="text-muted-foreground">No grades found in classroom.</div>
              ) : (
                grades.map(grade => (
                  <div key={grade.name}>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-600">{grade.name}</label>
                    <Textarea
                      value={learningOutcomes[grade.name] || ''}
                      onChange={e => handleLearningOutcomeChange(grade.name, e.target.value)}
                      placeholder="What should students learn from this topic?"
                      rows={3}
                      disabled={isCreatingTopic || !!topicCreatedId}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-border hover:bg-muted h-11 flex-1 rounded-lg border-2 font-medium"
              disabled={isCreatingTopic}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTopic}
              disabled={!canCreate() || isCreatingTopic || !!topicCreatedId}
              className="bg-primary hover:bg-primary/90 h-11 flex-1 rounded-lg font-medium disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              {isCreatingTopic ? 'Creating...' : 'Create Topic'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTopicDialog
