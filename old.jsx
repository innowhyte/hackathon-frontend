import React, { useState, useEffect, useRef } from 'react'
import './App.css'

// Add line-clamp styles
const lineClampStyles = `
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = lineClampStyles
  document.head.appendChild(style)
}

const data = {
  Addition: {
    inputs: [
      "Grade 4: Add two numbers sum not exceeding 999 with carrying over at unit's and ten's place",
      "Grade 5: Add two numbers sum not exceeding 9999 with carrying over at unit's and ten's place",
    ],
    outputs: [
      {
        day: 1,
        whole_class_introduction_plan:
          "Review place value (Units, Tens, Hundreds) and simple addition. Introduce the concept of 'carrying over' when the sum in the units column is 10 or more, using a visual example on the board.",
        grade_plans: [
          {
            grade: 'Grade 4',
            learning_objective:
              "Students will be able to add two 2-digit numbers with carrying over at the unit's place.",
          },
          {
            grade: 'Grade 5',
            learning_objective:
              "Students will be able to add two 3-digit numbers with carrying over at the unit's place.",
          },
        ],
      },
      {
        day: 2,
        whole_class_introduction_plan:
          'Recap the process of carrying over from the units to the tens place. Introduce the concept of carrying over from the tens to the hundreds place, explaining it is the same principle.',
        grade_plans: [
          {
            grade: 'Grade 4',
            learning_objective:
              "Students will be able to add two 3-digit numbers with carrying over at the unit's place.",
          },
          {
            grade: 'Grade 5',
            learning_objective:
              "Students will be able to add two 4-digit numbers with carrying over at the unit's place.",
          },
        ],
      },
      {
        day: 3,
        whole_class_introduction_plan:
          "Demonstrate adding numbers that require carrying over at both the unit's and ten's place simultaneously. Work through a step-by-step example for the whole class.",
        grade_plans: [
          {
            grade: 'Grade 4',
            learning_objective:
              "Students will be able to add two 3-digit numbers with carrying over at the unit's and ten's place.",
          },
          {
            grade: 'Grade 5',
            learning_objective:
              "Students will be able to add two 3-digit numbers with carrying over at the unit's and ten's place.",
          },
        ],
      },
      {
        day: 4,
        whole_class_introduction_plan:
          'Review the complete process of multi-digit addition with carrying. Introduce simple word problems that require addition to find a total.',
        grade_plans: [
          {
            grade: 'Grade 4',
            learning_objective:
              'Students will be able to solve simple word problems involving the addition of two numbers up to 999 with carrying over.',
          },
          {
            grade: 'Grade 5',
            learning_objective:
              "Students will be able to add two 4-digit numbers with carrying over at the unit's and ten's place.",
          },
        ],
      },
      {
        day: 5,
        whole_class_introduction_plan:
          "Consolidate the week's learning by solving mixed-problem sets on the board and discussing real-life scenarios where addition with carrying is used, such as calculating shopping bills.",
        grade_plans: [
          {
            grade: 'Grade 4',
            learning_objective:
              'Students will demonstrate mastery by correctly solving a variety of addition problems with sums up to 999 with carrying over.',
          },
          {
            grade: 'Grade 5',
            learning_objective:
              'Students will be able to solve multi-step word problems involving the addition of two numbers up to 9999 with carrying over.',
          },
        ],
      },
    ],
  },
  'Water cycle': {
    inputs: [
      'Grade 4: Explain the different stages of water cycle - evaporation, condensation, precipitation, collection',
      'Grade 5: Explain the different stages of water cycle - evaporation, condensation, precipitation, collection',
    ],
    outputs: [
      {
        day: 1,
        whole_class_introduction_plan:
          "Introduce the concept of the water cycle by asking students where water comes from and where it goes. Define the first stage, evaporation, explaining how the sun's heat turns water into vapor.",
        grade_plans: [
          {
            grade: 'Grade 4',
            learning_objective:
              'Students will be able to define and describe the process of evaporation as the first stage of the water cycle.',
          },
          {
            grade: 'Grade 5',
            learning_objective:
              'Students will be able to define and describe the process of evaporation, identifying the sun as the source of energy.',
          },
        ],
      },
      {
        day: 2,
        whole_class_introduction_plan:
          'Recap evaporation. Introduce the second stage, condensation, by explaining what happens to water vapor as it cools in the atmosphere and its connection to cloud formation.',
        grade_plans: [
          {
            grade: 'Grade 4',
            learning_objective:
              'Students will be able to define and describe the process of condensation and its role in forming clouds.',
          },
          {
            grade: 'Grade 5',
            learning_objective:
              'Students will be able to define and describe the process of condensation and explain how it leads to the formation of clouds.',
          },
        ],
      },
      {
        day: 3,
        whole_class_introduction_plan:
          'Review evaporation and condensation. Introduce the third stage, precipitation, by explaining what happens when clouds become saturated with water droplets.',
        grade_plans: [
          {
            grade: 'Grade 4',
            learning_objective:
              'Students will be able to define and describe the process of precipitation and name its common forms (rain, snow).',
          },
          {
            grade: 'Grade 5',
            learning_objective:
              'Students will be able to define and describe the process of precipitation and identify its different forms (rain, snow, sleet, hail).',
          },
        ],
      },
      {
        day: 4,
        whole_class_introduction_plan:
          'Recap the first three stages. Introduce the final stage, collection, by discussing where water goes after it falls back to Earth.',
        grade_plans: [
          {
            grade: 'Grade 4',
            learning_objective:
              'Students will be able to define and describe the process of collection in bodies of water like rivers and lakes.',
          },
          {
            grade: 'Grade 5',
            learning_objective:
              'Students will be able to define and describe the process of collection, including surface runoff and groundwater.',
          },
        ],
      },
      {
        day: 5,
        whole_class_introduction_plan:
          'Review all four stages of the water cycle. Present a complete diagram showing how evaporation, condensation, precipitation, and collection work together in a continuous loop.',
        grade_plans: [
          {
            grade: 'Grade 4',
            learning_objective: 'Students will be able to sequence and label the four main stages of the water cycle.',
          },
          {
            grade: 'Grade 5',
            learning_objective:
              'Students will be able to explain how the four stages of the water cycle are interconnected and continuous.',
          },
        ],
      },
    ],
  },
}

function App() {
  const [selectedGrades, setSelectedGrades] = useState([])
  const [currentScreen, setCurrentScreen] = useState('gradeSelection') // 'gradeSelection', 'topicSetup', 'question', 'weeklyPlan', 'dayLesson', 'gradeActivities', 'studentManagement', 'studentReport', 'topicAssessment', 'conductAssessment'
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  // New state for topic setup
  const [topic, setTopic] = useState('')
  const [learningOutcomes, setLearningOutcomes] = useState({})
  const [uploadedFile, setUploadedFile] = useState(null)
  const [linkUrl, setLinkUrl] = useState('')
  const [uploadType, setUploadType] = useState('file') // 'file', 'image', 'link'

  // New state for day selection
  const [selectedDay, setSelectedDay] = useState(null)

  // New state for whole class introduction modal
  const [showWholeClassModal, setShowWholeClassModal] = useState(false)

  // State for blackboard drawing dialog
  const [showBlackboardDialog, setShowBlackboardDialog] = useState(false)
  const [blackboardPrompt, setBlackboardPrompt] = useState('')

  // State for story dialog
  const [showStoryDialog, setShowStoryDialog] = useState(false)
  const [storyPrompt, setStoryPrompt] = useState('')

  // State for flashcard dialog
  const [showFlashcardDialog, setShowFlashcardDialog] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showDescription, setShowDescription] = useState(false)

  // State for gamified activities dialog
  const [showGamifiedDialog, setShowGamifiedDialog] = useState(false)
  const [gamifiedPrompt, setGamifiedPrompt] = useState('')

  // State for question prompts dialog
  const [showQuestionPromptsDialog, setShowQuestionPromptsDialog] = useState(false)
  const [questionPromptsPrompt, setQuestionPromptsPrompt] = useState('')

  // State for AI help dialog
  const [showAIHelpDialog, setShowAIHelpDialog] = useState(false)
  const [aiHelpPrompt, setAiHelpPrompt] = useState('')
  const [aiHelpResponse, setAiHelpResponse] = useState('')

  // State for grade activities modal
  const [showGradeActivitiesModal, setShowGradeActivitiesModal] = useState(false)
  const [activeGradeId, setActiveGradeId] = useState(null)
  const [gradeActivitiesSelections, setGradeActivitiesSelections] = useState({}) // { [day]: { [gradeId]: { mode: '', modalities: [] } } }

  // Carousel and generate state (must be at top level)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)

  // At the top level of App, add state for prompts and responses per card
  const [cardPrompts, setCardPrompts] = useState(['', '', ''])
  const [cardResponses, setCardResponses] = useState(['', '', ''])

  // New state for student management
  const [students, setStudents] = useState({}) // { [gradeId]: [{ id, name }] }
  const [newStudentName, setNewStudentName] = useState('')
  const [selectedGradeForStudents, setSelectedGradeForStudents] = useState(null)
  const [showAddStudentModal, setShowAddStudentModal] = useState(false)
  const [selectedStudentForReport, setSelectedStudentForReport] = useState(null)
  const [showGradeDropdown, setShowGradeDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // New state for assessment option dropdowns
  const [showQuestionDropdown, setShowQuestionDropdown] = useState(false)
  const [showWordsDropdown, setShowWordsDropdown] = useState(false)
  const questionDropdownRef = useRef(null)
  const wordsDropdownRef = useRef(null)

  // New state for assessment
  const [selectedGradeForAssessment, setSelectedGradeForAssessment] = useState(null)
  const [selectedAssessmentType, setSelectedAssessmentType] = useState(null)
  const [generatedAssessment, setGeneratedAssessment] = useState(null)
  const [assessmentPrompt, setAssessmentPrompt] = useState('')
  const [savedAssessments, setSavedAssessments] = useState([])

  // New state for assessment options
  const [assessmentOptions, setAssessmentOptions] = useState({
    written: {
      numberOfQuestions: 5,
      answerType: 'mcq', // 'mcq', 'truefalse'
    },
    oral: {
      numberOfWords: 100,
      difficultyLevel: 'medium', // 'easy', 'medium', 'hard'
    },
    project: {
      projectType: 'poster', // 'poster', 'model', 'presentation', 'report'
    },
  })

  // New state for assessment conduction
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [selectedStudentForAssessment, setSelectedStudentForAssessment] = useState(null)
  const [assessmentResults, setAssessmentResults] = useState({}) // { [assessmentId]: { [studentId]: { score, answers, completedAt } } }
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [studentAnswers, setStudentAnswers] = useState({})

  // New state for student feedback
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [selectedStudentForFeedback, setSelectedStudentForFeedback] = useState(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [studentFeedback, setStudentFeedback] = useState({})

  // New state for assessment media and scoring
  const [studentImages, setStudentImages] = useState({}) // { [studentId]: [{ url, name }] }
  const [studentRecordings, setStudentRecordings] = useState({}) // { [studentId]: [{ url, duration }] }
  const [studentScores, setStudentScores] = useState({}) // { [studentId]: score }
  const [studentComments, setStudentComments] = useState({}) // { [studentId]: comment }
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [recordingTimer, setRecordingTimer] = useState(null) // { [studentId]: [{ text, date, id }] }

  // Options
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

  // Sample flashcard data
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

  const handleGradeSelect = gradeId => {
    setSelectedGrades(prev => {
      if (prev.includes(gradeId)) {
        return prev.filter(id => id !== gradeId)
      } else {
        return [...prev, gradeId]
      }
    })
  }

  const handleAnswerSelect = answerId => {
    setSelectedAnswer(answerId)
  }

  const handleContinue = () => {
    if (currentScreen === 'gradeSelection') {
      setCurrentScreen('topicSetup')
    } else if (currentScreen === 'topicSetup') {
      setCurrentScreen('weeklyPlan')
    }
  }

  const handleDaySelect = day => {
    setSelectedDay(day)
    setCurrentScreen('dayLesson')
  }

  const handleLearningOutcomeChange = (gradeId, value) => {
    setLearningOutcomes(prev => ({
      ...prev,
      [gradeId]: value,
    }))
  }

  const handleFileUpload = event => {
    const file = event.target.files[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const isGradeSelected = gradeId => selectedGrades.includes(gradeId)

  const canContinueFromTopicSetup = () => {
    if (!topic.trim()) return false

    // Check if all selected grades have learning outcomes
    return selectedGrades.every(gradeId => learningOutcomes[gradeId] && learningOutcomes[gradeId].trim())
  }

  const handleWholeClassIntroduction = () => {
    setShowWholeClassModal(true)
  }

  const handleBlackboardChipClick = () => {
    setShowBlackboardDialog(true)
  }

  const handleStoryChipClick = () => {
    setShowStoryDialog(true)
  }

  const handleFlashcardChipClick = () => {
    setShowFlashcardDialog(true)
    setCurrentCardIndex(0)
    setShowDescription(false)
  }

  const handleGamifiedChipClick = () => {
    setShowGamifiedDialog(true)
  }

  const handleQuestionPromptsChipClick = () => {
    setShowQuestionPromptsDialog(true)
  }

  const handleAIHelpClick = () => {
    setShowAIHelpDialog(true)
  }

  const handleAIHelpSubmit = () => {
    if (aiHelpPrompt.trim()) {
      // Generate a demo response based on the prompt
      const responses = {
        default: `Thank you for your question about "${aiHelpPrompt}". Here are some suggestions to help you address this student concern:

1. **Break it down**: Start with the most basic concepts and build up gradually. Use simple language and relatable examples.

2. **Use visual aids**: Create diagrams, drawings, or use physical objects to make abstract concepts more concrete.

3. **Interactive approach**: Ask the student questions to gauge their understanding and adjust your explanation accordingly.

4. **Real-world connections**: Connect the topic to things the student already knows or experiences in daily life.

5. **Practice together**: Work through examples step by step with the student before asking them to try independently.

Would you like me to provide more specific strategies for this particular situation?`,

        math: `For mathematical concepts, I recommend:

