import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { AppContextProvider } from './context/app-context'
import GradeSelection from './pages/grade-selection'
import TopicSetup from './pages/topic-setup'
import WeeklyPlan from './pages/weekly-plan'
import DayLesson from './pages/day-lesson'
import StudentManagement from './pages/student-management'
import TopicAssessment from './pages/topic-assessment'
import ConductAssessment from './pages/conduct-assessment'
import AssessmentOverview from './pages/assessment-overview'
import StudentAssessment from './pages/student-assessment'
import GradeActivities from './pages/grade-activities'
import WholeClassActivities from './pages/whole-class-activities'
import CarouselPage from './pages/carousel-page'
import NotFound from './pages/not-found'
import './index.css'
import { Toaster } from '@/components/ui/sonner'

const router = createBrowserRouter([
  {
    path: '/',
    element: <GradeSelection />,
    errorElement: <NotFound />,
  },
  {
    path: '/setup',
    element: <TopicSetup />,
  },
  {
    path: '/plan',
    element: <WeeklyPlan />,
  },
  {
    path: '/day/:day',
    element: <DayLesson />,
  },
  {
    path: '/students',
    element: <StudentManagement />,
  },
  {
    path: '/assessment',
    element: <TopicAssessment />,
  },
  {
    path: '/assessment/:assessmentId/conduct/grade/:grade',
    element: <AssessmentOverview />,
  },
  {
    path: '/assessment/:assessmentId/student/:studentId',
    element: <StudentAssessment />,
  },
  {
    path: '/assessment/:assessmentId/:grade',
    element: <ConductAssessment />,
  },
  {
    path: '/day/:day/activities',
    element: <WholeClassActivities />,
  },
  {
    path: '/day/:day/grade/:gradeId/activities',
    element: <GradeActivities />,
  },
  {
    path: '/day/:day/grade/:gradeId/carousel',
    element: <CarouselPage />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppContextProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AppContextProvider>
  </React.StrictMode>,
)
