import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { EditIcon } from 'lucide-react'

interface EditStudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedStudent: { id: number; name: string } | null
  onSave: (studentId: number, newName: string) => void
}

const EditStudentDialog = ({ open, onOpenChange, selectedStudent, onSave }: EditStudentDialogProps) => {
  const [studentName, setStudentName] = useState('')

  // Update student name when selected student changes
  useEffect(() => {
    if (selectedStudent) {
      setStudentName(selectedStudent.name)
    }
  }, [selectedStudent])

  const handleEditStudent = () => {
    if (studentName.trim() && selectedStudent && studentName.trim() !== selectedStudent.name) {
      onSave(selectedStudent.id, studentName.trim())
      setStudentName('')
      onOpenChange(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setStudentName(selectedStudent?.name || '')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        if (!open) {
          handleClose()
        }
      }}
    >
      <DialogContent className="bg-background">
        <DialogHeader className="border-border border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <EditIcon className="text-primary mr-2 h-5 w-5" />
              <DialogTitle className="text-foreground text-lg font-semibold">Edit Student</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-6">
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">Student Name</label>
            <Input
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              placeholder="Enter student's full name"
              className="border-border focus:border-primary bg-background h-12 rounded-lg border-2 transition-colors focus:ring-0 focus:outline-none"
              onKeyDown={e => {
                if (e.key === 'Enter' && studentName.trim()) {
                  handleEditStudent()
                }
              }}
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-border hover:bg-muted h-11 flex-1 rounded-lg border-2 font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditStudent}
              disabled={!studentName.trim() || studentName.trim() === selectedStudent?.name}
              className="bg-primary hover:bg-primary/90 h-11 flex-1 rounded-lg font-medium disabled:cursor-not-allowed disabled:opacity-50"
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditStudentDialog
