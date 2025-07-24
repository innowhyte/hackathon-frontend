import { Button } from './ui/button'

export interface AssessmentTypeConfig {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

interface AssessmentTypeSelectorProps {
  selectedType: string | null
  onTypeSelect: (type: string) => void
  onClearGenerated?: () => void
  config: AssessmentTypeConfig[]
  title?: string
  className?: string
}

export default function AssessmentTypeSelector({
  selectedType,
  onTypeSelect,
  onClearGenerated,
  config,
  title = 'Select Assessment Type',
  className = '',
}: AssessmentTypeSelectorProps) {
  const handleTypeSelect = (type: string) => {
    onTypeSelect(type)
    if (onClearGenerated) {
      onClearGenerated()
    }
  }

  return (
    <div className={`rounded-lg border border-neutral-200 bg-white p-4 shadow-sm ${className}`}>
      <h2 className="mb-3 text-base font-medium text-neutral-800">{title}</h2>
      <div className="space-y-3">
        {config.map(assessmentType => (
          <Button
            key={assessmentType.id}
            onClick={() => handleTypeSelect(assessmentType.id)}
            variant={selectedType === assessmentType.id ? 'assessmentSelected' : 'assessment'}
            className="h-auto w-full justify-start"
          >
            <div className="flex w-full flex-col items-start">
              <div className="flex min-w-0 flex-row items-center gap-2">
                <div className="text-primary mt-0.5 h-8 w-8 flex-shrink-0">{assessmentType.icon}</div>
                <div className="text-base font-medium text-neutral-800">{assessmentType.title}</div>
              </div>
              <div className="mt-1 text-base leading-relaxed text-neutral-600">{assessmentType.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
