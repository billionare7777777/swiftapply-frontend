// Custom hook for managing application data and operations

import { useState, useEffect, useCallback } from 'react'
import { Application, ApplicationStatus } from '../types'
import { getApplicationService } from '../core/serviceRegistry'

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const applicationService = getApplicationService()

  const fetchApplications = useCallback(async (forceRefresh: boolean = false) => {
    if (!applicationService) {
      setError('Application service not available')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const fetchedApplications = await applicationService.getApplications(forceRefresh)
      setApplications(fetchedApplications)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications')
    } finally {
      setLoading(false)
    }
  }, [applicationService])

  const createApplication = useCallback(async (data: {
    job_title: string
    company: string
    job_url: string
    resume_content?: string
    cover_letter?: string
    notes?: string
  }) => {
    if (!applicationService) {
      setError('Application service not available')
      return { success: false, message: 'Application service not available' }
    }

    try {
      setLoading(true)
      setError(null)
      const result = await applicationService.createApplication(data)
      if (result.success) {
        await fetchApplications(true)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create application'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [applicationService, fetchApplications])

  const updateApplication = useCallback(async (id: string, data: Partial<Application>) => {
    if (!applicationService) {
      setError('Application service not available')
      return { success: false, message: 'Application service not available' }
    }

    try {
      setLoading(true)
      setError(null)
      const result = await applicationService.updateApplication(id, data)
      if (result.success) {
        await fetchApplications(true)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update application'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [applicationService, fetchApplications])

  const submitApplication = useCallback(async (id: string) => {
    if (!applicationService) {
      setError('Application service not available')
      return { success: false, message: 'Application service not available' }
    }

    try {
      setLoading(true)
      setError(null)
      const result = await applicationService.submitApplication(id)
      if (result.success) {
        await fetchApplications(true)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit application'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [applicationService, fetchApplications])

  const updateApplicationStatus = useCallback(async (
    id: string, 
    status: ApplicationStatus, 
    notes?: string
  ) => {
    if (!applicationService) {
      setError('Application service not available')
      return { success: false, message: 'Application service not available' }
    }

    try {
      setLoading(true)
      setError(null)
      const result = await applicationService.updateApplicationStatus(id, status, notes)
      if (result.success) {
        await fetchApplications(true)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update application status'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [applicationService, fetchApplications])

  const bulkApplyToJobs = useCallback(async (data: {
    jobs: any[]
    resume_content: string
    template_id?: string
  }) => {
    if (!applicationService) {
      setError('Application service not available')
      return { success: false, applications_created: 0, message: 'Application service not available' }
    }

    try {
      setLoading(true)
      setError(null)
      const result = await applicationService.bulkApplyToJobs(data)
      if (result.success) {
        await fetchApplications(true)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bulk apply to jobs'
      setError(errorMessage)
      return { success: false, applications_created: 0, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [applicationService, fetchApplications])

  const getApplicationsDueForFollowup = useCallback(async () => {
    if (!applicationService) {
      setError('Application service not available')
      return []
    }

    try {
      setError(null)
      const dueApplications = await applicationService.getApplicationsDueForFollowup()
      return dueApplications
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get applications due for follow-up')
      return []
    }
  }, [applicationService])

  const getApplicationStats = useCallback(async () => {
    if (!applicationService) {
      setError('Application service not available')
      return null
    }

    try {
      setError(null)
      const stats = await applicationService.getApplicationStats()
      return stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get application stats')
      return null
    }
  }, [applicationService])

  const getApplicationTemplates = useCallback(async () => {
    if (!applicationService) {
      setError('Application service not available')
      return []
    }

    try {
      setError(null)
      const templates = await applicationService.getApplicationTemplates()
      return templates
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get application templates')
      return []
    }
  }, [applicationService])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  return {
    applications,
    loading,
    error,
    fetchApplications,
    createApplication,
    updateApplication,
    submitApplication,
    updateApplicationStatus,
    bulkApplyToJobs,
    getApplicationsDueForFollowup,
    getApplicationStats,
    getApplicationTemplates
  }
}
