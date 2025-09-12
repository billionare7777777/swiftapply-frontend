// Application service for managing application data and operations

import { applicationApi } from '../api/applicationApi'
import { Application, ApplicationStatus } from '../types'

export class ApplicationService {
  private applicationsCache: Application[] = []
  private lastFetchTime: number | null = null
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  async getApplications(forceRefresh: boolean = false): Promise<Application[]> {
    if (forceRefresh || this.shouldRefreshCache()) {
      await this.refreshApplications()
    }
    return this.applicationsCache
  }

  async createApplication(data: {
    job_id: string
    job_title: string
    company: string
    job_url: string
    resume_content?: string
    cover_letter?: string
    notes?: string
  }): Promise<{ success: boolean; application?: Application; message: string }> {
    try {
      const response = await applicationApi.createApplication(data)
      if (response.success) {
        await this.refreshApplications()
      }
      return response
    } catch (error) {
      console.error('Error creating application:', error)
      return { success: false, message: 'Failed to create application' }
    }
  }

  async updateApplication(id: string, data: Partial<Application>): Promise<{ success: boolean; message: string }> {
    try {
      const response = await applicationApi.updateApplication(id, data)
      if (response.success) {
        await this.refreshApplications()
      }
      return response
    } catch (error) {
      console.error('Error updating application:', error)
      return { success: false, message: 'Failed to update application' }
    }
  }

  async submitApplication(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await applicationApi.submitApplication(id)
      if (response.success) {
        await this.refreshApplications()
      }
      return response
    } catch (error) {
      console.error('Error submitting application:', error)
      return { success: false, message: 'Failed to submit application' }
    }
  }

  async updateApplicationStatus(
    id: string, 
    status: ApplicationStatus, 
    notes?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await applicationApi.updateApplicationStatus(id, status, notes)
      if (response.success) {
        await this.refreshApplications()
      }
      return response
    } catch (error) {
      console.error('Error updating application status:', error)
      return { success: false, message: 'Failed to update application status' }
    }
  }

  async getApplicationStats(): Promise<any> {
    try {
      const response = await applicationApi.getApplicationStats()
      return response.stats
    } catch (error) {
      console.error('Error getting application stats:', error)
      return null
    }
  }

  async getApplicationTemplates(): Promise<any[]> {
    try {
      const response = await applicationApi.getApplicationTemplates()
      return response.templates
    } catch (error) {
      console.error('Error getting application templates:', error)
      return []
    }
  }

  async bulkApplyToJobs(data: {
    jobs: any[]
    resume_content: string
    template_id?: string
  }): Promise<{ success: boolean; applications_created: number; message: string }> {
    try {
      const response = await applicationApi.bulkApplyToJobs(data)
      if (response.success) {
        await this.refreshApplications()
      }
      return response
    } catch (error) {
      console.error('Error bulk applying to jobs:', error)
      return { success: false, applications_created: 0, message: 'Failed to bulk apply to jobs' }
    }
  }

  async getApplicationsDueForFollowup(): Promise<Application[]> {
    try {
      const response = await applicationApi.getApplicationsDueForFollowup()
      return response.applications
    } catch (error) {
      console.error('Error getting applications due for follow-up:', error)
      return []
    }
  }

  private async refreshApplications(): Promise<void> {
    try {
      const response = await applicationApi.getAllApplications()
      this.applicationsCache = response.applications
      this.lastFetchTime = Date.now()
    } catch (error) {
      console.error('Error refreshing applications:', error)
      // Keep existing cache on error
    }
  }

  private shouldRefreshCache(): boolean {
    if (!this.lastFetchTime) return true
    return Date.now() - this.lastFetchTime > this.CACHE_DURATION
  }


}

export const applicationService = new ApplicationService()
