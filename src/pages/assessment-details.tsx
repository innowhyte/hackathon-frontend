import { useParams, useNavigate, useSearchParams } from 'react-router'
import { useTitle } from '../hooks/use-title'
import BottomNav from '../components/bottom-nav'
import Header from '../components/header'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

import { useAssessmentDetails } from '../queries/assessment-queries'
import { useStudentsByGrade } from '../queries/student-queries'
import Loading from '../components/loading'
import { Users, FileText, Download } from 'lucide-react'

const assessmentTypeMap = {
  mcq: 'Multiple Choice Question',
  passage_reading: 'Passage Reading',
  passage_completion: 'Passage Completion',
}

export default function AssessmentDetails() {
  const { assessmentId, grade, classroomId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const topicId = searchParams.get('topicId')

  // Fetch assessment details
  const {
    data: assessment,
    isLoading: isAssessmentLoading,
    error: assessmentError,
  } = useAssessmentDetails(topicId, grade?.toString() || null, assessmentId || null)

  // Fetch students for the grade
  const { data: students, isLoading: isStudentsLoading } = useStudentsByGrade(Number(grade))

  // Set title based on assessment data
  const title = assessment
    ? `${assessmentTypeMap[assessment.assessment_type as keyof typeof assessmentTypeMap]} | ${assessment.grade_name}`
    : 'Assessment Overview'
  useTitle(title)

  if (isAssessmentLoading || isStudentsLoading) {
    return <Loading />
  }

  if (assessmentError) {
    return (
      <div className="bg-background min-h-screen pb-20">
        <Header
          title="Assessment Overview"
          onBack={() => navigate(`/classrooms/${classroomId}/assessments${topicId ? `?topicId=${topicId}` : ''}`)}
        />
        <div className="p-6">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Error Loading Assessment</CardTitle>
                <CardDescription>Failed to load assessment details. Please try again.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() =>
                    navigate(`/classrooms/${classroomId}/assessments${topicId ? `?topicId=${topicId}` : ''}`)
                  }
                >
                  Back to Assessments
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="bg-background min-h-screen pb-20">
        <Header
          title="Assessment Overview"
          onBack={() => navigate(`/classrooms/${classroomId}/assessments${topicId ? `?topicId=${topicId}` : ''}`)}
        />
        <div className="p-6">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Not Found</CardTitle>
                <CardDescription>The requested assessment could not be found.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() =>
                    navigate(`/classrooms/${classroomId}/assessments${topicId ? `?topicId=${topicId}` : ''}`)
                  }
                >
                  Back to Assessments
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  const handleSelectStudent = (student: { id: number; name: string }) => {
    navigate(
      `/classrooms/${classroomId}/grade/${grade}/assessment/${assessmentId}/student/${student.id}?topicId=${topicId}`,
    )
  }

  const handleBackToAssessment = () => {
    navigate(`/classrooms/${classroomId}/assessments${topicId ? `?topicId=${topicId}` : ''}`)
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Header
        title={`${assessment.grade_name} ${assessmentTypeMap[assessment.assessment_type as keyof typeof assessmentTypeMap]}`}
        onBack={handleBackToAssessment}
      />

      <div className="p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Assessment Header */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>{assessmentTypeMap[assessment.assessment_type as keyof typeof assessmentTypeMap]}</CardTitle>
              <div className="text-muted-foreground space-y-1 text-sm">
                <div>
                  <strong>Grade:</strong> {assessment.grade_name}
                </div>
                <div>
                  <strong>Topic:</strong> {assessment.topic_name}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Assessment Content Details */}
          {assessment.assessment_type === 'passage_completion' && 'passage' in assessment.content && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Passage Completion Content
                </CardTitle>
                <CardDescription>
                  Students will complete the passage orally by speaking the missing words
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="mb-2 font-medium">Passage:</h4>
                  <p className="text-sm leading-relaxed">{assessment.content.passage}</p>
                  <br />
                  <h4 className="mb-2 font-medium">Answer Keys:</h4>
                  <p className="text-sm leading-relaxed">
                    {'expected_answers' in assessment.content ? assessment.content.expected_answers?.join(', ') : ''}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {assessment.assessment_type === 'passage_reading' && 'passage' in assessment.content && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Passage Reading Content
                </CardTitle>
                <CardDescription>Students will read the passage orally for assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="mb-2 font-medium">Passage:</h4>
                  <p className="text-sm leading-relaxed">{assessment.content.passage}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {assessment.assessment_type === 'mcq' && assessment.attributes?.pdf_url && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Multiple Choice Questions
                </CardTitle>
                <CardDescription>Download the PDF to view the assessment questions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => window.open(assessment.attributes!.pdf_url, '_blank')} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Assessment PDF
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Student Selection */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Select Student to Assess</CardTitle>
              <CardDescription>
                Choose a student to conduct the assessment for{' '}
                {assessmentTypeMap[assessment.assessment_type as keyof typeof assessmentTypeMap]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {students && students.length > 0 ? (
                <div className="space-y-3">
                  {students.map((student: { id: number; name: string }) => {
                    const hasCompleted = false
                    return (
                      <Button
                        key={student.id}
                        onClick={() => handleSelectStudent(student)}
                        variant={hasCompleted ? 'secondary' : 'outline'}
                        className="h-auto w-full justify-between p-4"
                      >
                        <div className="flex items-center">
                          <div className="bg-primary/10 mr-3 flex h-10 w-10 items-center justify-center rounded-full">
                            <Users className="text-primary h-5 w-5" />
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
                  <Users className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
                  <p className="text-lg font-medium">No students in this grade</p>
                  <p className="mb-4 text-sm">Add students in the Student Management section</p>
                  <Button onClick={() => navigate(`/students?grade=${assessment.grade_id}`)}>Manage Students</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
