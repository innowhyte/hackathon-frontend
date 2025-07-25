import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AppContextProvider } from './context/app-context'
import GradeSelection from './pages/grade-selection'
import Topics from './pages/topics'
import WeeklyPlan from './pages/weekly-plan'
import DayLesson from './pages/day-lesson'
import StudentManagement from './pages/student-management'
import Assessments from './pages/assessments'
import StudentAssessment from './pages/student-assessment'
import GradeActivities from './pages/grade-activities'
import WholeClassMaterials from './pages/whole-class-materials'
import NotFound from './pages/not-found'
import './index.css'
import { Toaster } from '@/components/ui/sonner'
import AssessmentDetails from './pages/assessment-details'
import StudentDetails from './pages/student-details'

const router = createBrowserRouter([
  {
    path: '/',
    element: <GradeSelection />,
    errorElement: <NotFound />,
  },
  {
    path: '/topics',
    element: <Topics />,
  },
  {
    path: '/weekly-plan',
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
    path: '/grade/:grade/students/:id',
    element: <StudentDetails />,
  },
  {
    path: '/assessments',
    element: <Assessments />,
  },
  {
    path: '/grade/:grade/assessment/:assessmentId',
    element: <AssessmentDetails />,
  },
  {
    path: '/grade/:grade/assessment/:assessmentId/conduct',
    element: <AssessmentDetails />,
  },
  {
    path: '/grade/:grade/assessment/:assessmentId/student/:studentId',
    element: <StudentAssessment />,
  },
  {
    path: '/day/:day/materials',
    element: <WholeClassMaterials />,
  },
  {
    path: '/day/:day/grade/:gradeId/activities',
    element: <GradeActivities />,
  },
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AppContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
)
