// Job service for managing job data and operations

import { jobApi } from '../api/jobApi'
import { Job, DatabaseJob, JobSearchFilters } from '../types'

export class JobService {
  private jobsCache: DatabaseJob[] = []
  private lastFetchTime: number | null = null
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  async getJobs(forceRefresh: boolean = false): Promise<Job[]> {
    if (forceRefresh || this.shouldRefreshCache()) {
      await this.refreshJobs()
    }
    return this.jobsCache.map(this.convertDatabaseJobToJob)
  }

  async searchJobs(filters: JobSearchFilters): Promise<Job[]> {
    try {
      const response = await jobApi.searchJobs(filters)
      return response.jobs
    } catch (error) {
      console.error('Error searching jobs:', error)
      return []
    }
  }

  async forceScrape(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await jobApi.forceScrape()
      await this.refreshJobs()
      return { success: true, message: response.message }
    } catch (error) {
      console.error('Error forcing scrape:', error)
      return { success: false, message: 'Failed to scrape jobs' }
    }
  }

  async exportJobsToCsv(): Promise<{ success: boolean; blob?: Blob; error?: string }> {
    try {
      const blob = await jobApi.exportJobsToCsv()
      return { success: true, blob }
    } catch (error) {
      console.error('Error exporting jobs:', error)
      return { success: false, error: 'Failed to export jobs' }
    }
  }

  async importJobsFromCsv(file: File): Promise<{ success: boolean; message: string }> {
    try {
      const response = await jobApi.importJobsFromCsv(file)
      await this.refreshJobs()
      return { success: true, message: response.message }
    } catch (error) {
      console.error('Error importing jobs:', error)
      return { success: false, message: 'Failed to import jobs' }
    }
  }

  async getJobCategories(): Promise<Record<string, number>> {
    try {
      const response = await jobApi.getJobCategories()
      return response.categories
    } catch (error) {
      console.error('Error getting job categories:', error)
      return {}
    }
  }

  async getJobStats(): Promise<any> {
    try {
      const response = await jobApi.getJobStats()
      return response.stats
    } catch (error) {
      console.error('Error getting job stats:', error)
      return null
    }
  }

  private async refreshJobs(): Promise<void> {
    try {
      const response = await jobApi.getJobsFromDatabase(100, 0)
      if (response.success) {
        this.jobsCache = response.jobs
        this.lastFetchTime = Date.now()
      }
    } catch (error) {
      console.error('Error refreshing jobs:', error)
      // Keep existing cache on error
    }
  }

  private shouldRefreshCache(): boolean {
    if (!this.lastFetchTime) return true
    return Date.now() - this.lastFetchTime > this.CACHE_DURATION
  }

  private convertDatabaseJobToJob(dbJob: DatabaseJob): Job {
    return {
      id: dbJob.job_id,
      title: dbJob.title,
      company: dbJob.company_name,
      company_avatar: dbJob.company_avatar_path,
      job_type: dbJob.job_type,
      salary_range: dbJob.budget_cost ? `$${dbJob.budget_cost.toLocaleString()}` : undefined,
      url: dbJob.job_path,
      posted_date: dbJob.creation_time,
      scraped_at: dbJob.scraped_time
    }
  }
}

export const jobService = new JobService()
