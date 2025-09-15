/**
 * Enhanced Auto-Apply Hook
 * Manages fast, automated job applications with real-time progress tracking
 */

import { useState, useEffect, useCallback } from 'react'
import { enhancedAutoApplyApi, ApplicationProgress, ApplicationResult, UserApplication } from '../api/enhancedAutoApplyApi'

export interface UseEnhancedAutoApplyReturn {
  // Application management
  startApplication: (userId: number, jobId: number) => Promise<boolean>
  cancelApplication: (userId: number, jobId: number) => Promise<boolean>
  submitSecurityCode: (userId: number, jobId: number, securityCode: string) => Promise<boolean>
  
  // Progress tracking
  currentProgress: ApplicationProgress | null
  isProcessing: boolean
  isWaitingForSecurityCode: boolean
  
  // Application history
  applications: UserApplication[]
  totalApplications: number
  loadingApplications: boolean
  refreshApplications: () => Promise<void>
  
  // Error handling
  error: string | null
  clearError: () => void
  
  // Service status
  serviceAvailable: boolean
  testService: () => Promise<boolean>
}

export const useEnhancedAutoApply = (userId?: number): UseEnhancedAutoApplyReturn => {
  const [currentProgress, setCurrentProgress] = useState<ApplicationProgress | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isWaitingForSecurityCode, setIsWaitingForSecurityCode] = useState(false)
  const [applications, setApplications] = useState<UserApplication[]>([])
  const [totalApplications, setTotalApplications] = useState(0)
  const [loadingApplications, setLoadingApplications] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [serviceAvailable, setServiceAvailable] = useState(true)
  const [activeApplicationKey, setActiveApplicationKey] = useState<string | null>(null)

  // Test service availability on mount
  useEffect(() => {
    testService()
  }, [])

  // Load applications on mount if userId is provided
  useEffect(() => {
    if (userId) {
      refreshApplications()
    }
  }, [userId])

  // Poll for progress updates when processing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isProcessing && activeApplicationKey) {
      interval = setInterval(async () => {
        try {
          const result = await enhancedAutoApplyApi.getApplicationStatus(activeApplicationKey)
          if (result.success && result.status) {
            setCurrentProgress(result.status)
            
            // Check if waiting for security code
            if (result.status.status === 'waiting_for_security_code') {
              setIsWaitingForSecurityCode(true)
              setIsProcessing(false)
            }
            // Check if application is completed
            else if (result.status.status === 'completed' || result.status.status === 'error') {
              setIsProcessing(false)
              setIsWaitingForSecurityCode(false)
              setActiveApplicationKey(null)
              
              // Refresh applications list
              if (userId) {
                refreshApplications()
              }
            }
          }
        } catch (err) {
          console.error('Error polling application status:', err)
        }
      }, 2000) // Poll every 2 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isProcessing, activeApplicationKey, userId])

  const startApplication = useCallback(async (userId: number, jobId: number): Promise<boolean> => {
    try {
      setError(null)
      setIsProcessing(true)
      setCurrentProgress({
        success: true,
        status: 'processing',
        step: 1,
        total_steps: 4,
        current_action: 'Initializing application',
        message: 'Starting automated job application'
      })

      const result = await enhancedAutoApplyApi.startApplication(userId, jobId)
      
      if (result.success && result.application_key) {
        setActiveApplicationKey(result.application_key)
        return true
      } else {
        setError(result.error || 'Failed to start application')
        setIsProcessing(false)
        setCurrentProgress(null)
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      setIsProcessing(false)
      setCurrentProgress(null)
      return false
    }
  }, [])

  const cancelApplication = useCallback(async (userId: number, jobId: number): Promise<boolean> => {
    try {
      setError(null)
      
      const result = await enhancedAutoApplyApi.cancelApplication(userId, jobId)
      
      if (result.success) {
        // Reset processing state
        setIsProcessing(false)
        setIsWaitingForSecurityCode(false)
        setActiveApplicationKey(null)
        setCurrentProgress(null)
        
        // Refresh applications list
        if (userId) {
          refreshApplications()
        }
        
        return true
      } else {
        setError(result.error || 'Failed to cancel application')
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return false
    }
  }, [])

  const submitSecurityCode = useCallback(async (userId: number, jobId: number, securityCode: string): Promise<boolean> => {
    try {
      setError(null)
      setIsProcessing(true)
      setIsWaitingForSecurityCode(false)
      
      const result = await enhancedAutoApplyApi.submitSecurityCode(userId, jobId, securityCode)
      
      if (result.success && result.application_key) {
        setActiveApplicationKey(result.application_key)
        return true
      } else {
        setError(result.error || 'Failed to submit security code')
        setIsProcessing(false)
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      setIsProcessing(false)
      return false
    }
  }, [])

  const refreshApplications = useCallback(async (): Promise<void> => {
    if (!userId) return

    try {
      setLoadingApplications(true)
      setError(null)

      const result = await enhancedAutoApplyApi.getUserApplications(userId, 50, 0)
      
      if (result.success) {
        setApplications(result.applications)
        setTotalApplications(result.total_count)
      } else {
        setError(result.error || 'Failed to load applications')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
    } finally {
      setLoadingApplications(false)
    }
  }, [userId])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const testService = useCallback(async (): Promise<boolean> => {
    try {
      const result = await enhancedAutoApplyApi.testService()
      setServiceAvailable(result.success)
      return result.success
    } catch (err) {
      setServiceAvailable(false)
      return false
    }
  }, [])

  return {
    startApplication,
    cancelApplication,
    submitSecurityCode,
    currentProgress,
    isProcessing,
    isWaitingForSecurityCode,
    applications,
    totalApplications,
    loadingApplications,
    refreshApplications,
    error,
    clearError,
    serviceAvailable,
    testService
  }
}
