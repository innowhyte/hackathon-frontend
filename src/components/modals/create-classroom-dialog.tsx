import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useCreateOrUpdateClassroom } from '../../mutations/classroom-mutations'
import GradeMultiSelector from '../grade-multi-selector'
import { toast } from 'sonner'
import { grades } from '@/lib/grades'

interface CreateClassroomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateClassroomDialog({ open, onOpenChange }: CreateClassroomDialogProps) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [language, setLanguage] = useState('')
  const [selectedGrades, setSelectedGrades] = useState<{ id: number; name: string }[]>([])
  const [specialInstructions, setSpecialInstructions] = useState<{ [key: number]: string }>({})

  const createClassroomMutation = useCreateOrUpdateClassroom()

  const handleGradeChange = (grades: { id: number; name: string }[]) => {
    setSelectedGrades(grades)
    // Update special instructions to only include selected grades
    const newInstructions: { [key: number]: string } = {}
    grades.forEach(grade => {
      if (specialInstructions[grade.id]) {
        newInstructions[grade.id] = specialInstructions[grade.id]
      }
    })
    setSpecialInstructions(newInstructions)
  }

  // const handleSpecialInstructionsChange = (gradeId: number, value: string) => {
  //   setSpecialInstructions(prev => ({
  //     ...prev,
  //     [gradeId]: value,
  //   }))
  // }

  const handleSubmit = () => {
    if (!name.trim() || !location.trim() || !language.trim() || selectedGrades.length === 0) {
      toast.error('Please fill in all required fields and select at least one grade')
      return
    }

    const payload = {
      name: name.trim(),
      location: location.trim(),
      language: language.trim(),
      grades: selectedGrades.map(grade => ({
        name: grade.name,
        special_instructions: specialInstructions[grade.id] || '',
      })),
    }

    createClassroomMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Classroom created successfully!')
        onOpenChange(false)
        // Reset form
        setName('')
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
    setName('')
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
            <Label htmlFor="name">Classroom Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter classroom name"
              className="mt-1"
            />
          </div>
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
          <GradeMultiSelector selectedGrades={selectedGrades} grades={grades} onGradeChange={handleGradeChange} />
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
                createClassroomMutation.isPending ||
                !name.trim() ||
                !location.trim() ||
                !language.trim() ||
                selectedGrades.length === 0
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
