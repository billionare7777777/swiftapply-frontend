'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Database, ExternalLink, Building2, MapPin, DollarSign, Calendar, Filter, Search, RefreshCw, Download, Upload, Shield, Bot, Hand, User, Settings } from 'lucide-react'
import { apiClient } from '../../api/client'
import { jobApi } from '../../api/jobApi'
import { applicationApi } from '../../api/applicationApi'
import { DatabaseJob, UserProfile, ApplicationProgress } from '../../types'
// import SecureGreenhouseLogin from './SecureGreenhouseLogin'
import JobCard from '../ui/JobCard'
import ApplicationProgressModal from '../ui/ApplicationProgressModal'
import UserProfileModal from '../ui/UserProfileModal'

interface JobStatistics {
  total_jobs: number
  recent_jobs: number
  top_companies: Array<{ name: string; count: number }>
  job_types: Array<{ type: string; count: number }>
}
 
export const ScrapedJobsDisplay: React.FC = () => {
  const [jobs, setJobs] = useState<DatabaseJob[]>([])
  const [statistics, setStatistics] = useState<JobStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [scraping, setScraping] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCompany, setFilterCompany] = useState('')
  const [filterType, setFilterType] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [showSecureLogin, setShowSecureLogin] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [applicationProgress, setApplicationProgress] = useState<ApplicationProgress | null>(null)
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null)

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchJobs(true) // Silent refresh
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchJobs()
    fetchStatistics()
    loadUserProfile()
  }, [])

  const loadUserProfile = useCallback(() => {
    // Load user profile from localStorage or API
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    } else {
      // Set default profile
      setUserProfile({
        name: 'Your Name',
        email: 'your.email@example.com',
        phone: '',
        location: '',
        linkedin_url: '',
        portfolio_url: '',
        summary: 'Experienced professional with strong skills in technology and problem-solving.',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
        experience: [
          {
            company: 'Previous Company',
            position: 'Software Developer',
            duration: '2020-2023',
            description: 'Developed web applications and managed database systems.'
          }
        ],
        education: [
          {
            institution: 'University Name',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            year: '2020'
          }
        ],
        certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
        languages: ['English', 'Spanish']
      })
    }
  }, [])

  const saveUserProfile = useCallback((profile: UserProfile) => {
    setUserProfile(profile)
    localStorage.setItem('userProfile', JSON.stringify(profile))
  }, [])

  const handleAutoSubmit = useCallback(async (job: DatabaseJob) => {
    if (!userProfile) {
      setShowUserProfile(true)
      return
    }

    try {
      console.log('🚀 Starting auto submit for job:', job.title)
      console.log('Job ID:', job.job_id)
      console.log('User profile:', userProfile)
      
      const response = await applicationApi.autoSubmitApplication(job.job_id, userProfile)
      
      if (response.success) {
        console.log('✅ Auto submit response:', response)
        setCurrentApplicationId(response.application_id || null)
        setShowProgressModal(true)
        
        // Start polling for progress
        if (response.application_id) {
          pollApplicationProgress(response.application_id)
        }
      } else {
        console.error('❌ Auto submit failed:', response.error)
        alert(`Auto submit failed: ${response.error}`)
      }
    } catch (error) {
      console.error('❌ Auto submit error:', error)
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      
      // More specific error messages
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      if (errorMessage.includes('Failed to fetch')) {
        alert('❌ Cannot connect to the server. Please make sure the backend is running on https://locust-one-mutt.ngrok-free.app')
      } else if (errorMessage.includes('CORS')) {
        alert('❌ CORS error. Please check server configuration.')
      } else {
        alert(`Auto submit error: ${errorMessage}`)
      }
    }
  }, [userProfile])

  const handleManualSubmit = useCallback(async (job: DatabaseJob) => {
    if (!userProfile) {
      setShowUserProfile(true)
      return
    }

    try {
      console.log('🖱️ Starting manual submit for job:', job.title)
      const response = await applicationApi.manualSubmitApplication(job.job_id, userProfile)
      
      if (response.success && response.job_url) {
        console.log('✅ Manual submit response:', response)
        console.log('🌐 Opening job URL:', response.job_url)
        
        // Open job URL in new tab
        const newWindow = window.open(response.job_url, '_blank', 'noopener,noreferrer')
        
        if (newWindow) {
          // Show success message
          alert(`✅ Job application page opened!\n\nJob: ${job.title}\nCompany: ${job.company_name}\n\nComplete your application in the new tab.`)
        } else {
          alert('❌ Failed to open job URL. Please check your popup blocker settings.')
        }
      } else {
        console.error('❌ Manual submit failed:', response.error)
        alert(`Manual submit failed: ${response.error}`)
      }
    } catch (error) {
      console.error('❌ Manual submit error:', error)
      alert(`Manual submit error: ${error}`)
    }
  }, [userProfile])

  const pollApplicationProgress = useCallback(async (applicationId: string) => {
    try {
      const response = await applicationApi.getApplicationProgress(applicationId)
      if (response.success) {
        setApplicationProgress(response.progress)
        
        // Continue polling if still processing
        if (response.progress.status === 'processing') {
          setTimeout(() => pollApplicationProgress(applicationId), 2000)
        }
      }
    } catch (error) {
      console.error('Progress polling error:', error)
    }
  }, [])

  const fetchJobs = useCallback(async (silent: boolean = false) => {
    try {
      if (!silent) setLoading(true)
      const response = await jobApi.getJobsFromDatabase(100, 0)
      if (response.success) {
        setJobs(response.jobs)
        setTotalCount(response.total_count)
        setLastUpdated(new Date().toISOString())
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  const fetchStatistics = useCallback(async () => {
    try {
      const response = await jobApi.getJobStatistics()
      if (response.success) {
        setStatistics(response.statistics)
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([fetchJobs(), fetchStatistics()])
    setRefreshing(false)
  }

  const handleScrapeJobs = async () => {
    setScraping(true)
    try {
      const response = await jobApi.forceScrapeGreenhouseJobs(500, false)
      if (response.success) {
        await fetchJobs()
        await fetchStatistics()
        alert(`Successfully scraped and stored ${response.jobs_stored} jobs!`)
      } else {
        alert('Failed to scrape jobs: ' + response.message)
      }
    } catch (error) {
      console.error('Error scraping jobs:', error)
      alert('Error scraping jobs: ' + (error as Error).message)
    } finally {
      setScraping(false)
    }
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
      day: 'numeric'
    })
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCompany = !filterCompany || job.company_name === filterCompany
    const matchesType = !filterType || job.job_type === filterType
    
    return matchesSearch && matchesCompany && matchesType
  })

  const displayedJobs = showAll ? filteredJobs : filteredJobs.slice(0, 10)

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Secure Login Modal */}
      {showSecureLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Secure Greenhouse Login</h2>
                <button
                  onClick={() => setShowSecureLogin(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* <SecureGreenhouseLogin /> */}
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.total_jobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.recent_jobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Building2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Companies</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.top_companies.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Filter className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Job Types</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.job_types.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Jobs List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Job Application Dashboard</h3>
              <div className="text-sm text-gray-500">
                {filteredJobs.length} of {totalCount} jobs available
                {lastUpdated && (
                  <span className="ml-2">
                    • Last updated: {new Date(lastUpdated).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowUserProfile(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <User className="h-4 w-4" />
                <span>Profile Settings</span>
              </button>
              <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setShowSecureLogin(true)}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Shield className="h-4 w-4" />
                <span>Secure Login & Scrape</span>
              </button>
              <button
                onClick={handleScrapeJobs}
                disabled={scraping}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Database className={`h-4 w-4 ${scraping ? 'animate-pulse' : ''}`} />
                <span>{scraping ? 'Scraping...' : 'Public Scrape'}</span>
              </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Companies</option>
              {statistics?.top_companies.map((company) => (
                <option key={company.name} value={company.name}>
                  {company.name} ({company.count})
                </option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              {statistics?.job_types.map((type) => (
                <option key={type.type} value={type.type}>
                  {type.type} ({type.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6">
          {displayedJobs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onAutoApply={handleAutoSubmit}
                  onManualApply={handleManualSubmit}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Jobs Found</h3>
              <p className="text-gray-600 mb-4">
                {jobs.length === 0 
                  ? "No jobs have been scraped yet. Start a scraping session to see jobs here."
                  : "No jobs match your current filters. Try adjusting your search criteria."
                }
              </p>
              {jobs.length === 0 && (
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Refresh Page
                </button>
              )}
            </div>
          )}

          {filteredJobs.length > 10 && (
            <div className="text-center pt-6">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-6 py-3 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
              >
                {showAll ? 'Show Less' : `Show All ${filteredJobs.length} Jobs`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Modal */}
      {showUserProfile && userProfile && (
        <UserProfileModal
          profile={userProfile}
          onSave={saveUserProfile}
          onClose={() => setShowUserProfile(false)}
        />
      )}

      {/* Application Progress Modal */}
      {showProgressModal && applicationProgress && (
        <ApplicationProgressModal
          progress={applicationProgress}
          applicationId={currentApplicationId}
          onClose={() => setShowProgressModal(false)}
        />
      )}
    </div>
  )
}

export default ScrapedJobsDisplay
