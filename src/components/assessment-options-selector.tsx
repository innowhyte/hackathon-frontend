import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export interface OptionConfig {
  id: string
  label: string
  type: 'select' | 'button-group'
  options?: Array<{ value: string | number; label: string }>
  className?: string
}

export interface AssessmentOptionsConfig {
  [key: string]: OptionConfig[]
}

interface AssessmentOptionsSelectorProps {
  selectedType: string | null
  options: any
  onOptionsChange: (options: any) => void
  config: AssessmentOptionsConfig
  title?: string
  className?: string
}

export default function AssessmentOptionsSelector({
  selectedType,
  options,
  onOptionsChange,
  config,
  title = 'Assessment Options',
  className = '',
}: AssessmentOptionsSelectorProps) {
  if (!selectedType || !config[selectedType]) {
    return null
  }

  const handleOptionChange = (optionId: string, value: string | number) => {
    const currentTypeOptions = options[selectedType] || {}
    onOptionsChange({
      ...options,
      [selectedType]: {
        ...currentTypeOptions,
        [optionId]: value,
      },
    })
  }

  const renderOption = (option: OptionConfig) => {
    const currentValue = options[selectedType]?.[option.id]
    const defaultValue = option.options?.[0]?.value

    if (option.type === 'select') {
      return (
        <Select
          key={option.id}
          value={currentValue?.toString() || defaultValue?.toString() || ''}
          onValueChange={value => handleOptionChange(option.id, value)}
        >
          <SelectTrigger className="focus:border-primary h-12! w-full rounded-lg border border-neutral-200 bg-white p-3 text-neutral-800 focus:ring-0 focus:outline-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {option.options?.map(opt => (
              <SelectItem key={opt.value} value={opt.value.toString()} className="h-10!">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (option.type === 'button-group') {
      return (
        <div key={option.id} className={`flex gap-2 ${option.className || ''}`}>
          {option.options?.map(opt => (
            <Button
              key={opt.value}
              onClick={() => handleOptionChange(option.id, opt.value)}
              variant={(currentValue || defaultValue) === opt.value ? 'default' : 'outline'}
              className="flex-1 py-2 text-sm"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      )
    }

    return null
  }

  return (
    <div className={`rounded-lg border border-neutral-200 bg-white p-4 shadow-sm ${className}`}>
      <h2 className="mb-3 text-base font-medium text-neutral-800">{title}</h2>
      <div className="space-y-4">
        {config[selectedType].map(option => (
          <div key={option.id}>
            <label className="mb-2 block text-sm font-medium text-neutral-700">{option.label}</label>
            {renderOption(option)}
          </div>
        ))}
      </div>
    </div>
  )
}
