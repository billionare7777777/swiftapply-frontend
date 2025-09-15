/**
 * Enhanced Auto-Apply API service
 * Fast, automated job application functionality
 */

export interface ApplicationProgress {
  success: boolean
  status: 'processing' | 'completed' | 'error' | 'waiting_for_security_code'
  step: number
  total_steps: number
  current_action: string
  message: string
  start_time?: string
  error?: string
}

export interface ApplicationResult {
  success: boolean
  message: string
  application_data?: any
  progress?: ApplicationProgress
  error?: string
}

export interface UserApplication {
  id: number
  user_id: number
  job_id: number
  status: string
  applied_at: string
  job_title: string
  company_name: string
  job_type: string
  job_path: string
  resume_length: number
  cover_letter_length: number
}

export interface ApplicationsResponse {
  success: boolean
  applications: UserApplication[]
  total_count: number
  limit: number
  offset: number
  error?: string
}

class EnhancedAutoApplyApi {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://chemurgic-scalably-selena.ngrok-free.dev/api'

  async startApplication(userId: number, jobId: number): Promise<{ success: boolean; application_key?: string; message?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/enhanced-auto-apply/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          user_id: userId,
          job_id: jobId
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error starting enhanced auto-apply:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getApplicationStatus(applicationKey: string): Promise<{ success: boolean; status?: ApplicationProgress; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/enhanced-auto-apply/status/${applicationKey}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error getting application status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getUserApplications(userId: number, limit: number = 50, offset: number = 0): Promise<ApplicationsResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/enhanced-auto-apply/applications/${userId}?limit=${limit}&offset=${offset}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error getting user applications:', error)
      return {
        success: false,
        applications: [],
        total_count: 0,
        limit,
        offset,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getApplicationDetails(userId: number, jobId: number): Promise<{ success: boolean; application?: any; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/enhanced-auto-apply/application/${userId}/${jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error getting application details:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async cancelApplication(userId: number, jobId: number): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/enhanced-auto-apply/cancel/${userId}/${jobId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error cancelling application:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async submitSecurityCode(userId: number, jobId: number, securityCode: string): Promise<{ success: boolean; application_key?: string; message?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/enhanced-auto-apply/submit-security-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          user_id: userId,
          job_id: jobId,
          security_code: securityCode
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error submitting security code:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async testService(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/enhanced-auto-apply/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error testing enhanced auto-apply service:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async cleanupOldApplications(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/enhanced-auto-apply/cleanup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error cleaning up applications:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Export singleton instance
export const enhancedAutoApplyApi = new EnhancedAutoApplyApi()
