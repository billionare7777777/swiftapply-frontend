'use client'

import React, { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff, Shield, AlertCircle, CheckCircle, Clock, User, Key } from 'lucide-react'
import { apiClient } from '../../api/client'

interface SecureLoginState {
  step: 'form' | 'processing' | 'success' | 'error'
  sessionId?: string
  message?: string
  errorDetails?: string
  jobsScraped?: number
  jobsStored?: number
  screenshotsTaken?: string[]
  credentialsCleared?: boolean
}

interface UserConsent {
  greenhouse_access_consent: boolean
  consent_timestamp: string
}

export const SecureGreenhouseLogin: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [userConsent, setUserConsent] = useState(false)
  const [loginState, setLoginState] = useState<SecureLoginState>({ step: 'form' })
  const [isHttps, setIsHttps] = useState(false)
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null)

  // Check if we're on HTTPS
  useEffect(() => {
    setIsHttps(window.location.protocol === 'https:')
  }, [])

  // Auto-clear session after expiry
  useEffect(() => {
    if (sessionExpiry && loginState.step === 'processing') {
      const timer = setTimeout(() => {
        setLoginState({ step: 'error', message: 'Session expired. Please try again.' })
      }, sessionExpiry.getTime() - Date.now())

      return () => clearTimeout(timer)
    }
  }, [sessionExpiry, loginState.step])

  const handleSecureLogin = async () => {
    if (!isHttps) {
      setLoginState({
        step: 'error',
        message: 'HTTPS is required for secure credential handling',
        errorDetails: 'Please access this application over HTTPS to ensure your credentials are protected.'
      })
      return
    }

    if (!email || !password) {
      setLoginState({
        step: 'error',
        message: 'Email and password are required'
      })
      return
    }

    if (!userConsent) {
      setLoginState({
        step: 'error',
        message: 'You must agree to allow ASAP to access your Greenhouse jobs'
      })
      return
    }

    setLoginState({ step: 'processing' })

    try {
      // Step 1: Store credentials securely
      const consentData: UserConsent = {
        greenhouse_access_consent: userConsent,
        consent_timestamp: new Date().toISOString()
      }

      const loginResponse = await apiClient.post('/api/greenhouse/secure-login', {
        email,
        password,
        user_consent: consentData
      })

      if (!(loginResponse as any).data.success) {
        setLoginState({
          step: 'error',
          message: (loginResponse as any).data.error || 'Failed to store credentials securely'
        })
        return
      }

      const sessionId = (loginResponse as any).data.session_id
      setSessionExpiry(new Date(Date.now() + 30 * 60 * 1000)) // 30 minutes

      // Step 2: Start scraping with secure credentials
      const scrapeResponse = await apiClient.post('/api/greenhouse/secure-scrape', {
        session_id: sessionId
      })

      if ((scrapeResponse as any).data.success) {
        setLoginState({
          step: 'success',
          sessionId,
          message: (scrapeResponse as any).data.message,
          jobsScraped: (scrapeResponse as any).data.jobs_scraped,
          jobsStored: (scrapeResponse as any).data.jobs_stored,
          screenshotsTaken: (scrapeResponse as any).data.screenshots_taken,
          credentialsCleared: (scrapeResponse as any).data.credentials_cleared
        })
      } else {
        setLoginState({
          step: 'error',
          sessionId,
          message: (scrapeResponse as any).data.error || 'Failed to scrape jobs',
          errorDetails: (scrapeResponse as any).data.error_details,
          screenshotsTaken: (scrapeResponse as any).data.screenshots_taken,
          credentialsCleared: (scrapeResponse as any).data.credentials_cleared
        })
      }
    } catch (error: any) {
      console.error('Secure login error:', error)
      setLoginState({
        step: 'error',
        message: error.response?.data?.error || 'An unexpected error occurred',
        errorDetails: error.response?.data?.error_details || error.message
      })
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setUserConsent(false)
    setLoginState({ step: 'form' })
    setSessionExpiry(null)
  }

  const clearSession = async () => {
    if (loginState.sessionId) {
      try {
        await apiClient.post(`/api/greenhouse/clear-session/${loginState.sessionId}`)
      } catch (error) {
        console.error('Error clearing session:', error)
      }
    }
    resetForm()
  }

  if (!isHttps) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-900">HTTPS Required</h3>
            <p className="text-sm text-red-600">Secure connection required for credential handling</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">
            This application requires HTTPS to ensure your Greenhouse credentials are protected. 
            Please access this page over a secure connection (https://) to continue.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Secure Credential Handling</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your Greenhouse credentials are stored securely in memory only and automatically expire after 30 minutes. 
              They are never saved to disk or logged. All communication uses HTTPS encryption.
            </p>
          </div>
        </div>
      </div>

      {/* Login Form */}
      {loginState.step === 'form' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Lock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Secure Greenhouse Login</h3>
              <p className="text-sm text-gray-600">Enter your Greenhouse credentials to scrape jobs</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Greenhouse Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="your.email@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Greenhouse Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* User Consent */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="consent"
                  checked={userConsent}
                  onChange={(e) => setUserConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="consent" className="text-sm text-gray-700">
                  <strong>I consent to allow ASAP to access my Greenhouse jobs.</strong>
                  <br />
                  <span className="text-gray-600">
                    By checking this box, you authorize ASAP to log into your Greenhouse account 
                    and scrape job listings for the purpose of job application automation. 
                    Your credentials will be used only for this session and will not be stored permanently.
                  </span>
                </label>
              </div>
            </div>

            <button
              onClick={handleSecureLogin}
              disabled={!email || !password || !userConsent}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <div className="flex items-center justify-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Login Securely & Scrape Jobs</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Processing State */}
      {loginState.step === 'processing' && (
        <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Processing Secure Login</h3>
              <p className="text-sm text-blue-600">Logging into Greenhouse and scraping jobs...</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Credentials stored securely in memory</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Logging into Greenhouse...</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-400">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span>Scraping job listings...</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-400">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span>Storing jobs in database...</span>
            </div>
          </div>

          {sessionExpiry && (
            <div className="mt-4 text-xs text-gray-500">
              Session expires at: {sessionExpiry.toLocaleTimeString()}
            </div>
          )}
        </div>
      )}

      {/* Success State */}
      {loginState.step === 'success' && (
        <div className="bg-white rounded-lg shadow-sm border border-green-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900">Login Successful!</h3>
              <p className="text-sm text-green-600">{loginState.message}</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-green-800">Jobs Scraped:</span>
                <span className="ml-2 text-green-700">{loginState.jobsScraped || 0}</span>
              </div>
              <div>
                <span className="font-medium text-green-800">Jobs Stored:</span>
                <span className="ml-2 text-green-700">{loginState.jobsStored || 0}</span>
              </div>
              <div>
                <span className="font-medium text-green-800">Credentials Cleared:</span>
                <span className="ml-2 text-green-700">
                  {loginState.credentialsCleared ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span className="font-medium text-green-800">Screenshots:</span>
                <span className="ml-2 text-green-700">
                  {loginState.screenshotsTaken?.length || 0} taken
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={resetForm}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Scrape More Jobs
            </button>
            <button
              onClick={clearSession}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear Session
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {loginState.step === 'error' && (
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900">Login Failed</h3>
              <p className="text-sm text-red-600">{loginState.message}</p>
            </div>
          </div>

          {loginState.errorDetails && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">{loginState.errorDetails}</p>
            </div>
          )}

          {loginState.screenshotsTaken && loginState.screenshotsTaken.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Debug Screenshots:</h4>
              <p className="text-sm text-gray-600">
                {loginState.screenshotsTaken.length} screenshots were taken for debugging purposes.
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={resetForm}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            {loginState.sessionId && (
              <button
                onClick={clearSession}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Session
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SecureGreenhouseLogin
