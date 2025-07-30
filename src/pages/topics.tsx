import React from 'react'
import { useTitle } from '../hooks/use-title'
import { useNavigate, useParams } from 'react-router'
import BottomNav from '../components/bottom-nav'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import Header from '../components/header'
import { toast } from 'sonner'
import TopicSelector from '../components/topic-selector'
import { useAllTopics } from '../queries/topic-queries'
import CreateTopicDialog from '@/components/modals/create-topic-dialog'
import { useTopicMaterials, useIncompleteMaterials } from '../queries/material-queries'
import type { TopicMaterial } from '../queries/material-queries'
import { useAddMaterialMutation, useDeleteMaterialMutation } from '@/mutations/material-mutations'
import { Loader2, Trash2, ImageIcon, LinkIcon, ExternalLink, RotateCw } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { useCreateWeeklyPlan } from '../mutations/topic-mutations'
import { Sparkles } from 'lucide-react'
import AIHelpDialog from '../components/modals/ai-help-dialog'
import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export default function Topics() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const params = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const topicIdParam = searchParams.get('topicId')
  const classroomId = params.classroomId
  const { data: topics, isLoading: isLoadingTopics } = useAllTopics()
  const [selectedTopicId, setSelectedTopicId] = React.useState<number | null>(
    topicIdParam ? parseInt(topicIdParam) : null,
  )
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)
  const { mutate: createWeeklyPlan, isPending: isCreatingWeeklyPlan } = useCreateWeeklyPlan()

  // Supporting materials state (local)
  const [supportingMaterials, setSupportingMaterials] = React.useState<
    Array<{
      id: string
      type: 'image' | 'link'
      name: string
      url?: string
      file?: File
    }>
  >([])
  const [uploadType, setUploadType] = React.useState<'image' | 'link'>('image')
  const [linkUrl, setLinkUrl] = React.useState('')
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null)

  const { data: topicMaterials, isLoading: isLoadingMaterials } = useTopicMaterials(selectedTopicId)
  const addMaterialMutation = useAddMaterialMutation(selectedTopicId)
  const deleteMaterialMutation = useDeleteMaterialMutation(selectedTopicId)

  // Polling state for incomplete materials
  const [pollingInterval, setPollingInterval] = React.useState<number | undefined>(1000) // Start with 1 second
  const [showSyncIndicator, setShowSyncIndicator] = React.useState(false)
  const [previouslyHadIncomplete, setPreviouslyHadIncomplete] = React.useState(false)

  const { data: incompleteMaterials, refetch: refetchIncomplete } = useIncompleteMaterials(
    selectedTopicId,
    pollingInterval,
  )

  // Generate a new threadId when selectedTopicId changes
  useEffect(() => {
    if (selectedTopicId) {
      setThreadId(crypto.randomUUID())
    } else {
      setThreadId(null)
    }
  }, [selectedTopicId])

  // Handle polling logic based on incomplete materials
  React.useEffect(() => {
    if (incompleteMaterials !== undefined) {
      const hasIncomplete = incompleteMaterials.length > 0

      const timestamp = new Date().toLocaleTimeString()
      console.log(`🔄 [${timestamp}] Incomplete materials response:`, incompleteMaterials)
      console.log(`📊 [${timestamp}] Has incomplete materials:`, hasIncomplete)

      if (hasIncomplete) {
        // We have incomplete materials - poll every second and show indicator
        console.log(`⚡ [${timestamp}] Switching to 1 second polling (has incomplete materials)`)
        setShowSyncIndicator(true)
        setPollingInterval(1000)
        setPreviouslyHadIncomplete(true)
      } else {
        // Empty array - no incomplete materials, poll every minute and hide indicator
        console.log(`⏰ [${timestamp}] Switching to 60 second polling (no incomplete materials)`)
        setShowSyncIndicator(false)
        setPollingInterval(60000)

        // Only invalidate when transitioning from having incomplete to not having incomplete
        if (previouslyHadIncomplete) {
          console.log(
            `🔄 [${timestamp}] State changed from incomplete to complete - invalidating topic-materials query`,
          )
          queryClient.invalidateQueries({ queryKey: ['topic-materials', selectedTopicId] })
          setPreviouslyHadIncomplete(false)
        } else {
          console.log(`📝 [${timestamp}] Already in complete state - no invalidation needed`)
        }
      }
    }
  }, [incompleteMaterials])

  React.useEffect(() => {
    if (topics && topics.length > 0) {
      // Check if topicIdParam is present and valid
      const topicIdFromUrl = topicIdParam ? parseInt(topicIdParam) : null
      const topicExists = topicIdFromUrl && topics.some(t => t.id === topicIdFromUrl)
      if (topicIdFromUrl && topicExists) {
        setSelectedTopicId(topicIdFromUrl)
      } else if (selectedTopicId === null) {
        setSelectedTopicId(topics[0].id)
        setSearchParams({ topicId: topics[0].id.toString() })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics])

  // Sync selectedTopicId with URL
  React.useEffect(() => {
    if (selectedTopicId) {
      setSearchParams({ topicId: selectedTopicId.toString() })
    } else {
      setSearchParams({})
    }
  }, [selectedTopicId])

  // Get selected topic and weekly plan
  const selectedTopic = topics?.find(t => t.id === selectedTopicId)
  useTitle(selectedTopic?.name || 'Topic Setup')
  const lessonPlan = selectedTopic?.weekly_plan || {}
  const hasLessonPlan = lessonPlan && Object.keys(lessonPlan).length > 0
  const [showAIHelpDialog, setShowAIHelpDialog] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)

  // Handlers for supporting materials
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleAddMaterial = () => {
    if (!selectedTopicId) return

    if (uploadType === 'link' && linkUrl.trim()) {
      addMaterialMutation.mutate(
        { link: linkUrl.trim() },
        {
          onSuccess: () => {
            setLinkUrl('')
            toast.success('Link added successfully!')
            // Trigger immediate refetch of incomplete materials
            const timestamp = new Date().toLocaleTimeString()
            console.log(`🚀 [${timestamp}] Material added - triggering immediate incomplete materials check`)
            setTimeout(() => refetchIncomplete(), 1000)
          },
          onError: () => {
            toast.error('Failed to add link')
          },
        },
      )
    } else if (uploadType === 'image' && uploadedFile) {
      addMaterialMutation.mutate(
        { file: uploadedFile },
        {
          onSuccess: () => {
            setUploadedFile(null)
            // Clear the file input
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
            if (fileInput) {
              fileInput.value = ''
            }
            toast.success('Image added successfully!')
            // Trigger immediate refetch of incomplete materials
            const timestamp = new Date().toLocaleTimeString()
            console.log(`🚀 [${timestamp}] Material added - triggering immediate incomplete materials check`)
            setTimeout(() => refetchIncomplete(), 1000)
          },
          onError: () => {
            toast.error('Failed to add image')
          },
        },
      )
    }
  }

  const handleRemoveMaterial = (id: string) => {
    setSupportingMaterials(prev => prev.filter(material => material.id !== id))
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Header
        title={selectedTopic?.name || 'Sahayak'}
        onBack={() => navigate(`/classrooms?classroomId=${classroomId}`)}
        showAIHelp={!!selectedTopicId}
        onShowAIHelp={() => setShowAIHelpDialog(true)}
      />
      <div className="px-4 py-3">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Topics</h2>
            <Button onClick={() => setShowCreateDialog(true)} className="rounded-xl px-4 py-2 text-base font-medium">
              + Create Topic
            </Button>
          </div>
          <TopicSelector selectedTopicId={selectedTopicId} onTopicChange={id => setSelectedTopicId(id)} />

          {/* Create Weekly Plan Button (if no plan exists) */}
          {selectedTopicId && !hasLessonPlan && (
            <div className="mb-6 flex justify-center">
              <Button
                onClick={() => {
                  if (!selectedTopicId) return
                  createWeeklyPlan(selectedTopicId, {
                    onSuccess: () => {
                      toast.success('Weekly lesson plan created successfully!')
                    },
                    onError: () => {
                      toast.error('Failed to create weekly lesson plan.')
                    },
                  })
                }}
                size="lg"
                className="rounded-xl px-6 py-3 text-base font-medium shadow-md transition-all duration-300 hover:shadow-lg"
                disabled={isCreatingWeeklyPlan}
              >
                {isCreatingWeeklyPlan ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Generating Weekly Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Create Weekly Lesson Plan
                  </>
                )}
              </Button>
            </div>
          )}
          {isLoadingTopics && <div>Loading topics...</div>}
          {!isLoadingTopics && topics && topics.length === 0 && (
            <div className="text-muted-foreground py-8 text-center">No topics found. Please create a topic.</div>
          )}

          {/* Supporting Material Section */}
          <Card className="mb-3">
            <CardHeader>
              <CardTitle>Add Supporting Material</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex justify-center">
                <div className="flex overflow-hidden rounded-lg border border-neutral-200">
                  <Button
                    onClick={() => setUploadType('image')}
                    variant={uploadType === 'image' ? 'default' : 'ghost'}
                    size="sm"
                    className={`rounded-l-full rounded-r-none border-0 ${uploadType === 'image' ? 'bg-primary text-primary-foreground' : 'hover:bg-neutral-100'}`}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Image Upload</span>
                  </Button>
                  <Button
                    onClick={() => setUploadType('link')}
                    variant={uploadType === 'link' ? 'default' : 'ghost'}
                    size="sm"
                    className={`rounded-l-none rounded-r-full border-l-0 ${uploadType === 'link' ? 'bg-primary text-primary-foreground' : 'hover:bg-neutral-100'}`}
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
                  <Button
                    onClick={handleAddMaterial}
                    size="sm"
                    className="w-full"
                    disabled={!linkUrl.trim() || addMaterialMutation.isPending}
                  >
                    {addMaterialMutation.isPending ? 'Adding...' : 'Add Link'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:mr-3 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium file:transition-colors"
                  />
                  <Button
                    onClick={handleAddMaterial}
                    size="sm"
                    className="w-full"
                    disabled={!uploadedFile || addMaterialMutation.isPending}
                  >
                    {addMaterialMutation.isPending ? 'Adding...' : 'Add Image'}
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
                            {material.type === 'image' && (
                              <svg className="h-4 w-4 text-neutral-600" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
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

          {/* Topic Materials from API */}
          {selectedTopicId && (
            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2">
                <h3 className="text-lg font-semibold">Current Materials for Topic</h3>
                {showSyncIndicator && <RotateCw className="h-4 w-4 animate-spin text-blue-600" />}
              </div>
              {isLoadingMaterials ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[1, 2].map(index => (
                    <Card key={index} className="relative overflow-hidden">
                      <div className="bg-muted flex aspect-video w-full items-center justify-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="text-muted-foreground/60 h-7 w-7 animate-spin" />
                          <span className="text-muted-foreground/80 text-xs">Loading...</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="bg-muted-foreground/20 mb-2 h-4 w-3/4 animate-pulse rounded"></div>
                        <div className="bg-muted-foreground/20 h-3 w-1/2 animate-pulse rounded"></div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : topicMaterials && topicMaterials.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {topicMaterials.map((material: TopicMaterial) => (
                    <Card key={material.id} className="relative overflow-hidden">
                      {material.content_link.includes('.png') ||
                      material.content_link.includes('.jpg') ||
                      material.content_link.includes('.jpeg') ? (
                        // Show image for materials with diagrams
                        <div className="bg-muted flex aspect-video w-full items-center justify-center">
                          <img
                            src={material.content_link}
                            alt={material.summary}
                            className="max-h-48 w-full object-contain"
                            loading="lazy"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 z-10 text-red-500 hover:bg-red-50 hover:text-red-700"
                            onClick={() => deleteMaterialMutation.mutate({ materialId: material.id })}
                            disabled={
                              deleteMaterialMutation.isPending &&
                              deleteMaterialMutation.variables?.materialId === material.id
                            }
                          >
                            {deleteMaterialMutation.isPending &&
                            deleteMaterialMutation.variables?.materialId === material.id ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Trash2 className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      ) : (
                        // Show link for materials without diagrams
                        <div className="bg-muted relative flex aspect-video w-full items-center justify-center">
                          <a
                            href={material.content_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 underline hover:text-blue-800"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Open link
                          </a>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 z-10 text-red-500 hover:bg-red-50 hover:text-red-700"
                            onClick={() => deleteMaterialMutation.mutate({ materialId: material.id })}
                            disabled={
                              deleteMaterialMutation.isPending &&
                              deleteMaterialMutation.variables?.materialId === material.id
                            }
                          >
                            {deleteMaterialMutation.isPending &&
                            deleteMaterialMutation.variables?.materialId === material.id ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Trash2 className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      )}
                      {!material.content_metadata?.has_diagrams && (
                        <div className="p-4">
                          <div className="text-primary text-sm font-medium">{material.summary}</div>
                        </div>
                      )}
                      {material.content_metadata?.has_diagrams && (
                        <div className="p-4">
                          <div className="text-primary mb-2 text-sm font-medium">{material.summary}</div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-muted-foreground/20 bg-muted/10 border-2 border-dashed">
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="bg-muted mb-4 rounded-full p-3">
                      <ImageIcon className="text-muted-foreground h-8 w-8" />
                    </div>
                    <h4 className="text-foreground mb-2 text-lg font-medium">No materials yet</h4>
                    <p className="text-muted-foreground mb-4 max-w-sm">
                      Add images or links to help with your lesson. These materials will appear here once added.
                    </p>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <ImageIcon className="h-4 w-4" />
                      <span>Images</span>
                      <span>•</span>
                      <LinkIcon className="h-4 w-4" />
                      <span>Links</span>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
      <CreateTopicDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} classroomId={classroomId} />
      <AIHelpDialog
        showAIHelpDialog={showAIHelpDialog}
        setShowAIHelpDialog={setShowAIHelpDialog}
        topicId={selectedTopicId ? selectedTopicId.toString() : ''}
        threadId={threadId || ''}
      />
      <BottomNav />
    </div>
  )
}
