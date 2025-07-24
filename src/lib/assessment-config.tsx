import type { AssessmentTypeConfig } from '../components/assessment-type-selector'
import type { AssessmentOptionsConfig } from '../components/assessment-options-selector'

export const assessmentTypeConfig: AssessmentTypeConfig[] = [
  {
    id: 'mcq',
    title: 'Multiple Choice Questions',
    description: 'Traditional written assessment with multiple choice questions',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    id: 'passage_reading',
    title: 'Passage Reading',
    description: 'Oral assessment where students read a passage.',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    id: 'passage_completion',
    title: 'Passage Completion',
    description: 'Oral assessment where students complete a passage by filling in the blanks.',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
]

export const AssessmentType = {
  mcq: 'Multiple Choice Questions',
  passage_reading: 'Passage Reading',
  passage_completion: 'Passage Completion',
} as const

export const assessmentOptionsConfig: AssessmentOptionsConfig = {
  mcq: [
    {
      id: 'numberOfQuestions',
      label: 'Number of Questions',
      type: 'select',
      options: [
        { value: 3, label: '3 Questions' },
        { value: 5, label: '5 Questions' },
        { value: 10, label: '10 Questions' },
        { value: 15, label: '15 Questions' },
        { value: 20, label: '20 Questions' },
      ],
    },
    {
      id: 'answerType',
      label: 'Answer Type',
      type: 'button-group',
      options: [{ value: 'mcq', label: 'Multiple Choice' }],
    },
  ],
  passage_reading: [
    {
      id: 'numberOfWords',
      label: 'Expected Response Length (words)',
      type: 'select',
      options: [
        { value: 50, label: '50 words' },
        { value: 75, label: '75 words' },
        { value: 100, label: '100 words' },
        { value: 150, label: '150 words' },
      ],
    },
    {
      id: 'difficultyLevel',
      label: 'Difficulty Level',
      type: 'button-group',
      options: [
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' },
      ],
    },
  ],
  passage_completion: [
    {
      id: 'projectType',
      label: 'Project Type',
      type: 'button-group',
      className: 'grid grid-cols-2 gap-2',
      options: [
        { value: 'poster', label: 'Poster' },
        { value: 'model', label: 'Model' },
        { value: 'presentation', label: 'Presentation' },
        { value: 'report', label: 'Report' },
      ],
    },
  ],
}

// Function to generate default options from config
export function generateDefaultOptions(): any {
  const defaults: any = {}

  Object.keys(assessmentOptionsConfig).forEach(type => {
    defaults[type] = {}
    assessmentOptionsConfig[type].forEach(option => {
      // Set first option as default for each field
      if (option.options && option.options.length > 0) {
        defaults[type][option.id] = option.options[0].value
      }
    })
  })

  return defaults
}
