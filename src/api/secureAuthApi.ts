/**
 * Secure Authentication API Client
 * Handles secure Greenhouse credential storage and job scraping
 */

import { apiClient } from './client'

export interface UserConsent {
  greenhouse_access_consent: boolean
  consent_timestamp: string
}

export interface SecureLoginRequest {
  email: string
  password: string
  user_consent: UserConsent
}

export interface SecureLoginResponse {
  success: boolean
  message: string
  session_id?: string
  expires_in_minutes?: number
  error?: string
}

export interface SecureScrapeRequest {
  session_id: string
}

export interface SecureScrapeResponse {
  success: boolean
  message: string
  jobs_scraped?: number
  jobs_stored?: number
  screenshots_taken?: string[]
  credentials_cleared?: boolean
  error?: string
  error_details?: string
}

export interface SessionInfo {
  exists: boolean
  email?: string
  created_at?: string
  expires_at?: string
  time_until_expiry?: string
  user_consent?: boolean
  consent_timestamp?: string
  error?: string
}

export interface SessionStatusResponse {
  success: boolean
  session_info?: SessionInfo
  error?: string
}

export interface ActiveSessionsResponse {
  success: boolean
  active_sessions: number
  max_sessions: number
  error?: string
}

export const secureAuthApi = {
  /**
   * Securely store Greenhouse credentials in memory
   */
  async storeCredentials(request: SecureLoginRequest): Promise<SecureLoginResponse> {
    const response = await apiClient.post<SecureLoginResponse>('/greenhouse/secure-login', request)
    return response
  },

  /**
   * Login to Greenhouse and scrape jobs using secure credentials
   */
  async scrapeJobs(request: SecureScrapeRequest): Promise<SecureScrapeResponse> {
    const response = await apiClient.post<SecureScrapeResponse>('/greenhouse/secure-scrape', request)
    return response
  },

  /**
   * Get session status without exposing credentials
   */
  async getSessionStatus(sessionId: string): Promise<SessionStatusResponse> {
    const response = await apiClient.get<SessionStatusResponse>(`/greenhouse/session-status/${sessionId}`)
    return response
  },

  /**
   * Immediately clear credentials from memory
   */
  async clearSession(sessionId: string): Promise<{ success: boolean; message: string; error?: string }> {
    const response = await apiClient.post<{ success: boolean; message: string; error?: string }>(`/greenhouse/clear-session/${sessionId}`)
    return response
  },

  /**
   * Get count of active sessions (for monitoring)
   */
  async getActiveSessions(): Promise<ActiveSessionsResponse> {
    const response = await apiClient.get<ActiveSessionsResponse>('/greenhouse/active-sessions')
    return response
  },

  /**
   * Complete secure login flow: store credentials and scrape jobs
   */
  async completeSecureLogin(
    email: string, 
    password: string, 
    userConsent: boolean
  ): Promise<{
    success: boolean
    message: string
    sessionId?: string
    jobsScraped?: number
    jobsStored?: number
    screenshotsTaken?: string[]
    credentialsCleared?: boolean
    error?: string
    errorDetails?: string
  }> {
    try {
      // Step 1: Store credentials securely
      const consentData: UserConsent = {
        greenhouse_access_consent: userConsent,
        consent_timestamp: new Date().toISOString()
      }

      const loginResponse = await this.storeCredentials({
        email,
        password,
        user_consent: consentData
      })

      if (!loginResponse.success) {
        return {
          success: false,
          message: loginResponse.error || 'Failed to store credentials securely'
        }
      }

      // Step 2: Scrape jobs with secure credentials
      const scrapeResponse = await this.scrapeJobs({
        session_id: loginResponse.session_id!
      })

      return {
        success: scrapeResponse.success,
        message: scrapeResponse.message,
        sessionId: loginResponse.session_id,
        jobsScraped: scrapeResponse.jobs_scraped,
        jobsStored: scrapeResponse.jobs_stored,
        screenshotsTaken: scrapeResponse.screenshots_taken,
        credentialsCleared: scrapeResponse.credentials_cleared,
        error: scrapeResponse.error,
        errorDetails: scrapeResponse.error_details
      }
    } catch (error: any) {
      console.error('Complete secure login error:', error)
      return {
        success: false,
        message: error.response?.data?.error || 'An unexpected error occurred',
        errorDetails: error.response?.data?.error_details || error.message
      }
    }
  }
}

export default secureAuthApi
