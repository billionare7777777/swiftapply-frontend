// Resume-related API endpoints

import { apiClient } from './client'
import { UserData, ResumeTemplate } from '../types'

export class ResumeApi {
  async generateResume(data: {
    name: string
    email: string
    summary: string
    skills: string[]
    experience: any[]
    education: any[]
    template?: string
    job_description?: string
  }): Promise<{
    success: boolean
    resume: string
    template: string
    generated_at: string
    ai_enhanced: boolean
    message: string
    error?: string
  }> {
    return apiClient.post('/resume/generate', data)
  }

  async getResumeTemplates(): Promise<{ templates: string[]; count: number }> {
    return apiClient.get('/resume/templates')
  }

  async analyzeJobDescription(jobDescription: string): Promise<{
    analysis: any
    message: string
  }> {
    return apiClient.post('/resume/analyze-job', { job_description: jobDescription })
  }
}

export const resumeApi = new ResumeApi()
