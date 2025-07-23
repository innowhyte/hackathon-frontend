import { useTitle } from '../hooks/use-title'
import { useStudentManagement } from '../hooks/use-student-management'

import BottomNav from '../components/bottom-nav'
import Header from '../components/header'
import AIHelpDialog from '../components/modals/ai-help-dialog'
import AddStudentDialog from '../components/modals/add-student-dialog'
import EditStudentDialog from '../components/modals/edit-student-dialog'
import FeedbackDialog from '../components/modals/feedback-dialog'
import GradeSelector from '../components/grade-selector'
import StudentsList from '../components/students-list'
import EmptyGradeState from '../components/empty-grade-state'

export default function StudentManagement() {
  const {
    selectedGrade,
    showAddStudentModal,
    showEditStudentModal,
    showFeedbackModal,
    selectedStudentForEdit,
    selectedStudentForFeedback,
    latestClassroom,
    students,
    feedback,
    isLoading,
    error,
    isFeedbackLoading,
    isLoadingClassroom,
    createStudentMutation,
    deleteStudentMutation,
    handleGradeChange,
    handleAddStudent,
    handleOpenEditModal,
    handleSaveEdit,
    handleRemoveStudent,
    handleOpenFeedbackModal,
    handleSaveFeedback,
    handleDeleteFeedback,
    setShowAddStudentModal,
    setShowEditStudentModal,
    setShowFeedbackModal,
    getStudentFeedback,
    navigate,
  } = useStudentManagement()

  useTitle(`${selectedGrade?.name ? `${selectedGrade.name} | ` : ''} Student Management`)

  if (isLoadingClassroom) {
    return (
      <div className="bg-background min-h-screen pb-20">
        <Header title="Student Management" onBack={() => navigate('/weekly-plan')} />
        <div className="p-6">
          <div className="mx-auto max-w-2xl">
            <div className="py-12 text-center">
              <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                <div className="text-muted-foreground h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
              </div>
              <p className="text-muted-foreground">Loading classroom data...</p>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Header title="Student Management" onBack={() => navigate('/weekly-plan')} />

      <div className="p-6">
        <div className="mx-auto max-w-2xl">
          {/* Grade Selection */}
          <GradeSelector
            selectedGrade={selectedGrade}
            grades={latestClassroom?.grades || []}
            onGradeChange={handleGradeChange}
            isLoading={isLoadingClassroom}
          />

          {/* Students Section */}
          {selectedGrade ? (
            <StudentsList
              students={students}
              feedback={feedback}
              selectedGrade={selectedGrade}
              isLoading={isLoading}
              isFeedbackLoading={isFeedbackLoading}
              error={error}
              onAddStudent={() => setShowAddStudentModal(true)}
              onOpenFeedback={handleOpenFeedbackModal}
              onOpenEdit={handleOpenEditModal}
              onRemoveStudent={handleRemoveStudent}
              isRemoving={deleteStudentMutation.isPending}
              isAdding={createStudentMutation.isPending}
            />
          ) : (
            <EmptyGradeState />
          )}
        </div>
      </div>

      {/* Modals */}
      <AIHelpDialog />
      <AddStudentDialog open={showAddStudentModal} onOpenChange={setShowAddStudentModal} onAdd={handleAddStudent} />
      <EditStudentDialog
        open={showEditStudentModal}
        onOpenChange={setShowEditStudentModal}
        selectedStudent={selectedStudentForEdit}
        onSave={handleSaveEdit}
      />
      <FeedbackDialog
        open={showFeedbackModal}
        onOpenChange={setShowFeedbackModal}
        selectedStudent={selectedStudentForFeedback}
        studentFeedback={selectedStudentForFeedback ? getStudentFeedback(selectedStudentForFeedback.id) : []}
        onSaveFeedback={handleSaveFeedback}
        onDeleteFeedback={handleDeleteFeedback}
      />
      <BottomNav />
    </div>
  )
}