• Start with concrete examples using objects they can touch and count
• Use visual representations like drawings or charts
• Break complex problems into smaller, manageable steps
• Encourage the student to explain their thinking process
• Provide plenty of practice with similar problems
• Connect math to real-life situations they can relate to

Remember to be patient and celebrate small victories to build their confidence!`,

        science: `For science topics, try these approaches:

• Begin with hands-on experiments or demonstrations
• Use analogies to compare new concepts with familiar things
• Encourage questions and curiosity
• Show real-world applications of the scientific concepts
• Use storytelling to make the content more engaging
• Break down complex processes into simple steps

Science is best learned through exploration and discovery!`,
      }

      // Check if prompt contains specific subject keywords
      let response = responses.default
      if (
        aiHelpPrompt.toLowerCase().includes('math') ||
        aiHelpPrompt.toLowerCase().includes('calculation') ||
        aiHelpPrompt.toLowerCase().includes('number')
      ) {
        response = responses.math
      } else if (
        aiHelpPrompt.toLowerCase().includes('science') ||
        aiHelpPrompt.toLowerCase().includes('experiment') ||
        aiHelpPrompt.toLowerCase().includes('nature')
      ) {
        response = responses.science
      }

      setAiHelpResponse(response)
    }
  }

  // Open modal for grade activities
  const handleGradeActivitiesClick = gradeId => {
    setActiveGradeId(gradeId)
    setCurrentScreen('gradeActivities')
  }

  // Handle mode selection (single)
  const handleModeSelect = modeId => {
    setGradeActivitiesSelections(prev => {
      const dayKey = selectedDay
      return {
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          [activeGradeId]: {
            ...(prev[dayKey]?.[activeGradeId] || {}),
            mode: modeId,
          },
        },
      }
    })
  }

  // Handle modality selection (multi)
  const handleModalityToggle = modalityId => {
    setGradeActivitiesSelections(prev => {
      const dayKey = selectedDay
      const current = prev[dayKey]?.[activeGradeId]?.modalities || []
      const newModalities = current.includes(modalityId)
        ? current.filter(id => id !== modalityId)
        : [...current, modalityId]
      return {
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          [activeGradeId]: {
            ...(prev[dayKey]?.[activeGradeId] || {}),
            modalities: newModalities,
          },
        },
      }
    })
  }

  // Save and close modal
  const handleSaveGradeActivities = () => {
    setCurrentScreen('dayLesson')
    setActiveGradeId(null)
  }

  // Student management handlers
  const handleGradeSelectForStudents = gradeId => {
    setSelectedGradeForStudents(gradeId)
  }

  const handleAddStudent = () => {
    if (newStudentName.trim() && selectedGradeForStudents) {
      const newStudent = {
        id: Date.now(),
        name: newStudentName.trim(),
      }

      setStudents(prev => ({
        ...prev,
        [selectedGradeForStudents]: [...(prev[selectedGradeForStudents] || []), newStudent],
      }))

      setNewStudentName('')
      setShowAddStudentModal(false)
    }
  }

  const handleRemoveStudent = (gradeId, studentId) => {
    setStudents(prev => ({
      ...prev,
      [gradeId]: prev[gradeId].filter(student => student.id !== studentId),
    }))
  }

  const handleOpenAddStudentModal = () => {
    if (selectedGradeForStudents) {
      setShowAddStudentModal(true)
    }
  }

  const handleOpenStudentReport = student => {
    setSelectedStudentForReport(student)
    setCurrentScreen('studentReport')
  }

  // Student feedback handlers
  const handleOpenFeedbackModal = student => {
    setSelectedStudentForFeedback(student)
    setFeedbackText('')
    setShowFeedbackModal(true)
  }

  const handleSaveFeedback = () => {
    if (selectedStudentForFeedback && feedbackText.trim()) {
      const newFeedback = {
        id: Date.now(),
        text: feedbackText.trim(),
        date: new Date().toISOString(),
      }

      setStudentFeedback(prev => ({
        ...prev,
        [selectedStudentForFeedback.id]: [newFeedback, ...(prev[selectedStudentForFeedback.id] || [])],
      }))
      setFeedbackText('')
    }
  }

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false)
    setSelectedStudentForFeedback(null)
    setFeedbackText('')
  }

  const handleDeleteFeedback = feedbackId => {
    if (selectedStudentForFeedback) {
      setStudentFeedback(prev => ({
        ...prev,
        [selectedStudentForFeedback.id]: prev[selectedStudentForFeedback.id].filter(
          feedback => feedback.id !== feedbackId,
        ),
      }))
    }
  }

  const handleOpenTopicAssessment = () => {
    setCurrentScreen('topicAssessment')
  }

  const handleGradeSelectForAssessment = gradeId => {
    setSelectedGradeForAssessment(gradeId)
    setSelectedAssessmentType(null)
    setGeneratedAssessment(null)
  }

  const handleAssessmentTypeSelect = type => {
    setSelectedAssessmentType(type)
    setGeneratedAssessment(null)
    // Reset options when changing assessment type
    if (type !== selectedAssessmentType) {
      setAssessmentOptions(prev => ({
        ...prev,
        [type]: {
          ...prev[type], // Keep existing defaults
        },
      }))
    }
  }

  const handleAssessmentOptionChange = (type, option, value) => {
    setAssessmentOptions(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [option]: value,
      },
    }))
  }

  const handleGenerateAssessment = () => {
    if (selectedGradeForAssessment && selectedAssessmentType) {
      const currentOptions = assessmentOptions[selectedAssessmentType]

      // Generate sample assessment based on type and options
      const sampleAssessments = {
        written: {
          title: `Written Test - ${topic}`,
          type: 'Written Test',
          answerType: currentOptions.answerType,
          numberOfQuestions: currentOptions.numberOfQuestions,
          questions: generateWrittenQuestions(currentOptions.numberOfQuestions, currentOptions.answerType),
          instructions: `Answer all ${currentOptions.numberOfQuestions} questions. ${currentOptions.answerType === 'mcq' ? 'Choose the best answer from the given options.' : 'Mark each statement as True or False.'}`,
          duration: currentOptions.numberOfQuestions * 10, // 10 minutes per question
          points: currentOptions.numberOfQuestions * 10,
        },
        oral: {
          title: `Oral Assessment - ${topic}`,
          type: 'Oral Assessment',
          numberOfWords: currentOptions.numberOfWords,
          difficultyLevel: currentOptions.difficultyLevel,
          questions: generateOralQuestions(currentOptions.difficultyLevel),
          instructions: `Be prepared to answer questions orally. Each response should be approximately ${currentOptions.numberOfWords} words. Difficulty level: ${currentOptions.difficultyLevel}.`,
          duration: 30,
          points: 50,
        },
        project: {
          title: `Project-Based Assessment - ${topic}`,
          type: 'Project-Based Assessment',
          projectType: currentOptions.projectType,
          questions: generateProjectTasks(currentOptions.projectType),
          instructions: `Complete the ${currentOptions.projectType} project according to the given guidelines. Be creative and thorough.`,
          duration: 120,
          points: 150,
        },
      }

      setGeneratedAssessment(sampleAssessments[selectedAssessmentType])
    }
  }

  // Helper functions for generating questions
  const generateWrittenQuestions = (count, answerType) => {
    const baseQuestions = [
      'Water on Earth today is about the same amount as it was millions of years ago.',
      'The water cycle is the process where water moves from the ground to the atmosphere and back again.',
      'Water can exist as a solid, liquid, and gas on Earth.',
      'Most of the water on Earth is found in rivers and lakes.',
      'Evaporation is when the sun heats up water and turns it into water vapor.',
      'Condensation is when water vapor turns into ice.',
      'Precipitation happens when water falls from clouds as rain or snow.',
      'Gravity helps pull water back to the ground during the water cycle.',
      'Transpiration is when water leaves the ocean and goes into the air.',
      'Understanding the water cycle is important because it affects things like drinking water and farming.',
    ]

    const questions = baseQuestions.slice(0, count)

    if (answerType === 'mcq') {
      return questions.map(q => ({
        question: q,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'A',
      }))
    } else {
      return questions.map(q => ({
        question: q,
        type: 'true/false',
      }))
    }
  }

  const generateOralQuestions = difficulty => {
    const questions = {
      easy: [
        'Tell me what you know about this topic.',
        'Can you give a simple example?',
        'What do you find interesting about this?',
        'How would you explain this to a friend?',
        'What questions do you have?',
      ],
      medium: [
        'Explain the main concept in your own words.',
        'What are the key benefits of this topic?',
        'How would you apply this knowledge in real life?',
        'Compare this with something you already know.',
        'What are the most important points to remember?',
      ],
      hard: [
        'Analyze the complex relationships within this topic.',
        'Evaluate the strengths and weaknesses of different approaches.',
        'Synthesize information from multiple perspectives.',
        'Critically assess the implications of this topic.',
        'Propose solutions to advanced problems in this area.',
      ],
    }
    return questions[difficulty] || questions.medium
  }

  const generateProjectTasks = projectType => {
    const tasks = {
      poster: [
        'Create a visual representation of the key concepts.',
        'Design an informative and attractive layout.',
        'Include relevant images and diagrams.',
        'Write clear and concise explanations.',
        'Present your poster to the class.',
      ],
      model: [
        'Build a physical or digital model.',
        'Demonstrate key principles through your model.',
        'Explain how your model works.',
        'Show the relationship between different components.',
        'Test and refine your model.',
      ],
      presentation: [
        'Prepare a comprehensive presentation.',
        'Create engaging slides with visuals.',
        'Practice your speaking and timing.',
        'Include interactive elements.',
        'Answer questions from the audience.',
      ],
      report: [
        'Research the topic thoroughly.',
        'Organize information logically.',
        'Write clear and detailed explanations.',
        'Include citations and references.',
        'Draw conclusions based on your findings.',
      ],
    }
    return tasks[projectType] || tasks.poster
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

      setSavedAssessments(prev => [...prev, newAssessment])
      setGeneratedAssessment(null)
      setAssessmentPrompt('')
      setSelectedAssessmentType(null)
    }
  }

  const handleEditAssessment = () => {
    if (assessmentPrompt.trim() && generatedAssessment) {
      // Update the generated assessment based on the prompt
      setGeneratedAssessment(prev => ({
        ...prev,
        title: `${prev.title} (Edited)`,
        instructions: assessmentPrompt,
      }))
    }
  }

  // Assessment conduction handlers
  const handleOpenAssessment = assessment => {
    setSelectedAssessment(assessment)
    setCurrentScreen('conductAssessment')
    setSelectedStudentForAssessment(null)
    setCurrentQuestionIndex(0)
    setStudentAnswers({})
  }

  const handleSelectStudentForAssessment = student => {
    setSelectedStudentForAssessment(student)
    setCurrentQuestionIndex(0)
    setStudentAnswers({})
  }

  const handleAnswerQuestion = (questionIndex, answer) => {
    setStudentAnswers(prev => ({
      ...prev,
      [questionIndex]: answer,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedAssessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmitAssessment = () => {
    if (selectedAssessment && selectedStudentForAssessment) {
      // Calculate score (simple implementation - you can make this more sophisticated)
      const totalQuestions = selectedAssessment.questions.length
      const answeredQuestions = Object.keys(studentAnswers).length
      const score = Math.round((answeredQuestions / totalQuestions) * selectedAssessment.points)

      const result = {
        score,
        answers: { ...studentAnswers },
        completedAt: new Date().toISOString(),
        totalQuestions,
        answeredQuestions,
      }

      setAssessmentResults(prev => ({
        ...prev,
        [selectedAssessment.id]: {
          ...prev[selectedAssessment.id],
          [selectedStudentForAssessment.id]: result,
        },
      }))

      // Reset for next student
      setSelectedStudentForAssessment(null)
      setCurrentQuestionIndex(0)
      setStudentAnswers({})
    }
  }

  const handleFinishAssessment = () => {
    setSelectedAssessment(null)
    setSelectedStudentForAssessment(null)
    setCurrentQuestionIndex(0)
    setStudentAnswers({})
    setCurrentScreen('topicAssessment')
  }

  // New handlers for assessment media and scoring
  const handleImageUpload = (event, studentId) => {
    const files = Array.from(event.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = e => {
        const newImage = {
          url: e.target.result,
          name: file.name,
        }
        setStudentImages(prev => ({
          ...prev,
          [studentId]: [...(prev[studentId] || []), newImage],
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (studentId, imageIndex) => {
    setStudentImages(prev => ({
      ...prev,
      [studentId]: prev[studentId].filter((_, index) => index !== imageIndex),
    }))
  }

  const handleScoreChange = (studentId, score) => {
    setStudentScores(prev => ({
      ...prev,
      [studentId]: score,
    }))
  }

  const handleCommentChange = (studentId, comment) => {
    setStudentComments(prev => ({
      ...prev,
      [studentId]: comment,
    }))
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks = []

      recorder.ondataavailable = e => {
        chunks.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        const url = URL.createObjectURL(blob)
        const duration = recordingTime

        const newRecording = {
          url,
          duration,
        }

        setStudentRecordings(prev => ({
          ...prev,
          [selectedStudentForAssessment.id]: [...(prev[selectedStudentForAssessment.id] || []), newRecording],
        }))

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      setRecordingTimer(timer)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not start recording. Please check your microphone permissions.')
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

  const playRecording = url => {
    const audio = new Audio(url)
    audio.play()
  }

  const removeRecording = (studentId, recordingIndex) => {
    setStudentRecordings(prev => ({
      ...prev,
      [studentId]: prev[studentId].filter((_, index) => index !== recordingIndex),
    }))
  }

  const handleSubmitStudentAssessment = () => {
    if (selectedAssessment && selectedStudentForAssessment) {
      const score = studentScores[selectedStudentForAssessment.id] || 0
      const comment = studentComments[selectedStudentForAssessment.id] || ''
      const images = studentImages[selectedStudentForAssessment.id] || []
      const recordings = studentRecordings[selectedStudentForAssessment.id] || []

      const result = {
        score: parseInt(score),
        comment,
        images,
        recordings,
        completedAt: new Date().toISOString(),
        maxScore: selectedAssessment.points,
      }

      setAssessmentResults(prev => ({
        ...prev,
        [selectedAssessment.id]: {
          ...prev[selectedAssessment.id],
          [selectedStudentForAssessment.id]: result,
        },
      }))

      // Reset for next student
      setSelectedStudentForAssessment(null)

      // Clear the current student's data
      setStudentScores(prev => {
        const newScores = { ...prev }
        delete newScores[selectedStudentForAssessment.id]
        return newScores
      })
      setStudentComments(prev => {
        const newComments = { ...prev }
        delete newComments[selectedStudentForAssessment.id]
        return newComments
      })
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowGradeDropdown(false)
      }
      if (questionDropdownRef.current && !questionDropdownRef.current.contains(event.target)) {
        setShowQuestionDropdown(false)
      }
      if (wordsDropdownRef.current && !wordsDropdownRef.current.contains(event.target)) {
        setShowWordsDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Cleanup recording timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimer) {
        clearInterval(recordingTimer)
      }
    }
  }, [recordingTimer])

  // Bottom Navigation Bar Component
  function BottomNav({ currentScreen, setCurrentScreen }) {
    return (
      <nav className="border-neutral-80 shadow-elevation-3 fixed bottom-0 left-0 z-50 w-full border-t-2 bg-neutral-100/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-around py-2">
          <button
            onClick={() => setCurrentScreen('topicSetup')}
            className={`flex flex-col items-center rounded-2xl px-4 py-2 transition-all duration-300 ${
              currentScreen === 'topicSetup' ? 'bg-primary-90 text-primary-10' : 'text-neutral-30 hover:bg-neutral-96'
            }`}
          >
            {/* Topic Icon */}
            <svg className="mb-1 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 2a7 7 0 0 0-7 7c0 2.386 1.053 4.507 2.75 5.905A2.996 2.996 0 0 0 10 18h4a2.996 2.996 0 0 0 2.25-3.095C17.947 13.507 19 11.386 19 9a7 7 0 0 0-7-7zm0 18v2m-4 0h8"
              />
            </svg>
            <span className="text-xs font-medium">Topic</span>
          </button>
          <button
            onClick={() => setCurrentScreen('weeklyPlan')}
            className={`flex flex-col items-center rounded-2xl px-4 py-2 transition-all duration-300 ${
              currentScreen === 'weeklyPlan'
                ? 'bg-secondary-90 text-secondary-10'
                : 'text-neutral-30 hover:bg-neutral-96'
            }`}
          >
            {/* Lesson Plan Icon */}
            <svg className="mb-1 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={2} />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h5" />
            </svg>
            <span className="text-xs font-medium">Lesson Plan Days</span>
          </button>
          <button
            onClick={() => setCurrentScreen('studentManagement')}
            className={`flex flex-col items-center rounded-2xl px-4 py-2 transition-all duration-300 ${
              currentScreen === 'studentManagement'
                ? 'bg-tertiary-90 text-tertiary-10'
                : 'text-neutral-30 hover:bg-neutral-96'
            }`}
          >
            {/* Students Icon */}
            <span className="material-icons mb-1 text-2xl">groups_2</span>
            <span className="text-xs font-medium">Students</span>
          </button>
        </div>
      </nav>
    )
  }

  // Topic Setup Screen
  if (currentScreen === 'topicSetup') {
    return (
      <div className="bg-neutral-98 min-h-screen pb-20">
        {/* App Bar */}
        <div className="shadow-elevation-2 flex items-center justify-between bg-neutral-100/90 p-4 backdrop-blur-sm">
          <button
            onClick={() => setCurrentScreen('gradeSelection')}
            className="hover:bg-neutral-96 rounded-xl p-2 transition-colors duration-200"
          >
            <svg className="text-neutral-30 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-primary-40 text-xl font-medium">Sahayak</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div className="flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            {/* Topic Input */}
            <div className="shadow-elevation-2 mb-4 rounded-3xl bg-neutral-100 p-4">
              <h2 className="text-neutral-10 mb-3 text-xl font-medium">What's your lesson topic?</h2>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g., Indian Geography, Mathematical Operations, etc."
                className="border-neutral-80 focus:border-primary-40 text-neutral-10 w-full rounded-2xl border-2 bg-neutral-100 p-4 placeholder-neutral-50 focus:ring-0 focus:outline-none"
              />
            </div>

            {/* Learning Outcomes */}
            <div className="shadow-elevation-2 mb-6 rounded-3xl bg-neutral-100 p-4">
              <h2 className="text-neutral-10 mb-3 text-xl font-medium">Learning Outcomes by Grade</h2>
              <div className="space-y-4">
                {selectedGrades.map(gradeId => {
                  const grade = grades.find(g => g.id === gradeId)
                  return (
                    <div key={gradeId} className="border-primary-40 border-l-4 pl-4">
                      <label className="text-neutral-30 mb-2 block text-sm font-medium">{grade.name}</label>
                      <textarea
                        value={learningOutcomes[gradeId] || ''}
                        onChange={e => handleLearningOutcomeChange(gradeId, e.target.value)}
                        placeholder="What should students learn from this topic?"
                        rows="2"
                        className="border-neutral-80 focus:border-primary-40 text-neutral-10 w-full resize-none rounded-2xl border-2 bg-neutral-100 p-3 placeholder-neutral-50 focus:ring-0 focus:outline-none"
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* File Upload Section */}
            <div className="shadow-elevation-2 mb-6 rounded-3xl bg-neutral-100 p-6">
              <h2 className="text-neutral-10 mb-4 text-xl font-medium">Add Supporting Material (Optional)</h2>

              {/* Upload Type Selection */}
              <div className="mb-4 flex">
                <button
                  onClick={() => setUploadType('file')}
                  className={`flex items-center space-x-2 rounded-l-full px-4 py-3 font-medium transition-all duration-200 ${
                    uploadType === 'file'
                      ? 'bg-primary-40 text-primary-100'
                      : 'bg-neutral-96 text-neutral-30 hover:bg-neutral-94'
                  }`}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>File</span>
                </button>
                <button
                  onClick={() => setUploadType('image')}
                  className={`flex items-center space-x-2 px-4 py-3 font-medium transition-all duration-200 ${
                    uploadType === 'image'
                      ? 'bg-primary-40 text-primary-100'
                      : 'bg-neutral-96 text-neutral-30 hover:bg-neutral-94'
                  }`}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Image</span>
                </button>
                <button
                  onClick={() => setUploadType('link')}
                  className={`flex items-center space-x-2 rounded-r-full px-4 py-3 font-medium transition-all duration-200 ${
                    uploadType === 'link'
                      ? 'bg-primary-40 text-primary-100'
                      : 'bg-neutral-96 text-neutral-30 hover:bg-neutral-94'
                  }`}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Link</span>
                </button>
              </div>

              {/* Upload Interface */}
              {uploadType === 'link' ? (
                <div>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={e => setLinkUrl(e.target.value)}
                    placeholder="https://example.com/resource"
                    className="border-neutral-80 focus:border-primary-40 text-neutral-10 w-full rounded-2xl border-2 bg-neutral-100 p-4 placeholder-neutral-50 focus:ring-0 focus:outline-none"
                  />
                  {linkUrl && <p className="text-primary-40 mt-2 text-sm font-medium">✓ Link added</p>}
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept={uploadType === 'image' ? 'image/*' : '*/*'}
                    className="border-neutral-80 focus:border-primary-40 text-neutral-10 file:bg-primary-90 file:text-primary-10 hover:file:bg-primary-100 w-full rounded-2xl border-2 bg-neutral-100 p-4 file:mr-4 file:rounded-xl file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium focus:ring-0 focus:outline-none"
                  />
                  {uploadedFile && (
                    <p className="text-primary-40 mt-2 text-sm font-medium">✓ {uploadedFile.name} uploaded</p>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            {canContinueFromTopicSetup() ? (
              <div className="mx-auto mt-8 flex w-full max-w-md items-center justify-center gap-4">
                <button
                  onClick={handleContinue}
                  className="bg-primary-40 hover:shadow-elevation-3 active:shadow-elevation-1 text-primary-100 shadow-elevation-2 flex-1 rounded-3xl px-6 py-4 font-medium transition-all duration-300"
                >
                  <span className="text-base font-medium">Create Weekly Lesson Plan</span>
                </button>
                <button
                  onClick={handleAIHelpClick}
                  className="bg-tertiary-40 hover:shadow-elevation-3 text-tertiary-100 shadow-elevation-2 hover:shadow-elevation-4 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300"
                  style={{ zIndex: 60 }}
                  aria-label="Get AI Teaching Help"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={handleAIHelpClick}
                className="bg-tertiary-40 hover:shadow-elevation-4 text-tertiary-100 shadow-elevation-3 hover:shadow-elevation-5 fixed right-6 bottom-24 z-50 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300"
                style={{ zIndex: 30 }}
                aria-label="Get AI Teaching Help"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
        <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />

        {/* AI Help Dialog */}
        {showAIHelpDialog && (
          <div className="bg-neutral-10/50 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-neutral-98 shadow-elevation-5 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl">
              {/* Dialog Header */}
              <div className="border-neutral-80 flex items-center justify-between border-b-2 p-6">
                <h2 className="text-neutral-10 flex items-center text-xl font-medium">
                  <svg className="text-tertiary-40 mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  AI Teaching Assistant
                </h2>
                <button
                  onClick={() => {
                    setShowAIHelpDialog(false)
                    setAiHelpResponse('')
                  }}
                  className="hover:bg-neutral-96 rounded-xl p-2 transition-colors duration-200"
                >
                  <svg className="text-neutral-30 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Dialog Content */}
              <div className="p-6">
                {/* Prompt Input */}
                <div className="mb-6">
                  <label className="text-neutral-30 mb-3 block text-sm font-medium">
                    Describe the student's doubt or question:
                  </label>
                  <div className="relative">
                    <textarea
                      value={aiHelpPrompt}
                      onChange={e => setAiHelpPrompt(e.target.value)}
                      placeholder="e.g., A student is confused about how to explain the concept of photosynthesis to a 3rd grader. How can I make it simpler?"
                      rows="4"
                      className="border-neutral-80 focus:border-tertiary-40 text-neutral-10 w-full resize-none rounded-2xl border-2 bg-neutral-100 p-4 pr-12 placeholder-neutral-50 focus:ring-0 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
                          const recognition = new SpeechRecognition()
                          recognition.continuous = false
                          recognition.interimResults = false
                          recognition.lang = 'en-US'

                          recognition.onstart = () => {
                            // Visual feedback that recording started
                          }

                          recognition.onresult = event => {
                            const transcript = event.results[0][0].transcript
                            setAiHelpPrompt(prev => prev + (prev ? ' ' : '') + transcript)
                          }

                          recognition.onerror = event => {
                            console.error('Speech recognition error:', event.error)
                          }

                          recognition.start()
                        } else {
                          alert('Speech recognition is not supported in your browser.')
                        }
                      }}
                      className="hover:text-tertiary-40 hover:bg-neutral-96 absolute top-4 right-4 rounded-lg p-2 text-neutral-50 transition-colors duration-200"
                      title="Click to speak"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Sample Prompts */}
                {/* <div className="bg-tertiary-90 rounded-2xl p-4 mb-6">
                  <h3 className="text-lg font-medium text-tertiary-10 mb-3">
                    Sample prompts you can try:
                  </h3>
                  <div className="space-y-2 text-sm text-tertiary-10">
                    <p>• "How can I explain {topic} to a student who is struggling with the basic concepts?"</p>
                    <p>• "What are some real-world examples I can use to make {topic} more relatable?"</p>
                    <p>• "How can I adapt my teaching approach for different learning styles when covering {topic}?"</p>
                    <p>• "What are common misconceptions students have about {topic} and how can I address them?"</p>
                    <p>• "Can you suggest some hands-on activities to reinforce the learning of {topic}?"</p>
                  </div>
                </div> */}

                {/* Submit Button */}
                <button
                  onClick={handleAIHelpSubmit}
                  className={`bg-tertiary-40 hover:shadow-elevation-3 active:shadow-elevation-1 text-tertiary-100 shadow-elevation-2 w-full rounded-3xl px-6 py-4 font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50`}
                  disabled={!aiHelpPrompt.trim()}
                >
                  <span className="flex items-center justify-center">
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                    Submit
                  </span>
                </button>

                {/* AI Response */}
                {aiHelpResponse && (
                  <div className="bg-tertiary-90 border-tertiary-40 mt-6 rounded-2xl border-l-4 p-4">
                    <h4 className="text-tertiary-10 mb-3 flex items-center text-lg font-medium">
                      <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      AI Teaching Assistant
                    </h4>
                    <div className="text-tertiary-10 scrollbar-thin scrollbar-thumb-tertiary-40 scrollbar-track-tertiary-80 max-h-64 overflow-y-auto pr-2 text-sm leading-relaxed whitespace-pre-line">
                      {aiHelpResponse}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Weekly Plan Screen
  if (currentScreen === 'weeklyPlan') {
    // Get the lesson plan data for the current topic
    const topicData = data[topic]
    const lessonPlan = topicData?.outputs || []

    return (
      <div className="bg-neutral-98 min-h-screen pb-20">
        {/* App Bar */}
        <div className="flex items-center justify-between bg-white/80 p-4 shadow-sm backdrop-blur-sm">
          <button
            onClick={() => setCurrentScreen('topicSetup')}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
          >
            <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-primary-40 text-xl font-medium">Sahayak</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            <h2 className="mb-2 text-center text-2xl font-semibold text-neutral-800">Weekly Lesson Plan</h2>
            <p className="mb-8 text-center text-neutral-600">Topic: {topic}</p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {lessonPlan.map((dayPlan, index) => (
                <button
                  key={dayPlan.day}
                  onClick={() => handleDaySelect(dayPlan.day)}
                  className="hover:bg-primary-90 border-neutral-80 flex w-full flex-col items-start justify-start rounded-2xl border bg-white/80 p-6 text-left shadow-md transition-all duration-200"
                >
                  <div className="text-primary-40 mb-3 text-xl font-medium">Day {dayPlan.day}</div>
                  <div className="line-clamp-3 text-sm text-neutral-600">
                    {dayPlan.whole_class_introduction_plan.substring(0, 100)}...
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {dayPlan.grade_plans.map((gradePlan, idx) => (
                      <span key={idx} className="bg-primary-90 text-primary-40 rounded-full px-2 py-1 text-xs">
                        {gradePlan.grade}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Assessments Card */}
            <div className="mt-8">
              <button
                onClick={handleOpenTopicAssessment}
                className="bg-tertiary-40 hover:bg-tertiary-30 text-tertiary-100 border-tertiary-40 flex w-full flex-col items-center justify-center rounded-2xl border p-8 text-xl font-medium shadow-md transition-all duration-200"
              >
                <svg className="mb-3 h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Assessments
              </button>
            </div>
          </div>
        </div>
        <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
      </div>
    )
  }

  // Day Lesson Screen
  if (currentScreen === 'dayLesson') {
    // Get the lesson plan data for the selected day
    const topicData = data[topic]
    const lessonPlan = topicData?.outputs || []
    const currentDayPlan = lessonPlan.find(day => day.day === selectedDay)

    return (
      <div className="bg-neutral-98 min-h-screen">
        {/* App Bar */}
        <div className="flex items-center justify-between bg-white/80 p-4 shadow-sm backdrop-blur-sm">
          <button
            onClick={() => setCurrentScreen('weeklyPlan')}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
          >
            <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-primary-40 text-xl font-medium">Sahayak</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div className="p-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-2 text-center text-2xl font-semibold text-neutral-800">Day {selectedDay} Lesson Plan</h2>
            <p className="mb-8 text-center text-neutral-600">{topic}</p>

            <div className="space-y-6">
              {/* Whole Class Introduction Card */}
              <div className="w-full rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-medium text-neutral-800">Whole Class Introduction</h3>
                  <div className="bg-primary-40 flex h-8 w-8 items-center justify-center rounded-full">
                    <span className="material-icons mb-1 text-2xl text-white">groups_2</span>
                  </div>
                </div>
                {currentDayPlan && (
                  <div className="bg-primary-90 rounded-xl p-4">
                    <p className="text-sm leading-relaxed text-neutral-700">
                      {currentDayPlan.whole_class_introduction_plan}
                    </p>
                  </div>
                )}
                <div className="mt-4">
                  <button
                    onClick={handleWholeClassIntroduction}
                    className="bg-primary-40 hover:bg-primary-30 text-primary-100 w-full rounded-xl px-4 py-3 font-medium transition-all duration-200"
                  >
                    Generate Teaching Materials
                  </button>
                </div>
              </div>

              {/* Grade-specific Cards */}
              {currentDayPlan?.grade_plans.map((gradePlan, index) => {
                const gradeNumber = parseInt(gradePlan.grade.replace('Grade ', ''))
                return (
                  <div
                    key={index}
                    className="w-full rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xl font-medium text-neutral-800">{gradePlan.grade} Activities</h3>
                      <div className="bg-primary-40 flex h-8 w-8 items-center justify-center rounded-full">
                        <span className="material-symbols-outlined text-white">cognition</span>
                      </div>
                    </div>
                    <div className="bg-primary-90 mb-4 rounded-xl p-4">
                      <h4 className="text-primary-10 mb-2 text-sm font-medium">Learning Objective:</h4>
                      <p className="text-sm leading-relaxed text-neutral-700">{gradePlan.learning_objective}</p>
                    </div>
                    <button
                      onClick={() => handleGradeActivitiesClick(gradeNumber)}
                      className="bg-secondary-40 hover:bg-secondary-30 text-secondary-100 w-full rounded-xl px-4 py-3 font-medium transition-all duration-200"
                    >
                      Create Grade Activities
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Whole Class Introduction Modal */}
        {showWholeClassModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-neutral-98 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 p-6">
                <h2 className="text-xl font-semibold text-neutral-800">Whole Class Introduction</h2>
                <button
                  onClick={() => setShowWholeClassModal(false)}
                  className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
                >
                  <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Teaching Content */}
                <div className="bg-primary-90 mb-6 rounded-xl p-4">
                  <h3 className="mb-3 text-lg font-medium text-neutral-800">What to teach in class:</h3>
                  <p className="leading-relaxed text-neutral-700">
                    {currentDayPlan
                      ? currentDayPlan.whole_class_introduction_plan
                      : `Begin by introducing the concept of ${topic} to the entire class. Use engaging visuals and real-world examples to capture students' attention. Explain the basic concepts and objectives clearly, ensuring all students understand what they will be learning throughout this lesson.`}
                  </p>
                </div>

                {/* Generate Options */}
                <div className="mb-6">
                  <h3 className="mb-4 text-lg font-medium text-neutral-800">Generate any...</h3>
                  <div className="flex flex-col gap-3">
                    {/* Blackboard Drawings */}
                    <button
                      className="bg-primary-60 border-primary-40 flex items-center rounded-xl border px-5 py-3 shadow-sm transition-all duration-200 hover:shadow-md"
                      onClick={handleBlackboardChipClick}
                    >
                      <svg
                        className="text-primary-40 mr-2 h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      <span className="text-base font-medium text-neutral-800">Blackboard drawings</span>
                    </button>

                    {/* Story Based */}
                    <button
                      className="bg-primary-60 border-primary-40 flex items-center rounded-xl border px-5 py-3 shadow-sm transition-all duration-200 hover:shadow-md"
                      onClick={handleStoryChipClick}
                    >
                      <svg
                        className="text-primary-40 mr-2 h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <span className="text-base font-medium text-neutral-800">Story based</span>
                    </button>

                    {/* Flash Cards */}
                    <button
                      className="bg-primary-60 border-primary-40 flex items-center rounded-xl border px-5 py-3 shadow-sm transition-all duration-200 hover:shadow-md"
                      onClick={handleFlashcardChipClick}
                    >
                      <svg
                        className="text-primary-40 mr-2 h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={2} />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8M8 16h5" />
                      </svg>
                      <span className="text-base font-medium text-neutral-800">Flash cards</span>
                    </button>

                    {/* Gamified Activities */}
                    <button
                      className="bg-primary-60 border-primary-40 flex items-center rounded-xl border px-5 py-3 shadow-sm transition-all duration-200 hover:shadow-md"
                      onClick={handleGamifiedChipClick}
                    >
                      <svg
                        className="text-primary-40 mr-2 h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-base font-medium text-neutral-800">Gamified activities</span>
                    </button>

                    {/* Question Prompts */}
                    <button
                      className="bg-primary-60 border-primary-40 flex items-center rounded-xl border px-5 py-3 shadow-sm transition-all duration-200 hover:shadow-md"
                      onClick={handleQuestionPromptsChipClick}
                    >
                      <svg
                        className="text-primary-40 mr-2 h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-base font-medium text-neutral-800">Question prompts</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blackboard Drawing Dialog */}
        {showBlackboardDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-neutral-98 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl shadow-xl">
              {/* Dialog Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 p-4">
                <h2 className="text-lg font-semibold text-neutral-800">Blackboard Drawing</h2>
                <button
                  onClick={() => setShowBlackboardDialog(false)}
                  className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
                >
                  <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Dialog Content */}
              <div className="flex flex-col items-center p-6">
                <img
                  src="assets/black_board_drawing.jpg"
                  alt="Blackboard Drawing"
                  className="mb-6 w-full max-w-xs rounded-lg border border-neutral-200 bg-neutral-100 object-contain"
                  style={{ background: '#222' }}
                />
                <div className="bg-neutral-98 mb-4 flex w-full items-center rounded-xl border border-neutral-200 px-4 py-3">
                  <input
                    type="text"
                    value={blackboardPrompt}
                    onChange={e => setBlackboardPrompt(e.target.value)}
                    placeholder="Type to edit the image using a prompt..."
                    className="flex-1 bg-transparent text-base text-neutral-800 outline-none"
                  />
                  <button className="ml-2 rounded-full p-2 hover:bg-neutral-200">
                    <svg className="h-5 w-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                </div>
                <button
                  className={`bg-primary-40 hover:shadow-elevation-3 active:shadow-elevation-1 text-primary-100 shadow-elevation-2 w-full rounded-2xl px-6 py-3 font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50`}
                  disabled={!blackboardPrompt.trim()}
                >
                  Update Drawing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Story Dialog */}
        {showStoryDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-neutral-98 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl shadow-xl">
              {/* Dialog Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 p-4">
                <h2 className="text-lg font-semibold text-neutral-800">Story Based Learning</h2>
                <button
                  onClick={() => setShowStoryDialog(false)}
                  className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
                >
                  <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Dialog Content */}
              <div className="flex flex-col p-6">
                {/* Sample Story */}
                <div className="bg-primary-90 mb-6 rounded-xl p-4">
                  <h3 className="text-primary-10 mb-3 text-lg font-medium">Story</h3>
                  <div className="scrollbar-thin scrollbar-thumb-primary-40 scrollbar-track-primary-80 max-h-64 overflow-y-auto pr-2">
                    <p className="text-sm leading-relaxed text-neutral-700">
                      Our story begins in the bustling city of Bengaluru, right in the heart of Cubbon Park. Imagine a
                      tiny, adventurous water droplet named Droplet. Droplet loved his life in a small puddle near a
                      vibrant flowerbed. One morning, as the Bengaluru sun began to climb high in the sky, Droplet felt
                      something peculiar. The air around him was getting warmer and warmer.
                      <br />
                      "Woah, it's getting toasty!" Droplet exclaimed. He noticed his friends, other little water
                      droplets in the puddle, were also feeling the heat. As the sun's rays intensified, Droplet felt
                      himself getting lighter and lighter. He was no longer a liquid! He was transforming into something
                      invisible, something airy. It was like he was floating upwards, becoming a tiny puff of mist.
                      <br />
                      "This is amazing!" Droplet thought. He was no longer bound to the ground. He was rising, higher
                      and higher, leaving the park behind. This incredible journey, where the sun's warm hug turned him
                      from liquid water into an invisible gas called water vapor, was just the beginning of his grand
                      adventure. He was *evaporating*!
                    </p>
                  </div>
                </div>

                {/* Edit Prompt */}
                <div className="bg-neutral-98 mb-4 flex w-full items-center rounded-xl border border-neutral-200 px-4 py-3">
                  <input
                    type="text"
                    value={storyPrompt}
                    onChange={e => setStoryPrompt(e.target.value)}
                    placeholder="Type to customize the story..."
                    className="flex-1 bg-transparent text-base text-neutral-800 outline-none"
                  />
                  <button className="ml-2 rounded-full p-2 hover:bg-neutral-200">
                    <svg className="h-5 w-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                </div>
                <button
                  className={`bg-secondary-40 hover:shadow-elevation-3 active:shadow-elevation-1 text-secondary-100 shadow-elevation-2 w-full rounded-2xl px-6 py-3 font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50`}
                  disabled={!storyPrompt.trim()}
                >
                  Edit Story
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Flashcard Dialog */}
        {showFlashcardDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-neutral-98 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl shadow-xl">
              {/* Dialog Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 p-4">
                <h2 className="text-lg font-semibold text-neutral-800">Flashcards</h2>
                <button
                  onClick={() => setShowFlashcardDialog(false)}
                  className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
                >
                  <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Dialog Content */}
              <div className="flex flex-col items-center p-6">
                {/* Card Counter */}
                <div className="mb-4 text-sm text-neutral-600">
                  {currentCardIndex + 1} of {flashcardData.length}
                </div>

                {/* Flashcard Image */}
                <div className="mb-6 w-full max-w-xs">
                  <img
                    src={flashcardData[currentCardIndex].image}
                    alt={flashcardData[currentCardIndex].title}
                    className="h-64 w-full rounded-lg border border-neutral-200 bg-neutral-50 object-contain"
                  />
                </div>

                {/* Description Toggle Button */}
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="bg-primary-90 text-primary-10 hover:bg-primary-100 mb-4 flex items-center rounded-lg px-4 py-2 transition-colors duration-200"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {showDescription ? 'Hide' : 'Show'} Answer
                </button>

                {/* Description */}
                {showDescription && (
                  <div className="bg-primary-90 mb-6 w-full rounded-xl p-4">
                    {/* Card Title */}
                    <h3 className="mb-4 text-center text-xl font-semibold text-neutral-800">
                      {flashcardData[currentCardIndex].title}
                    </h3>
                    <p className="text-sm leading-relaxed text-neutral-700">
                      {flashcardData[currentCardIndex].description}
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex w-full max-w-xs items-center justify-between">
                  <button
                    onClick={() => {
                      setCurrentCardIndex(prev => (prev > 0 ? prev - 1 : flashcardData.length - 1))
                      setShowDescription(false)
                    }}
                    className="rounded-full bg-neutral-100 p-3 transition-colors duration-200 hover:bg-neutral-200"
                    disabled={flashcardData.length <= 1}
                  >
                    <svg className="h-5 w-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentCardIndex(prev => (prev < flashcardData.length - 1 ? prev + 1 : 0))
                      setShowDescription(false)
                    }}
                    className="rounded-full bg-neutral-100 p-3 transition-colors duration-200 hover:bg-neutral-200"
                    disabled={flashcardData.length <= 1}
                  >
                    <svg className="h-5 w-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gamified Activities Dialog */}
        {showGamifiedDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-neutral-98 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl shadow-xl">
              {/* Dialog Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 p-4">
                <h2 className="text-lg font-semibold text-neutral-800">Gamified Activities</h2>
                <button
                  onClick={() => setShowGamifiedDialog(false)}
                  className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
                >
                  <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Dialog Content */}
              <div className="p-6">
                {/* Game Instructions */}
                <div className="bg-secondary-90 mb-6 rounded-xl p-4">
                  <h3 className="mb-3 text-lg font-medium text-neutral-800">How to conduct the game in class:</h3>
                  <div className="space-y-3 text-sm text-neutral-700">
                    <p>
                      <strong>1. Setup:</strong> Divide the class into teams of 4-5 students. Each team gets a set of{' '}
                      {topic}-related cards or materials.
                    </p>
                    <p>
                      <strong>2. Game Rules:</strong> Teams compete to answer questions or complete tasks related to{' '}
                      {topic}. Points are awarded for correct answers and creative solutions.
                    </p>
                    <p>
                      <strong>3. Rounds:</strong> Play 3-4 rounds with increasing difficulty. Each round focuses on
                      different aspects of {topic}.
                    </p>
                    <p>
                      <strong>4. Scoring:</strong> Keep track of points on the board. Bonus points for teamwork and
                      helping others.
                    </p>
                    <p>
                      <strong>5. Conclusion:</strong> Announce the winning team and review key learning points from the
                      game.
                    </p>
                  </div>
                </div>

                {/* Edit Prompt */}
                <div className="bg-neutral-98 mb-4 flex w-full items-center rounded-xl border border-neutral-200 px-4 py-3">
                  <input
                    type="text"
                    value={gamifiedPrompt}
                    onChange={e => setGamifiedPrompt(e.target.value)}
                    placeholder="Type to customize the game instructions..."
                    className="flex-1 bg-transparent text-base text-neutral-800 outline-none"
                  />
                  <button className="ml-2 rounded-full p-2 hover:bg-neutral-200">
                    <svg className="h-5 w-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                </div>
                <button
                  className={`bg-tertiary-40 hover:shadow-elevation-3 active:shadow-elevation-1 text-tertiary-100 shadow-elevation-2 w-full rounded-2xl px-6 py-3 font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50`}
                  disabled={!gamifiedPrompt.trim()}
                >
                  Update Game
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Question Prompts Dialog */}
        {showQuestionPromptsDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-neutral-98 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl shadow-xl">
              {/* Dialog Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 p-4">
                <h2 className="text-lg font-semibold text-neutral-800">Question Prompts</h2>
                <button
                  onClick={() => setShowQuestionPromptsDialog(false)}
                  className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
                >
                  <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Dialog Content */}
              <div className="p-6">
                {/* Sample Questions */}
                <div className="bg-primary-90 mb-6 rounded-xl p-4">
                  <h3 className="mb-3 text-lg font-medium text-neutral-800">Sample Question Prompts:</h3>
                  <div className="space-y-2 text-sm text-neutral-700">
                    <p>• "What do you already know about {topic}?"</p>
                    <p>• "How do you think {topic} affects our daily lives?"</p>
                    <p>• "What questions do you have about {topic}?"</p>
                    <p>• "Can you think of examples of {topic} in your community?"</p>
                    <p>• "What would happen if we didn't have {topic}?"</p>
                  </div>
                </div>

                {/* Edit Prompt */}
                <div className="bg-neutral-98 mb-4 flex w-full items-center rounded-xl border border-neutral-200 px-4 py-3">
                  <input
                    type="text"
                    value={questionPromptsPrompt}
                    onChange={e => setQuestionPromptsPrompt(e.target.value)}
                    placeholder="Type to customize the question prompts..."
                    className="flex-1 bg-transparent text-base text-neutral-800 outline-none"
                  />
                  <button className="ml-2 rounded-full p-2 hover:bg-neutral-200">
                    <svg className="h-5 w-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                </div>
                <button
                  className={`bg-secondary-40 hover:shadow-elevation-3 active:shadow-elevation-1 text-secondary-100 shadow-elevation-2 w-full rounded-2xl px-6 py-3 font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50`}
                  disabled={!questionPromptsPrompt.trim()}
                >
                  Update Question Prompts
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grade Activities Modal */}
        {showGradeActivitiesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 p-4">
                <h2 className="text-lg font-semibold text-neutral-800">
                  {grades.find(g => g.id === activeGradeId)?.name} Activities
                </h2>
                <button
                  onClick={() => setShowGradeActivitiesModal(false)}
                  className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
                >
                  <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Modal Content */}
              <div className="p-6">
                {/* Mode of Interaction */}
                <div className="mb-6">
                  <h3 className="mb-3 text-base font-medium text-neutral-800">Mode of Interaction</h3>
                  <div className="flex flex-wrap gap-3">
                    {modeOfInteractionOptions.map(option => {
                      const selected = gradeActivitiesSelections[selectedDay]?.[activeGradeId]?.mode === option.id
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleModeSelect(option.id)}
                          className={`flex items-center gap-2 rounded-xl border-2 px-5 py-2 text-base font-medium transition-all duration-200 ${selected ? 'bg-primary-90 text-primary-40 border-primary-40' : 'text-neutral-30 border-neutral-80 hover:border-primary-40 hover:text-primary-40 bg-white'}`}
                          style={{ minWidth: 'fit-content' }}
                        >
                          {selected && (
                            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              />
                            </svg>
                          )}
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                {/* Modality */}
                <div className="mb-6">
                  <h3 className="mb-3 text-base font-medium text-neutral-800">
                    Modality <span className="text-xs text-neutral-500">(Select all that apply)</span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {modalityOptions.map(option => {
                      const selected = (
                        gradeActivitiesSelections[selectedDay]?.[activeGradeId]?.modalities || []
                      ).includes(option.id)
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleModalityToggle(option.id)}
                          className={`flex items-center gap-2 rounded-xl border-2 px-5 py-2 text-base font-medium transition-all duration-200 ${selected ? 'bg-secondary-90 text-secondary-40 border-secondary-40' : 'text-neutral-30 border-neutral-80 hover:border-secondary-40 hover:text-secondary-40 bg-white'}`}
                          style={{ minWidth: 'fit-content' }}
                        >
                          {selected && (
                            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              />
                            </svg>
                          )}
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <button
                  onClick={handleSaveGradeActivities}
                  className="bg-primary-40 hover:shadow-elevation-3 active:shadow-elevation-1 text-primary-100 shadow-elevation-2 w-full rounded-2xl px-6 py-3 font-medium transition-all duration-300"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Question Screen
  if (currentScreen === 'question') {
    return (
      <div className="bg-neutral-98 min-h-screen">
        {/* App Bar */}
        <div className="flex items-center justify-between bg-white/80 p-4 shadow-sm backdrop-blur-sm">
          <button
            onClick={() => setCurrentScreen('topicSetup')}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
          >
            <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-primary-40 text-xl font-medium">Sahayak</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-lg">
            {/* Question */}
            <div className="mb-6 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
              <h2 className="text-xl leading-relaxed font-normal text-neutral-800">{questionData.question}</h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              {questionData.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                    selectedAnswer === option.id
                      ? 'bg-secondary-90 border-secondary-40 text-secondary-10'
                      : 'border-neutral-300 bg-white/80 text-neutral-700 hover:border-neutral-400 hover:bg-white hover:shadow-sm'
                  } backdrop-blur-sm`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">{option.text}</span>
                    {selectedAnswer === option.id && (
                      <div className="bg-secondary-40 flex h-6 w-6 items-center justify-center rounded-full">
                        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Submit Button */}
            {selectedAnswer && (
              <div className="mt-8">
                <button className="bg-primary-40 hover:shadow-elevation-3 active:shadow-elevation-1 text-primary-100 shadow-elevation-2 w-full rounded-3xl px-6 py-4 font-medium transition-all duration-300">
                  <span className="text-base font-medium">Submit Answer</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Grade Activities Screen
  if (currentScreen === 'gradeActivities') {
    const grade = grades.find(g => g.id === activeGradeId)
    // Example instructions (replace with AI or dynamic content as needed)
    const activityInstructions = [
      {
        title: 'Activity 1: Collaborative Poster',
        description:
          'Students work together to create a visual poster about the topic. Each group presents their poster to the class.',
      },
      {
        title: 'Activity 2: Role Play',
        description:
          'Students act out scenarios related to the topic, helping them understand concepts through movement and discussion.',
      },
      {
        title: 'Activity 3: Worksheet Challenge',
        description:
          'Distribute worksheets based on the topic. Students solve them independently, then discuss answers in pairs.',
      },
    ]
    // Check if ready to generate
    const modeSelected = gradeActivitiesSelections[selectedDay]?.[activeGradeId]?.mode
    const modalitiesSelected = (gradeActivitiesSelections[selectedDay]?.[activeGradeId]?.modalities || []).length > 0

    return (
      <div className="bg-neutral-98 min-h-screen">
        {/* App Bar */}
        <div className="flex items-center justify-between bg-white/80 p-4 shadow-sm backdrop-blur-sm">
          <button
            onClick={() => setCurrentScreen('dayLesson')}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
          >
            <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-primary-40 text-xl font-medium">{grade?.name} Activities</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            {/* Mode of Interaction */}
            <div className="mb-8">
              <h3 className="mb-3 text-base font-medium text-neutral-800">Mode of Interaction</h3>
              <div className="flex flex-wrap gap-3">
                {modeOfInteractionOptions.map(option => {
                  const selected = gradeActivitiesSelections[selectedDay]?.[activeGradeId]?.mode === option.id
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleModeSelect(option.id)}
                      className={`flex items-center gap-2 rounded-xl border-2 px-5 py-2 text-base font-medium transition-all duration-200 ${selected ? 'bg-primary-90 text-primary-40 border-primary-40' : 'text-neutral-30 border-neutral-80 hover:border-primary-40 hover:text-primary-40 bg-white'}`}
                      style={{ minWidth: 'fit-content' }}
                    >
                      {selected && (
                        <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          />
                        </svg>
                      )}
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>
            {/* Modality */}
            <div className="mb-8">
              <h3 className="mb-3 text-base font-medium text-neutral-800">
                Modality <span className="text-xs text-neutral-500">(Select all that apply)</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {modalityOptions.map(option => {
                  const selected = (gradeActivitiesSelections[selectedDay]?.[activeGradeId]?.modalities || []).includes(
                    option.id,
                  )
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleModalityToggle(option.id)}
                      className={`flex items-center gap-2 rounded-xl border-2 px-5 py-2 text-base font-medium transition-all duration-200 ${selected ? 'bg-secondary-90 text-secondary-40 border-secondary-40' : 'text-neutral-30 border-neutral-80 hover:border-secondary-40 hover:text-secondary-40 bg-white'}`}
                      style={{ minWidth: 'fit-content' }}
                    >
                      {selected && (
                        <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          />
                        </svg>
                      )}
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>
            {/* Generate Button (always visible if ready) */}
            {modeSelected && modalitiesSelected && (
              <button
                onClick={() => {
                  setHasGenerated(true)
                  setCarouselIndex(0)
                }}
                className="bg-primary-40 text-primary-100 hover:bg-primary-30 mb-8 w-full rounded-xl px-6 py-3 font-medium shadow-sm transition-all duration-200"
              >
                Generate
              </button>
            )}
            {/* Carousel Cards */}
            {hasGenerated && (
              <div className="flex flex-col items-center">
                <div className="relative w-full">
                  <div className="mb-6 flex min-h-[180px] flex-col items-center rounded-2xl bg-white/90 p-6 shadow-lg">
                    <h4 className="mb-2 text-center text-lg font-semibold text-neutral-800">
                      {activityInstructions[carouselIndex].title}
                    </h4>
                    <p className="text-center text-base text-neutral-700">
                      {activityInstructions[carouselIndex].description}
                    </p>
                  </div>
                  {/* Carousel Navigation */}
                  <div className="flex w-full items-center justify-between px-4">
                    <button
                      onClick={() =>
                        setCarouselIndex(
                          (carouselIndex - 1 + activityInstructions.length) % activityInstructions.length,
                        )
                      }
                      className="rounded-full bg-neutral-200 p-2 hover:bg-neutral-300"
                      aria-label="Previous"
                    >
                      <svg className="h-5 w-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-sm text-neutral-500">
                      {carouselIndex + 1} / {activityInstructions.length}
                    </span>
                    <button
                      onClick={() => setCarouselIndex((carouselIndex + 1) % activityInstructions.length)}
                      className="rounded-full bg-neutral-200 p-2 hover:bg-neutral-300"
                      aria-label="Next"
                    >
                      <svg className="h-5 w-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                {/* Prompt input and response */}
                <div className="mt-4 w-full">
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Ask a question or modify the activity:
                  </label>
                  <div className="mb-2 flex gap-2">
                    <input
                      type="text"
                      value={cardPrompts[carouselIndex]}
                      onChange={e => {
                        const newPrompts = [...cardPrompts]
                        newPrompts[carouselIndex] = e.target.value
                        setCardPrompts(newPrompts)
                      }}
                      className="focus:ring-primary-40 flex-1 rounded-lg border border-neutral-300 p-2 focus:ring-2 focus:outline-none"
                      placeholder="e.g., How can I make this more engaging?"
                    />
                    <button
                      onClick={() => {
                        const newResponses = [...cardResponses]
                        newResponses[carouselIndex] = `Response to: "${cardPrompts[carouselIndex]}" (placeholder)`
                        setCardResponses(newResponses)
                        // Optionally clear prompt
                        // const newPrompts = [...cardPrompts];
                        // newPrompts[carouselIndex] = "";
                        // setCardPrompts(newPrompts);
                      }}
                      className="bg-primary-40 text-primary-100 hover:bg-primary-10 rounded-lg px-4 py-2 transition-all"
                      disabled={!cardPrompts[carouselIndex].trim()}
                    >
                      Ask
                    </button>
                  </div>
                  {cardResponses[carouselIndex] && (
                    <div className="bg-primary-90 text-neutral-10 mt-2 rounded-lg p-3 text-sm">
                      {cardResponses[carouselIndex]}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Student Management Screen
  if (currentScreen === 'studentManagement') {
    return (
      <div className="bg-neutral-98 min-h-screen pb-20">
        {/* App Bar */}
        <div className="flex items-center justify-between bg-white/80 p-4 shadow-sm backdrop-blur-sm">
          <button
            onClick={() => setCurrentScreen('topicSetup')}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
          >
            <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-primary-40 text-xl font-medium">Student Management</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div className="p-6">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-6 text-center text-2xl font-semibold text-neutral-800">Manage Your Students</h2>

            {/* Grade Selection */}
            <div className="shadow-elevation-2 mb-6 rounded-3xl bg-neutral-100 p-6">
              <h3 className="text-neutral-10 mb-4 text-lg font-medium">Select Grade to Manage Students</h3>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowGradeDropdown(!showGradeDropdown)}
                  className="border-neutral-80 focus:border-primary-40 shadow-elevation-1 hover:shadow-elevation-2 flex w-full cursor-pointer items-center justify-between rounded-2xl border-2 bg-neutral-100 p-4 text-left transition-all duration-200 hover:border-neutral-50 focus:outline-none"
                >
                  <span className={selectedGradeForStudents ? 'text-neutral-10 font-medium' : 'text-neutral-50'}>
                    {selectedGradeForStudents
                      ? grades.find(g => g.id === selectedGradeForStudents)?.name
                      : 'Select a grade...'}
                  </span>
                  <div className="bg-primary-90 flex h-6 w-6 items-center justify-center rounded-full">
                    <svg
                      className={`text-primary-40 h-4 w-4 transition-transform duration-200 ${showGradeDropdown ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Custom Dropdown Options */}
                {showGradeDropdown && (
                  <div className="border-neutral-80 shadow-elevation-3 absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border-2 bg-neutral-100">
                    {grades.map(grade => (
                      <button
                        key={grade.id}
                        onClick={() => {
                          handleGradeSelectForStudents(grade.id)
                          setShowGradeDropdown(false)
                        }}
                        className={`flex w-full items-center justify-between px-4 py-3 text-left transition-all duration-200 ${
                          selectedGradeForStudents === grade.id
                            ? 'bg-primary-90 text-primary-10 font-medium'
                            : 'text-neutral-10 hover:bg-neutral-96'
                        }`}
                      >
                        <span>{grade.name}</span>
                        {selectedGradeForStudents === grade.id && (
                          <div className="bg-primary-40 flex h-5 w-5 items-center justify-center rounded-full">
                            <svg className="text-primary-100 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Student List */}
            {selectedGradeForStudents && (
              <div className="shadow-elevation-2 mb-6 rounded-3xl bg-neutral-100 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-neutral-10 text-lg font-medium">
                    Students in {grades.find(g => g.id === selectedGradeForStudents)?.name}
                  </h3>
                  <button
                    onClick={handleOpenAddStudentModal}
                    className="bg-primary-40 text-primary-100 hover:shadow-elevation-3 active:shadow-elevation-1 shadow-elevation-2 flex items-center rounded-2xl px-4 py-2 transition-all duration-200"
                  >
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Student
                  </button>
                </div>

                {students[selectedGradeForStudents] && students[selectedGradeForStudents].length > 0 ? (
                  <div className="space-y-3">
                    {students[selectedGradeForStudents].map(student => (
                      <div
                        key={student.id}
                        className="bg-neutral-96 border-neutral-80 shadow-elevation-1 hover:shadow-elevation-2 flex items-center justify-between rounded-2xl border-2 p-4 transition-all duration-200 hover:border-neutral-50"
                      >
                        <div className="flex items-center">
                          <div className="bg-primary-90 shadow-elevation-1 mr-4 flex h-12 w-12 items-center justify-center rounded-full">
                            <svg
                              className="text-primary-40 h-6 w-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <div>
                            <span className="text-neutral-10 text-base font-medium">{student.name}</span>
                            <p className="text-neutral-30 text-sm">Student</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenStudentReport(student)}
                            className="text-primary-40 hover:bg-primary-90 shadow-elevation-1 hover:shadow-elevation-2 rounded-xl p-3 transition-all duration-200"
                            title="View Report"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleOpenFeedbackModal(student)}
                            className="text-secondary-40 hover:bg-secondary-90 shadow-elevation-1 hover:shadow-elevation-2 rounded-xl p-3 transition-all duration-200"
                            title="Add Feedback"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleRemoveStudent(selectedGradeForStudents, student.id)}
                            className="text-error-40 hover:bg-error-90 shadow-elevation-1 hover:shadow-elevation-2 rounded-xl p-3 transition-all duration-200"
                            title="Delete Student"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-neutral-94 border-neutral-80 rounded-2xl border-2 border-dashed py-8 text-center">
                    <div className="bg-neutral-90 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                      <svg className="h-8 w-8 text-neutral-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-neutral-30 mb-2 text-lg font-medium">No students added yet</p>
                    <p className="text-sm text-neutral-50">Click "Add Student" to get started</p>
                  </div>
                )}
              </div>
            )}

            {/* Student Summary */}
            {selectedGradeForStudents &&
              students[selectedGradeForStudents] &&
              students[selectedGradeForStudents].length > 0 && (
                <div className="bg-primary-90 shadow-elevation-1 rounded-2xl p-4 text-center">
                  <div className="mb-2 flex items-center justify-center">
                    <div className="bg-primary-40 mr-3 flex h-8 w-8 items-center justify-center rounded-full">
                      <svg className="text-primary-100 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-primary-10 text-base font-medium">Class Summary</p>
                  </div>
                  <p className="text-primary-10 text-sm">
                    <span className="text-lg font-bold">{students[selectedGradeForStudents].length}</span> student
                    {students[selectedGradeForStudents].length !== 1 ? 's' : ''} in{' '}
                    {grades.find(g => g.id === selectedGradeForStudents)?.name}
                  </p>
                </div>
              )}
          </div>
        </div>

        {/* Add Student Modal */}
        {showAddStudentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-neutral-98 w-full max-w-md rounded-2xl shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-neutral-800">Add New Student</h2>
                <button
                  onClick={() => setShowAddStudentModal(false)}
                  className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
                >
                  <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Student Name</label>
                  <input
                    type="text"
                    value={newStudentName}
                    onChange={e => setNewStudentName(e.target.value)}
                    placeholder="Enter student's name"
                    className="focus:ring-primary-40 w-full rounded-lg border border-neutral-300 p-3 focus:border-transparent focus:ring-2 focus:outline-none"
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        handleAddStudent()
                      }
                    }}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddStudentModal(false)}
                    className="flex-1 rounded-lg border border-neutral-300 px-4 py-3 text-neutral-700 transition-colors duration-200 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddStudent}
                    disabled={!newStudentName.trim()}
                    className="bg-primary-40 text-primary-100 hover:bg-primary-10 flex-1 rounded-lg px-4 py-3 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add Student
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-neutral-98 w-full max-w-lg rounded-2xl shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-neutral-800">
                  Add Feedback for {selectedStudentForFeedback?.name}
                </h2>
                <button
                  onClick={handleCloseFeedbackModal}
                  className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
                >
                  <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Previous Feedback History */}
                {studentFeedback[selectedStudentForFeedback?.id] &&
                  studentFeedback[selectedStudentForFeedback?.id].length > 0 && (
                    <div className="mb-6">
                      <h3 className="mb-3 flex items-center text-sm font-medium text-neutral-700">
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Previous Feedback ({studentFeedback[selectedStudentForFeedback?.id].length})
                      </h3>
                      <div className="max-h-48 space-y-3 overflow-y-auto rounded-lg bg-neutral-50 p-4">
                        {studentFeedback[selectedStudentForFeedback?.id].map(feedback => (
                          <div
                            key={feedback.id}
                            className="border-secondary-40 rounded-lg border-l-4 bg-white p-3 shadow-sm"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 pr-3">
                                <p className="mb-2 text-sm text-neutral-800">{feedback.text}</p>
                                <p className="text-xs text-neutral-500">
                                  {new Date(feedback.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteFeedback(feedback.id)}
                                className="text-error-40 bg-error-90 text-error-30 rounded-md p-1"
                                title="Delete this feedback"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* New Feedback Input */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Add New Feedback</label>
                  <textarea
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                    placeholder="Enter your feedback about this student's performance, behavior, or any observations..."
                    rows="6"
                    className="focus:ring-secondary-40 w-full resize-none rounded-lg border border-neutral-300 p-3 focus:border-transparent focus:ring-2 focus:outline-none"
                  />
                  <p className="mt-2 text-xs text-neutral-500">
                    This feedback will be saved with today's date and time.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCloseFeedbackModal}
                    className="flex-1 rounded-lg border border-neutral-300 px-4 py-3 text-neutral-700 transition-colors duration-200 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveFeedback}
                    disabled={!feedbackText.trim()}
                    className="bg-secondary-40 text-secondary-100 hover:bg-secondary-10 flex-1 rounded-lg px-4 py-3 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Save Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
      </div>
    )
  }

  // Student Report Screen
  if (currentScreen === 'studentReport') {
    return (
      <div className="bg-neutral-98 min-h-screen pb-20">
        {/* App Bar */}
        <div className="flex items-center justify-between bg-white/80 p-4 shadow-sm backdrop-blur-sm">
          <button
            onClick={() => setCurrentScreen('studentManagement')}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
          >
            <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-primary-40 text-xl font-medium">Student Report</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div className="p-6">
          <div className="mx-auto max-w-2xl">
            {/* Student Header */}
            <div className="mb-6 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
              <div className="mb-4 flex items-center">
                <div className="bg-primary-90 mr-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <svg className="text-primary-40 h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-800">{selectedStudentForReport?.name}</h2>
                  <p className="text-neutral-600">Student Report</p>
                </div>
              </div>
            </div>

            {/* Report Sections */}
            <div className="space-y-6">
              {/* Academic Performance */}
              <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 flex items-center text-lg font-medium text-neutral-800">
                  <svg className="text-primary-40 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Academic Performance
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="bg-primary-90 rounded-lg p-4 text-center">
                    <div className="text-primary-40 text-2xl font-bold">85%</div>
                    <div className="text-neutral-30 text-sm">Overall Grade</div>
                  </div>
                  <div className="bg-secondary-90 rounded-lg p-4 text-center">
                    <div className="text-secondary-40 text-2xl font-bold">92%</div>
                    <div className="text-neutral-30 text-sm">Attendance</div>
                  </div>
                  <div className="bg-tertiary-90 rounded-lg p-4 text-center">
                    <div className="text-tertiary-40 text-2xl font-bold">15</div>
                    <div className="text-neutral-30 text-sm">Assignments</div>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 flex items-center text-lg font-medium text-neutral-800">
                  <svg className="text-secondary-40 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Recent Activities
                </h3>
                <div className="space-y-3">
                  <div className="bg-primary-90 flex items-center rounded-lg p-3">
                    <div className="bg-primary-40 mr-3 h-2 w-2 rounded-full"></div>
                    <span className="text-sm text-neutral-700">Completed Math Assignment</span>
                    <span className="ml-auto text-xs text-neutral-500">2 hours ago</span>
                  </div>
                  <div className="bg-primary-90 flex items-center rounded-lg p-3">
                    <div className="bg-primary-40 mr-3 h-2 w-2 rounded-full"></div>
                    <span className="text-sm text-neutral-700">Participated in Science Quiz</span>
                    <span className="ml-auto text-xs text-neutral-500">1 day ago</span>
                  </div>
                  <div className="bg-primary-90 flex items-center rounded-lg p-3">
                    <div className="bg-tertiary-40 mr-3 h-2 w-2 rounded-full"></div>
                    <span className="text-sm text-neutral-700">Submitted English Essay</span>
                    <span className="ml-auto text-xs text-neutral-500">3 days ago</span>
                  </div>
                </div>
              </div>

              {/* Learning Progress */}
              <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 flex items-center text-lg font-medium text-neutral-800">
                  <svg className="text-tertiary-40 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Learning Progress
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-neutral-700">Mathematics</span>
                      <span className="text-neutral-600">88%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-neutral-200">
                      <div className="bg-primary-40 h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-neutral-700">Science</span>
                      <span className="text-neutral-600">92%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-neutral-200">
                      <div className="bg-secondary-40 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-neutral-700">English</span>
                      <span className="text-neutral-600">75%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-neutral-200">
                      <div className="bg-tertiary-40 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Teacher Notes */}
              <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 flex items-center text-lg font-medium text-neutral-800">
                  <svg className="text-tertiary-40 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Teacher Notes
                </h3>
                <div className="bg-tertiary-90 rounded-lg p-4">
                  <p className="text-sm leading-relaxed text-neutral-700">
                    {selectedStudentForReport?.name} shows excellent progress in mathematics and science. They actively
                    participate in class discussions and complete assignments on time. Areas for improvement include
                    English writing skills and time management.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Topic Assessment Screen
  if (currentScreen === 'topicAssessment') {
    return (
      <div className="bg-neutral-98 min-h-screen pb-20">
        {/* App Bar */}
        <div className="flex items-center justify-between bg-white/80 p-4 shadow-sm backdrop-blur-sm">
          <button
            onClick={() => setCurrentScreen('weeklyPlan')}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
          >
            <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-primary-40 text-xl font-medium">Topic Assessment</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div className="p-6">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-2 text-center text-2xl font-semibold text-neutral-800">Assessment for {topic}</h2>
            <p className="mb-8 text-center text-neutral-600">Generate assessments based on your selected grades</p>

            <div className="space-y-6">
              {/* Grade Selection */}
              <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-medium text-neutral-800">Select Grade for Assessment</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {selectedGrades.map(gradeId => {
                    const grade = grades.find(g => g.id === gradeId)
                    return (
                      <button
                        key={gradeId}
                        onClick={() => handleGradeSelectForAssessment(gradeId)}
                        className={`rounded-xl border p-4 text-center transition-all duration-200 ${
                          selectedGradeForAssessment === gradeId
                            ? 'bg-primary-90 border-primary-40 text-primary-10'
                            : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        <span className="text-sm font-medium">{grade.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Assessment Types */}
              {selectedGradeForAssessment && (
                <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                  <h3 className="mb-4 text-lg font-medium text-neutral-800">Select Assessment Type</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={() => handleAssessmentTypeSelect('written')}
                      className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                        selectedAssessmentType === 'written'
                          ? 'bg-primary-90 border-primary-40 text-primary-10'
                          : 'border-neutral-80 text-neutral-30 hover:bg-neutral-96 bg-neutral-100'
                      }`}
                    >
                      <div className="mb-2 flex items-center">
                        <svg className="mr-2 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="font-medium">Written Test</span>
                      </div>
                      <p className="text-sm">Traditional written assessment with detailed questions</p>
                    </button>

                    <button
                      onClick={() => handleAssessmentTypeSelect('oral')}
                      className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                        selectedAssessmentType === 'oral'
                          ? 'bg-secondary-90 border-secondary-40 text-secondary-10'
                          : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="mb-2 flex items-center">
                        <svg className="mr-2 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span className="font-medium">Oral Assessment</span>
                      </div>
                      <p className="text-sm">Oral assessment with discussion-based questions</p>
                    </button>

                    <button
                      onClick={() => handleAssessmentTypeSelect('project')}
                      className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                        selectedAssessmentType === 'project'
                          ? 'bg-tertiary-90 border-tertiary-40 text-tertiary-10'
                          : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="mb-2 flex items-center">
                        <svg className="mr-2 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        <span className="font-medium">Project Based</span>
                      </div>
                      <p className="text-sm">Hands-on project assessment with practical tasks</p>
                    </button>
                  </div>
                </div>
              )}

              {/* Assessment Options */}
              {selectedAssessmentType && (
                <div className="overflow-visible rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                  <h3 className="mb-4 text-lg font-medium text-neutral-800">Assessment Options</h3>

                  {selectedAssessmentType === 'written' && (
                    <div className="space-y-4 overflow-visible">
                      {/* Number of Questions */}
                      <div className="overflow-visible">
                        <label className="mb-2 block text-sm font-medium text-neutral-700">Number of Questions</label>
                        <div className="relative overflow-visible" ref={questionDropdownRef}>
                          <button
                            onClick={() => setShowQuestionDropdown(!showQuestionDropdown)}
                            className="focus:ring-primary-40 flex w-full cursor-pointer items-center justify-between rounded-lg border border-neutral-300 bg-white p-3 text-left transition-all duration-200 hover:border-neutral-400 focus:ring-2 focus:outline-none"
                          >
                            <span className="font-medium text-neutral-800">
                              {assessmentOptions.written.numberOfQuestions} Questions
                            </span>
                            <div className="bg-primary-90 flex h-5 w-5 items-center justify-center rounded-full">
                              <svg
                                className={`text-primary-40 h-3 w-3 transition-transform duration-200 ${showQuestionDropdown ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </button>

                          {/* Custom Dropdown Options */}
                          {showQuestionDropdown && (
                            <div className="shadow-elevation-3 fixed top-1/2 left-1/2 z-[100] w-80 -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-lg border border-neutral-300 bg-white">
                              {[3, 5, 10, 15, 20].map(count => (
                                <button
                                  key={count}
                                  onClick={() => {
                                    handleAssessmentOptionChange('written', 'numberOfQuestions', count)
                                    setShowQuestionDropdown(false)
                                  }}
                                  className={`flex w-full items-center justify-between px-3 py-2 text-left transition-all duration-200 ${
                                    assessmentOptions.written.numberOfQuestions === count
                                      ? 'bg-primary-90 text-primary-10 font-medium'
                                      : 'text-neutral-800 hover:bg-neutral-50'
                                  }`}
                                >
                                  <span>{count} Questions</span>
                                  {assessmentOptions.written.numberOfQuestions === count && (
                                    <div className="bg-primary-40 flex h-4 w-4 items-center justify-center rounded-full">
                                      <svg className="text-primary-100 h-2 w-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Answer Type */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-700">Answer Type</label>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleAssessmentOptionChange('written', 'answerType', 'mcq')}
                            className={`flex-1 rounded-lg border p-3 text-center transition-all duration-200 ${
                              assessmentOptions.written.answerType === 'mcq'
                                ? 'bg-primary-90 border-primary-40 text-primary-10'
                                : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            <span className="font-medium">Multiple Choice (A, B, C, D)</span>
                          </button>
                          <button
                            onClick={() => handleAssessmentOptionChange('written', 'answerType', 'truefalse')}
                            className={`flex-1 rounded-lg border p-3 text-center transition-all duration-200 ${
                              assessmentOptions.written.answerType === 'truefalse'
                                ? 'bg-primary-90 border-primary-40 text-primary-10'
                                : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            <span className="font-medium">True/False</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedAssessmentType === 'oral' && (
                    <div className="space-y-4 overflow-visible">
                      {/* Number of Words */}
                      <div className="overflow-visible">
                        <label className="mb-2 block text-sm font-medium text-neutral-700">
                          Expected Response Length (words)
                        </label>
                        <div className="relative overflow-visible" ref={wordsDropdownRef}>
                          <button
                            onClick={() => setShowWordsDropdown(!showWordsDropdown)}
                            className="focus:ring-secondary-40 flex w-full cursor-pointer items-center justify-between rounded-lg border border-neutral-300 bg-white p-3 text-left transition-all duration-200 hover:border-neutral-400 focus:ring-2 focus:outline-none"
                          >
                            <span className="font-medium text-neutral-800">
                              {assessmentOptions.oral.numberOfWords} words
                            </span>
                            <div className="bg-secondary-90 flex h-5 w-5 items-center justify-center rounded-full">
                              <svg
                                className={`text-secondary-40 h-3 w-3 transition-transform duration-200 ${showWordsDropdown ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </button>

                          {/* Custom Dropdown Options */}
                          {showWordsDropdown && (
                            <div className="shadow-elevation-3 fixed top-1/2 left-1/2 z-[100] w-80 -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-lg border border-neutral-300 bg-white">
                              {[50, 100, 150, 200, 300].map(words => (
                                <button
                                  key={words}
                                  onClick={() => {
                                    handleAssessmentOptionChange('oral', 'numberOfWords', words)
                                    setShowWordsDropdown(false)
                                  }}
                                  className={`flex w-full items-center justify-between px-3 py-2 text-left transition-all duration-200 ${
                                    assessmentOptions.oral.numberOfWords === words
                                      ? 'bg-secondary-90 text-secondary-10 font-medium'
                                      : 'text-neutral-800 hover:bg-neutral-50'
                                  }`}
                                >
                                  <span>{words} words</span>
                                  {assessmentOptions.oral.numberOfWords === words && (
                                    <div className="bg-secondary-40 flex h-4 w-4 items-center justify-center rounded-full">
                                      <svg
                                        className="text-secondary-100 h-2 w-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Difficulty Level */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-700">Difficulty Level</label>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleAssessmentOptionChange('oral', 'difficultyLevel', 'easy')}
                            className={`flex-1 rounded-lg border p-3 text-center transition-all duration-200 ${
                              assessmentOptions.oral.difficultyLevel === 'easy'
                                ? 'bg-secondary-90 border-secondary-40 text-secondary-10'
                                : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            <span className="font-medium">Easy</span>
                          </button>
                          <button
                            onClick={() => handleAssessmentOptionChange('oral', 'difficultyLevel', 'medium')}
                            className={`flex-1 rounded-lg border p-3 text-center transition-all duration-200 ${
                              assessmentOptions.oral.difficultyLevel === 'medium'
                                ? 'bg-secondary-90 border-secondary-40 text-secondary-10'
                                : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            <span className="font-medium">Medium</span>
                          </button>
                          <button
                            onClick={() => handleAssessmentOptionChange('oral', 'difficultyLevel', 'hard')}
                            className={`flex-1 rounded-lg border p-3 text-center transition-all duration-200 ${
                              assessmentOptions.oral.difficultyLevel === 'hard'
                                ? 'bg-secondary-90 border-secondary-40 text-secondary-10'
                                : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            <span className="font-medium">Hard</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedAssessmentType === 'project' && (
                    <div className="space-y-4">
                      {/* Project Type */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-700">Project Type</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => handleAssessmentOptionChange('project', 'projectType', 'poster')}
                            className={`rounded-lg border p-3 text-center transition-all duration-200 ${
                              assessmentOptions.project.projectType === 'poster'
                                ? 'bg-tertiary-90 border-tertiary-40 text-tertiary-10'
                                : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            <span className="font-medium">Poster</span>
                          </button>
                          <button
                            onClick={() => handleAssessmentOptionChange('project', 'projectType', 'model')}
                            className={`rounded-lg border p-3 text-center transition-all duration-200 ${
                              assessmentOptions.project.projectType === 'model'
                                ? 'bg-tertiary-90 border-tertiary-40 text-tertiary-10'
                                : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            <span className="font-medium">Model</span>
                          </button>
                          <button
                            onClick={() => handleAssessmentOptionChange('project', 'projectType', 'presentation')}
                            className={`rounded-lg border p-3 text-center transition-all duration-200 ${
                              assessmentOptions.project.projectType === 'presentation'
                                ? 'bg-tertiary-90 border-tertiary-40 text-tertiary-10'
                                : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            <span className="font-medium">Presentation</span>
                          </button>
                          <button
                            onClick={() => handleAssessmentOptionChange('project', 'projectType', 'report')}
                            className={`rounded-lg border p-3 text-center transition-all duration-200 ${
                              assessmentOptions.project.projectType === 'report'
                                ? 'bg-tertiary-90 border-tertiary-40 text-tertiary-10'
                                : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            <span className="font-medium">Report</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Generate Button */}
              {selectedGradeForAssessment && selectedAssessmentType && (
                <div className="mt-20 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                  <button
                    onClick={handleGenerateAssessment}
                    className="bg-primary-40 hover:bg-primary-30 text-primary-100 w-full rounded-xl px-6 py-4 font-medium shadow-sm transition-all duration-200 hover:shadow-md"
                  >
                    Generate Assessment
                  </button>
                </div>
              )}

              {/* Generated Assessment */}
              {generatedAssessment && (
                <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                  <h3 className="mb-4 text-lg font-medium text-neutral-800">Generated Assessment</h3>

                  <div className="mb-6 space-y-4">
                    <div>
                      <h4 className="mb-2 font-medium text-neutral-800">{generatedAssessment.title}</h4>
                      <div className="text-sm text-neutral-600">
                        <p>
                          <strong>Type:</strong> {generatedAssessment.type}
                        </p>
                        <p>
                          <strong>Duration:</strong> {generatedAssessment.duration} minutes
                        </p>
                        <p>
                          <strong>Points:</strong> {generatedAssessment.points}
                        </p>
                        {generatedAssessment.answerType && (
                          <p>
                            <strong>Answer Format:</strong>{' '}
                            {generatedAssessment.answerType === 'mcq' ? 'Multiple Choice (A, B, C, D)' : 'True/False'}
                          </p>
                        )}
                        {generatedAssessment.numberOfQuestions && (
                          <p>
                            <strong>Number of Questions:</strong> {generatedAssessment.numberOfQuestions}
                          </p>
                        )}
                        {generatedAssessment.numberOfWords && (
                          <p>
                            <strong>Expected Response Length:</strong> {generatedAssessment.numberOfWords} words
                          </p>
                        )}
                        {generatedAssessment.difficultyLevel && (
                          <p>
                            <strong>Difficulty Level:</strong> {generatedAssessment.difficultyLevel}
                          </p>
                        )}
                        {generatedAssessment.projectType && (
                          <p>
                            <strong>Project Type:</strong> {generatedAssessment.projectType}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="mb-2 font-medium text-neutral-800">Instructions:</h5>
                      <p className="rounded-lg bg-neutral-50 p-3 text-sm text-neutral-700">
                        {generatedAssessment.instructions}
                      </p>
                    </div>

                    <div>
                      <h5 className="mb-2 font-medium text-neutral-800">Questions:</h5>
                      <ol className="list-inside list-decimal space-y-3 text-sm text-neutral-700">
                        {generatedAssessment.questions.map((question, index) => (
                          <li key={index} className="bg-primary-90 rounded-lg p-4">
                            {typeof question === 'string' ? (
                              question
                            ) : (
                              <div>
                                <p className="mb-2 font-medium">{question.question}</p>
                                {question.options && (
                                  <div className="ml-4 space-y-1">
                                    {question.options.map((option, optIndex) => (
                                      <p key={optIndex} className="text-xs">
                                        {String.fromCharCode(65 + optIndex)}. {option}
                                      </p>
                                    ))}
                                    <p className="text-primary-10 mt-2 text-xs font-medium">
                                      Correct Answer: {question.correctAnswer}
                                    </p>
                                  </div>
                                )}
                                {question.type === 'true/false' && (
                                  <div className="ml-4 text-xs">
                                    <p>Answer: True / False</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Edit Assessment */}
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                      Edit Assessment (Optional)
                    </label>
                    <textarea
                      value={assessmentPrompt}
                      onChange={e => setAssessmentPrompt(e.target.value)}
                      placeholder="Enter your modifications or additional instructions..."
                      rows="3"
                      className="focus:ring-primary-40 w-full resize-none rounded-lg border border-neutral-300 p-3 focus:border-transparent focus:ring-2 focus:outline-none"
                    />
                    {assessmentPrompt.trim() && (
                      <button
                        onClick={handleEditAssessment}
                        className="bg-primary-40 hover:bg-primary-10 text-primary-100 mt-2 rounded-lg px-4 py-2 font-medium transition-all duration-200"
                      >
                        Apply Changes
                      </button>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={handleSaveAssessment}
                      className="bg-secondary-40 hover:bg-secondary-10 text-secondary-100 flex-1 rounded-xl px-6 py-3 font-medium shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                      Save Assessment
                    </button>
                    <button
                      onClick={() => {
                        setGeneratedAssessment(null)
                        setAssessmentPrompt('')
                        setSelectedAssessmentType(null)
                      }}
                      className="flex-1 rounded-xl bg-neutral-500 px-6 py-3 font-medium text-white shadow-sm transition-all duration-200 hover:bg-neutral-600 hover:shadow-md"
                    >
                      Generate Another
                    </button>
                  </div>
                </div>
              )}

              {/* Saved Assessments */}
              {savedAssessments.length > 0 && (
                <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                  <h3 className="mb-4 text-lg font-medium text-neutral-800">
                    Saved Assessments ({savedAssessments.length})
                  </h3>
                  <div className="space-y-3">
                    {savedAssessments.map(assessment => (
                      <button
                        key={assessment.id}
                        onClick={() => handleOpenAssessment(assessment)}
                        className="w-full rounded-lg border border-neutral-200 p-4 text-left transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="font-medium text-neutral-800">{assessment.title}</h4>
                          <span className="text-xs text-neutral-500">{assessment.savedAt}</span>
                        </div>
                        <p className="text-sm text-neutral-600">
                          <strong>Grade:</strong> {grades.find(g => g.id === assessment.grade)?.name} |
                          <strong> Type:</strong> {assessment.type} |<strong> Points:</strong> {assessment.points}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-primary-40 text-xs font-medium">Click to conduct assessment</span>
                          <svg
                            className="h-4 w-4 text-neutral-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Conduct Assessment Screen
  if (currentScreen === 'conductAssessment') {
    const studentsInGrade = students[selectedAssessment?.grade] || []
    const currentQuestion = selectedAssessment?.questions[currentQuestionIndex]
    const studentAnswer = studentAnswers[currentQuestionIndex] || ''
    const isLastQuestion = currentQuestionIndex === selectedAssessment?.questions.length - 1
    const isFirstQuestion = currentQuestionIndex === 0

    return (
      <div className="bg-neutral-98 min-h-screen">
        {/* App Bar */}
        <div className="flex items-center justify-between bg-white/80 p-4 shadow-sm backdrop-blur-sm">
          <button
            onClick={handleFinishAssessment}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-neutral-100"
          >
            <svg className="h-6 w-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-primary-40 text-xl font-medium">Conduct Assessment</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div className="p-6">
          <div className="mx-auto max-w-2xl">
            {/* Assessment Header */}
            <div className="mb-6 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
              <h2 className="mb-2 text-xl font-semibold text-neutral-800">{selectedAssessment?.title}</h2>
              <div className="space-y-1 text-sm text-neutral-600">
                <p>
                  <strong>Type:</strong> {selectedAssessment?.type}
                </p>
                <p>
                  <strong>Grade:</strong> {grades.find(g => g.id === selectedAssessment?.grade)?.name}
                </p>
                <p>
                  <strong>Points:</strong> {selectedAssessment?.points}
                </p>
                <p>
                  <strong>Duration:</strong> {selectedAssessment?.duration} minutes
                </p>
              </div>
            </div>

            {/* Student Selection */}
            {!selectedStudentForAssessment ? (
              <div className="mb-6 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-medium text-neutral-800">Select Student to Assess</h3>
                {studentsInGrade.length > 0 ? (
                  <div className="space-y-3">
                    {studentsInGrade.map(student => {
                      const hasCompleted = assessmentResults[selectedAssessment?.id]?.[student.id]
                      return (
                        <button
                          key={student.id}
                          onClick={() => handleSelectStudentForAssessment(student)}
                          className={`w-full rounded-lg border p-4 text-left transition-all duration-200 ${
                            hasCompleted
                              ? 'bg-secondary-90 border-secondary-40 text-secondary-10'
                              : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="bg-primary-90 mr-3 flex h-10 w-10 items-center justify-center rounded-full">
                                <svg
                                  className="text-primary-40 h-5 w-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
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
                              <div className="text-secondary-40 flex items-center">
                                <svg className="mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span className="text-sm">Completed</span>
                              </div>
                            ) : (
                              <svg
                                className="h-5 w-5 text-neutral-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-neutral-500">
                    <svg
                      className="mx-auto mb-4 h-12 w-12 text-neutral-300"
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
              </div>
            ) : (
              /* Assessment Interface Based on Type */
              <div className="space-y-6">
                {/* Student Info */}
                <div className="bg-primary-90 rounded-xl p-4">
                  <div className="flex items-center">
                    <div className="bg-primary-100 mr-3 flex h-10 w-10 items-center justify-center rounded-full">
                      <svg className="text-primary-40 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">Assessing: {selectedStudentForAssessment.name}</p>
                      <p className="text-sm text-neutral-600">{selectedAssessment?.type}</p>
                    </div>
                  </div>
                </div>

                {/* Written Test - Image Upload Interface */}
                {selectedAssessment?.type === 'Written Test' && (
                  <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                    <h3 className="mb-4 text-lg font-medium text-neutral-800">Upload Student's Written Work</h3>
                    <p className="mb-6 text-neutral-600">
                      Please upload images of {selectedStudentForAssessment.name}'s written answers.
                    </p>

                    {/* File Upload Area */}
                    <div className="hover:border-primary-40 rounded-xl border-2 border-dashed border-neutral-300 p-8 text-center transition-colors duration-200">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={e => handleImageUpload(e, selectedStudentForAssessment.id)}
                        className="hidden"
                        id={`file-upload-${selectedStudentForAssessment.id}`}
                      />
                      <label htmlFor={`file-upload-${selectedStudentForAssessment.id}`} className="cursor-pointer">
                        <div className="bg-primary-90 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                          <svg
                            className="text-primary-40 h-8 w-8"
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
                        <p className="mb-2 text-lg font-medium text-neutral-800">Upload Images</p>
                        <p className="text-sm text-neutral-500">Click to select images or drag and drop</p>
                        <p className="mt-2 text-xs text-neutral-400">Supports: JPG, PNG, GIF</p>
                      </label>
                    </div>

                    {/* Uploaded Images Preview */}
                    {studentImages[selectedStudentForAssessment.id] &&
                      studentImages[selectedStudentForAssessment.id].length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-md mb-3 font-medium text-neutral-800">
                            Uploaded Images ({studentImages[selectedStudentForAssessment.id].length})
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            {studentImages[selectedStudentForAssessment.id].map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={image.url}
                                  alt={`Answer ${index + 1}`}
                                  className="h-32 w-full rounded-lg border-2 border-neutral-200 object-cover"
                                />
                                <button
                                  onClick={() => removeImage(selectedStudentForAssessment.id, index)}
                                  className="bg-error-40 text-error-100 hover:bg-error-30 absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-200"
                                >
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Score Input */}
                    <div className="mt-6">
                      <label className="mb-2 block text-sm font-medium text-neutral-700">
                        Score (out of {selectedAssessment?.points})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={selectedAssessment?.points}
                        value={studentScores[selectedStudentForAssessment.id] || ''}
                        onChange={e => handleScoreChange(selectedStudentForAssessment.id, e.target.value)}
                        placeholder="Enter score..."
                        className="focus:ring-primary-40 w-full rounded-xl border border-neutral-300 p-3 focus:border-transparent focus:ring-2 focus:outline-none"
                      />
                    </div>

                    {/* Comments */}
                    <div className="mt-4">
                      <label className="mb-2 block text-sm font-medium text-neutral-700">Comments (Optional)</label>
                      <textarea
                        value={studentComments[selectedStudentForAssessment.id] || ''}
                        onChange={e => handleCommentChange(selectedStudentForAssessment.id, e.target.value)}
                        placeholder="Add feedback comments..."
                        rows="3"
                        className="focus:ring-primary-40 w-full resize-none rounded-xl border border-neutral-300 p-3 focus:border-transparent focus:ring-2 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Oral Assessment - Voice Recording Interface */}
                {selectedAssessment?.type === 'Oral Assessment' && (
                  <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                    <h3 className="mb-4 text-lg font-medium text-neutral-800">Record Student's Oral Response</h3>
                    <p className="mb-6 text-neutral-600">
                      Record {selectedStudentForAssessment.name}'s oral responses to the assessment questions.
                    </p>

                    {/* Recording Interface */}
                    <div className="mb-6 text-center">
                      <div className="bg-primary-90 mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full">
                        {isRecording ? (
                          <div className="bg-error-40 flex h-16 w-16 animate-pulse items-center justify-center rounded-full">
                            <div className="bg-error-100 h-8 w-8 rounded-sm"></div>
                          </div>
                        ) : (
                          <svg
                            className="text-primary-40 h-16 w-16"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                            />
                          </svg>
                        )}
                      </div>

                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`rounded-xl px-8 py-3 font-medium transition-all duration-200 ${
                          isRecording
                            ? 'bg-error-40 text-error-100 hover:bg-error-30'
                            : 'bg-primary-40 text-primary-100 hover:bg-primary-30'
                        }`}
                      >
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                      </button>

                      {recordingTime > 0 && (
                        <p className="mt-2 text-sm text-neutral-600">
                          Recording time: {Math.floor(recordingTime / 60)}:
                          {(recordingTime % 60).toString().padStart(2, '0')}
                        </p>
                      )}
                    </div>

                    {/* Recorded Audio List */}
                    {studentRecordings[selectedStudentForAssessment.id] &&
                      studentRecordings[selectedStudentForAssessment.id].length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-md mb-3 font-medium text-neutral-800">
                            Recorded Responses ({studentRecordings[selectedStudentForAssessment.id].length})
                          </h4>
                          <div className="space-y-3">
                            {studentRecordings[selectedStudentForAssessment.id].map((recording, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between rounded-lg bg-neutral-50 p-3"
                              >
                                <div className="flex items-center">
                                  <div className="bg-primary-90 mr-3 flex h-8 w-8 items-center justify-center rounded-full">
                                    <svg
                                      className="text-primary-40 h-4 w-4"
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
                                    <p className="text-sm font-medium text-neutral-800">Recording {index + 1}</p>
                                    <p className="text-xs text-neutral-500">{recording.duration}s</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => playRecording(recording.url)}
                                    className="bg-primary-40 text-primary-100 hover:bg-primary-30 rounded-lg p-2 transition-colors duration-200"
                                  >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => removeRecording(selectedStudentForAssessment.id, index)}
                                    className="bg-error-40 text-error-100 hover:bg-error-30 rounded-lg p-2 transition-colors duration-200"
                                  >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Score Input */}
                    <div className="mt-6">
                      <label className="mb-2 block text-sm font-medium text-neutral-700">
                        Score (out of {selectedAssessment?.points})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={selectedAssessment?.points}
                        value={studentScores[selectedStudentForAssessment.id] || ''}
                        onChange={e => handleScoreChange(selectedStudentForAssessment.id, e.target.value)}
                        placeholder="Enter score..."
                        className="focus:ring-primary-40 w-full rounded-xl border border-neutral-300 p-3 focus:border-transparent focus:ring-2 focus:outline-none"
                      />
                    </div>

                    {/* Comments */}
                    <div className="mt-4">
                      <label className="mb-2 block text-sm font-medium text-neutral-700">Comments (Optional)</label>
                      <textarea
                        value={studentComments[selectedStudentForAssessment.id] || ''}
                        onChange={e => handleCommentChange(selectedStudentForAssessment.id, e.target.value)}
                        placeholder="Add feedback comments..."
                        rows="3"
                        className="focus:ring-primary-40 w-full resize-none rounded-xl border border-neutral-300 p-3 focus:border-transparent focus:ring-2 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Project Assessment - Keep existing interface for now */}
                {selectedAssessment?.type === 'Project-Based Assessment' && (
                  <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                    <h3 className="mb-4 text-lg font-medium text-neutral-800">Project Assessment</h3>
                    <p className="mb-6 text-neutral-600">
                      Evaluate {selectedStudentForAssessment.name}'s project work.
                    </p>

                    {/* Project Tasks */}
                    <div className="mb-6">
                      <h4 className="text-md mb-3 font-medium text-neutral-800">Project Tasks:</h4>
                      <ul className="space-y-2">
                        {selectedAssessment?.questions.map((task, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary-40 mr-2">•</span>
                            <span className="text-neutral-700">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Score Input */}
                    <div className="mt-6">
                      <label className="mb-2 block text-sm font-medium text-neutral-700">
                        Score (out of {selectedAssessment?.points})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={selectedAssessment?.points}
                        value={studentScores[selectedStudentForAssessment.id] || ''}
                        onChange={e => handleScoreChange(selectedStudentForAssessment.id, e.target.value)}
                        placeholder="Enter score..."
                        className="focus:ring-primary-40 w-full rounded-xl border border-neutral-300 p-3 focus:border-transparent focus:ring-2 focus:outline-none"
                      />
                    </div>

                    {/* Comments */}
                    <div className="mt-4">
                      <label className="mb-2 block text-sm font-medium text-neutral-700">Comments (Optional)</label>
                      <textarea
                        value={studentComments[selectedStudentForAssessment.id] || ''}
                        onChange={e => handleCommentChange(selectedStudentForAssessment.id, e.target.value)}
                        placeholder="Add feedback comments..."
                        rows="3"
                        className="focus:ring-primary-40 w-full resize-none rounded-xl border border-neutral-300 p-3 focus:border-transparent focus:ring-2 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedStudentForAssessment(null)}
                    className="flex items-center rounded-lg bg-neutral-100 px-4 py-2 text-neutral-700 transition-colors duration-200 hover:bg-neutral-200"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Students
                  </button>

                  <button
                    onClick={handleSubmitStudentAssessment}
                    className="bg-secondary-40 text-secondary-100 hover:bg-secondary-10 flex items-center rounded-lg px-6 py-2 transition-colors duration-200"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Submit Assessment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Grade Selection Screen (Original)
  return (
    <div className="bg-neutral-98 flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* App Title */}
        <div className="mb-12 text-center">
          <h1 className="text-primary-40 mb-4 text-4xl font-medium">Sahayak</h1>
          <p className="text-neutral-30 text-lg font-normal">Teaching Assistant</p>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-neutral-10 mb-2 text-xl leading-relaxed font-normal">
            What grade levels are your students in?
          </h2>
          <p className="text-sm font-medium text-neutral-50">Select all that apply</p>
        </div>

        {/* Grade Selection Cards */}
        <div className="mb-6 space-y-3">
          {grades.map(grade => (
            <button
              key={grade.id}
              onClick={() => handleGradeSelect(grade.id)}
              className={`shadow-elevation-1 hover:shadow-elevation-2 w-full rounded-3xl p-4 text-left transition-all duration-300 ${
                isGradeSelected(grade.id)
                  ? 'bg-primary-90 border-primary-40 text-primary-10 border-2'
                  : 'border-neutral-80 text-neutral-10 hover:bg-neutral-96 border-2 bg-neutral-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">{grade.name}</span>
                {isGradeSelected(grade.id) && (
                  <div className="bg-primary-40 flex h-6 w-6 items-center justify-center rounded-full">
                    <svg className="text-primary-100 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Selection Summary */}
        {selectedGrades.length > 0 && (
          <div className="mb-6 text-center">
            <p className="bg-neutral-96 inline-block rounded-full px-4 py-2 text-sm font-medium text-neutral-50">
              {selectedGrades.length} grade{selectedGrades.length > 1 ? 's' : ''} selected
            </p>
          </div>
        )}

        {/* Continue Button */}
        {selectedGrades.length > 0 && (
          <div className="mt-8">
            <button
              onClick={handleContinue}
              className="bg-primary-40 hover:shadow-elevation-3 active:shadow-elevation-1 text-primary-100 shadow-elevation-2 w-full rounded-3xl px-6 py-4 font-medium transition-all duration-300"
            >
              <span className="text-base font-medium">Continue</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
