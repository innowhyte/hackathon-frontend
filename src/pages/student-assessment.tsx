import { useParams, useNavigate } from 'react-router'
import { useTitle } from '../hooks/use-title'
import { useContext, useState } from 'react'
import { AppContext } from '../context/app-context'
import BottomNav from '../components/bottom-nav'
import Header from '../components/header'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import AIHelpDialog from '../components/modals/ai-help-dialog'

export default function StudentAssessment() {
  useTitle('Student Assessment')
  const { assessmentId, studentId } = useParams()
  const context = useContext(AppContext)
  const navigate = useNavigate()

  // Local state for assessment interface
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null)
  const [studentImages, setStudentImages] = useState<Array<{ url: string; file: File }>>([])
  const [studentRecordings, setStudentRecordings] = useState<Array<{ url: string; duration: number }>>([])
  const [studentScore, setStudentScore] = useState<string>('')
  const [studentComment, setStudentComment] = useState<string>('')

  if (!context) {
    return <div>Loading...</div>
  }

  const { savedAssessments, students, setAssessmentResults, grades } = context

  const assessment = savedAssessments.find((a: any) => a.id === Number(assessmentId))
  const student = students[assessment?.grade]?.find((s: any) => s.id === Number(studentId))

  if (!assessment || !student) {
    return <div>Assessment or student not found</div>
  }
  useTitle(`Assessing ${student.name}`)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map(file => ({
        url: URL.createObjectURL(file),
        file,
      }))
      setStudentImages(prev => [...prev, ...newImages])
    }
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

  const handleSubmitAssessment = () => {
    if (assessment && student) {
      const result = {
        score: Number(studentScore || 0),
        comments: studentComment || '',
        images: studentImages,
        recordings: studentRecordings,
        completedAt: new Date().toISOString(),
      }

      setAssessmentResults((prev: any) => ({
        ...prev,
        [assessment.id]: {
          ...prev[assessment.id],
          [student.id]: result,
        },
      }))

      // Navigate back to assessment overview
      navigate(`/assessment/${assessmentId}/conduct/grade/${assessment.grade}`)
    }
  }

  const handleBackToOverview = () => {
    navigate(`/assessment/${assessmentId}/conduct/grade/${assessment.grade}`)
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Header title={`Assessing ${student.name}`} onBack={handleBackToOverview} />

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

          {/* Student Info */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
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
                <div>
                  <p className="text-foreground font-medium">Assessing: {student.name}</p>
                  <p className="text-muted-foreground text-sm">{assessment.type}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Written Test - Image Upload Interface */}
          {assessment.type === 'Written Test' && (
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

                {/* Score Input */}
                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">
                    Score (out of {assessment.points})
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max={assessment.points}
                    value={studentScore}
                    onChange={e => setStudentScore(e.target.value)}
                    placeholder="Enter score..."
                    className="focus:ring-primary/20 focus:border-primary transition-all duration-200 focus:ring-2"
                  />
                </div>

                {/* Comments */}
                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">Comments (Optional)</label>
                  <Textarea
                    value={studentComment}
                    onChange={e => setStudentComment(e.target.value)}
                    placeholder="Add feedback comments..."
                    rows={3}
                    className="focus:ring-primary/20 focus:border-primary resize-none transition-all duration-200 focus:ring-2"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Oral Assessment - Voice Recording Interface */}
          {assessment.type === 'Oral Assessment' && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Record Student's Oral Response</CardTitle>
                <CardDescription>Record {student.name}'s oral responses to the assessment questions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Recording Interface */}
                <div className="text-center">
                  <div className="bg-primary/10 mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full">
                    {isRecording ? (
                      <div className="bg-destructive flex h-16 w-16 animate-pulse items-center justify-center rounded-full">
                        <div className="bg-destructive-foreground h-8 w-8 rounded-sm"></div>
                      </div>
                    ) : (
                      <svg className="text-primary h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                      </svg>
                    )}
                  </div>

                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    variant={isRecording ? 'destructive' : 'default'}
                    size="lg"
                    className={`transition-all duration-200 ${
                      isRecording
                        ? 'bg-destructive hover:bg-destructive/90 animate-pulse shadow-lg hover:shadow-xl'
                        : 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isRecording ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                      )}
                    </svg>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Button>

                  {recordingTime > 0 && (
                    <p className="text-muted-foreground mt-2 text-sm">
                      Recording time: {Math.floor(recordingTime / 60)}:
                      {(recordingTime % 60).toString().padStart(2, '0')}
                    </p>
                  )}
                </div>

                {/* Recorded Audio List */}
                {studentRecordings.length > 0 && (
                  <div>
                    <h4 className="text-md mb-3 font-medium">Recorded Responses ({studentRecordings.length})</h4>
                    <div className="space-y-3">
                      {studentRecordings.map((recording, index) => (
                        <div key={index} className="bg-muted flex items-center justify-between rounded-lg p-3">
                          <div className="flex items-center">
                            <div className="bg-primary/10 mr-3 flex h-8 w-8 items-center justify-center rounded-full">
                              <svg
                                className="text-primary h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Recording {index + 1}</p>
                              <p className="text-muted-foreground text-xs">{recording.duration}s</p>
                            </div>
                          </div>
                          <Button
                            onClick={() => removeRecording(index)}
                            variant="destructive"
                            size="icon"
                            className="bg-destructive/90 hover:bg-destructive h-8 w-8 shadow-md transition-all duration-200 hover:shadow-lg"
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
                      ))}
                    </div>
                  </div>
                )}

                {/* Score Input */}
                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">
                    Score (out of {assessment.points})
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max={assessment.points}
                    value={studentScore}
                    onChange={e => setStudentScore(e.target.value)}
                    placeholder="Enter score..."
                    className="focus:ring-primary/20 focus:border-primary transition-all duration-200 focus:ring-2"
                  />
                </div>

                {/* Comments */}
                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">Comments (Optional)</label>
                  <Textarea
                    value={studentComment}
                    onChange={e => setStudentComment(e.target.value)}
                    placeholder="Add feedback comments..."
                    rows={3}
                    className="focus:ring-primary/20 focus:border-primary resize-none transition-all duration-200 focus:ring-2"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project Assessment */}
          {assessment.type === 'Project-Based Assessment' && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Project Assessment</CardTitle>
                <CardDescription>Evaluate {student.name}'s project work.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Project Tasks */}
                <div>
                  <h4 className="text-md mb-3 font-medium">Project Tasks:</h4>
                  <ul className="space-y-2">
                    {assessment.questions.map((task: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-foreground">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* File Upload Area */}
                <div>
                  <h4 className="text-md mb-3 font-medium">Upload Project Files</h4>
                  <div className="border-border hover:border-primary/50 hover:bg-primary/5 group cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200">
                    <input
                      type="file"
                      accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="project-file-upload"
                    />
                    <div className="mb-4">
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
                      <p className="text-foreground mb-2 text-lg font-medium">Upload Project Files</p>
                      <p className="text-muted-foreground text-sm">
                        Drag and drop files here, or click browse to select
                      </p>
                      <p className="text-muted-foreground/70 mt-2 text-xs">
                        Supports: Images, PDF, Word, PowerPoint, Excel, ZIP
                      </p>
                    </div>
                    <Button
                      onClick={() => document.getElementById('project-file-upload')?.click()}
                      variant="outline"
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      Browse Files
                    </Button>
                  </div>
                </div>

                {/* Uploaded Files Preview */}
                {studentImages.length > 0 && (
                  <div>
                    <h4 className="text-md mb-3 font-medium">Uploaded Files ({studentImages.length})</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {studentImages.map((file, index) => (
                        <div key={index} className="relative">
                          {file.file.type.startsWith('image/') ? (
                            <img
                              src={file.url}
                              alt={`Project file ${index + 1}`}
                              className="border-border h-32 w-full rounded-lg border-2 object-cover"
                            />
                          ) : (
                            <div className="border-border flex h-32 w-full items-center justify-center rounded-lg border-2 bg-neutral-50">
                              <div className="text-center">
                                <svg
                                  className="text-primary mx-auto mb-2 h-8 w-8"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                <p className="text-xs font-medium text-neutral-700">{file.file.name}</p>
                                <p className="text-xs text-neutral-500">
                                  {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                          )}
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

                {/* Score Input */}
                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">
                    Score (out of {assessment.points})
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max={assessment.points}
                    value={studentScore}
                    onChange={e => setStudentScore(e.target.value)}
                    placeholder="Enter score..."
                    className="focus:ring-primary/20 focus:border-primary transition-all duration-200 focus:ring-2"
                  />
                </div>

                {/* Comments */}
                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">Comments (Optional)</label>
                  <Textarea
                    value={studentComment}
                    onChange={e => setStudentComment(e.target.value)}
                    placeholder="Add feedback comments..."
                    rows={3}
                    className="focus:ring-primary/20 focus:border-primary resize-none transition-all duration-200 focus:ring-2"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              onClick={handleSubmitAssessment}
              variant="default"
              size="lg"
              className="bg-primary hover:bg-primary/90 w-full shadow-lg transition-all duration-200 hover:shadow-xl sm:w-auto"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Submit Assessment
            </Button>

            <Button onClick={handleBackToOverview} variant="outline" size="lg" className="w-full sm:w-auto">
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Students
            </Button>
          </div>
        </div>
      </div>

      <AIHelpDialog />
      <BottomNav />
    </div>
  )
}
