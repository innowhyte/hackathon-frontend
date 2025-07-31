import Header from '../components/header'
import BottomNav from '../components/bottom-nav'
import { useParams, useNavigate } from 'react-router'
import { useStudentReport } from '../queries/student-queries'
import { useGenerateStudentReport } from '../mutations/student-mutations'
import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Brain,
  Lightbulb,
  Zap,
  Users,
  Award,
  BookOpen,
  BarChart,
  User,
  CheckCircle,
  Target,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStudentById } from '../queries/student-queries'

// Helper function to map rating strings to visual indicators using project colors
const getRatingInfo = (rating: string) => {
  switch (rating?.toLowerCase()) {
    case 'proficient':
      return {
        score: 4,
        bgColor: 'bg-primary', // Using chart-3 for success/proficient
        textColor: 'text-chart-3',
        borderColor: 'border-chart-3/30',
        bgLight: 'bg-chart-3/10',
        text: 'Proficient',
      }
    case 'developing':
      return {
        score: 3,
        bgColor: 'bg-yellow-500/80', // Using chart-5 for developing
        textColor: 'text-yellow-500',
        borderColor: 'border-yellow-500/30',
        bgLight: 'bg-yellow-500/10',
        text: 'Developing',
      }
    case 'needs_improvement':
      return {
        score: 2,
        bgColor: 'bg-destructive/90', // Using destructive for needs improvement
        textColor: 'text-destructive',
        borderColor: 'border-destructive/30',
        bgLight: 'bg-destructive/20',
        text: 'Needs Improvement',
      }
    default:
      return {
        score: 0,
        bgColor: 'bg-muted',
        textColor: 'text-muted-foreground',
        borderColor: 'border-border',
        bgLight: 'bg-muted/50',
        text: 'Not Assessed',
      }
  }
}

// Helper function to format camelCase titles
const formatTitle = (camelCase: string) => {
  const result = camelCase.replace(/([A-Z])/g, ' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

// Helper function to get icon for analysis categories using project colors
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'cognitiveStrengthsAndApproach':
      return <Brain className="text-chart-1 mr-2" size={20} />
    case 'abstractConceptGrasp':
      return <Lightbulb className="text-chart-4 mr-2" size={20} />
    case 'engagementAndMotivation':
      return <Zap className="text-chart-2 mr-2" size={20} />
    case 'socialAndInterpersonal':
      return <Users className="text-chart-5 mr-2" size={20} />
    case 'confidenceAndMindset':
      return <Award className="text-primary mr-2" size={20} />
    default:
      return <BarChart className="text-muted-foreground mr-2" size={20} />
  }
}

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string
  summary: string
  evidence: Array<{ topic: string; detail: string }>
  rating: string
}

