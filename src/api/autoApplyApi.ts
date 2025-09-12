import { apiClient } from './client'

export interface AutoApplyProgress {
  user_id: number
  job_id: number
  status: 'running' | 'completed' | 'error' | 'cancelled'
  current_step: number
  total_steps: number
  progress_percentage: number
  steps_completed: Array<{
    step: number
    title: string
    status: string
    completed_at: string
    [key: string]: any
  }>
  error?: string
  started_at: string
  completed_at?: string
  failed_at?: string
  cancelled_at?: string
}

export interface AutoApplyResponse {
  success: boolean
  data?: {
    session_key?: string
    progress?: AutoApplyProgress
  } | AutoApplyProgress  // Backend returns progress data directly in data field
  message?: string
  session_key?: string
  progress?: AutoApplyProgress
  error?: string
}

export interface AutoApplyHistoryItem {
  id: number
  job_id: number
  job_title: string
  company_name: string
  job_path: string
  status: string
  applied_at: string
  notes: any
}

export const autoApplyApi = {
  /**
   * Start the auto-apply process for a job
   */
  startAutoApply: async (userId: number, jobId: number): Promise<AutoApplyResponse> => {
    try {
      const response = await apiClient.post('/auto-apply/start', {
        user_id: userId,
        job_id: jobId
      })
      return response as AutoApplyResponse
    } catch (error: any) {
      console.error('Error starting auto-apply:', error)
      throw new Error(error.response?.data?.error || 'Failed to start auto-apply process')
    }
  },

  /**
   * Get the current progress of an auto-apply session
   */
  getProgress: async (sessionKey: string): Promise<AutoApplyResponse> => {
    try {
      const response = await apiClient.get(`/auto-apply/progress/${sessionKey}`)
      return response as AutoApplyResponse
    } catch (error: any) {
      console.error('Error getting auto-apply progress:', error)
      throw new Error(error.response?.data?.error || 'Failed to get auto-apply progress')
    }
  },

  /**
   * Cancel an active auto-apply session
   */
  cancelAutoApply: async (sessionKey: string): Promise<AutoApplyResponse> => {
    try {
      const response = await apiClient.post(`/auto-apply/cancel/${sessionKey}`)
      return response as AutoApplyResponse
    } catch (error: any) {
      console.error('Error cancelling auto-apply:', error)
      throw new Error(error.response?.data?.error || 'Failed to cancel auto-apply process')
    }
  },

  /**
   * Get the auto-apply history for a user
   */
  getHistory: async (userId: number): Promise<{ success: boolean; applications: AutoApplyHistoryItem[]; error?: string }> => {
    try {
      const response = await apiClient.get(`/auto-apply/history/${userId}`)
      return response as { success: boolean; applications: AutoApplyHistoryItem[]; error?: string }
    } catch (error: any) {
      console.error('Error getting auto-apply history:', error)
      throw new Error(error.response?.data?.error || 'Failed to get auto-apply history')
    }
  },

  /**
   * Clean up completed or failed sessions
   */
  cleanupSessions: async (): Promise<{ success: boolean; cleaned_sessions: number; active_sessions: number; error?: string }> => {
    try {
      const response = await apiClient.post('/auto-apply/cleanup')
      return response as { success: boolean; cleaned_sessions: number; active_sessions: number; error?: string }
    } catch (error: any) {
      console.error('Error cleaning up sessions:', error)
      throw new Error(error.response?.data?.error || 'Failed to cleanup sessions')
    }
  }
}

