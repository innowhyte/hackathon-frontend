import { useParams, useNavigate } from 'react-router'
import { useTitle } from '../hooks/use-title'
import { useContext } from 'react'
import { AppContext } from '../context/app-context'
import BottomNav from '../components/bottom-nav'
import Header from '../components/header'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import AIHelpDialog from '../components/modals/ai-help-dialog'

export default function AssessmentOverview() {
  useTitle('Assessment Overview')
  const { assessmentId, grade } = useParams()
  const context = useContext(AppContext)
  const navigate = useNavigate()

  if (!context) {
    return <div>Loading...</div>
  }

  const { savedAssessments, students, assessmentResults, grades } = context

  const assessment = savedAssessments.find((a: any) => a.id === Number(assessmentId))
  const gradeNumber = Number(grade)
  const studentsInGrade = students[gradeNumber] || []

  if (!assessment) {
    return <div>Assessment not found</div>
  }

  if (!gradeNumber || !studentsInGrade.length) {
    return (
      <div className="bg-background min-h-screen pb-20">
        <Header title={`Assessment Overview - Grade ${gradeNumber}`} onBack={() => navigate('/assessment')} />
        <div className="p-6">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>No Students Found</CardTitle>
                <CardDescription>
                  No students found for Grade {gradeNumber}. Please add students to this grade first.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/students')}>Manage Students</Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  useTitle(`${assessment.title} | Grade ${gradeNumber}`)

  const handleSelectStudent = (student: { id: number; name: string }) => {
    navigate(`/assessment/${assessmentId}/student/${student.id}`)
  }

  const handleBackToAssessment = () => {
    navigate('/assessment')
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Header title={`Assessment Overview - Grade ${gradeNumber}`} onBack={handleBackToAssessment} />

      <div className="p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Assessment Header */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>{assessment.title}</CardTitle>
              <CardDescription>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Type:</strong> {assessment.type}
                  </p>
                  <p>
                    <strong>Grade:</strong> {grades.find(g => g.id === assessment.grade)?.name}
                  </p>
                  <p>
                    <strong>Points:</strong> {assessment.points}
                  </p>
                  <p>
                    <strong>Duration:</strong> {assessment.duration} minutes
                  </p>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Student Selection */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Select Student to Assess</CardTitle>
              <CardDescription>Choose a student to conduct the assessment for {assessment.title}</CardDescription>
            </CardHeader>
            <CardContent>
              {studentsInGrade.length > 0 ? (
                <div className="space-y-3">
                  {studentsInGrade.map(student => {
                    const hasCompleted = assessmentResults[assessment.id]?.[student.id]
                    return (
                      <Button
                        key={student.id}
                        onClick={() => handleSelectStudent(student)}
                        variant={hasCompleted ? 'secondary' : 'outline'}
                        className="h-auto w-full justify-between p-4"
                      >
                        <div className="flex items-center">
                          <div className="bg-primary/10 mr-3 flex h-10 w-10 items-center justify-center rounded-full">
                            <svg className="text-primary h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <span className="font-medium">{student.name}</span>
                        </div>
                        {hasCompleted ? (
                          <Badge variant="secondary" className="flex items-center">
                            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Completed
                          </Badge>
                        ) : (
                          <svg
                            className="text-muted-foreground h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </Button>
                    )
                  })}
                </div>
              ) : (
                <div className="text-muted-foreground py-8 text-center">
                  <svg
                    className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  <p className="text-lg font-medium">No students in this grade</p>
                  <p className="text-sm">Add students in the Student Management section</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AIHelpDialog />
      <BottomNav />
    </div>
  )
}
