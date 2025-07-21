import { createContext, useState, useRef, type ReactNode } from 'react'
import { data } from '../lib/data'

// Define the shape of the context state
interface AppContextState {
  selectedGrades: number[]
  setSelectedGrades: React.Dispatch<React.SetStateAction<number[]>>
  currentScreen: string
  setCurrentScreen: React.Dispatch<React.SetStateAction<string>>
  selectedAnswer: string | null
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string | null>>
  topic: string
  setTopic: React.Dispatch<React.SetStateAction<string>>
  learningOutcomes: { [key: number]: string }
  setLearningOutcomes: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>
  uploadedFile: File | null
  setUploadedFile: React.Dispatch<React.SetStateAction<File | null>>
  linkUrl: string
  setLinkUrl: React.Dispatch<React.SetStateAction<string>>
  uploadType: 'file' | 'image' | 'link'
  setUploadType: React.Dispatch<React.SetStateAction<'file' | 'image' | 'link'>>
  supportingMaterials: Array<{
    id: string
    type: 'file' | 'image' | 'link'
    name: string
    url?: string
    file?: File
  }>
  setSupportingMaterials: React.Dispatch<
    React.SetStateAction<
      Array<{
        id: string
        type: 'file' | 'image' | 'link'
        name: string
        url?: string
        file?: File
      }>
    >
  >
  selectedDay: number | null
  setSelectedDay: React.Dispatch<React.SetStateAction<number | null>>
  showWholeClassModal: boolean
  setShowWholeClassModal: React.Dispatch<React.SetStateAction<boolean>>
  showBlackboardDialog: boolean
  setShowBlackboardDialog: React.Dispatch<React.SetStateAction<boolean>>
  blackboardPrompt: string
  setBlackboardPrompt: React.Dispatch<React.SetStateAction<string>>
  showStoryDialog: boolean
  setShowStoryDialog: React.Dispatch<React.SetStateAction<boolean>>
  storyPrompt: string
  setStoryPrompt: React.Dispatch<React.SetStateAction<string>>
  showFlashcardDialog: boolean
  setShowFlashcardDialog: React.Dispatch<React.SetStateAction<boolean>>
  flashcardPrompt: string
  setFlashcardPrompt: React.Dispatch<React.SetStateAction<string>>
  currentCardIndex: number
  setCurrentCardIndex: React.Dispatch<React.SetStateAction<number>>
  showDescription: boolean
  setShowDescription: React.Dispatch<React.SetStateAction<boolean>>
  showGamifiedDialog: boolean
  setShowGamifiedDialog: React.Dispatch<React.SetStateAction<boolean>>
  gamifiedPrompt: string
  setGamifiedPrompt: React.Dispatch<React.SetStateAction<string>>
  showQuestionPromptsDialog: boolean
  setShowQuestionPromptsDialog: React.Dispatch<React.SetStateAction<boolean>>
  questionPromptsPrompt: string
  setQuestionPromptsPrompt: React.Dispatch<React.SetStateAction<string>>
  showAIHelpDialog: boolean
  setShowAIHelpDialog: React.Dispatch<React.SetStateAction<boolean>>
  aiHelpPrompt: string
  setAiHelpPrompt: React.Dispatch<React.SetStateAction<string>>
  aiHelpResponse: string
  setAiHelpResponse: React.Dispatch<React.SetStateAction<string>>
  showGradeActivitiesModal: boolean
  setShowGradeActivitiesModal: React.Dispatch<React.SetStateAction<boolean>>
  activeGradeId: number | null
  setActiveGradeId: React.Dispatch<React.SetStateAction<number | null>>
  gradeActivitiesSelections: any // Replace with a more specific type if possible
  setGradeActivitiesSelections: React.Dispatch<React.SetStateAction<any>>
  hasGenerated: boolean
  setHasGenerated: React.Dispatch<React.SetStateAction<boolean>>
  carouselIndex: number
  setCarouselIndex: React.Dispatch<React.SetStateAction<number>>
  cardPrompts: string[]
  setCardPrompts: React.Dispatch<React.SetStateAction<string[]>>
  cardResponses: string[]
  setCardResponses: React.Dispatch<React.SetStateAction<string[]>>
  students: { [key: number]: { id: number; name: string }[] }
  setStudents: React.Dispatch<React.SetStateAction<{ [key: number]: { id: number; name: string }[] }>>

