import { Loader2 } from 'lucide-react'

export default function Loading({ message }: { message?: string }) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <Loader2 className="text-primary h-10 w-10 animate-spin" />
      {message && <p className="text-primary">{message}</p>}
    </div>
  )
}
