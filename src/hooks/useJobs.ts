// Custom hook for managing job data and operations

import { useState, useEffect, useCallback } from 'react'
import { Job, JobSearchFilters } from '../types'
import { getJobService } from '../core/serviceRegistry'

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const jobService = getJobService()

  const fetchJobs = useCallback(async (forceRefresh: boolean = false) => {
    if (!jobService) {
      setError('Job service not available')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const fetchedJobs = await jobService.getJobs(forceRefresh)
      setJobs(fetchedJobs)
      setLastUpdated(new Date().toISOString())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }, [jobService])

  const searchJobs = useCallback(async (filters: JobSearchFilters) => {
    if (!jobService) {
      setError('Job service not available')
      return []
    }

    try {
      setLoading(true)
      setError(null)
      const searchResults = await jobService.searchJobs(filters)
      return searchResults
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search jobs')
      return []
    } finally {
      setLoading(false)
    }
  }, [jobService])

  const forceScrape = useCallback(async () => {
    if (!jobService) {
      setError('Job service not available')
      return { success: false, message: 'Job service not available' }
    }

    try {
      setLoading(true)
      setError(null)
      const result = await jobService.forceScrape()
      if (result.success) {
        await fetchJobs(true)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to scrape jobs'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [jobService, fetchJobs])

  const exportJobs = useCallback(async () => {
    if (!jobService) {
      setError('Job service not available')
      return { success: false, error: 'Job service not available' }
    }

    try {
      setLoading(true)
      setError(null)
      const result = await jobService.exportJobsToCsv()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export jobs'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [jobService])

  const importJobs = useCallback(async (file: File) => {
    if (!jobService) {
      setError('Job service not available')
      return { success: false, message: 'Job service not available' }
    }

    try {
      setLoading(true)
      setError(null)
      const result = await jobService.importJobsFromCsv(file)
      if (result.success) {
        await fetchJobs(true)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import jobs'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [jobService, fetchJobs])

  const getJobCategories = useCallback(async () => {
    if (!jobService) {
      setError('Job service not available')
      return {}
    }

    try {
      setError(null)
      const categories = await jobService.getJobCategories()
      return categories
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get job categories')
      return {}
    }
  }, [jobService])

  const getJobStats = useCallback(async () => {
    if (!jobService) {
      setError('Job service not available')
      return null
    }

    try {
      setError(null)
      const stats = await jobService.getJobStats()
      return stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get job stats')
      return null
    }
  }, [jobService])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  return {
    jobs,
    loading,
    error,
    lastUpdated,
    fetchJobs,
    searchJobs,
    forceScrape,
    exportJobs,
    importJobs,
    getJobCategories,
    getJobStats
  }
}