  selectedGradeForStudents: number | null
  setSelectedGradeForStudents: React.Dispatch<React.SetStateAction<number | null>>
  showAddStudentModal: boolean
  setShowAddStudentModal: React.Dispatch<React.SetStateAction<boolean>>
  selectedStudentForReport: { id: number; name: string } | null
  setSelectedStudentForReport: React.Dispatch<React.SetStateAction<{ id: number; name: string } | null>>
  showGradeDropdown: boolean
  setShowGradeDropdown: React.Dispatch<React.SetStateAction<boolean>>
  dropdownRef: React.RefObject<HTMLDivElement | null>
  showQuestionDropdown: boolean
  setShowQuestionDropdown: React.Dispatch<React.SetStateAction<boolean>>
  showWordsDropdown: boolean
  setShowWordsDropdown: React.Dispatch<React.SetStateAction<boolean>>
  questionDropdownRef: React.RefObject<HTMLDivElement | null>
  wordsDropdownRef: React.RefObject<HTMLDivElement | null>
  selectedGradeForAssessment: number | null
  setSelectedGradeForAssessment: React.Dispatch<React.SetStateAction<number | null>>
  selectedAssessmentType: string | null
  setSelectedAssessmentType: React.Dispatch<React.SetStateAction<string | null>>
  generatedAssessment: any // Replace with a more specific type if possible
  setGeneratedAssessment: React.Dispatch<React.SetStateAction<any>>
  assessmentPrompt: string
  setAssessmentPrompt: React.Dispatch<React.SetStateAction<string>>
  savedAssessments: any[] // Replace with a more specific type if possible
  setSavedAssessments: React.Dispatch<React.SetStateAction<any[]>>
  assessmentOptions: any // Replace with a more specific type if possible
  setAssessmentOptions: React.Dispatch<React.SetStateAction<any>>
  selectedAssessment: any // Replace with a more specific type if possible
  setSelectedAssessment: React.Dispatch<React.SetStateAction<any>>
  selectedStudentForAssessment: { id: number; name: string } | null
  setSelectedStudentForAssessment: React.Dispatch<React.SetStateAction<{ id: number; name: string } | null>>
  assessmentResults: any // Replace with a more specific type if possible
  setAssessmentResults: React.Dispatch<React.SetStateAction<any>>
  currentQuestionIndex: number
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>
  studentAnswers: any // Replace with a more specific type if possible
  setStudentAnswers: React.Dispatch<React.SetStateAction<any>>
  showFeedbackModal: boolean
  setShowFeedbackModal: React.Dispatch<React.SetStateAction<boolean>>
  selectedStudentForFeedback: { id: number; name: string } | null
  setSelectedStudentForFeedback: React.Dispatch<React.SetStateAction<{ id: number; name: string } | null>>
  feedbackText: string
  setFeedbackText: React.Dispatch<React.SetStateAction<string>>
  studentFeedback: any // Replace with a more specific type if possible
  setStudentFeedback: React.Dispatch<React.SetStateAction<any>>
  studentImages: any // Replace with a more specific type if possible
  setStudentImages: React.Dispatch<React.SetStateAction<any>>
  studentRecordings: any // Replace with a more specific type if possible
  setStudentRecordings: React.Dispatch<React.SetStateAction<any>>
  studentScores: any // Replace with a more specific type if possible
  setStudentScores: React.Dispatch<React.SetStateAction<any>>
  studentComments: any // Replace with a more specific type if possible
  setStudentComments: React.Dispatch<React.SetStateAction<any>>
  isRecording: boolean
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>
  recordingTime: number
  setRecordingTime: React.Dispatch<React.SetStateAction<number>>
  mediaRecorder: MediaRecorder | null
  setMediaRecorder: React.Dispatch<React.SetStateAction<MediaRecorder | null>>
  recordingTimer: number | null
  setRecordingTimer: React.Dispatch<React.SetStateAction<number | null>>
  grades: { id: number; name: string }[]
  questionData: any
  flashcardData: any[]
  modeOfInteractionOptions: any[]
  modalityOptions: any[]
  lessonPlan: any
}

// Create the context with a default value
export const AppContext = createContext<AppContextState | undefined>(undefined)

