import React, { useContext } from 'react'
import { useTitle } from '../hooks/use-title'
import { useNavigate } from 'react-router'
import { AppContext } from '../context/app-context'
import BottomNav from '../components/bottom-nav'
import { Sparkles } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import Header from '../components/header'
import AIHelpDialog from '../components/modals/ai-help-dialog'
import { useLatestClassroom } from '../queries/classroom-queries'
import { useCreateTopic } from '../mutations/topic-mutations'
import { useCreateWeeklyPlan } from '../mutations/topic-mutations'
import { toast } from 'sonner'

export default function TopicSetup() {
  useTitle('Topic Setup')
  const context = useContext(AppContext)
  const navigate = useNavigate()

  const { data: latestClassroom, isLoading, isError, error } = useLatestClassroom()

  if (!context) {
    return <div>Loading...</div>
  }

  const {
    topic,
    setTopic,
    learningOutcomes,
    setLearningOutcomes,
    uploadType,
    setUploadType,
    linkUrl,
    setLinkUrl,
    uploadedFile,
    setUploadedFile,
    supportingMaterials,
    setSupportingMaterials,
  } = context

  // Use grades from latest classroom as selectedGrades
  const selectedGrades: { name: string; special_instructions?: string }[] = latestClassroom?.grades || []

  // Topic creation state
  const [topicCreatedId, setTopicCreatedId] = React.useState<number | null>(null)
  const { mutate: createTopic, isPending: isCreatingTopic } = useCreateTopic()
  const { mutate: createWeeklyPlan, isPending: isCreatingWeeklyPlan } = useCreateWeeklyPlan()

  const handleCreateTopic = () => {
    if (!topic.trim()) return
    // Build learning_outcomes array with grade_id (fallback to index if id missing)
    const learning_outcomes = selectedGrades.map((grade, idx) => ({
      learning_outcomes: learningOutcomes[grade.name] || '',
      grade_id: (grade as any).id ?? idx + 1,
    }))
    createTopic(
      { name: topic, learning_outcomes },
      {
        onSuccess: data => {
          setTopicCreatedId(data.id)
          toast.success('Topic created!')
        },
        onError: error => {
          console.error(error)
          toast.error('Failed to create topic.')
        },
      },
    )
  }

  const handleLearningOutcomeChange = (gradeName: string, value: string) => {
    setLearningOutcomes(prev => ({
      ...prev,
      [gradeName]: value,
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleAddMaterial = () => {
    if (uploadType === 'link' && linkUrl.trim()) {
      const newMaterial = {
        id: Date.now().toString(),
        type: 'link' as const,
        name: linkUrl,
        url: linkUrl,
      }
      setSupportingMaterials(prev => [...prev, newMaterial])
      setLinkUrl('')
    } else if (uploadType === 'file' && uploadedFile) {
      const newMaterial = {
        id: Date.now().toString(),
        type: 'file' as const,
        name: uploadedFile.name,
        file: uploadedFile,
      }
      setSupportingMaterials(prev => [...prev, newMaterial])
      setUploadedFile(null)
      // Clear the file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
    }
  }

  const handleRemoveMaterial = (id: string) => {
    setSupportingMaterials(prev => prev.filter(material => material.id !== id))
  }

  const canContinueFromTopicSetup = () => {
    if (!topic.trim()) return false
    return selectedGrades.every(g => learningOutcomes[g.name] && learningOutcomes[g.name].trim())
  }

  const handleCreateWeeklyPlan = () => {
    if (!topicCreatedId) return
    createWeeklyPlan(topicCreatedId, {
      onSuccess: () => {
        navigate(`/weekly-plan?topicId=${topicCreatedId}`)
      },
      onError: () => {
        toast.error('Failed to create weekly plan.')
      },
    })
  }

  if (isLoading) {
    return <div>Loading classroom...</div>
  }
  if (isError) {
    return <div className="text-red-600">{(error as Error)?.message || 'Failed to load classroom.'}</div>
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Header title="Sahayak" onBack={() => navigate('/')} showAIHelp />

      <div className="px-4 py-3">
        <div className="mx-auto w-full max-w-md">
          <Card className="mb-3">
            <CardHeader>
              <CardTitle>What's your lesson topic?</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g., Indian Geography, Mathematical Operations, etc."
                disabled={!!topicCreatedId}
              />
            </CardContent>
          </Card>

          <Card className="mb-3">
            <CardHeader>
              <CardTitle>Learning Outcomes by Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedGrades.map(grade => (
                  <div key={grade.name}>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-600">{grade.name}</label>
                    <Textarea
                      value={learningOutcomes[grade.name] || ''}
                      onChange={e => handleLearningOutcomeChange(grade.name, e.target.value)}
                      placeholder="What should students learn from this topic?"
                      rows={3}
                      disabled={!!topicCreatedId}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Create Topic Button */}
          <div className="mb-3 flex w-full justify-center">
            <Button
              onClick={handleCreateTopic}
              size="lg"
              className="rounded-xl px-4 py-3 text-base font-medium shadow-md transition-all duration-300 hover:shadow-lg"
              disabled={!canContinueFromTopicSetup() || !!topicCreatedId || isCreatingTopic}
            >
              {isCreatingTopic ? 'Creating Topic...' : 'Create Topic'}
            </Button>
          </div>

          {/* Supporting Material Section - disabled until topic is created */}
          <Card
            className={`mb-3 ${topicCreatedId ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-50'}`}
          >
            <CardHeader>
              <CardTitle>Add Supporting Material (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex justify-center">
                <div className="flex overflow-hidden rounded-lg border border-neutral-200">
                  <Button
                    onClick={() => setUploadType('file')}
                    variant={uploadType === 'file' ? 'default' : 'ghost'}
                    size="sm"
                    className={`rounded-l-full rounded-r-none border-0 ${
                      uploadType === 'file' ? 'bg-primary text-primary-foreground' : 'hover:bg-neutral-100'
                    }`}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2-2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>File Upload</span>
                  </Button>
                  <Button
                    onClick={() => setUploadType('link')}
                    variant={uploadType === 'link' ? 'default' : 'ghost'}
                    size="sm"
                    className={`rounded-l-none rounded-r-full border-l-0 ${
                      uploadType === 'link' ? 'bg-primary text-primary-foreground' : 'hover:bg-neutral-100'
                    }`}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Link</span>
                  </Button>
                </div>
              </div>

              {uploadType === 'link' ? (
                <div className="space-y-2">
                  <Input
                    type="url"
                    value={linkUrl}
                    onChange={e => setLinkUrl(e.target.value)}
                    placeholder="https://example.com/resource"
                  />
                  <Button onClick={handleAddMaterial} size="sm" className="w-full" disabled={!linkUrl.trim()}>
                    Add Link
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                    className="file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:mr-3 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium file:transition-colors"
                  />
                  <Button onClick={handleAddMaterial} size="sm" className="w-full" disabled={!uploadedFile}>
                    Add File
                  </Button>
                </div>
              )}

              {/* Materials Preview */}
              {supportingMaterials.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-medium text-neutral-700">Added Materials:</h4>
                  <div className="max-h-32 space-y-2 overflow-y-auto">
                    {supportingMaterials.map(material => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-2"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="flex h-6 w-6 items-center justify-center">
                            {material.type === 'file' && (
                              <svg className="h-4 w-4 text-neutral-600" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2-2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}

                            {material.type === 'link' && (
                              <svg className="h-4 w-4 text-neutral-600" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="truncate text-sm text-neutral-700">{material.name}</span>
                        </div>
                        <Button
                          onClick={() => handleRemoveMaterial(material.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:bg-red-50 hover:text-red-700"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mx-auto mt-6 flex w-full max-w-md items-center justify-center gap-3">
            <Button
              onClick={handleCreateWeeklyPlan}
              size="lg"
              className="flex-1 rounded-xl px-4 py-3 text-base font-medium shadow-md transition-all duration-300 hover:shadow-lg"
              disabled={!topicCreatedId || isCreatingWeeklyPlan}
            >
              {isCreatingWeeklyPlan ? (
                <>
                  <Sparkles className="h-5 w-5 animate-spin" />
                  Generating Weekly Plan...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Create Weekly Lesson Plan
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      <AIHelpDialog />
      <BottomNav />
    </div>
  )
}
