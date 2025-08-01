import { useParams, useNavigate, useSearchParams } from 'react-router'
import { useTitle } from '../hooks/use-title'
import { useState } from 'react'
import BottomNav from '../components/bottom-nav'
import Header from '../components/header'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useAssessmentDetails } from '../queries/assessment-queries'
import { useStudentById } from '../queries/student-queries'
import Loading from '../components/loading'
import { FileText } from 'lucide-react'
import { useEvaluateMcqAssessment, useEvaluateOralAssessment } from '../mutations/assessment-mutations'
import { useStudentAssessmentEvaluation } from '../queries/assessment-queries'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table'
import { toast } from 'sonner'

const assessmentTypeMap = {
  mcq: 'Multiple Choice Question',
  passage_reading: 'Passage Reading',
  passage_completion: 'Passage Completion',
}

export default function StudentAssessment() {
  const { assessmentId, studentId, grade, classroomId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const topicId = searchParams.get('topicId')

  // Local state for assessment interface
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null)
  const [studentImages, setStudentImages] = useState<Array<{ url: string; file: File }>>([])
  const [studentRecordings, setStudentRecordings] = useState<Array<{ url: string; duration: number }>>([])

  // Add mutation hooks
  const mcqMutation = useEvaluateMcqAssessment(Number(studentId), Number(assessmentId))
  const oralMutation = useEvaluateOralAssessment(Number(studentId), Number(assessmentId))

  // Fetch assessment details
  const {
    data: assessment,
    isLoading: isAssessmentLoading,
    error: assessmentError,
  } = useAssessmentDetails(topicId, grade?.toString() || null, assessmentId || null)

  // Fetch students for the grade
  const { data: student, isLoading: isStudentLoading } = useStudentById(Number(studentId))

  // Fetch student assessment evaluation result
  const { data: evaluationResult } = useStudentAssessmentEvaluation(Number(studentId), Number(assessmentId))

  // Set title based on student and assessment data
  const title =
    student && assessment
      ? `Assessing ${student.name} - ${assessmentTypeMap[assessment.assessment_type as keyof typeof assessmentTypeMap]}`
      : 'Student Assessment'
  useTitle(title)

  if (isAssessmentLoading || isStudentLoading) {
    return <Loading />
  }

  if (assessmentError) {
    return (
      <div className="bg-background min-h-screen pb-20">
        <Header
          title="Student Assessment"
          onBack={() =>
            navigate(
              `/classrooms/${classroomId}/grade/${grade}/assessment/${assessmentId}${topicId ? `?topicId=${topicId}` : ''}`,
            )
          }
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
                    navigate(
                      `/classrooms/${classroomId}/grade/${grade}/assessment/${assessmentId}${topicId ? `?topicId=${topicId}` : ''}`,
                    )
                  }
                >
                  Back to Assessment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  if (!assessment || !student) {
    return (
      <div className="bg-background min-h-screen pb-20">
        <Header
          title="Student Assessment"
          onBack={() => navigate(`/grade/${grade}/assessment/${assessmentId}${topicId ? `?topicId=${topicId}` : ''}`)}
        />
        <div className="p-6">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Assessment or Student Not Found</CardTitle>
                <CardDescription>
                  {!topicId
                    ? 'Missing topic ID. Please navigate from the assessment list.'
                    : !assessment
                      ? 'The requested assessment could not be found.'
                      : 'The requested student could not be found.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() =>
                    navigate(`/grade/${grade}/assessment/${assessmentId}${topicId ? `?topicId=${topicId}` : ''}`)
                  }
                >
                  Back to Assessment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map(file => ({
        url: URL.createObjectURL(file),
        file,
      }))
      setStudentImages(prev => [...prev, ...newImages])
    }
    // Reset the input value to allow selecting the same file again
    event.target.value = ''
  }

  const removeImage = (imageIndex: number) => {
    setStudentImages(prev => prev.filter((_, index) => index !== imageIndex))
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = e => {
        chunks.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        const duration = recordingTime

        setStudentRecordings(prev => [...prev, { url, duration }])
        setRecordingTime(0)
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      setRecordingTimer(timer)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      if (recordingTimer) {
        clearInterval(recordingTimer)
        setRecordingTimer(null)
      }
    }
  }

  const removeRecording = (recordingIndex: number) => {
    setStudentRecordings(prev => prev.filter((_, index) => index !== recordingIndex))
  }

  const handleSubmitAssessment = async () => {
    if (assessment && student) {
      try {
        let result
        if (assessment.assessment_type === 'mcq') {
          const images = studentImages.map(img => img.file)
          result = await mcqMutation.mutateAsync(images)
        } else if (
          assessment.assessment_type === 'passage_completion' ||
          assessment.assessment_type === 'passage_reading'
        ) {
          if (studentRecordings.length === 0) return
          const audioUrl = studentRecordings[0].url
          const audioBlob = await fetch(audioUrl).then(r => r.blob())
          result = await oralMutation.mutateAsync(audioBlob)
        }
        console.log('Assessment Evaluation Result:', result)
        toast.success('Assessment submitted successfully')
      } catch (error) {
        console.error('Error submitting assessment:', error)
        toast.error('Error submitting assessment')
      }
    }
  }

  const handleBackToOverview = () => {
    navigate(
      `/classrooms/${classroomId}/grade/${grade}/assessment/${assessmentId}${topicId ? `?topicId=${topicId}` : ''}`,
    )
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Header title={`Assessing ${student.name}`} onBack={handleBackToOverview} />

      <div className="p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Assessment Header - always at the top */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>{assessmentTypeMap[assessment.assessment_type as keyof typeof assessmentTypeMap]}</CardTitle>
              <div className="text-muted-foreground space-y-1 text-sm">
                <div>
                  <strong>Type:</strong>{' '}
                  {assessmentTypeMap[assessment.assessment_type as keyof typeof assessmentTypeMap]}
                </div>
                <div>
                  <strong>Grade:</strong> {assessment.grade_name}
                </div>
                <div>
                  <strong>Topic:</strong> {assessment.topic_name}
                </div>
              </div>
              {/* Student Details */}
              <div className="mt-4 border-t pt-3">
                <div className="flex items-center gap-2">
                  <svg className="text-primary h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-foreground font-medium">Assessing: {student.name}</span>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Show MCQ or Passage Completion Evaluation Result if available, else show assessment UI */}
          {evaluationResult?.evaluated_mcqs && evaluationResult.evaluated_mcqs.length > 0 ? (
            <Card className="border-primary/40">
              <CardHeader>
                <CardTitle>MCQ Evaluation Result</CardTitle>
                <CardDescription>
                  Score: <span className="font-bold">{evaluationResult.score}%</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question ID</TableHead>
                      <TableHead>Correct?</TableHead>
                      <TableHead>Correct Answer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluationResult.evaluated_mcqs.map((q: any) => (
                      <TableRow
                        key={q.question_id}
                        className={
                          q.is_correct === true
                            ? 'bg-primary/10'
                            : q.is_correct === false
                              ? 'bg-destructive/10'
                              : 'bg-muted/50'
                        }
                      >
                        <TableCell>{q.question_id}</TableCell>
                        <TableCell className="font-semibold">
                          {q.is_correct === true ? 'Yes' : q.is_correct === false ? 'No' : 'Unanswered'}
                        </TableCell>
                        <TableCell>{q.correct_answer}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : evaluationResult?.passage_completion_evaluation &&
            evaluationResult.passage_completion_evaluation.length > 0 ? (
            <Card className="border-primary/40">
              <CardHeader>
                <CardTitle>Passage Completion Evaluation</CardTitle>
                <CardDescription>
                  Score: <span className="font-bold">{evaluationResult.score}%</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Show passage for reference */}
                {assessment &&
                  (assessment.assessment_type === 'passage_completion' ||
                    assessment.assessment_type === 'passage_reading') &&
                  'passage' in assessment.content &&
                  assessment.content.passage && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="mb-2 font-medium">Passage:</h4>
                      <p className="text-sm leading-relaxed">{assessment.content.passage}</p>
                    </div>
                  )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Actual Answer</TableHead>
                      <TableHead>Expected Answer</TableHead>
                      <TableHead>Correct?</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluationResult.passage_completion_evaluation.map((item: any, idx: number) => (
                      <TableRow
                        key={idx}
                        className={
                          item.is_correct === true
                            ? 'bg-primary/10'
                            : item.is_correct === false
                              ? 'bg-destructive/10'
                              : 'bg-muted/50'
                        }
                      >
                        <TableCell>
                          {item.actual_answer ?? <span className="text-muted-foreground italic">Unanswered</span>}
                        </TableCell>
                        <TableCell>{item.expected_answer}</TableCell>
                        <TableCell className="font-semibold">
                          {item.is_correct === true ? 'Yes' : item.is_correct === false ? 'No' : 'Unanswered'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Assessment Content */}
              {assessment.assessment_type === 'passage_completion' && 'passage' in assessment.content && (
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Passage Completion
                    </CardTitle>
                    <CardDescription>
                      Students will complete the passage orally by speaking the missing words
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="mb-2 font-medium">Passage:</h4>
                      <p className="text-sm leading-relaxed">{assessment.content.passage}</p>
                    </div>

                    {/* Audio Recording Section */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Record Student's Response</h4>

                      {/* Recording Controls */}
                      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                        {/* Recording Button */}
                        {!isRecording ? (
                          <Button
                            onClick={startRecording}
                            className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                            disabled={isRecording}
                          >
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                              />
                            </svg>
                            Start Recording
                          </Button>
                        ) : (
                          <Button
                            onClick={stopRecording}
                            variant="destructive"
                            className="bg-destructive hover:bg-destructive/90 w-full sm:w-auto"
                          >
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                              />
                            </svg>
                            Stop Recording
                          </Button>
                        )}
                        {/* Timer */}
                        <div className="bg-muted/50 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 sm:w-auto">
                          <svg
                            className="text-muted-foreground h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-sm font-medium tabular-nums">
                            {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>

                      {/* Recorded Audio List */}
                      {studentRecordings.length > 0 && (
                        <div>
                          <h5 className="mb-2 text-sm font-medium">Recorded Responses ({studentRecordings.length})</h5>
                          <div className="space-y-2">
                            {studentRecordings.map((recording, index) => (
                              <div
                                key={index}
                                className="flex w-full flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div className="flex flex-row items-center gap-2">
                                  <svg
                                    className="text-primary h-5 w-5 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                                    />
                                  </svg>
                                  <span className="text-sm font-medium">Recording {index + 1}</span>
                                  <span className="text-muted-foreground text-xs tabular-nums">
                                    {Math.floor(recording.duration / 60)}:
                                    {(recording.duration % 60).toString().padStart(2, '0')}
                                  </span>
                                </div>
                                <div className="flex w-full flex-row items-center gap-2">
                                  <audio controls className="h-8 w-full">
                                    <source src={recording.url} type="audio/webm" />
                                    Your browser does not support the audio element.
                                  </audio>
                                  <Button
                                    onClick={() => removeRecording(index)}
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 flex-shrink-0 p-0"
                                  >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submit Button for Passage Completion */}
                    <div className="pt-4">
                      <Button
                        onClick={handleSubmitAssessment}
                        variant="default"
                        size="lg"
                        className="bg-primary hover:bg-primary/90 w-full shadow-lg transition-all duration-200 hover:shadow-xl"
                        disabled={studentRecordings.length === 0 || oralMutation.isPending}
                      >
                        {oralMutation.isPending ? (
                          <>
                            <svg className="mr-2 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Submit Assessment
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {assessment.assessment_type === 'passage_reading' && 'passage' in assessment.content && (
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Passage Reading
                    </CardTitle>
                    <CardDescription>Students will read the passage orally for assessment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="mb-2 font-medium">Passage:</h4>
                      <p className="text-sm leading-relaxed">{assessment.content.passage}</p>
                    </div>

                    {/* Audio Recording Section */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Record Student's Reading</h4>

                      {/* Recording Controls */}
                      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                        {/* Recording Button */}
                        {!isRecording ? (
                          <Button
                            onClick={startRecording}
                            className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                            disabled={isRecording}
                          >
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                              />
                            </svg>
                            Start Recording
                          </Button>
                        ) : (
                          <Button
                            onClick={stopRecording}
                            variant="destructive"
                            className="bg-destructive hover:bg-destructive/90 w-full sm:w-auto"
                          >
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                              />
                            </svg>
                            Stop Recording
                          </Button>
                        )}
                        {/* Timer */}
                        <div className="bg-muted/50 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 sm:w-auto">
                          <svg
                            className="text-muted-foreground h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-sm font-medium tabular-nums">
                            {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>

                      {/* Recorded Audio List */}
                      {studentRecordings.length > 0 && (
                        <div>
                          <h5 className="mb-2 text-sm font-medium">Recorded Readings ({studentRecordings.length})</h5>
                          <div className="space-y-2">
                            {studentRecordings.map((recording, index) => (
                              <div
                                key={index}
                                className="flex w-full flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div className="flex flex-row items-center gap-2">
                                  <svg
                                    className="text-primary h-5 w-5 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                                    />
                                  </svg>
                                  <span className="text-sm font-medium">Recording {index + 1}</span>
                                  <span className="text-muted-foreground text-xs tabular-nums">
                                    {Math.floor(recording.duration / 60)}:
                                    {(recording.duration % 60).toString().padStart(2, '0')}
                                  </span>
                                </div>
                                <div className="flex w-full flex-row items-center gap-2">
                                  <audio controls className="h-8 w-full">
                                    <source src={recording.url} type="audio/webm" />
                                    Your browser does not support the audio element.
                                  </audio>
                                  <Button
                                    onClick={() => removeRecording(index)}
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 flex-shrink-0 p-0"
                                  >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submit Button for Passage Reading */}
                    <div className="pt-4">
                      <Button
                        onClick={handleSubmitAssessment}
                        variant="default"
                        size="lg"
                        className="bg-primary hover:bg-primary/90 w-full shadow-lg transition-all duration-200 hover:shadow-xl"
                        disabled={studentRecordings.length === 0 || oralMutation.isPending}
                      >
                        {oralMutation.isPending ? (
                          <>
                            <svg className="mr-2 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Submit Assessment
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* MCQ Assessment - Image Upload Interface */}
              {assessment.assessment_type === 'mcq' && (
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Upload Student's Written Work</CardTitle>
                    <CardDescription>Please upload images of {student.name}'s written answers.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* File Upload Area */}
                    <div className="border-border hover:border-primary/50 hover:bg-primary/5 group cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="bg-primary/10 group-hover:bg-primary/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-all duration-200">
                          <svg
                            className="text-primary h-8 w-8 transition-transform duration-200 group-hover:scale-110"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </div>
                        <p className="text-foreground mb-2 text-lg font-medium">Upload Images</p>
                        <p className="text-muted-foreground text-sm">Click to select images or drag and drop</p>
                        <p className="text-muted-foreground/70 mt-2 text-xs">Supports: JPG, PNG, GIF</p>
                      </label>
                    </div>

                    {/* Uploaded Images Preview */}
                    {studentImages.length > 0 && (
                      <div>
                        <h4 className="text-md mb-3 font-medium">Uploaded Images ({studentImages.length})</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {studentImages.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image.url}
                                alt={`Answer ${index + 1}`}
                                className="border-border h-32 w-full rounded-lg border-2 object-cover"
                              />
                              <Button
                                onClick={() => removeImage(index)}
                                variant="destructive"
                                size="icon"
                                className="bg-destructive/90 hover:bg-destructive absolute top-2 right-2 h-7 w-7 shadow-md transition-all duration-200 hover:shadow-lg"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Submit Button for MCQ */}
                    <div className="pt-4">
                      <Button
                        onClick={handleSubmitAssessment}
                        variant="default"
                        size="lg"
                        className="bg-primary hover:bg-primary/90 w-full shadow-lg transition-all duration-200 hover:shadow-xl"
                        disabled={studentImages.length === 0 || mcqMutation.isPending}
                      >
                        {mcqMutation.isPending ? (
                          <>
                            <svg className="mr-2 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Submit Assessment
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button onClick={handleBackToOverview} variant="outline" size="lg" className="w-full sm:w-auto">
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Students
            </Button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