const CollapsibleSection = ({ title, summary, evidence, rating }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const ratingInfo = getRatingInfo(rating)

  return (
    <div className={`bg-card border ${ratingInfo.borderColor} mb-3 overflow-hidden rounded-xl shadow-sm`}>
      <div
        className="hover:bg-accent/50 flex cursor-pointer flex-col p-4 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {getCategoryIcon(title)}
          <span className="text-foreground flex-1 text-base font-semibold">{formatTitle(title)}</span>
          <span className="ml-auto">
            {isOpen ? (
              <ChevronUp size={20} className="text-muted-foreground" />
            ) : (
              <ChevronDown size={20} className="text-muted-foreground" />
            )}
          </span>
        </div>
        <div className="mt-2">
          <span className={`rounded-2xl px-3 py-1 text-xs font-semibold ${ratingInfo.bgColor} text-primary-foreground`}>
            {ratingInfo.text}
          </span>
        </div>
      </div>
      {isOpen && (
        <div className={`border-t ${ratingInfo.borderColor} p-4 ${ratingInfo.bgLight}`}>
          <p className={`text-foreground mb-3 leading-relaxed`}>{summary}</p>
          {evidence && evidence.length > 0 && (
            <div>
              <h4 className="text-foreground mb-2 flex items-center font-bold">
                <Target size={16} className="text-muted-foreground mr-1" />
                Evidence:
              </h4>
              <ul className="space-y-2">
                {evidence.map((item, index) => (
                  <li key={index} className={`text-foreground text-sm ${ratingInfo.borderColor} pl-3`}>
                    <span className="font-semibold">{item.topic.replace(/_/g, ' ')}:</span> {item.detail}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ActionableRecommendationsCollapsible({ actionableRecommendations }: { actionableRecommendations: any }) {
  const [openChild, setOpenChild] = useState<{ [key: string]: boolean }>({})
  const toggleChild = (key: string) => setOpenChild(prev => ({ ...prev, [key]: !prev[key] }))
  return (
    <>
      <div className="flex items-center gap-2 p-4">
        <CheckCircle size={24} className="text-muted-foreground mr-2" />
        <span className="text-foreground flex-1 text-base font-semibold">Actionable Recommendations</span>
      </div>
      <div>
        {/* Core Strengths to Cultivate Collapsible */}
        {actionableRecommendations.coreStrengthsToCultivate && (
          <div>
            <div
              className="hover:bg-primary/10 border-primary/20 mb-4 flex cursor-pointer items-center rounded-xl border-2 p-4 transition-colors"
              onClick={() => toggleChild('coreStrengthsToCultivate')}
            >
              <Award size={18} className="text-primary mr-2" />
              <span className="text-primary flex-1 font-bold">Core Strengths to Cultivate</span>
              {openChild.coreStrengthsToCultivate ? (
                <ChevronUp size={18} className="text-muted-foreground" />
              ) : (
                <ChevronDown size={18} className="text-muted-foreground" />
              )}
            </div>
            {openChild.coreStrengthsToCultivate && (
              <ul className="mt-2 space-y-4">
                {actionableRecommendations.coreStrengthsToCultivate.map((item: any, idx: number) => (
                  <li key={idx} className="bg-primary/10 border-primary/10 rounded-lg border p-4">
                    <div className="text-primary mb-1 font-semibold">{item.title}</div>
                    <div className="text-foreground mb-1">
                      <span className="font-medium">Strategy:</span> {item.strategy}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      <span className="font-medium">Rationale:</span> {item.rationale}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {/* Strategies for Growth Collapsible */}
        {actionableRecommendations.strategiesForGrowth && (
          <div className="">
            <div
              className="hover:bg-primary/10 border-primary/20 mb-4 flex cursor-pointer items-center rounded-xl border-2 p-4 transition-colors"
              onClick={() => toggleChild('strategiesForGrowth')}
            >
              <Lightbulb size={18} className="text-primary mr-2" />
              <span className="text-primary flex-1 font-bold">Strategies for Growth</span>
              {openChild.strategiesForGrowth ? (
                <ChevronUp size={18} className="text-muted-foreground" />
              ) : (
                <ChevronDown size={18} className="text-muted-foreground" />
              )}
            </div>
            {openChild.strategiesForGrowth && (
              <ul className="mt-2 space-y-4">
                {actionableRecommendations.strategiesForGrowth.map((item: any, idx: number) => (
                  <li key={idx} className="border-primary/20 bg-primary/10 rounded-lg border p-4">
                    <div className="text-primary mb-1 font-semibold">{item.title}</div>
                    <div className="text-foreground mb-1">
                      <span className="font-medium">Strategy:</span> {item.strategy}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      <span className="font-medium">Rationale:</span> {item.rationale}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default function StudentDetails() {
  const { grade, id, classroomId } = useParams()
  const studentId = id ? Number(id) : null
  const navigate = useNavigate()

  const { data: report, isLoading, error, refetch } = useStudentReport(studentId)
  const { mutate: generateReport, isPending: isGeneratingReport } = useGenerateStudentReport()
  const { data: student, isLoading: isStudentLoading } = useStudentById(studentId)

  const handleGenerateReport = async () => {
    if (!studentId) return
    generateReport(studentId)
  }

  if (isLoading || isStudentLoading) {
    return (
      <div className="bg-background min-h-screen pb-20">
        <Header title="Student Details" onBack={() => navigate(`/classrooms/${classroomId}/students?grade=${grade}`)} />
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
          <div className="bg-card w-full max-w-md rounded-xl p-8 text-center shadow-lg">
            <RefreshCw className="text-primary mx-auto mb-4 animate-spin" size={32} />
            <p className="text-muted-foreground">Loading student details...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-background min-h-screen pb-20">
        <Header title="Student Details" onBack={() => navigate(`/classrooms/${classroomId}/students?grade=${grade}`)} />
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
          <div className="bg-card border-destructive/20 w-full max-w-md rounded-xl border p-8 text-center shadow-lg">
            <div className="bg-destructive/10 mx-auto mb-4 w-fit rounded-full p-3">
              <Target className="text-destructive" size={24} />
            </div>
            <p className="text-destructive mb-4">Failed to load student report</p>
            <button
              onClick={() => refetch()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Header title="Student Profile" onBack={() => navigate(`/classrooms/${classroomId}/students?grade=${grade}`)} />

      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Header Section with Gradient using project colors */}
        <div className="bg-primary text-primary-foreground mb-6 rounded-2xl p-6 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="mb-2 flex items-center text-2xl font-bold sm:text-3xl">
                <User size={24} className="mr-2" />
                Student Profile
              </h1>
              {student ? (
                <p className="text-primary-foreground/90 text-lg">
                  {student.name} | {student.grade_name || student.grade_id}
                </p>
              ) : (
                <p className="text-primary-foreground/90 text-lg">Student not found</p>
              )}
            </div>
          </div>
        </div>

        {/* Generate Report Button */}
        <div className="mb-6">
          <Button variant="outline" className="w-full" onClick={handleGenerateReport} disabled={isGeneratingReport}>
            <RefreshCw className={isGeneratingReport ? 'animate-spin' : ''} size={20} />
            {isGeneratingReport ? 'Generating New Report...' : 'Generate New Report'}
          </Button>
        </div>

        {report ? (
          <div className="space-y-6">
            {/* Holistic Profile Section using project colors */}
            {report.holisticProfile && (
              <div className="bg-primary/5 border-primary/20 rounded-xl border p-6 shadow-sm">
                <h2 className="text-primary mb-4 flex items-center text-2xl font-bold">
                  <BookOpen size={24} className="mr-2" />
                  Overall Summary
                </h2>
                <p className="text-foreground mb-4 leading-relaxed">{report.holisticProfile.overallSummary}</p>
                {report.holisticProfile.learnerProfileTag && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {report.holisticProfile.learnerProfileTag.split(',').map((tag: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="rounded-2xl px-3 py-1 text-xs font-medium">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Detailed Analysis Section */}
            {report.detailedAnalysis && Object.keys(report.detailedAnalysis).length > 0 && (
              <div>
                <h2 className="text-foreground mb-4 flex items-center text-2xl font-bold">
                  <BarChart size={24} className="text-muted-foreground mr-2" />
                  Detailed Analysis
                </h2>
                <div className="space-y-3">
                  {Object.entries(report.detailedAnalysis).map(([key, section]: any) => (
                    <CollapsibleSection
                      key={key}
                      title={key}
                      summary={section.summary}
                      evidence={section.evidence || []}
                      rating={section.rating}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Actionable Recommendations Section using project colors */}
            {report.actionableRecommendations && (
              <ActionableRecommendationsCollapsible actionableRecommendations={report.actionableRecommendations} />
            )}
          </div>
        ) : (
          <div className="bg-card rounded-xl p-8 text-center shadow-lg">
            <div className="bg-muted mx-auto mb-4 w-fit rounded-full p-4">
              <BookOpen className="text-muted-foreground" size={32} />
            </div>
            <h3 className="text-foreground mb-2 text-xl font-semibold">No Report Available</h3>
            {student && (
              <div className="mb-4">
                <p className="text-foreground text-lg font-medium">{student.name}</p>
                <p className="text-muted-foreground text-sm">Grade: {student.grade_name || student.grade_id}</p>
              </div>
            )}
            <p className="text-muted-foreground mb-4">
              Generate a new report to view detailed student analysis and recommendations.
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
