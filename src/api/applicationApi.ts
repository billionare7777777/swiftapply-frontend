// Application API service for job applications

import { apiClient } from './client'
import { 
  JobApplicationRequest, 
  JobApplicationResponse, 
  Application, 
  ApplicationProgress,
  UserProfile 
} from '../types'

export const applicationApi = {
  // Create a new application
  async createApplication(data: {
    job_id: string
    job_title: string
    company: string
    job_url: string
    resume_content?: string
    cover_letter?: string
    notes?: string
  }): Promise<{ success: boolean; application?: Application; message: string }> {
    const response = await apiClient.post<{ success: boolean; application?: Application; message: string }>('/applications', data)
    return response
  },

  // Auto submit job application with GPT-generated responses
  async autoSubmitApplication(jobId: string, userData: UserProfile): Promise<JobApplicationResponse> {
    const response = await apiClient.post<JobApplicationResponse>('/applications/auto-submit', {
      job_id: jobId,
      user_data: userData
    })
    return response
  },

  // Manual submit job application (opens job URL)
  async manualSubmitApplication(jobId: string, userData: UserProfile): Promise<JobApplicationResponse> {
    const response = await apiClient.post<JobApplicationResponse>('/applications/manual-submit', {
      
      job_id: jobId,
      user_data: userData
    })
    return response
  },

  // Get application progress
  async getApplicationProgress(applicationId: string): Promise<{ success: boolean; progress: ApplicationProgress }> {
    const response = await apiClient.get<{ success: boolean; progress: ApplicationProgress }>(`/applications/progress/${applicationId}`)
    return response
  },

  // Get application details
  async getApplication(applicationId: string): Promise<{ success: boolean; application: Application }> {
    const response = await apiClient.get<{ success: boolean; application: Application }>(`/applications/${applicationId}`)
    return response
  },

  // Get all applications for user
  async getUserApplications(userId: number, limit: number = 50, offset: number = 0): Promise<{
    success: boolean
    applications: Application[]
    count: number
    total_count: number
  }> {
    const response = await apiClient.get<{
      success: boolean
      applications: Application[]
      count: number
      total_count: number
    }>(`/applications?user_id=${userId}&limit=${limit}&offset=${offset}`)
    return response
  },

  // Update application status
  async updateApplicationStatus(applicationId: string, status: string, notes?: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.patch<{ success: boolean; message: string }>(`/applications/${applicationId}/status`, {
      status,
      ...(notes && { notes })
    })
    return response
  },

  // Update application
  async updateApplication(id: string, data: Partial<Application>): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put<{ success: boolean; message: string }>(`/applications/${id}`, data)
    return response
  },

  // Submit application
  async submitApplication(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(`/applications/${id}/submit`)
    return response
  },

  // Get application statistics
  async getApplicationStats(): Promise<{ success: boolean; stats: any }> {
    const response = await apiClient.get<{ success: boolean; stats: any }>('/applications/stats')
    return response
  },

  // Get application templates
  async getApplicationTemplates(): Promise<{ success: boolean; templates: any[] }> {
    const response = await apiClient.get<{ success: boolean; templates: any[] }>('/applications/templates')
    return response
  },

  // Bulk apply to jobs
  async bulkApplyToJobs(data: {
    jobs: any[]
    resume_content: string
    template_id?: string
  }): Promise<{ success: boolean; applications_created: number; message: string }> {
    const response = await apiClient.post<{ success: boolean; applications_created: number; message: string }>('/applications/bulk-apply', data)
    return response
  },

  // Get applications due for follow-up
  async getApplicationsDueForFollowup(): Promise<{ success: boolean; applications: Application[] }> {
    const response = await apiClient.get<{ success: boolean; applications: Application[] }>('/applications/due-for-followup')
    return response
  },

  // Get all applications
  async getAllApplications(): Promise<{ success: boolean; applications: Application[] }> {
    const response = await apiClient.get<{ success: boolean; applications: Application[] }>('/applications')
    return response
  },

  // Delete application
  async deleteApplication(applicationId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(`/applications/${applicationId}`)
    return response
  }
}

export default applicationApi