// Create the provider component
export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedGrades, setSelectedGrades] = useState<number[]>([])
  const [currentScreen, setCurrentScreen] = useState('gradeSelection')
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [topic, setTopic] = useState('')
  const [learningOutcomes, setLearningOutcomes] = useState<{ [key: number]: string }>({})
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [linkUrl, setLinkUrl] = useState('')
  const [uploadType, setUploadType] = useState<'file' | 'image' | 'link'>('file')
  const [supportingMaterials, setSupportingMaterials] = useState<
    Array<{
      id: string
      type: 'file' | 'image' | 'link'
      name: string
      url?: string
      file?: File
    }>
  >([])
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [showWholeClassModal, setShowWholeClassModal] = useState(false)
  const [showBlackboardDialog, setShowBlackboardDialog] = useState(false)
  const [blackboardPrompt, setBlackboardPrompt] = useState('')
  const [showStoryDialog, setShowStoryDialog] = useState(false)
  const [storyPrompt, setStoryPrompt] = useState('')
  const [showFlashcardDialog, setShowFlashcardDialog] = useState(false)
  const [flashcardPrompt, setFlashcardPrompt] = useState('')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showDescription, setShowDescription] = useState(false)
  const [showGamifiedDialog, setShowGamifiedDialog] = useState(false)
  const [gamifiedPrompt, setGamifiedPrompt] = useState('')
  const [showQuestionPromptsDialog, setShowQuestionPromptsDialog] = useState(false)
  const [questionPromptsPrompt, setQuestionPromptsPrompt] = useState('')
  const [showAIHelpDialog, setShowAIHelpDialog] = useState(false)
  const [aiHelpPrompt, setAiHelpPrompt] = useState('')
  const [aiHelpResponse, setAiHelpResponse] = useState('')
  const [showGradeActivitiesModal, setShowGradeActivitiesModal] = useState(false)
  const [activeGradeId, setActiveGradeId] = useState<number | null>(null)
  const [gradeActivitiesSelections, setGradeActivitiesSelections] = useState({})
  const [hasGenerated, setHasGenerated] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [cardPrompts, setCardPrompts] = useState(['', '', ''])
  const [cardResponses, setCardResponses] = useState(['', '', ''])
  const [students, setStudents] = useState<{ [key: number]: { id: number; name: string }[] }>({})

  const [selectedGradeForStudents, setSelectedGradeForStudents] = useState<number | null>(null)
  const [showAddStudentModal, setShowAddStudentModal] = useState(false)
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<{ id: number; name: string } | null>(null)
  const [showGradeDropdown, setShowGradeDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [showQuestionDropdown, setShowQuestionDropdown] = useState(false)
  const [showWordsDropdown, setShowWordsDropdown] = useState(false)
  const questionDropdownRef = useRef<HTMLDivElement>(null)
  const wordsDropdownRef = useRef<HTMLDivElement>(null)
  const [selectedGradeForAssessment, setSelectedGradeForAssessment] = useState<number | null>(null)
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<string | null>(null)
  const [generatedAssessment, setGeneratedAssessment] = useState(null)
  const [assessmentPrompt, setAssessmentPrompt] = useState('')
  const [savedAssessments, setSavedAssessments] = useState<any[]>([])
  const [assessmentOptions, setAssessmentOptions] = useState({
    written: { numberOfQuestions: 5, answerType: 'mcq' },
    oral: { numberOfWords: 100, difficultyLevel: 'medium' },
    project: { projectType: 'poster' },
  })
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [selectedStudentForAssessment, setSelectedStudentForAssessment] = useState<{ id: number; name: string } | null>(
    null,
  )
  const [assessmentResults, setAssessmentResults] = useState({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [studentAnswers, setStudentAnswers] = useState({})
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [selectedStudentForFeedback, setSelectedStudentForFeedback] = useState<{ id: number; name: string } | null>(
    null,
  )
  const [feedbackText, setFeedbackText] = useState('')
  const [studentFeedback, setStudentFeedback] = useState({})
  const [studentImages, setStudentImages] = useState({})
  const [studentRecordings, setStudentRecordings] = useState({})
  const [studentScores, setStudentScores] = useState({})
  const [studentComments, setStudentComments] = useState({})
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordingTimer, setRecordingTimer] = useState<number | null>(null)

  const grades = [
    { id: 1, name: 'Grade 1' },
    { id: 2, name: 'Grade 2' },
    { id: 3, name: 'Grade 3' },
    { id: 4, name: 'Grade 4' },
    { id: 5, name: 'Grade 5' },
  ]

  const questionData = {
    question: 'Which of the following states touches the boundary of Pakistan?',
    options: [
      { id: 'a', text: 'Punjab', isCorrect: true },
      { id: 'b', text: 'Haryana', isCorrect: false },
      { id: 'c', text: 'Himachal Pradesh', isCorrect: false },
      { id: 'd', text: 'Delhi', isCorrect: false },
    ],
  }

  const flashcardData = [
    {
      id: 1,
      image: 'assets/apple.png',
      title: 'Apple',
      description:
        'A red, round fruit that grows on trees. Apples are sweet and crunchy, and they are good for your health. They contain vitamins and fiber that help keep you strong and healthy.',
    },
    {
      id: 2,
      image: 'assets/banana.png',
      title: 'Banana',
      description:
        'A yellow, curved fruit that grows in bunches. Bananas are soft and sweet when ripe. They are rich in potassium and provide quick energy, making them a great snack for active children.',
    },
    {
      id: 3,
      image: 'assets/orange.png',
      title: 'Orange',
      description:
        'A round, orange-colored fruit with a thick peel. Oranges are juicy and contain lots of vitamin C, which helps keep your immune system strong and protects you from getting sick.',
    },
  ]

  const modeOfInteractionOptions = [
    { id: 'independent', label: 'Work independently' },
    { id: 'peer', label: 'Work with each other' },
    { id: 'teacher', label: 'Work with the teacher' },
  ]

  const modalityOptions = [
    { id: 'visual', label: 'Visual' },
    { id: 'auditory', label: 'Auditory' },
    { id: 'kinesthetic', label: 'Activity based' },
    { id: 'paper', label: 'Paper/Slate based' },
  ]

  const lessonPlan = topic ? data[topic as keyof typeof data]?.outputs || [] : []

  const value = {
    selectedGrades,
    setSelectedGrades,
    currentScreen,
    setCurrentScreen,
    selectedAnswer,
    setSelectedAnswer,
    topic,
    setTopic,
    learningOutcomes,
    setLearningOutcomes,
    uploadedFile,
    setUploadedFile,
    linkUrl,
    setLinkUrl,
    uploadType,
    setUploadType,
    supportingMaterials,
    setSupportingMaterials,
    selectedDay,
    setSelectedDay,
    showWholeClassModal,
    setShowWholeClassModal,
    showBlackboardDialog,
    setShowBlackboardDialog,
    blackboardPrompt,
    setBlackboardPrompt,
    showStoryDialog,
    setShowStoryDialog,
    storyPrompt,
    setStoryPrompt,
    showFlashcardDialog,
    setShowFlashcardDialog,
    flashcardPrompt,
    setFlashcardPrompt,
    currentCardIndex,
    setCurrentCardIndex,
    showDescription,
    setShowDescription,
    showGamifiedDialog,
    setShowGamifiedDialog,
    gamifiedPrompt,
    setGamifiedPrompt,
    showQuestionPromptsDialog,
    setShowQuestionPromptsDialog,
    questionPromptsPrompt,
    setQuestionPromptsPrompt,
    showAIHelpDialog,
    setShowAIHelpDialog,
    aiHelpPrompt,
    setAiHelpPrompt,
    aiHelpResponse,
    setAiHelpResponse,
    showGradeActivitiesModal,
    setShowGradeActivitiesModal,
    activeGradeId,
    setActiveGradeId,
    gradeActivitiesSelections,
    setGradeActivitiesSelections,
    hasGenerated,
    setHasGenerated,
    carouselIndex,
    setCarouselIndex,
    cardPrompts,
    setCardPrompts,
    cardResponses,
    setCardResponses,
    students,
    setStudents,
    selectedGradeForStudents,
    setSelectedGradeForStudents,
    showAddStudentModal,
    setShowAddStudentModal,
    selectedStudentForReport,
    setSelectedStudentForReport,
    showGradeDropdown,
    setShowGradeDropdown,
    dropdownRef,
    showQuestionDropdown,
    setShowQuestionDropdown,
    showWordsDropdown,
    setShowWordsDropdown,
    questionDropdownRef,
    wordsDropdownRef,
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
    selectedAssessment,
    setSelectedAssessment,
    selectedStudentForAssessment,
    setSelectedStudentForAssessment,
    assessmentResults,
    setAssessmentResults,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    studentAnswers,
    setStudentAnswers,
    showFeedbackModal,
    setShowFeedbackModal,
    selectedStudentForFeedback,
    setSelectedStudentForFeedback,
    feedbackText,
    setFeedbackText,
    studentFeedback,
    setStudentFeedback,
    studentImages,
    setStudentImages,
    studentRecordings,
    setStudentRecordings,
    studentScores,
    setStudentScores,
    studentComments,
    setStudentComments,
    isRecording,
    setIsRecording,
    recordingTime,
    setRecordingTime,
    mediaRecorder,
    setMediaRecorder,
    recordingTimer,
    setRecordingTimer,
    grades,
    questionData,
    flashcardData,
    modeOfInteractionOptions,
    modalityOptions,
    lessonPlan,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
