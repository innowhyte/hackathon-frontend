import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useCreateOrUpdateClassroom } from '../../mutations/classroom-mutations'
import { toast } from 'sonner'

interface CreateClassroomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateClassroomDialog({ open, onOpenChange }: CreateClassroomDialogProps) {
  const [location, setLocation] = useState('')
  const [language, setLanguage] = useState('')
  const [selectedGrades, setSelectedGrades] = useState<number[]>([])
  const [specialInstructions, setSpecialInstructions] = useState<{ [key: number]: string }>({})

  const grades = [
    { id: 1, name: 'Grade 1' },
    { id: 2, name: 'Grade 2' },
    { id: 3, name: 'Grade 3' },
    { id: 4, name: 'Grade 4' },
    { id: 5, name: 'Grade 5' },
  ]

  const createClassroomMutation = useCreateOrUpdateClassroom()

  const handleGradeToggle = (gradeId: number) => {
    setSelectedGrades(prev => {
      if (prev.includes(gradeId)) {
        const newSelected = prev.filter(id => id !== gradeId)
        const newInstructions = { ...specialInstructions }
        delete newInstructions[gradeId]
        setSpecialInstructions(newInstructions)
        return newSelected
      } else {
        return [...prev, gradeId]
      }
    })
  }

  // const handleSpecialInstructionsChange = (gradeId: number, value: string) => {
  //   setSpecialInstructions(prev => ({
  //     ...prev,
  //     [gradeId]: value,
  //   }))
  // }

  const handleSubmit = () => {
    if (!location.trim() || !language.trim() || selectedGrades.length === 0) {
      toast.error('Please fill in all required fields and select at least one grade')
      return
    }

    const payload = {
      location: location.trim(),
      language: language.trim(),
      grades: selectedGrades.map(gradeId => ({
        name: grades.find(g => g.id === gradeId)?.name || `Grade ${gradeId}`,
        special_instructions: specialInstructions[gradeId] || '',
      })),
    }

    createClassroomMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Classroom created successfully!')
        onOpenChange(false)
        // Reset form
        setLocation('')
        setLanguage('')
        setSelectedGrades([])
        setSpecialInstructions({})
      },
      onError: () => {
        toast.error('Failed to create classroom')
      },
    })
  }

  const handleCancel = () => {
    onOpenChange(false)
    // Reset form
    setLocation('')
    setLanguage('')
    setSelectedGrades([])
    setSpecialInstructions({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Classroom</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto p-1">
          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Enter location"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="language">Language *</Label>
            <Input
              id="language"
              value={language}
              onChange={e => setLanguage(e.target.value)}
              placeholder="Enter language"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Select Grades *</Label>
            <div className="mt-2 space-y-3">
              {grades.map(grade => (
                <Button
                  key={grade.id}
                  onClick={() => handleGradeToggle(grade.id)}
                  variant={selectedGrades.includes(grade.id) ? 'default' : 'outline'}
                  size="lg"
                  className={`shadow-elevation-1 hover:shadow-elevation-2 h-auto w-full rounded-3xl p-4 text-left transition-all duration-300 ${
                    selectedGrades.includes(grade.id)
                      ? 'bg-secondary border-primary border-2 text-black'
                      : 'border-secondary hover:bg-secondary/50 bg-background border-2 text-black'
                  }`}
                >
                  <div className="relative flex w-full items-center">
                    <span className="flex-1 text-center">{grade.name}</span>
                    {selectedGrades.includes(grade.id) && (
                      <div className="bg-primary absolute right-0 flex h-6 w-6 items-center justify-center rounded-full">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>
          {/* {selectedGrades.length > 0 && (
            <div>
              <Label>Special Instructions (Optional)</Label>
              <div className="mt-2 space-y-2">
                {selectedGrades
                  .sort((a, b) => a - b)
                  .map(gradeId => {
                    const gradeName = grades.find(g => g.id === gradeId)?.name || `Grade ${gradeId}`
                    return (
                      <div key={gradeId}>
                        <Label htmlFor={`instructions-${gradeId}`} className="text-sm">
                          {gradeName}
                        </Label>
                        <textarea
                          id={`instructions-${gradeId}`}
                          value={specialInstructions[gradeId] || ''}
                          onChange={e => handleSpecialInstructionsChange(gradeId, e.target.value)}
                          placeholder={`Special instructions for ${gradeName}`}
                          className="focus:border-primary focus:ring-primary mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:outline-none"
                          rows={2}
                        />
                      </div>
                    )
                  })}
              </div>
            </div>
          )} */}
          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                createClassroomMutation.isPending || !location.trim() || !language.trim() || selectedGrades.length === 0
              }
              className="flex-1"
            >
              {createClassroomMutation.isPending ? 'Creating...' : 'Create Classroom'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
