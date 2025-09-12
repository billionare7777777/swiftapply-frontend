// Job-related API endpoints

import { apiClient } from './client'
import { Job, DatabaseJob, JobSearchFilters, JobSearchResponse } from '../types'

export class JobApi {
  async getAllJobs(): Promise<{ jobs: Job[]; total: number; last_updated?: string }> {
    const response = await apiClient.get<{ success: boolean; jobs: Job[]; total_count: number }>('/jobs/from-database')
    return {
      jobs: response.jobs,
      total: response.total_count,
      last_updated: new Date().toISOString()
    }
  }

  async getJobsFromDatabase(limit: number = 50, offset: number = 0, companyName?: string): Promise<{ success: boolean; jobs: DatabaseJob[]; count: number; total_count: number }> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    })
    if (companyName) {
      params.append('company_name', companyName)
    }
    return apiClient.get(`/jobs/from-database?${params.toString()}`)
  }

  async getJobStatistics(): Promise<{ success: boolean; statistics: any }> {
    return apiClient.get('/jobs/statistics')
  }

  async scrapeGreenhouseJobs(maxJobs: number = 500, useSelenium: boolean = false): Promise<{ success: boolean; message: string; jobs_scraped: number; jobs_stored: number }> {
    return apiClient.post('/jobs/scrape-greenhouse', {
      max_jobs: maxJobs,
      use_selenium: useSelenium
    })
  }

  async forceScrapeGreenhouseJobs(maxJobs: number = 500, useSelenium: boolean = false): Promise<{ success: boolean; message: string; jobs_scraped: number; jobs_stored: number }> {
    return apiClient.post('/jobs/scrape-greenhouse-force', {
      max_jobs: maxJobs,
      use_selenium: useSelenium
    })
  }

  async searchJobs(filters: JobSearchFilters): Promise<JobSearchResponse> {
    return apiClient.post<JobSearchResponse>('/jobs/search', filters)
  }

  async getJobs(params: { limit?: number; offset?: number; search?: string; company?: string; job_type?: string }): Promise<{ success: boolean; jobs: DatabaseJob[]; count: number; total_count: number; statistics?: any }> {
    const queryParams = new URLSearchParams()
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.offset) queryParams.append('offset', params.offset.toString())
    if (params.search) queryParams.append('search', params.search)
    if (params.company) queryParams.append('company_name', params.company)
    if (params.job_type) queryParams.append('job_type', params.job_type)
    
    return apiClient.get<{ success: boolean; jobs: DatabaseJob[]; count: number; total_count: number; statistics?: any }>(`/jobs/from-database?${queryParams.toString()}`)
  }

  async forceScrape(): Promise<{ message: string; jobs_count: number; timestamp?: string }> {
    return apiClient.post('/jobs/scrape')
  }

  async exportJobsToCsv(): Promise<Blob> {
    const response = await fetch(`${apiClient['baseUrl']}/api/jobs/export-csv`)
    if (!response.ok) {
      throw new Error('Failed to export jobs')
    }
    return response.blob()
  }

  async importJobsFromCsv(file: File): Promise<{ message: string; jobs_count: number; timestamp?: string }> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${apiClient['baseUrl']}/api/jobs/import-csv`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error('Failed to import jobs')
    }
    
    return response.json()
  }

  async getJobCategories(): Promise<{ categories: Record<string, number>; total_categories: number }> {
    return apiClient.get('/jobs/categories')
  }

  async getJobStats(): Promise<{ stats: any; message: string }> {
    return apiClient.get('/jobs/stats')
  }
}

export const jobApi = new JobApi()
