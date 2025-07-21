import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-primary mb-4 text-4xl font-bold">404 - Not Found</h1>
      <p className="text-muted-foreground mb-8 text-lg">The page you are looking for does not exist.</p>
      <Link to="/" className="bg-primary text-primary-foreground rounded-lg px-6 py-3">
        Go to Home
      </Link>
    </div>
  )
}
