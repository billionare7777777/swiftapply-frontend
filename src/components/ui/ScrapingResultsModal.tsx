'use client'

import React, { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Clock, Database, ExternalLink, Eye, EyeOff } from 'lucide-react'
import { ProgressBar, ProgressStep } from './ProgressBar'

interface ScrapingResultsModalProps {
  isOpen: boolean
  onClose: () => void
  sessionId?: string
  results?: {
    jobsScraped: number
    totalJobs: number
    status: string
    message: string
    screenshotsTaken: string[]
    credentialsUsed: any
    userCredentials: any
    emailNotRegistered?: boolean
  }
}

interface JobData {
  id: number
  job_id: string
  title: string
  company_name: string
  company_avatar_path?: string
  job_type?: string
  budget_cost?: number
  job_path?: string
  creation_time: string
  scraped_time: string
  is_active: boolean
}

export const ScrapingResultsModal: React.FC<ScrapingResultsModalProps> = ({
  isOpen,
  onClose,
  sessionId,
  results
}) => {
  const [jobs, setJobs] = useState<JobData[]>([])
  const [loading, setLoading] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)
  const [activeTab, setActiveTab] = useState<'progress' | 'jobs' | 'screenshots'>('progress')

  // Fetch jobs when modal opens
  useEffect(() => {
    if (isOpen && results?.jobsScraped && results.jobsScraped > 0) {
      fetchJobs()
    }
  }, [isOpen, results?.jobsScraped])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://locust-one-mutt.ngrok-free.app/api'
      const jobsApiUrl = baseUrl.endsWith('/api') ? `${baseUrl}/jobs?limit=50` : `${baseUrl}/api/jobs?limit=50`
      const response = await fetch(jobsApiUrl)
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs || [])
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = () => {
    if (results?.emailNotRegistered) {
      return <AlertCircle className="h-6 w-6 text-yellow-500" />
    }
    if (results?.status === 'completed') {
      return <CheckCircle className="h-6 w-6 text-green-500" />
    }
    if (results?.status === 'error') {
      return <AlertCircle className="h-6 w-6 text-red-500" />
    }
    return <Clock className="h-6 w-6 text-blue-500" />
  }

  const getStatusColor = () => {
    if (results?.emailNotRegistered) {
      return 'text-yellow-600'
    }
    if (results?.status === 'completed') {
      return 'text-green-600'
    }
    if (results?.status === 'error') {
      return 'text-red-600'
    }
    return 'text-blue-600'
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Not specified'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Greenhouse Job Scraping Results
              </h2>
              <p className={`text-sm ${getStatusColor()}`}>
                {results?.message || 'Processing...'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('progress')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'progress'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Progress & Details
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'jobs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Scraped Jobs ({results?.jobsScraped || 0})
            </button>
            <button
              onClick={() => setActiveTab('screenshots')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'screenshots'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Screenshots ({results?.screenshotsTaken?.length || 0})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'progress' && (
            <div className="space-y-6">
              {/* Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Jobs Scraped</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {results?.jobsScraped || 0}
                  </p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Status</span>
                  </div>
                  <p className="text-lg font-semibold text-green-600 mt-1 capitalize">
                    {results?.status || 'Processing'}
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-900">Session ID</span>
                  </div>
                  <p className="text-sm font-mono text-emerald-600 mt-1">
                    {sessionId || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Email Not Registered Warning */}
              {results?.emailNotRegistered && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-900">
                        Email Not Registered with Greenhouse
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Your email address is not registered with Greenhouse. Please create an account first.
                      </p>
                      <a
                        href="https://app.greenhouse.io/users/sign_up"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-yellow-800 hover:text-yellow-900 mt-2"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Sign up for Greenhouse
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Credentials Used */}
              {(results?.credentialsUsed || results?.userCredentials) && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900">
                      🔐 Credentials Used for Login
                    </h4>
                    <button
                      onClick={() => setShowCredentials(!showCredentials)}
                      className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                    >
                      {showCredentials ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                      {showCredentials ? 'Hide' : 'Show'} Details
                    </button>
                  </div>
                  
                  {showCredentials && (
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Email:</span>
                        <span className="ml-2 text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                          {results?.userCredentials?.email || results?.credentialsUsed?.email}
                        </span>
                      </div>
                      {results?.userCredentials?.verification_code && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Verification Code:</span>
                          <span className="ml-2 text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                            {results.userCredentials.verification_code}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading jobs...</p>
                </div>
              ) : jobs.length > 0 ? (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {job.company_avatar_path && (
                              <img
                                src={job.company_avatar_path}
                                alt={`${job.company_name} logo`}
                                className="h-8 w-8 rounded-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            )}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                              <p className="text-sm text-gray-600">{job.company_name}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Type:</span>
                              <span className="ml-1 text-gray-600">{job.job_type || 'Not specified'}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Budget:</span>
                              <span className="ml-1 text-gray-600">{formatCurrency(job.budget_cost)}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Scraped:</span>
                              <span className="ml-1 text-gray-600">{formatDate(job.scraped_time)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {job.job_path && (
                          <a
                            href={job.job_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4 text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No jobs found in database</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Jobs will appear here after successful scraping
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'screenshots' && (
            <div className="space-y-4">
              {results?.screenshotsTaken && results.screenshotsTaken.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.screenshotsTaken.map((screenshot, index) => {
                    const filename = screenshot.split('/').pop() || screenshot
                    const stepName = filename.split('_')[0] + '_' + filename.split('_')[1]
                    return (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">{stepName}</div>
                        <div className="text-xs text-gray-500 font-mono break-all mb-2">{filename}</div>
                        <div className="text-xs text-blue-600">
                          📁 {screenshot}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No screenshots captured</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Screenshots will appear here during the scraping process
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {results?.jobsScraped && results.jobsScraped > 0 && (
              <span>✅ {results.jobsScraped} jobs successfully scraped and stored</span>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
            {results?.jobsScraped && results.jobsScraped > 0 && (
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScrapingResultsModal
