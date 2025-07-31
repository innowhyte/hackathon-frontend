import { useSearchParams, useNavigate, useLocation, useParams } from 'react-router'
import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Home, Menu, School } from 'lucide-react'
import { Button } from './ui/button'
import AIHelpDialog from './modals/ai-help-dialog'

export default function BottomNav() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const [showAIHelpDialog, setShowAIHelpDialog] = useState(false)
  const topicId = searchParams.get('topicId')
  const classroomIdFromParams = params.classroomId
  const classroomIdFromSearch = searchParams.get('classroomId')
  const classroomId = classroomIdFromParams || classroomIdFromSearch

  const handleNavigation = (path: string) => {
    if (path === '/') {
      // Special case: Home always navigates to root without classroom context
      navigate('/')
      return
    }

    if (classroomId) {
      if (path === '/classrooms') {
        // Special case: navigate to classrooms with classroomId as query parameter
        if (topicId) {
          navigate(`${path}?classroomId=${classroomId}&topicId=${topicId}`)
        } else {
          navigate(`${path}?classroomId=${classroomId}`)
        }
      } else {
        const classroomPath = `/classrooms/${classroomId}${path}`
        if (topicId) {
          navigate(`${classroomPath}?topicId=${topicId}`)
        } else {
          navigate(classroomPath)
        }
      }
    } else {
      if (topicId) {
        navigate(`${path}?topicId=${topicId}`)
      } else {
        navigate(path)
      }
    }
  }

  const isActive = (path: string) => {
    if (classroomId) {
      if (path === '/classrooms') {
        // Special case: check if we're on /classrooms with classroomId query parameter
        return location.pathname === '/classrooms' && searchParams.get('classroomId') === classroomId
      }
      return location.pathname === `/classrooms/${classroomId}${path}`
    }
    return location.pathname === path
  }

  const navigationItems = [
    {
      path: '/',
      label: 'Home',
      icon: <Home className="h-5 w-5" />,
    },
    {
      path: '/classrooms',
      label: 'Classrooms',
      icon: <School className="h-5 w-5" />,
    },
    {
      path: '/topics',
      label: 'Topics',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 2a7 7 0 0 0-7 7c0 2.386 1.053 4.507 2.75 5.905A2.996 2.996 0 0 0 10 18h4a2.996 2.996 0 0 0 2.25-3.095C17.947 13.507 19 11.386 19 9a7 7 0 0 0-7-7zm0 18v2m-4 0h8"
          />
        </svg>
      ),
    },
    {
      path: '/weekly-plan',
      label: 'Weekly Plan',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h5" />
        </svg>
      ),
    },
    {
      path: '/assessments',
      label: 'Assessment',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      path: '/students',
      label: 'Students',
      icon: <span className="material-icons text-xl">groups_2</span>,
    },
  ]

  const currentActiveItem = navigationItems.find(item => isActive(item.path))

  return (
    <>
      <nav className="border-border shadow-elevation-3 bg-background/95 fixed bottom-0 left-0 z-50 w-full border-t-2 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-2">
          {/* Navigation Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-muted flex flex-col items-center rounded-2xl px-4 py-2 transition-all duration-300"
              >
                <Menu className="mb-1 h-6 w-6" />
                <span className="text-xs font-medium">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {navigationItems.map(item => (
                <DropdownMenuItem
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center gap-3 px-3 py-2 ${
                    isActive(item.path) ? 'bg-secondary text-secondary-foreground' : ''
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                  {isActive(item.path) && <div className="bg-secondary-foreground ml-auto h-2 w-2 rounded-full" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Current Active Page Display */}
          <div className="flex flex-col items-center">
            {currentActiveItem && (
              <>
                <div className="mb-1 h-6 w-6">{currentActiveItem.icon}</div>
                <span className="text-secondary-foreground text-xs font-medium">{currentActiveItem.label}</span>
              </>
            )}
          </div>

          {/* AI Help Button */}
          <Button
            onClick={() => setShowAIHelpDialog(true)}
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full shadow-md transition-all duration-300 hover:shadow-lg"
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
          </Button>
        </div>
      </nav>

      {/* AI Help Dialog */}
      <AIHelpDialog showAIHelpDialog={showAIHelpDialog} setShowAIHelpDialog={setShowAIHelpDialog} />
    </>
  )
}
