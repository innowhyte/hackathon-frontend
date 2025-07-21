import { useContext } from 'react'
import { useNavigate } from 'react-router'

import { AppContext } from '../context/app-context'
import BottomNav from '../components/bottom-nav'
import Header from '../components/header'
import AIHelpDialog from '../components/modals/ai-help-dialog'
import AddStudentDialog from '../components/modals/add-student-dialog'
import FeedbackDialog from '../components/modals/feedback-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Button } from '../components/ui/button'
import { UserPlusIcon, UsersIcon, Trash2Icon, MessageSquareIcon } from 'lucide-react'

export default function StudentManagement() {
  const context = useContext(AppContext)
  const navigate = useNavigate()

  if (!context) {
    return <div>Loading...</div>
  }

  const {
    students,
    setStudents,
    selectedGradeForStudents,
    setSelectedGradeForStudents,
    setShowAddStudentModal,
    setShowFeedbackModal,
    setSelectedStudentForFeedback,
    studentFeedback,
    selectedGrades,
  } = context

  const handleRemoveStudent = (gradeId: number, studentId: number) => {
    setStudents((prev: any) => ({
      ...prev,
      [gradeId]: prev[gradeId].filter((student: { id: number }) => student.id !== studentId),
    }))
  }

  const handleOpenFeedbackModal = (student: { id: number; name: string }) => {
    setSelectedStudentForFeedback(student)
    setShowFeedbackModal(true)
  }

  const getFeedbackCount = (studentId: number) => {
    return studentFeedback[studentId]?.length || 0
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Header title="Student Management" onBack={() => navigate('/plan')} />

      <div className="p-6">
        <div className="mx-auto max-w-2xl">
          {/* Grade Selection */}
          <div className="mb-8">
            <label className="text-foreground mb-3 block text-sm font-medium">Select Grade</label>
            <Select
              value={selectedGradeForStudents?.toString()}
              onValueChange={value => setSelectedGradeForStudents(Number(value))}
            >
              <SelectTrigger className="border-border focus:border-primary h-14! w-full rounded-xl border-2 text-base transition-colors focus:ring-0 focus:outline-none">
                <SelectValue placeholder="Select a grade" />
              </SelectTrigger>
              <SelectContent>
                {selectedGrades.map(grade => (
                  <SelectItem key={grade} value={grade.toString()} className="h-10!">
                    Grade {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Students Section */}
          {selectedGradeForStudents && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                    <UsersIcon className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-foreground text-xl font-semibold">
                      Grade {selectedGrades.find(g => g === selectedGradeForStudents)}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {students[selectedGradeForStudents]?.length || 0} students
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowAddStudentModal(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 rounded-xl px-6 font-medium"
                >
                  <UserPlusIcon className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              </div>

              {/* Students List */}
              <div className="bg-card border-border rounded-xl border shadow-sm">
                {students[selectedGradeForStudents]?.length > 0 ? (
                  <div className="divide-border divide-y">
                    {students[selectedGradeForStudents].map((student: { id: number; name: string }) => (
                      <div
                        key={student.id}
                        className="hover:bg-muted/50 flex items-center justify-between p-4 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-foreground font-medium">{student.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => handleOpenFeedbackModal(student)}
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-primary hover:bg-primary/10 border-border hover:border-primary relative h-8 w-8 rounded-lg border p-0 transition-colors"
                            title="Add Feedback"
                          >
                            <MessageSquareIcon className="h-4 w-4" />
                            {getFeedbackCount(student.id) > 0 && (
                              <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs font-medium">
                                {getFeedbackCount(student.id)}
                              </span>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleRemoveStudent(selectedGradeForStudents, student.id)}
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-border hover:border-destructive h-8 w-8 rounded-lg border p-0 transition-colors"
                            title="Remove Student"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                      <UsersIcon className="text-muted-foreground h-6 w-6" />
                    </div>
                    <h3 className="text-foreground mb-2 text-lg font-medium">No students yet</h3>
                    <p className="text-muted-foreground mb-4 text-sm">Start by adding students to this grade level</p>
                    <Button
                      onClick={() => setShowAddStudentModal(true)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <UserPlusIcon className="mr-2 h-4 w-4" />
                      Add First Student
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty State when no grade is selected */}
          {!selectedGradeForStudents && (
            <div className="py-12 text-center">
              <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                <UsersIcon className="text-muted-foreground h-8 w-8" />
              </div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">Select a Grade</h3>
              <p className="text-muted-foreground">Choose a grade level above to manage students</p>
            </div>
          )}
        </div>
      </div>

      <AIHelpDialog />
      <AddStudentDialog />
      <FeedbackDialog />
      <BottomNav />
    </div>
  )
}
