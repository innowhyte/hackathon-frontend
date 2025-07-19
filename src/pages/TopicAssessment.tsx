import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import BottomNav from '../components/BottomNav'
import Header from '../components/Header'
import AIHelpDialog from '../components/modals/AIHelpDialog'

const TopicAssessment = () => {
  const context = useContext(AppContext)
  const navigate = useNavigate()

  if (!context) {
    return <div>Loading...</div>
  }

  const {
    topic,
    grades,
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
          duration: currentOptions.numberOfQuestions * 10,
          points: currentOptions.numberOfQuestions * 10,
        },
        oral: {
          title: `Oral Assessment - ${topic}`,
          type: 'Oral Assessment',
          numberOfWords: currentOptions.numberOfWords,
          difficultyLevel: currentOptions.difficultyLevel,
          questions: [], // Generate questions dynamically
          instructions: `Be prepared to answer questions orally.`,
          duration: 30,
          points: 50,
        },
        project: {
          title: `Project-Based Assessment - ${topic}`,
          type: 'Project-Based Assessment',
          projectType: currentOptions.projectType,
          questions: [], // Generate questions dynamically
          instructions: `Complete the ${currentOptions.projectType} project.`,
          duration: 120,
          points: 150,
        },
      }
      setGeneratedAssessment(sampleAssessments[selectedAssessmentType])
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
    <div className="bg-neutral-98 min-h-screen pb-20">
      <Header title="Assessments" onBack={() => navigate('/plan')} />

      <div className="p-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <label htmlFor="grade-select" className="mb-2 block text-sm font-medium text-neutral-700">
              Select Grade
            </label>
            <select
              id="grade-select"
              value={selectedGradeForAssessment || ''}
              onChange={e => setSelectedGradeForAssessment(Number(e.target.value))}
              className="border-neutral-80 focus:border-primary-40 text-neutral-10 w-full rounded-2xl border-2 bg-neutral-100 p-3 focus:ring-0 focus:outline-none"
            >
              <option value="" disabled>
                Select a grade
              </option>
              {grades.map(grade => (
                <option key={grade.id} value={grade.id}>
                  {grade.name}
                </option>
              ))}
            </select>
          </div>

          {selectedGradeForAssessment && (
            <div className="mb-6">
              <h2 className="mb-2 text-lg font-medium text-neutral-800">Assessment Type</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedAssessmentType('written')}
                  className={`rounded-lg p-2 ${selectedAssessmentType === 'written' ? 'bg-primary-40 text-white' : 'bg-gray-200'}`}
                >
                  Written
                </button>
                <button
                  onClick={() => setSelectedAssessmentType('oral')}
                  className={`rounded-lg p-2 ${selectedAssessmentType === 'oral' ? 'bg-primary-40 text-white' : 'bg-gray-200'}`}
                >
                  Oral
                </button>
                <button
                  onClick={() => setSelectedAssessmentType('project')}
                  className={`rounded-lg p-2 ${selectedAssessmentType === 'project' ? 'bg-primary-40 text-white' : 'bg-gray-200'}`}
                >
                  Project
                </button>
              </div>
            </div>
          )}

          {selectedAssessmentType && (
            <div className="mb-6">
              <h2 className="mb-2 text-lg font-medium text-neutral-800">Options</h2>
              {selectedAssessmentType === 'written' && (
                <div className="flex flex-col gap-2">
                  <label>Number of Questions: {assessmentOptions.written.numberOfQuestions}</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={assessmentOptions.written.numberOfQuestions}
                    onChange={e =>
                      setAssessmentOptions({
                        ...assessmentOptions,
                        written: { ...assessmentOptions.written, numberOfQuestions: Number(e.target.value) },
                      })
                    }
                  />
                  <select
                    value={assessmentOptions.written.answerType}
                    onChange={e =>
                      setAssessmentOptions({
                        ...assessmentOptions,
                        written: { ...assessmentOptions.written, answerType: e.target.value },
                      })
                    }
                  >
                    <option value="mcq">MCQ</option>
                    <option value="truefalse">True/False</option>
                  </select>
                </div>
              )}
              {selectedAssessmentType === 'oral' && (
                <div className="flex flex-col gap-2">
                  <label>Number of Words: {assessmentOptions.oral.numberOfWords}</label>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={assessmentOptions.oral.numberOfWords}
                    onChange={e =>
                      setAssessmentOptions({
                        ...assessmentOptions,
                        oral: { ...assessmentOptions.oral, numberOfWords: Number(e.target.value) },
                      })
                    }
                  />
                  <select
                    value={assessmentOptions.oral.difficultyLevel}
                    onChange={e =>
                      setAssessmentOptions({
                        ...assessmentOptions,
                        oral: { ...assessmentOptions.oral, difficultyLevel: e.target.value },
                      })
                    }
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              )}
              {selectedAssessmentType === 'project' && (
                <div className="flex flex-col gap-2">
                  <select
                    value={assessmentOptions.project.projectType}
                    onChange={e =>
                      setAssessmentOptions({
                        ...assessmentOptions,
                        project: { ...assessmentOptions.project, projectType: e.target.value },
                      })
                    }
                  >
                    <option value="poster">Poster</option>
                    <option value="model">Model</option>
                    <option value="presentation">Presentation</option>
                    <option value="report">Report</option>
                  </select>
                </div>
              )}
              <button onClick={handleGenerateAssessment} className="bg-primary-40 mt-4 rounded-lg p-2 text-white">
                Generate Assessment
              </button>
            </div>
          )}

          {generatedAssessment && (
            <div className="mb-6">
              <h2 className="mb-2 text-lg font-medium text-neutral-800">Generated Assessment</h2>
              <div className="rounded-lg bg-white p-4 shadow">
                <h3 className="font-bold">{generatedAssessment.title}</h3>
                <p>{generatedAssessment.instructions}</p>
                <button onClick={handleSaveAssessment} className="bg-primary-40 mt-4 rounded-lg p-2 text-white">
                  Save Assessment
                </button>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="mb-2 text-lg font-medium text-neutral-800">Saved Assessments</h2>
            <div className="rounded-lg bg-white p-4 shadow">
              {savedAssessments.length > 0 ? (
                <ul>
                  {savedAssessments.map((assessment: any) => (
                    <li key={assessment.id} className="flex items-center justify-between border-b py-2">
                      <span>{assessment.title}</span>
                      <button onClick={() => navigate(`/assessment/${assessment.id}`)} className="text-primary-40">
                        Conduct
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No saved assessments.</p>
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

export default TopicAssessment
