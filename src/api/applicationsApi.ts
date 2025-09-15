/**
 * API service for job applications
 */

export interface JobApplication {
  id: number
  user_id: number
  job_id: number
  application_status: string
  applied_at: string
  job_description: string
  resume: string
  cover_letter: string
  created_at: string
  updated_at: string
  job_title: string
  company_name: string
  job_type: string
  job_path: string
  budget_cost: number | null
  job_creation_time: string
}

export interface ApplicationsResponse {
  success: boolean
  applications: JobApplication[]
  count: number
  total_count: number
  error?: string
}

class ApplicationsApi {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  async getApplications(userId: number, limit: number = 50, offset: number = 0): Promise<ApplicationsResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/applications?user_id=${userId}&limit=${limit}&offset=${offset}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching applications:', error)
      return {
        success: false,
        applications: [],
        count: 0,
        total_count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getApplicationById(applicationId: number): Promise<{ success: boolean; application?: JobApplication; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/applications/${applicationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching application:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async updateApplicationStatus(applicationId: number, status: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error updating application status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

export const applicationsApi = new ApplicationsApi()
