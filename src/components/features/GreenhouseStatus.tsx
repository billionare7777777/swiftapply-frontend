'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Loader2, RefreshCw } from 'lucide-react'
import { apiClient } from '../../api/client'
import { useAuth } from '../../context/AuthContext'

interface GreenhouseStatusData {
  is_registered: boolean
  message: string
  details: string
}

interface GreenhouseJobsData {
  jobs_count: number
  has_jobs: boolean
  last_scraped: string
}

export const GreenhouseStatus: React.FC = () => {
  const { user } = useAuth()
  const [emailStatus, setEmailStatus] = useState<GreenhouseStatusData | null>(null)
  const [jobsStatus, setJobsStatus] = useState<GreenhouseJobsData | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isScraping, setIsScraping] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.email) {
      checkGreenhouseStatus()
    }
  }, [user?.email])

  const checkGreenhouseStatus = async () => {
    try {
      setError('')
      
      // Check jobs status first
      const jobsResponse = await apiClient.get<{ success: boolean; jobs_count: number; has_jobs: boolean; last_scraped: string }>('/greenhouse/status')
      if (jobsResponse.success) {
        setJobsStatus({
          jobs_count: jobsResponse.jobs_count,
          has_jobs: jobsResponse.has_jobs,
          last_scraped: jobsResponse.last_scraped
        })
      }
    } catch (err) {
      console.error('Error checking Greenhouse status:', err)
      setError('Failed to check Greenhouse status')
    }
  }

  const verifyEmailOnGreenhouse = async () => {
    if (!user?.email) return

    setIsVerifying(true)
    setError('')

    try {
      const response = await apiClient.post<{ success: boolean; is_registered: boolean; message: string; details: string }>('/greenhouse/verify-email', {
        email: user.email
      })

      if (response.success) {
        setEmailStatus({
          is_registered: response.is_registered,
          message: response.message,
          details: response.details
        })
      } else {
        setError('Failed to verify email on Greenhouse')
      }
    } catch (err) {
      console.error('Error verifying email:', err)
      setError('Failed to verify email on Greenhouse')
    } finally {
      setIsVerifying(false)
    }
  }

  const scrapeJobs = async () => {
    setIsScraping(true)
    setError('')

    try {
      // Use the new progress tracking endpoint
      const response = await apiClient.post<{ success: boolean; session_id: string; message: string }>('/greenhouse/start-scraping', {
        email: user?.email,
        max_jobs: 1000
      })

      if (response.success) {
        // Set flag to auto-start progress tracking
        localStorage.setItem('autoStartScraping', 'true')
        // Refresh the page to show progress bar
        window.location.reload()
      } else {
        setError('Failed to start job scraping')
      }
    } catch (err) {
      console.error('Error starting scraping:', err)
      setError('Failed to start job scraping')
    } finally {
      setIsScraping(false)
    }
  }

  const loginAndScrape = async () => {
    if (!user?.email) return

    setIsScraping(true)
    setError('')

    try {
      // Use the new progress tracking endpoint for login and scrape
      const response = await apiClient.post<{ success: boolean; session_id: string; message: string }>('/greenhouse/start-scraping', {
        email: user.email,
        max_jobs: 1000
      })

      if (response.success) {
        // Set flag to auto-start progress tracking
        localStorage.setItem('autoStartScraping', 'true')
        // Refresh the page to show progress bar
        window.location.reload()
      } else {
        setError('Failed to start Greenhouse login and scraping')
      }
    } catch (err) {
      console.error('Error with Greenhouse login and scrape:', err)
      setError('Failed to login to Greenhouse and scrape jobs')
    } finally {
      setIsScraping(false)
    }
  }

  const getStatusIcon = () => {
    if (isVerifying) return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
    
    if (emailStatus) {
      return emailStatus.is_registered 
        ? <CheckCircle className="h-5 w-5 text-green-500" />
        : <XCircle className="h-5 w-5 text-red-500" />
    }
    
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />
  }

  const getStatusColor = () => {
    if (emailStatus) {
      return emailStatus.is_registered ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
    }
    return 'border-yellow-200 bg-yellow-50'
  }

  const getStatusText = () => {
    if (isVerifying) return 'Verifying email on Greenhouse...'
    if (emailStatus) {
      return emailStatus.is_registered 
        ? 'Email is registered on Greenhouse' 
        : 'Email is not registered on Greenhouse'
    }
    return 'Email verification status unknown'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Greenhouse Integration</h3>
        <button
          onClick={checkGreenhouseStatus}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Refresh status"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Email Verification Status */}
      <div className={`rounded-lg border p-4 mb-4 ${getStatusColor()}`}>
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div className="flex-1">
            <p className="font-medium text-gray-900">{getStatusText()}</p>
            {emailStatus && (
              <p className="text-sm text-gray-600 mt-1">{emailStatus.message}</p>
            )}
          </div>
          <button
            onClick={verifyEmailOnGreenhouse}
            disabled={isVerifying || !user?.email}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isVerifying ? 'Verifying...' : 'Verify Email'}
          </button>
        </div>
      </div>

      {/* Jobs Status */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Scraped Jobs</h4>
            <p className="text-sm text-gray-600">
              {jobsStatus ? `${jobsStatus.jobs_count} jobs in database` : 'Loading...'}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              💡 Jobs are automatically scraped when you log into SwiftApply.ai
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={scrapeJobs}
              disabled={isScraping || (jobsStatus?.has_jobs && jobsStatus.jobs_count > 0)}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isScraping ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Scraping...</span>
                </div>
              ) : (
                'Manual Scrape'
              )}
            </button>
            <button
              onClick={loginAndScrape}
              disabled={isScraping}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Auto Login & Scrape
            </button>
          </div>
        </div>
        {jobsStatus?.has_jobs && jobsStatus.jobs_count > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Jobs already scraped. Click refresh to check for updates.
          </p>
        )}
      </div>

      {/* Auto-Apply Status */}
      <div className={`rounded-lg border p-4 ${emailStatus?.is_registered ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <div className="flex items-center space-x-3">
          {emailStatus?.is_registered ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <div>
            <p className="font-medium text-gray-900">
              {emailStatus?.is_registered ? 'Auto-Apply Enabled' : 'Auto-Apply Disabled'}
            </p>
            <p className="text-sm text-gray-600">
              {emailStatus?.is_registered 
                ? 'You can use automatic job applications'
                : 'Register on Greenhouse to enable automatic job applications'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-4 text-xs text-gray-500">
        <p>
          <strong>Enhanced Integration:</strong> When you log into SwiftApply.ai, the system automatically logs into Greenhouse using your credentials and scrapes the latest job postings from <code>https://my.greenhouse.io/jobs</code>. 
          This ensures you always have the most up-to-date job listings available.
        </p>
        <p className="mt-2">
          <strong>Manual Options:</strong> You can also manually verify your email registration or scrape jobs using the buttons above.
        </p>
      </div>
    </div>
  )
}
