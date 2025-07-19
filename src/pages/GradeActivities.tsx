import { useNavigate, useParams } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import Header from '../components/Header'
import AIHelpDialog from '../components/modals/AIHelpDialog'

const GradeActivities = () => {
  const context = useContext(AppContext)
  const navigate = useNavigate()
  const { day, gradeId } = useParams()

  if (!context) {
    return <div>Loading...</div>
  }

  const {
    activeGradeId,
    gradeActivitiesSelections,
    setGradeActivitiesSelections,
    modeOfInteractionOptions,
    modalityOptions,
  } = context

  // Determine if this is whole class activities or grade-specific activities
  const isWholeClass = !gradeId
  const currentGradeId = gradeId ? parseInt(gradeId) : activeGradeId

  const handleModeSelect = (modeId: string) => {
    setGradeActivitiesSelections((prev: any) => ({
      ...prev,
      [day as string]: {
        ...prev[day as string],
        [currentGradeId as number]: {
          ...(prev[day as string]?.[currentGradeId as number] || {}),
          mode: modeId,
        },
      },
    }))
  }

  const handleModalityToggle = (modalityId: string) => {
    setGradeActivitiesSelections((prev: any) => {
      const current = prev[day as string]?.[currentGradeId as number]?.modalities || []
      const newModalities = current.includes(modalityId)
        ? current.filter((id: string) => id !== modalityId)
        : [...current, modalityId]
      return {
        ...prev,
        [day as string]: {
          ...prev[day as string],
          [currentGradeId as number]: {
            ...(prev[day as string]?.[currentGradeId as number] || {}),
            modalities: newModalities,
          },
        },
      }
    })
  }

  return (
    <div className="bg-background min-h-screen">
      <Header
        title={isWholeClass ? 'Whole Class Activities' : `Grade ${currentGradeId} Activities`}
        onBack={() => navigate(`/day/${day}`)}
      />
      <div className="mb-4 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Mode of Interaction */}
          <div className="mb-8">
            <h3 className="mb-3 text-base font-medium text-neutral-800">Mode of Interaction</h3>
            <div className="flex flex-wrap gap-3">
              {modeOfInteractionOptions.map(option => {
                const selected =
                  gradeActivitiesSelections[day as string]?.[currentGradeId as number]?.mode === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => handleModeSelect(option.id)}
                    className={`flex items-center gap-2 rounded-xl border-2 px-5 py-2 text-base font-medium transition-all duration-200 ${selected ? 'bg-primary border-primary text-white' : 'text-neutral-30 border-neutral-80 hover:border-primary hover:text-primary bg-white'}`}
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
                  </button>
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
                const selected = (
                  gradeActivitiesSelections[day as string]?.[currentGradeId as number]?.modalities || []
                ).includes(option.id)
                return (
                  <button
                    key={option.id}
                    onClick={() => handleModalityToggle(option.id)}
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
                  </button>
                )
              })}
            </div>
          </div>
          {/* Generate Button (always visible if ready) */}
          {gradeActivitiesSelections[day as string]?.[currentGradeId as number]?.mode &&
            (gradeActivitiesSelections[day as string]?.[currentGradeId as number]?.modalities || []).length > 0 && (
              <button
                onClick={() => {
                  navigate(`/day/${day}/grade/${currentGradeId}/carousel`)
                }}
                className="bg-primary hover:bg-primary/90 mb-8 w-full rounded-xl px-6 py-3 font-medium text-white shadow-sm transition-all duration-200"
              >
                Generate
              </button>
            )}
        </div>
      </div>
      <AIHelpDialog />
    </div>
  )
}

export default GradeActivities
