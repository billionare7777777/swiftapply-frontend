'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ProgressBar, ProgressStep } from '../ui/ProgressBar'
import { VerificationCodeInput } from './VerificationCodeInput'
import { ScrapingResultsModal } from '../ui/ScrapingResultsModal'
import { apiClient } from '../../api/client'
import { useAuth } from '../../context/AuthContext'

interface ScrapingSession {
  id: string
  status: 'idle' | 'starting' | 'logging_in' | 'scraping' | 'processing' | 'completed' | 'error'
  progress: number
  currentStep: string
  steps: ProgressStep[]
  message: string
  jobsScraped: number
  totalJobs: number
  startTime?: Date
  endTime?: Date
  screenshotsTaken?: string[]
  credentialsUsed?: {
    email: string
    password: string
  }
  userCredentials?: {
    email: string
    password: string
  }
  emailNotRegistered?: boolean
}

export const JobScrapingProgress: React.FC = () => {
  const { user } = useAuth()
  const [session, setSession] = useState<ScrapingSession | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [error, setError] = useState('')
  const [showVerificationInput, setShowVerificationInput] = useState(false)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [modalResults, setModalResults] = useState<any>(null)

  // Initialize default steps
  const getDefaultSteps = (): ProgressStep[] => [
    {
      id: 'init',
      title: 'Initializing',
      description: 'Setting up scraping session...',
      status: 'pending'
    },
    {
      id: 'login',
      title: 'Logging into Greenhouse',
      description: 'Authenticating with Greenhouse credentials...',
      status: 'pending'
    },
    {
      id: 'navigate',
      title: 'Navigating to Jobs Page',
      description: 'Loading Greenhouse jobs page...',
      status: 'pending'
    },
    {
      id: 'scrape',
      title: 'Scraping Jobs',
      description: 'Extracting job listings from Greenhouse...',
      status: 'pending'
    },
    {
      id: 'process',
      title: 'Processing Data',
      description: 'Cleaning and storing job data...',
      status: 'pending'
    },
    {
      id: 'complete',
      title: 'Complete',
      description: 'Job scraping completed successfully!',
      status: 'pending'
    }
  ]

  // Start scraping session with demo credentials
  const startScraping = useCallback(async () => {
    if (!user?.email) {
      setError('User email not available')
      return
    }

    setError('')
    setSession({
      id: `session_${Date.now()}`,
      status: 'starting',
      progress: 0,
      currentStep: 'init',
      steps: getDefaultSteps(),
      message: 'Starting job scraping process...',
      jobsScraped: 0,
      totalJobs: 0,
      startTime: new Date()
    })

    try {
      // Start the scraping process with demo credentials
      const response = await apiClient.post<{
        success: boolean
        session_id: string
        message: string
      }>('/greenhouse/start-scraping', {
        email: user.email,
        max_jobs: 1000
      })

      if (response.success) {
        setSession(prev => prev ? {
          ...prev,
          id: response.session_id,
          status: 'logging_in',
          currentStep: 'login',
          message: response.message
        } : null)
        
        // Start polling for progress updates
        setIsPolling(true)
      } else {
        setError('Failed to start scraping session')
        setSession(null)
      }
    } catch (err) {
      console.error('Error starting scraping:', err)
      setError('Failed to start scraping session')
      setSession(null)
    }
  }, [user?.email])

  // Start scraping session with actual user credentials
  const startScrapingWithCredentials = useCallback(async (email: string, password: string) => {
    setError('')
    setSession({
      id: `session_${Date.now()}`,
      status: 'starting',
      progress: 0,
      currentStep: 'init',
      steps: getDefaultSteps(),
      message: 'Starting job scraping process with your credentials...',
      jobsScraped: 0,
      totalJobs: 0,
      startTime: new Date()
    })

    try {
      // Start the scraping process with actual credentials
      const response = await apiClient.post<{
        success: boolean
        session_id: string
        message: string
      }>('/greenhouse/start-scraping-with-credentials', {
        email: email,
        password: password,
        max_jobs: 1000
      })

      if (response.success) {
        setSession(prev => prev ? {
          ...prev,
          id: response.session_id,
          status: 'logging_in',
          currentStep: 'login',
          message: response.message
        } : null)
        
        // Start polling for progress updates
        setIsPolling(true)
      } else {
        setError('Failed to start scraping session')
        setSession(null)
      }
    } catch (err) {
      console.error('Error starting scraping with credentials:', err)
      setError('Failed to start scraping session')
      setSession(null)
    }
  }, [])

  // Start scraping session with verification code
  const startScrapingWithVerification = useCallback(async (email: string, verificationCode: string) => {
    setError('')
    setSession({
      id: `session_${Date.now()}`,
      status: 'starting',
      progress: 0,
      currentStep: 'init',
      steps: getDefaultSteps(),
      message: 'Starting job scraping process with verification code...',
      jobsScraped: 0,
      totalJobs: 0,
      startTime: new Date()
    })

    try {
      // Start the scraping process with verification code
      const response = await apiClient.post<{
        success: boolean
        session_id: string
        message: string
      }>('/greenhouse/start-scraping-with-verification', {
        email: email,
        verification_code: verificationCode,
        max_jobs: 1000
      })

      if (response.success) {
        setSession(prev => prev ? {
          ...prev,
          id: response.session_id,
          status: 'logging_in',
          currentStep: 'login',
          message: response.message
        } : null)
        
        // Start polling for progress updates
        setIsPolling(true)
        setShowVerificationInput(false)
      } else {
        setError('Failed to start scraping session with verification code')
        setSession(null)
      }
    } catch (err) {
      console.error('Error starting scraping with verification code:', err)
      setError('Failed to start scraping session with verification code')
      setSession(null)
    }
  }, [])

  // Poll for progress updates
  const pollProgress = useCallback(async () => {
    if (!session?.id || !isPolling) return

    try {
      const response = await apiClient.get<{
        success: boolean
        session: {
          id: string
          status: string
          progress: number
          current_step: string
          message: string
          jobs_scraped: number
          total_jobs: number
          steps: Array<{
            id: string
            status: string
            progress?: number
          }>
        }
      }>(`/greenhouse/scraping-progress/${session.id}`)

      if (response.success && response.session) {
        const { session: sessionData } = response
        
        // Update steps with progress data
        const updatedSteps = getDefaultSteps().map(step => {
          const stepData = sessionData.steps.find(s => s.id === step.id)
          if (stepData) {
            return {
              ...step,
              status: stepData.status as any,
              progress: stepData.progress
            }
          }
          return step
        })

        setSession(prev => prev ? {
          ...prev,
          status: sessionData.status as any,
          progress: sessionData.progress,
          currentStep: sessionData.current_step,
          message: sessionData.message,
          jobsScraped: sessionData.jobs_scraped,
          totalJobs: sessionData.total_jobs,
          screenshotsTaken: (sessionData as any).screenshots_taken || [],
          credentialsUsed: (sessionData as any).credentials_used || {},
          userCredentials: (sessionData as any).user_credentials || {},
          emailNotRegistered: (sessionData as any).email_not_registered || false,
          steps: updatedSteps,
          endTime: sessionData.status === 'completed' || sessionData.status === 'error' 
            ? new Date() 
            : prev.endTime
        } : null)

        // Stop polling if completed or error
        if (sessionData.status === 'completed' || sessionData.status === 'error') {
          setIsPolling(false)
          
          // Show results modal for completed sessions
          if (sessionData.status === 'completed' && sessionData.jobs_scraped > 0) {
            setModalResults({
              jobsScraped: sessionData.jobs_scraped,
              totalJobs: sessionData.total_jobs,
              status: sessionData.status,
              message: sessionData.message,
              screenshotsTaken: (sessionData as any).screenshots_taken || [],
              credentialsUsed: (sessionData as any).credentials_used || {},
              userCredentials: (sessionData as any).user_credentials || {},
              emailNotRegistered: (sessionData as any).email_not_registered || false
            })
            
            // Check if we should show the modal (set from login)
            const shouldShowModal = localStorage.getItem('showScrapingResultsModal') === 'true'
            if (shouldShowModal) {
              setShowResultsModal(true)
              localStorage.removeItem('showScrapingResultsModal')
            }
          }
        }
      }
    } catch (err) {
      console.error('Error polling progress:', err)
      // Continue polling on error, but log it
    }
  }, [session?.id, isPolling])

  // Polling effect
  useEffect(() => {
    if (!isPolling) return

    const interval = setInterval(pollProgress, 1000) // Poll every second
    return () => clearInterval(interval)
  }, [isPolling, pollProgress])

  // Auto-start scraping if user is logged in and no session exists
  useEffect(() => {
    if (user?.email && !session && !isPolling) {
      // Check if we need to start scraping from login
      const shouldAutoStart = localStorage.getItem('autoStartGreenhouseScraping') === 'true'
      if (shouldAutoStart) {
        // Get stored credentials
        const storedCredentials = localStorage.getItem('greenhouseCredentials')
        if (storedCredentials) {
          try {
            const credentials = JSON.parse(storedCredentials)
            console.log('🚀 Auto-starting Greenhouse scraping with stored credentials')
            
            if (credentials.useVerificationCode) {
              // Show verification code input for auto-start
              setShowVerificationInput(true)
            } else if (credentials.password) {
              // Use traditional password login
              startScrapingWithCredentials(credentials.email, credentials.password)
            } else {
              // Fallback to demo credentials
              startScraping()
            }
          } catch (error) {
            console.error('Error parsing stored credentials:', error)
            startScraping() // Fallback to regular start
          }
        } else {
          startScraping() // Fallback to regular start
        }
        
        // Clean up localStorage
        localStorage.removeItem('autoStartGreenhouseScraping')
        localStorage.removeItem('greenhouseCredentials')
      }
    }
  }, [user?.email, session, isPolling])

  // Handle verification code completion
  const handleVerificationComplete = useCallback((sessionId: string) => {
    setSession(prev => prev ? {
      ...prev,
      id: sessionId,
      status: 'logging_in',
      currentStep: 'login',
      message: 'Verification successful, starting job scraping...'
    } : null)
    setIsPolling(true)
    setShowVerificationInput(false)
  }, [])

  // Handle verification code error
  const handleVerificationError = useCallback((error: string) => {
    setError(error)
    setShowVerificationInput(false)
  }, [])

  // Handle verification code cancel
  const handleVerificationCancel = useCallback(() => {
    setShowVerificationInput(false)
    setSession(null)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsPolling(false)
    }
  }, [])

  const getStatusMessage = () => {
    if (!session) return ''
    
    if (session.status === 'completed') {
      return `Successfully scraped ${session.jobsScraped} jobs from Greenhouse!`
    }
    
    if (session.status === 'error') {
      return 'Job scraping encountered an error. Please try again.'
    }
    
    return session.message || 'Processing...'
  }

  const getDuration = () => {
    if (!session?.startTime) return ''
    
    const endTime = session.endTime || new Date()
    const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000)
    
    if (duration < 60) {
      return `${duration}s`
    } else {
      const minutes = Math.floor(duration / 60)
      const seconds = duration % 60
      return `${minutes}m ${seconds}s`
    }
  }

  // Show verification code input if needed
  if (showVerificationInput && user?.email) {
    return (
      <div className="mb-8">
        <VerificationCodeInput
          email={user.email}
          onVerificationComplete={handleVerificationComplete}
          onError={handleVerificationError}
          onCancel={handleVerificationCancel}
        />
      </div>
    )
  }

  // Don't show if no session and not auto-starting
  if (!session && !isPolling) {
    return null
  }

  return (
    <div className="mb-8">
      <ProgressBar
        steps={session?.steps || getDefaultSteps()}
        currentStep={session?.currentStep}
        overallProgress={session?.progress || 0}
        title="Greenhouse Job Scraping"
        description={getStatusMessage()}
        isVisible={true}
      />
      
      {/* Additional Info */}
      {session && (
        <div className="mt-4 space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm font-medium text-blue-900">Jobs Scraped</div>
              <div className="text-2xl font-bold text-blue-600">
                {session.jobsScraped}
                {session.totalJobs > 0 && (
                  <span className="text-sm text-blue-500"> / {session.totalJobs}</span>
                )}
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-sm font-medium text-green-900">Duration</div>
              <div className="text-2xl font-bold text-green-600">{getDuration()}</div>
            </div>
            
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <div className="text-sm font-medium text-emerald-900">Status</div>
              <div className="text-lg font-semibold text-emerald-600 capitalize">
                {session.status.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Credentials Used */}
          {(session.credentialsUsed && Object.keys(session.credentialsUsed).length > 0) || 
           (session.userCredentials && Object.keys(session.userCredentials).length > 0) ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-900 mb-2">🔐 Credentials Used for Login</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-yellow-800">Email:</span>
                  <span className="ml-2 text-sm text-yellow-700 font-mono bg-yellow-100 px-2 py-1 rounded">
                    {session.userCredentials?.email || session.credentialsUsed?.email}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-yellow-800">Password:</span>
                  <span className="ml-2 text-sm text-yellow-700 font-mono bg-yellow-100 px-2 py-1 rounded">
                    {session.userCredentials?.password || session.credentialsUsed?.password}
                  </span>
                </div>
                {session.userCredentials && Object.keys(session.userCredentials).length > 0 && (
                  <div className="mt-2 text-xs text-yellow-600">
                    ✅ Using your actual login credentials
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Screenshots Taken */}
          {session.screenshotsTaken && session.screenshotsTaken.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">📸 Screenshots Captured ({session.screenshotsTaken.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {session.screenshotsTaken.map((screenshot, index) => {
                  const filename = screenshot.split('/').pop() || screenshot
                  const stepName = filename.split('_')[0] + '_' + filename.split('_')[1]
                  return (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="text-xs font-medium text-gray-700 mb-2">{stepName}</div>
                      <div className="text-xs text-gray-500 font-mono break-all">{filename}</div>
                      <div className="mt-2 text-xs text-blue-600">
                        📁 Saved to: {screenshot}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Email Not Registered Notification */}
      {session?.emailNotRegistered && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="text-yellow-500 text-xl">⚠️</div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-yellow-900 mb-2">
                Email Not Registered with Greenhouse
              </h4>
              <p className="text-sm text-yellow-700 mb-3">
                The email address <strong>{user?.email}</strong> is not registered with Greenhouse. 
                You need to create a Greenhouse account first before you can scrape jobs.
              </p>
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                <p className="text-xs text-yellow-800 font-medium mb-2">Next Steps:</p>
                <ol className="text-xs text-yellow-700 space-y-1 list-decimal list-inside">
                  <li>Visit <a href="https://app.greenhouse.io/users/sign_up" target="_blank" rel="noopener noreferrer" className="underline">Greenhouse Sign Up</a></li>
                  <li>Create an account with your email: <strong>{user?.email}</strong></li>
                  <li>Return to SwiftApply.ai and try the job scraping again</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="text-red-500">⚠️</div>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Manual Start Buttons */}
      {!session && !isPolling && !showVerificationInput && (
        <div className="mt-4 text-center space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowVerificationInput(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              🔐 Start with Verification Code
            </button>
            <button
              onClick={startScraping}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              🚀 Start with Demo Credentials
            </button>
            <button
              onClick={() => {
                setModalResults({
                  jobsScraped: 25,
                  totalJobs: 25,
                  status: 'completed',
                  message: 'Successfully scraped 25 jobs from Greenhouse',
                  screenshotsTaken: ['01_login_page.png', '02_email_entered.png', '03_verification_page.png'],
                  credentialsUsed: { email: 'test@example.com' },
                  userCredentials: { email: 'test@example.com', verification_code: '123456' },
                  emailNotRegistered: false
                })
                setShowResultsModal(true)
              }}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              📊 View Sample Results
            </button>
          </div>
          <p className="text-xs text-gray-500">
            <strong>New:</strong> Use verification code for real Greenhouse login, or demo credentials for testing
          </p>
        </div>
      )}

      {/* Results Modal */}
      <ScrapingResultsModal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        sessionId={session?.id}
        results={modalResults}
      />
    </div>
  )
}

export default JobScrapingProgress
