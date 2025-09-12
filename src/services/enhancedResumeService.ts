import { Resume, UserData, Job } from '../components/features/StepByStepResumeGenerator'

export class EnhancedResumeService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://locust-one-mutt.ngrok-free.app/api'
  
  // Helper method to construct API URLs correctly
  private getApiUrl(endpoint: string): string {
    const base = this.baseUrl.endsWith('/api') ? this.baseUrl : `${this.baseUrl}/api`
    return `${base}${endpoint}`
  }

  private getUserId(): string {
    try {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user).id.toString() : 'default_user'
    } catch (error) {
      console.error('Error getting user ID:', error)
      return 'default_user'
    }
  }

  async getUserResumes(): Promise<Resume[]> {
    try {
      const response = await fetch(this.getApiUrl('/resumes/user'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': this.getUserId()
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch resumes')
      }

      const data = await response.json()
      return data.resumes || []
    } catch (error) {
      console.error('Error fetching resumes:', error)
      return []
    }
  }

  async getResumeForEdit(resumeId: string): Promise<any> {
    try {
      const response = await fetch(this.getApiUrl(`/resumes/${resumeId}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': this.getUserId()
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch resume for editing')
      }

      const data = await response.json()
      return data.resume || null
    } catch (error) {
      console.error('Error fetching resume for editing:', error)
      return null
    }
  }

  async getUserData(): Promise<UserData | null> {
    try {
      const response = await fetch(this.getApiUrl('/user/profile'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': this.getUserId()
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const data = await response.json()
      return data.user || null
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  async getAvailableJobs(): Promise<Job[]> {
    try {
      const response = await fetch(this.getApiUrl('/jobs/available'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch jobs')
      }

      const data = await response.json()
      return data.jobs || []
    } catch (error) {
      console.error('Error fetching jobs:', error)
      return []
    }
  }

  async uploadResume(file: File): Promise<Resume> {
    try {
      const formData = new FormData()
      formData.append('resume', file)

      const response = await fetch(this.getApiUrl('/resumes/upload'), {
        method: 'POST',
        headers: {
          'X-User-ID': this.getUserId()
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload resume')
      }

      const data = await response.json()
      return data.resume
    } catch (error) {
      console.error('Error uploading resume:', error)
      throw error
    }
  }

  async generateResumeVariants(userData: UserData, template: string, jobDescription?: string): Promise<Resume[]> {
    try {
      const response = await fetch(this.getApiUrl('/resumes/generate-variants'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': this.getUserId()
        },
        body: JSON.stringify({
          userData,
          template,
          jobDescription
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate resume variants')
      }

      const data = await response.json()
      return data.variants || []
    } catch (error) {
      console.error('Error generating resume variants:', error)
      throw error
    }
  }

  async saveResume(resume: Resume): Promise<void> {
    try {
      // Ensure required fields are present
      const resumeData = {
        ...resume,
        user_id: resume.user_id || this.getUserId(),
        first_name: resume.first_name || 'Unknown',
        last_name: resume.last_name || 'User',
        title: resume.title || 'Resume'
      }

      // For new resumes (those with temporary IDs), don't send the ID
      // This forces the backend to create a new resume instead of trying to update
      if (resumeData.id && resumeData.id.startsWith('resume_')) {
        delete resumeData.id
      }

      const response = await fetch(this.getApiUrl('/resumes/save'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': this.getUserId()
        },
        body: JSON.stringify({ resume: resumeData })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Save resume error response:', errorText)
        throw new Error(`Failed to save resume: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error saving resume:', error)
      throw error
    }
  }

  async deleteResume(resumeId: string): Promise<void> {
    try {
      const response = await fetch(this.getApiUrl(`/resumes/${resumeId}`), {
        method: 'DELETE',
        headers: {
          'X-User-ID': this.getUserId()
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete resume')
      }
    } catch (error) {
      console.error('Error deleting resume:', error)
      throw error
    }
  }

  async analyzeJob(jobId: string): Promise<any> {
    try {
      const response = await fetch(this.getApiUrl(`/jobs/${jobId}/analyze`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to analyze job')
      }

      const data = await response.json()
      return data.analysis
    } catch (error) {
      console.error('Error analyzing job:', error)
      throw error
    }
  }

  async clearSampleResumes(): Promise<void> {
    try {
      const response = await fetch(this.getApiUrl('/resumes/clear-samples'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': this.getUserId()
        }
      })

      if (!response.ok) {
        throw new Error('Failed to clear sample resumes')
      }

      const data = await response.json()
      console.log(`Cleared ${data.deleted_count} sample resumes from database`)
    } catch (error) {
      console.error('Error clearing sample resumes:', error)
      throw error
    }
  }

}
