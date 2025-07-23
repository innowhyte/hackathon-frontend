import { useNavigate } from 'react-router'
import { useTitle } from '../hooks/use-title'
import { useContext } from 'react'
import { AppContext } from '../context/app-context'
import BottomNav from '../components/bottom-nav'
import Header from '../components/header'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import AIHelpDialog from '../components/modals/ai-help-dialog'
import { useLatestClassroom } from '../queries/classroom-queries'

export default function TopicAssessment() {
  useTitle('Topic Assessment')
  const context = useContext(AppContext)
  const navigate = useNavigate()
  const { data: latestClassroom, isLoading: isLoadingClassroom } = useLatestClassroom()

  if (!context || isLoadingClassroom) {
    return <div>Loading...</div>
  }

  const {
    topic,
    selectedGradeForAssessment,
    setSelectedGradeForAssessment,
    selectedAssessmentType,
    setSelectedAssessmentType,
    generatedAssessment,
    setGeneratedAssessment,
    assessmentPrompt,
    setAssessmentPrompt,
    savedAssessments,
    setSavedAssessments,
    assessmentOptions,
    setAssessmentOptions,
  } = context

  // Map grades from latestClassroom to expected format
  const gradesList = [
    { id: 1, name: 'Grade 1' },
    { id: 2, name: 'Grade 2' },
    { id: 3, name: 'Grade 3' },
    { id: 4, name: 'Grade 4' },
    { id: 5, name: 'Grade 5' },
  ]
  const selectedGrades = (latestClassroom?.grades || [])
    .map(g => {
      const gradeObj = gradesList.find(gr => gr.name === g.name)
      return gradeObj ? { gradeId: gradeObj.id, specialInstructions: g.special_instructions || '' } : undefined
    })
    .filter((g): g is { gradeId: number; specialInstructions: string } => g !== undefined)

  const handleGenerateAssessment = () => {
    if (selectedGradeForAssessment && selectedAssessmentType) {
      const currentOptions = assessmentOptions[selectedAssessmentType as keyof typeof assessmentOptions]
      const sampleAssessments = {
        written: {
          title: `Written Test - ${topic}`,
          type: 'Written Test',
          answerType: currentOptions.answerType,
          numberOfQuestions: currentOptions.numberOfQuestions,
          questions: [], // Generate questions dynamically
          instructions: `Answer all ${currentOptions.numberOfQuestions} questions.`,
        },
        oral: {
          title: `Oral Assessment - ${topic}`,
          type: 'Oral Assessment',
          numberOfWords: currentOptions.numberOfWords,
          difficultyLevel: currentOptions.difficultyLevel,
          questions: [], // Generate questions dynamically
          instructions: `Be prepared to answer questions orally.`,
        },
        project: {
          title: `Project-Based Assessment - ${topic}`,
          type: 'Project-Based Assessment',
          projectType: currentOptions.projectType,
          questions: [], // Generate questions dynamically
          instructions: `Complete the ${currentOptions.projectType} project.`,
        },
      }
      setGeneratedAssessment(sampleAssessments[selectedAssessmentType as keyof typeof sampleAssessments])
    }
  }

  const handleSaveAssessment = () => {
    if (generatedAssessment) {
      const newAssessment = {
        id: Date.now(),
        ...generatedAssessment,
        grade: selectedGradeForAssessment,
        topic: topic,
        prompt: assessmentPrompt,
        savedAt: new Date().toLocaleDateString(),
      }
      setSavedAssessments((prev: any[]) => [...prev, newAssessment])
      setGeneratedAssessment(null)
      setAssessmentPrompt('')
      setSelectedAssessmentType(null)
    }
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Header title="Topic Assessment" onBack={() => navigate('/plan')} />

      <div className="p-4">
        <div className="mx-auto max-w-md space-y-6">
          {/* Main Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-800">Assessment for Addition</h1>
            <p className="mt-1 text-sm text-neutral-600">Generate assessments based on your selected grades.</p>
          </div>

          {/* Grade Selection */}
          <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-base font-medium text-neutral-800">Select Grade for Assessment</h2>
            <div className="flex gap-2">
              {selectedGrades.length > 0 ? (
                selectedGrades.map(g => (
                  <Button
                    key={g.gradeId}
                    onClick={() => setSelectedGradeForAssessment(g.gradeId)}
                    variant={selectedGradeForAssessment === g.gradeId ? 'default' : 'outline'}
                    className="flex-1 py-2 text-sm"
                  >
                    Grade {g.gradeId}
                  </Button>
                ))
              ) : (
                <span className="text-sm text-neutral-500">No grades found. Please set up grades first.</span>
              )}
            </div>
          </div>

          {/* Assessment Type Selection */}
          {selectedGradeForAssessment && (
            <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-base font-medium text-neutral-800">Select Assessment Type</h2>
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setSelectedAssessmentType('written')
                    setGeneratedAssessment(null)
                  }}
                  variant={selectedAssessmentType === 'written' ? 'assessmentSelected' : 'assessment'}
                  className="h-auto w-full justify-start"
                >
                  <div className="flex w-full flex-col items-start">
                    <div className="flex min-w-0 flex-row items-center gap-2">
                      <svg
                        className="text-primary mt-0.5 h-8 w-8 flex-shrink-0"
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
                      <div className="text-base font-medium text-neutral-800">Written Test</div>
                    </div>
                    <div className="mt-1 text-base leading-relaxed text-neutral-600">
                      Traditional written assessment with detailed questions
                    </div>
                  </div>
                </Button>
                <Button
                  onClick={() => {
                    setSelectedAssessmentType('oral')
                    setGeneratedAssessment(null)
                  }}
                  variant={selectedAssessmentType === 'oral' ? 'assessmentSelected' : 'assessment'}
                  className="h-auto w-full justify-start"
                >
                  <div className="flex w-full flex-col items-start">
                    <div className="flex min-w-0 flex-row items-center gap-2">
                      <svg
                        className="text-primary mt-0.5 h-8 w-8 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <div className="text-base font-medium text-neutral-800">Oral Assessment</div>
                    </div>
                    <div className="mt-1 text-base leading-relaxed text-neutral-600">
                      Oral assessment with discussion-based questions
                    </div>
                  </div>
                </Button>
                <Button
                  onClick={() => {
                    setSelectedAssessmentType('project')
                    setGeneratedAssessment(null)
                  }}
                  variant={selectedAssessmentType === 'project' ? 'assessmentSelected' : 'assessment'}
                  className="h-auto w-full justify-start"
                >
                  <div className="flex w-full flex-col items-start">
                    <div className="flex min-w-0 flex-row items-center gap-2">
                      <svg
                        className="text-primary mt-0.5 h-8 w-8 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      <div className="text-base font-medium text-neutral-800">Project Based</div>
                    </div>
                    <div className="mt-1 text-base leading-relaxed text-neutral-600">
                      Hands-on project assessment with practical tasks
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {/* Options Section */}
          {selectedAssessmentType && (
            <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-base font-medium text-neutral-800">Assessment Options</h2>
              <div className="space-y-4">
                {selectedAssessmentType === 'written' && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-700">Number of Questions</label>
                      <Select
                        value={assessmentOptions.written.numberOfQuestions.toString()}
                        onValueChange={value =>
                          setAssessmentOptions({
                            ...assessmentOptions,
                            written: { ...assessmentOptions.written, numberOfQuestions: Number(value) },
                          })
                        }
                      >
                        <SelectTrigger className="focus:border-primary h-12! w-full rounded-lg border border-neutral-200 bg-white p-3 text-neutral-800 focus:ring-0 focus:outline-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[3, 5, 10, 15, 20].map(num => (
                            <SelectItem key={num} value={num.toString()} className="h-10!">
                              {num} Questions
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-700">Answer Type</label>
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            setAssessmentOptions({
                              ...assessmentOptions,
                              written: { ...assessmentOptions.written, answerType: 'mcq' },
                            })
                          }
                          variant={assessmentOptions.written.answerType === 'mcq' ? 'default' : 'outline'}
                          className="flex-1 py-2 text-sm"
                        >
                          Multiple Choice
                        </Button>
                        <Button
                          onClick={() =>
                            setAssessmentOptions({
                              ...assessmentOptions,
                              written: { ...assessmentOptions.written, answerType: 'truefalse' },
                            })
                          }
                          variant={assessmentOptions.written.answerType === 'truefalse' ? 'default' : 'outline'}
                          className="flex-1 py-2 text-sm"
                        >
                          True/False
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                {selectedAssessmentType === 'oral' && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-700">
                        Expected Response Length (words)
                      </label>
                      <Select
                        value={assessmentOptions.oral.numberOfWords.toString()}
                        onValueChange={value =>
                          setAssessmentOptions({
                            ...assessmentOptions,
                            oral: { ...assessmentOptions.oral, numberOfWords: Number(value) },
                          })
                        }
                      >
                        <SelectTrigger className="focus:border-primary h-12! w-full rounded-lg border border-neutral-200 bg-white p-3 text-neutral-800 focus:ring-0 focus:outline-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[50, 75, 100, 150].map(num => (
                            <SelectItem key={num} value={num.toString()} className="h-10!">
                              {num} words
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-700">Difficulty Level</label>
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            setAssessmentOptions({
                              ...assessmentOptions,
                              oral: { ...assessmentOptions.oral, difficultyLevel: 'easy' },
                            })
                          }
                          variant={assessmentOptions.oral.difficultyLevel === 'easy' ? 'default' : 'outline'}
                          className="flex-1 py-2 text-sm"
                        >
                          Easy
                        </Button>
                        <Button
                          onClick={() =>
                            setAssessmentOptions({
                              ...assessmentOptions,
                              oral: { ...assessmentOptions.oral, difficultyLevel: 'medium' },
                            })
                          }
                          variant={assessmentOptions.oral.difficultyLevel === 'medium' ? 'default' : 'outline'}
                          className="flex-1 py-2 text-sm"
                        >
                          Medium
                        </Button>
                        <Button
                          onClick={() =>
                            setAssessmentOptions({
                              ...assessmentOptions,
                              oral: { ...assessmentOptions.oral, difficultyLevel: 'hard' },
                            })
                          }
                          variant={assessmentOptions.oral.difficultyLevel === 'hard' ? 'default' : 'outline'}
                          className="flex-1 py-2 text-sm"
                        >
                          Hard
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                {selectedAssessmentType === 'project' && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Project Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() =>
                          setAssessmentOptions({
                            ...assessmentOptions,
                            project: { ...assessmentOptions.project, projectType: 'poster' },
                          })
                        }
                        variant={assessmentOptions.project.projectType === 'poster' ? 'default' : 'outline'}
                        className="h-10 text-sm"
                      >
                        Poster
                      </Button>
                      <Button
                        onClick={() =>
                          setAssessmentOptions({
                            ...assessmentOptions,
                            project: { ...assessmentOptions.project, projectType: 'model' },
                          })
                        }
                        variant={assessmentOptions.project.projectType === 'model' ? 'default' : 'outline'}
                        className="h-10 text-sm"
                      >
                        Model
                      </Button>
                      <Button
                        onClick={() =>
                          setAssessmentOptions({
                            ...assessmentOptions,
                            project: { ...assessmentOptions.project, projectType: 'presentation' },
                          })
                        }
                        variant={assessmentOptions.project.projectType === 'presentation' ? 'default' : 'outline'}
                        className="h-10 text-sm"
                      >
                        Presentation
                      </Button>
                      <Button
                        onClick={() =>
                          setAssessmentOptions({
                            ...assessmentOptions,
                            project: { ...assessmentOptions.project, projectType: 'report' },
                          })
                        }
                        variant={assessmentOptions.project.projectType === 'report' ? 'default' : 'outline'}
                        className="h-10 text-sm"
                      >
                        Report
                      </Button>
                    </div>
                  </div>
                )}
                <Button
                  onClick={handleGenerateAssessment}
                  className="bg-primary hover:bg-primary/90 w-full text-white"
                  disabled={!selectedGradeForAssessment || !selectedAssessmentType}
                >
                  Generate Assessment
                </Button>
              </div>
            </div>
          )}

          {/* Generated Assessment Preview */}
          {generatedAssessment && (
            <div>
              <h2 className="mb-3 text-base font-medium text-neutral-800">Generated Assessment</h2>
              <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-primary mb-2 text-lg font-bold">{generatedAssessment.title}</h3>
                  <div className="space-y-2 text-sm text-neutral-600">
                    <div className="flex items-center justify-between">
                      <span>Grade:</span>
                      <span className="font-medium">Grade {selectedGradeForAssessment}</span>
                    </div>
                    {selectedAssessmentType === 'written' && (
                      <>
                        <div className="flex items-center justify-between">
                          <span>Assessment Type:</span>
                          <span className="font-medium">Written Test</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Number of Questions:</span>
                          <span className="font-medium">{assessmentOptions.written.numberOfQuestions}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Question Format:</span>
                          <span className="font-medium capitalize">
                            {assessmentOptions.written.answerType === 'mcq' ? 'Multiple Choice' : 'True/False'}
                          </span>
                        </div>
                      </>
                    )}
                    {selectedAssessmentType === 'oral' && (
                      <>
                        <div className="flex items-center justify-between">
                          <span>Assessment Type:</span>
                          <span className="font-medium">Oral Assessment</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Number of Words:</span>
                          <span className="font-medium">{assessmentOptions.oral.numberOfWords}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Difficulty Level:</span>
                          <span className="font-medium capitalize">{assessmentOptions.oral.difficultyLevel}</span>
                        </div>
                      </>
                    )}
                    {selectedAssessmentType === 'project' && (
                      <>
                        <div className="flex items-center justify-between">
                          <span>Assessment Type:</span>
                          <span className="font-medium">Project-Based Assessment</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Project Type:</span>
                          <span className="font-medium capitalize">{assessmentOptions.project.projectType}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-4 rounded-lg bg-neutral-50 p-3">
                  <h4 className="mb-2 font-medium text-neutral-800">Instructions</h4>
                  <p className="text-sm text-neutral-600">{generatedAssessment.instructions}</p>
                </div>

                {selectedAssessmentType === 'written' && (
                  <div className="mb-4 rounded-lg bg-blue-50 p-3">
                    <h4 className="mb-2 font-medium text-blue-800">Sample Questions Preview</h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      <p>• Question 1: [Sample question will be generated]</p>
                      <p>• Question 2: [Sample question will be generated]</p>
                      <p>• Question 3: [Sample question will be generated]</p>
                      <p className="text-xs text-blue-600">
                        + {assessmentOptions.written.numberOfQuestions - 3} more questions
                      </p>
                    </div>
                  </div>
                )}

                {selectedAssessmentType === 'oral' && (
                  <div className="mb-4 rounded-lg bg-green-50 p-3">
                    <h4 className="mb-2 font-medium text-green-800">Oral Assessment Guidelines</h4>
                    <div className="space-y-1 text-sm text-green-700">
                      <p>• Students will answer questions verbally</p>
                      <p>• Assessment focuses on {assessmentOptions.oral.difficultyLevel} level comprehension</p>
                      <p>• Teacher can ask follow-up questions for clarity</p>
                      <p>• Responses should be approximately {assessmentOptions.oral.numberOfWords} words</p>
                    </div>
                  </div>
                )}

                {selectedAssessmentType === 'project' && (
                  <div className="mb-4 rounded-lg bg-purple-50 p-3">
                    <h4 className="mb-2 font-medium text-purple-800">Project Requirements</h4>
                    <div className="space-y-1 text-sm text-purple-700">
                      <p>• Students will create a {assessmentOptions.project.projectType}</p>
                      <p>• Project should demonstrate understanding of {topic}</p>
                      <p>• Students have {generatedAssessment.duration} minutes to complete</p>
                      <p>• Assessment includes both process and final product</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleSaveAssessment} className="bg-primary hover:bg-primary/90 flex-1 text-white">
                    Save Assessment
                  </Button>
                  <Button
                    onClick={() => {
                      // Handle preview functionality
                      console.log('Preview assessment:', generatedAssessment)
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Preview
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Saved Assessments */}
          <div>
            <h2 className="mb-3 text-base font-medium text-neutral-800">Saved Assessments</h2>
            <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
              {savedAssessments.length > 0 ? (
                <div className="space-y-3">
                  {savedAssessments.map((assessment: any) => (
                    <div
                      key={assessment.id}
                      className="flex items-center justify-between rounded-lg border border-neutral-200 p-3"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-neutral-800">{assessment.title}</span>
                        <span className="text-xs text-neutral-600">Grade {assessment.grade}</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-neutral-100 text-xs text-neutral-800 hover:bg-neutral-200"
                          >
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/assessment/${assessment.id}/conduct/grade/${assessment.grade}`)}
                          >
                            Conduct Assessment
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              // Handle edit functionality
                              console.log('Edit assessment:', assessment.id)
                            }}
                          >
                            Edit Assessment
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              // Handle delete functionality
                              setSavedAssessments((prev: any[]) => prev.filter((a: any) => a.id !== assessment.id))
                            }}
                          >
                            Delete Assessment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-neutral-500">No saved assessments.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <AIHelpDialog />
      <BottomNav />
    </div>
  )
}
