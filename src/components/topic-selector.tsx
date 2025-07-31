import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useAllTopics } from '../queries/topic-queries'

interface TopicSelectorProps {
  selectedTopicId: number | null
  onTopicChange: (topicId: number) => void
  classroomId: string | undefined
}

export default function TopicSelector({ selectedTopicId, onTopicChange, classroomId }: TopicSelectorProps) {
  const { data: topics, isLoading, error } = useAllTopics(classroomId)

  return (
    <div className="mb-4">
      <Select
        value={selectedTopicId?.toString() || ''}
        onValueChange={value => onTopicChange(Number(value))}
        disabled={isLoading}
      >
        <SelectTrigger className="border-border focus:border-primary h-14! w-full rounded-xl border-2 text-base transition-colors focus:ring-0 focus:outline-none disabled:opacity-50">
          <SelectValue placeholder={isLoading ? 'Loading topics...' : 'Select a topic'} />
        </SelectTrigger>
        <SelectContent>
          {topics && topics.length > 0 ? (
            topics.map(topic => (
              <SelectItem key={topic.id} value={topic.id.toString()} className="h-10!">
                {topic.name}
              </SelectItem>
            ))
          ) : (
            <span className="block px-4 py-2 text-sm text-neutral-500">
              {isLoading
                ? 'Loading topics...'
                : error
                  ? 'Error loading topics'
                  : 'No topics found. Please create a topic first.'}
            </span>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
