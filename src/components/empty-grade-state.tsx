import { UsersIcon } from 'lucide-react'

export default function EmptyGradeState() {
  return (
    <div className="py-12 text-center">
      <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
        <UsersIcon className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="text-foreground mb-2 text-xl font-semibold">Select a Grade</h3>
      <p className="text-muted-foreground">Choose a grade level above to manage students</p>
    </div>
  )
}
