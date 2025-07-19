import { useParams, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import BottomNav from '../components/BottomNav'
import Header from '../components/Header'
import AIHelpDialog from '../components/modals/AIHelpDialog'

const ConductAssessment = () => {
  const { assessmentId } = useParams()
  const context = useContext(AppContext)
  const navigate = useNavigate()

  if (!context) {
    return <div>Loading...</div>
  }

  const {
    savedAssessments,
    students,
    selectedStudentForAssessment,
    setSelectedStudentForAssessment,
    setAssessmentResults,
    studentAnswers,
    setStudentAnswers,
    currentQuestionIndex,
    setCurrentQuestionIndex,
  } = context

  const assessment = savedAssessments.find((a: any) => a.id === Number(assessmentId))

  if (!assessment) {
    return <div>Assessment not found</div>
  }

  const handleSubmitAssessment = () => {
    if (assessment && selectedStudentForAssessment) {
      const totalQuestions = assessment.questions.length
      const answeredQuestions = Object.keys(studentAnswers).length
      const score = Math.round((answeredQuestions / totalQuestions) * assessment.points)

      const result = {
        score,
        answers: { ...studentAnswers },
        completedAt: new Date().toISOString(),
        totalQuestions,
        answeredQuestions,
      }

      setAssessmentResults((prev: any) => ({
        ...prev,
        [assessment.id]: {
          ...prev[assessment.id],
          [selectedStudentForAssessment.id]: result,
        },
      }))

      setSelectedStudentForAssessment(null)
      setCurrentQuestionIndex(0)
      setStudentAnswers({})
    }
  }

  return (
    <div className="bg-neutral-98 min-h-screen pb-20">
      <Header title="Conduct Assessment" onBack={() => navigate('/assessment')} />

      <div className="p-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-lg font-medium">{assessment.title}</h2>

          <div className="my-4">
            <label htmlFor="student-select" className="mb-2 block text-sm font-medium text-neutral-700">
              Select Student
            </label>
            <select
              id="student-select"
              value={selectedStudentForAssessment?.id || ''}
              onChange={e => {
                const student = students[assessment.grade]?.find(s => s.id === Number(e.target.value))
                setSelectedStudentForAssessment(student || null)
              }}
              className="border-neutral-80 focus:border-primary-40 text-neutral-10 w-full rounded-2xl border-2 bg-neutral-100 p-3 focus:ring-0 focus:outline-none"
            >
              <option value="" disabled>
                Select a student
              </option>
              {students[assessment.grade]?.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          {selectedStudentForAssessment && (
            <div>
              {assessment.questions.map((q: any, index: number) => (
                <div key={index} className={`${index === currentQuestionIndex ? 'block' : 'hidden'}`}>
                  <p>{q.question}</p>
                  {/* Add answer inputs based on question type */}
                </div>
              ))}
              <button onClick={handleSubmitAssessment} className="bg-primary-40 mt-4 rounded-lg p-2 text-white">
                Submit Assessment
              </button>
            </div>
          )}
        </div>
      </div>

      <AIHelpDialog />
      <BottomNav />
    </div>
  )
}

export default ConductAssessment
