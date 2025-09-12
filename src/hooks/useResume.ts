// Custom hook for managing resume generation and operations

import { useState, useCallback } from 'react'
import { UserData } from '../types'
import { getResumeService } from '../core/serviceRegistry'

export const useResume = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedResume, setGeneratedResume] = useState<string | null>(null)

  const resumeService = getResumeService()

  const generateResume = useCallback(async (data: {
    name: string
    email: string
    summary: string
    skills: string[]
    experience: any[]
    education: any[]
    template?: string
    job_description?: string
  }) => {
    if (!resumeService) {
      setError('Resume service not available')
      return { success: false, message: 'Resume service not available' }
    }

    try {
      setLoading(true)
      setError(null)
      const result = await resumeService.generateResume(data)
      if (result.success && result.resume) {
        setGeneratedResume(result.resume)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate resume'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [resumeService])

  const getResumeTemplates = useCallback(async () => {
    if (!resumeService) {
      setError('Resume service not available')
      return []
    }

    try {
      setError(null)
      const templates = await resumeService.getResumeTemplates()
      return templates
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get resume templates')
      return []
    }
  }, [resumeService])

  const analyzeJobDescription = useCallback(async (jobDescription: string) => {
    if (!resumeService) {
      setError('Resume service not available')
      return { success: false, message: 'Resume service not available' }
    }

    try {
      setError(null)
      const result = await resumeService.analyzeJobDescription(jobDescription)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze job description'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    }
  }, [resumeService])

  const validateUserData = useCallback((data: UserData) => {
    if (!resumeService) {
      return { isValid: false, errors: ['Resume service not available'] }
    }
    return resumeService.validateUserData(data)
  }, [resumeService])

  const downloadResume = useCallback((filename?: string) => {
    if (!resumeService || !generatedResume) {
      setError('No resume to download')
      return
    }
    resumeService.formatResumeForDownload(generatedResume, filename)
  }, [resumeService, generatedResume])

  const clearGeneratedResume = useCallback(() => {
    setGeneratedResume(null)
    setError(null)
  }, [])

  return {
    loading,
    error,
    generatedResume,
    generateResume,
    getResumeTemplates,
    analyzeJobDescription,
    validateUserData,
    downloadResume,
    clearGeneratedResume
  }
}
