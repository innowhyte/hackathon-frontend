import { useNavigate, useParams, useSearchParams } from 'react-router'
import { useTitle } from '../hooks/use-title'
import React from 'react'
import Header from '../components/header'
import { Button } from '../components/ui/button'
import AIHelpDialog from '../components/modals/ai-help-dialog'
import Loading from '@/components/loading'

const GRADE_ACTIVITIES_SELECTIONS_KEY = 'gradeActivitiesSelections'

const modeOfInteractionOptions = [
  { id: 'independent', label: 'Work independently' },
  { id: 'peer', label: 'Work with each other' },
  { id: 'teacher', label: 'Work with the teacher' },
]

const modalityOptions = [
  { id: 'visual', label: 'Visual' },
  { id: 'auditory', label: 'Auditory' },
  { id: 'kinesthetic', label: 'Activity based' },
  { id: 'paper', label: 'Paper/Slate based' },
]

export default function GradeActivities() {
  const { day, gradeId } = useParams()
  const [searchParams] = useSearchParams()
  const topicIdParam = searchParams.get('topicId')
  const topicId = topicIdParam ? parseInt(topicIdParam) : null
  useTitle(`Day ${day} | Grade ${gradeId} Activities`)
  const navigate = useNavigate()

  // Local state for gradeActivitiesSelections
  const [gradeActivitiesSelections, setGradeActivitiesSelections] = React.useState<Record<string, Record<string, any>>>(
    () => {
      try {
        const stored = localStorage.getItem(GRADE_ACTIVITIES_SELECTIONS_KEY)
        return stored ? JSON.parse(stored) : {}
      } catch {
        return {}
      }
    },
  )

  // Save to localStorage on change
  React.useEffect(() => {
    localStorage.setItem(GRADE_ACTIVITIES_SELECTIONS_KEY, JSON.stringify(gradeActivitiesSelections))
  }, [gradeActivitiesSelections])

  const currentGradeId = gradeId ? gradeId : 'whole_class'

  const handleModeSelect = (modeId: string) => {
    setGradeActivitiesSelections(prev => {
      const updated = {
        ...prev,
        [day as string]: {
          ...prev[day as string],
          [currentGradeId]: {
            ...(prev[day as string]?.[currentGradeId] || {}),
            mode: modeId,
          },
        },
      }
      return updated
    })
  }

  const handleModalityToggle = (modalityId: string) => {
    setGradeActivitiesSelections(prev => {
      const current = prev[day as string]?.[currentGradeId]?.modalities || []
      const newModalities = current.includes(modalityId)
        ? current.filter((id: string) => id !== modalityId)
        : [...current, modalityId]
      const updated = {
        ...prev,
        [day as string]: {
          ...prev[day as string],
          [currentGradeId]: {
            ...(prev[day as string]?.[currentGradeId] || {}),
            modalities: newModalities,
          },
        },
      }
      return updated
    })
  }

  const selections = gradeActivitiesSelections[day as string]?.[currentGradeId] || {}

  return (
    <div className="bg-background min-h-screen">
      <Header
        title={`Grade ${gradeId} Activities`}
        onBack={() => {
          if (topicId) {
            navigate(`/day/${day}?topicId=${topicId}`)
          } else {
            navigate(`/day/${day}`)
          }
        }}
      />
      <div className="mb-4 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Mode of Interaction */}
          <div className="mb-8">
            <h3 className="mb-3 text-base font-medium text-neutral-800">Mode of Interaction</h3>
            <div className="flex flex-wrap gap-3">
              {modeOfInteractionOptions.map(option => {
                const selected = selections.mode === option.id
                return (
                  <Button
                    key={option.id}
                    onClick={() => handleModeSelect(option.id)}
                    variant={selected ? 'default' : 'outline'}
                    size="sm"
                    className={`flex items-center gap-2 rounded-xl border-2 px-5 py-2 text-base font-medium transition-all duration-200 ${selected ? 'bg-primary border-primary text-primary-foreground' : 'text-neutral-30 border-neutral-80 hover:border-primary hover:text-primary bg-white'}`}
                    style={{ minWidth: 'fit-content' }}
                  >
                    {selected && (
                      <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        />
                      </svg>
                    )}
                    {option.label}
                  </Button>
                )
              })}
            </div>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-base font-medium text-neutral-800">
              Modality <span className="text-xs text-neutral-500">(Select all that apply)</span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {modalityOptions.map(option => {
                const selected = (selections.modalities || []).includes(option.id)
                return (
                  <Button
                    key={option.id}
                    onClick={() => handleModalityToggle(option.id)}
                    variant={selected ? 'secondary' : 'outline'}
                    size="sm"
                    className={`flex items-center gap-2 rounded-xl border-2 px-5 py-2 text-base font-medium transition-all duration-200 ${selected ? 'bg-secondary-90 text-secondary-40 border-secondary-40' : 'text-neutral-30 border-neutral-80 hover:border-secondary-40 hover:text-secondary-40 bg-white'}`}
                    style={{ minWidth: 'fit-content' }}
                  >
                    {selected && (
                      <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        />
                      </svg>
                    )}
                    {option.label}
                  </Button>
                )
              })}
            </div>
          </div>
          {/* Generate Button (always visible if ready) */}
          {selections.mode && (selections.modalities || []).length > 0 && (
            <Button
              onClick={() => {
                if (topicId) {
                  navigate(`/day/${day}/grade/${gradeId}/activities?topicId=${topicId}`)
                } else {
                  navigate(`/day/${day}/grade/${gradeId}/activities`)
                }
              }}
              className="mb-8 w-full rounded-xl px-6 py-3 font-medium shadow-sm transition-all duration-200"
            >
              Generate
            </Button>
          )}
        </div>
      </div>
      <AIHelpDialog />
    </div>
  )
}
