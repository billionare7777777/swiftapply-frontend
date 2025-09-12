// Resume service for managing resume generation and operations

import { resumeApi } from '../api/resumeApi'
import { UserData, ResumeTemplate } from '../types'

export class ResumeService {
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
    resume?: string
    template?: string
    generated_at?: string
    ai_enhanced?: boolean
    message: string
    error?: string
  }> {
    try {
      const response = await resumeApi.generateResume(data)
      return response
    } catch (error) {
      console.error('Error generating resume:', error)
      return {
        success: false,
        message: 'Failed to generate resume',
        error: 'Network error'
      }
    }
  }

  async getResumeTemplates(): Promise<string[]> {
    try {
      const response = await resumeApi.getResumeTemplates()
      return response.templates
    } catch (error) {
      console.error('Error getting resume templates:', error)
      return []
    }
  }

  async analyzeJobDescription(jobDescription: string): Promise<{
    success: boolean
    analysis?: any
    message: string
  }> {
    try {
      const response = await resumeApi.analyzeJobDescription(jobDescription)
      return {
        success: true,
        analysis: response.analysis,
        message: response.message
      }
    } catch (error) {
      console.error('Error analyzing job description:', error)
      return {
        success: false,
        message: 'Failed to analyze job description'
      }
    }
  }

  validateUserData(data: UserData): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!data.name?.trim()) {
      errors.push('Name is required')
    }

    if (!data.email?.trim()) {
      errors.push('Email is required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Valid email is required')
    }

    if (!data.summary?.trim()) {
      errors.push('Professional summary is required')
    }

    if (!data.skills || data.skills.length === 0) {
      errors.push('At least one skill is required')
    }

    if (!data.experience || data.experience.length === 0) {
      errors.push('At least one work experience is required')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  formatResumeForDownload(resume: string, filename: string = 'resume.txt'): void {
    const blob = new Blob([resume], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

export const resumeService = new ResumeService()
