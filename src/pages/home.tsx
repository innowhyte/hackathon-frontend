import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router'
// import { BookOpen, Users, Target, Sparkles } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  // const features = [
  //   {
  //     icon: <BookOpen className="h-8 w-8" />,
  //     title: 'Lesson Planning',
  //     description: 'Create comprehensive weekly lesson plans with AI assistance',
  //   },
  //   {
  //     icon: <Users className="h-8 w-8" />,
  //     title: 'Student Management',
  //     description: 'Track student progress and manage classroom activities',
  //   },
  //   {
  //     icon: <Target className="h-8 w-8" />,
  //     title: 'Assessments',
  //     description: 'Design and conduct assessments with detailed analytics',
  //   },
  //   {
  //     icon: <Sparkles className="h-8 w-8" />,
  //     title: 'AI-Powered Tools',
  //     description: 'Generate materials, flashcards, and interactive content',
  //   },
  // ]

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-between pb-10">
      {/* Hero Section */}
      <section className="text-primary px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 text-center">
            <h1 className="mb-2 text-4xl font-medium">Sahayak</h1>
            <p className="text-lg font-normal">Teaching Assistant</p>
          </div>
          <p className="mb-8 text-lg opacity-90 md:text-xl">
            AI-powered tools to create engaging lessons, manage students, and track progress with ease and efficiency.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              onClick={() => navigate('/classrooms')}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>
      <div className="mt-10 flex flex-col items-center justify-center">
        <h3 className="text-primary">Developed by</h3>
        <img
          src="https://lzlzroabhwvvduwyfwvr.supabase.co/storage/v1/object/public/assets/iw_logo.png"
          alt="Innowhyte Logo"
          className="h-10 w-auto"
        />
      </div>

      {/* Features Section
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold">Everything You Need to Excel</h2>
            <p className="text-muted-foreground text-lg">
              Comprehensive tools designed specifically for modern educators
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-muted-foreground text-sm">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  )
}
