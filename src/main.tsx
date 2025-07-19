import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext'
import GradeSelection from './pages/GradeSelection'
import TopicSetup from './pages/TopicSetup'
import WeeklyPlan from './pages/WeeklyPlan'
import DayLesson from './pages/DayLesson'
import StudentManagement from './pages/StudentManagement'
import TopicAssessment from './pages/TopicAssessment'
import ConductAssessment from './pages/ConductAssessment'
import GradeActivities from './pages/GradeActivities'
import WholeClassActivities from './pages/WholeClassActivities'
import CarouselPage from './pages/CarouselPage'
import NotFound from './pages/NotFound'
import './index.css'

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
    path: '/assessment/:assessmentId',
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
    </AppContextProvider>
  </React.StrictMode>,
)
