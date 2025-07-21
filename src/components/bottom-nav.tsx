import { NavLink } from 'react-router'

export default function BottomNav() {
  return (
    <nav className="border-border shadow-elevation-3 bg-background/95 fixed bottom-0 left-0 z-50 w-full border-t-2 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center justify-around py-2">
        <NavLink
          to="/setup"
          className={({ isActive }) =>
            `flex flex-col items-center rounded-2xl px-4 py-2 transition-all duration-300 ${
              isActive ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-muted'
            }`
          }
        >
          <svg className="mb-1 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 2a7 7 0 0 0-7 7c0 2.386 1.053 4.507 2.75 5.905A2.996 2.996 0 0 0 10 18h4a2.996 2.996 0 0 0 2.25-3.095C17.947 13.507 19 11.386 19 9a7 7 0 0 0-7-7zm0 18v2m-4 0h8"
            />
          </svg>
          <span className="text-xs font-medium">Topic</span>
        </NavLink>
        <NavLink
          to="/plan"
          className={({ isActive }) =>
            `flex flex-col items-center rounded-2xl px-4 py-2 transition-all duration-300 ${
              isActive ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-muted'
            }`
          }
        >
          <svg className="mb-1 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h5" />
          </svg>
          <span className="text-xs font-medium">Lesson Plan</span>
        </NavLink>
        <NavLink
          to="/assessment"
          className={({ isActive }) =>
            `flex flex-col items-center rounded-2xl px-4 py-2 transition-all duration-300 ${
              isActive ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-muted'
            }`
          }
        >
          <svg className="mb-1 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs font-medium">Assessment</span>
        </NavLink>
        <NavLink
          to="/students"
          className={({ isActive }) =>
            `flex flex-col items-center rounded-2xl px-4 py-2 transition-all duration-300 ${
              isActive ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-muted'
            }`
          }
        >
          <span className="material-icons mb-1 text-2xl">groups_2</span>
          <span className="text-xs font-medium">Students</span>
        </NavLink>
      </div>
    </nav>
  )
}