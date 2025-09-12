// Clean, modern JobSearch component

import React, { useState, useEffect } from 'react'
import { Search, Filter, Building2, MapPin, DollarSign, Calendar, Briefcase, Grid3X3, List, ExternalLink, Zap, X, CheckCircle, AlertCircle, Loader2, FileText, RefreshCw, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { apiClient } from '../../api/client'
import { jobApi } from '../../api/jobApi'
import { autoApplyApi, AutoApplyProgress } from '../../api/autoApplyApi'
import { DatabaseJob } from '../../types'
import { useAuth } from '../../context/AuthContext'

export const CleanJobSearch: React.FC = () => {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<DatabaseJob[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCompany, setFilterCompany] = useState('')
  const [filterType, setFilterType] = useState('')
  const [viewFormat, setViewFormat] = useState<'grid' | 'list'>('grid')
  const [totalCount, setTotalCount] = useState(0)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [jobsPerPage, setJobsPerPage] = useState(5) // Reduced for testing
  const [totalPages, setTotalPages] = useState(0)
  
  // Auto-apply state
  const [showAutoApplyModal, setShowAutoApplyModal] = useState(false)
  const [currentJob, setCurrentJob] = useState<DatabaseJob | null>(null)
  const [autoApplyProgress, setAutoApplyProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [autoApplyStatus, setAutoApplyStatus] = useState<'idle' | 'running' | 'completed' | 'error' | 'cancelled'>('idle')
  const [autoApplyError, setAutoApplyError] = useState<string | null>(null)
  const [sessionKey, setSessionKey] = useState<string | null>(null)
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null)
  
  // Resume management state
  const [userResumes, setUserResumes] = useState<any[]>([])
  const [selectedResume, setSelectedResume] = useState<any | null>(null)
  const [showResumeSelection, setShowResumeSelection] = useState(false)
  const [resumeLoading, setResumeLoading] = useState(false)

  // Auto-apply steps configuration
  const autoApplySteps = [
    { id: 1, title: 'Navigating to job page', description: 'Automatically entering the relevant career path using scraping' },
    { id: 2, title: 'Extracting job details', description: 'Extracting the job description and required questions' },
    { id: 3, title: 'Filling form and submitting application', description: 'Automatically filling form fields and pressing the Apply button using scraping' },
    { id: 4, title: 'Storing application', description: 'Storing the job application form in PostgreSQL database' }
  ]

  const fetchJobs = async (page: number = currentPage) => {
    setLoading(true)
    try {
      const offset = (page - 1) * jobsPerPage
      const response = await jobApi.getJobs({
        limit: jobsPerPage,
        offset: offset,
        search: searchTerm,
        company: filterCompany,
        job_type: filterType
      })
      
      if (response.success) {
        console.log('Jobs fetched:', {
          jobs: response.jobs.length,
          total_count: response.total_count,
          jobsPerPage,
          calculatedTotalPages: Math.ceil(response.total_count / jobsPerPage)
        })
        setJobs(response.jobs)
        setTotalCount(response.total_count)
        setTotalPages(Math.ceil(response.total_count / jobsPerPage))
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
    fetchJobs(1)
  }, [searchTerm, filterCompany, filterType])

  useEffect(() => {
    setCurrentPage(1)
    fetchJobs(1)
  }, [jobsPerPage])

  // Since we're doing server-side filtering, we can use jobs directly
  const filteredJobs = jobs

  // For filter options, we need to fetch all jobs without pagination
  const [allJobs, setAllJobs] = useState<DatabaseJob[]>([])
  
  const fetchAllJobs = async () => {
    try {
      const response = await jobApi.getJobs({
        limit: 1000, // Get all jobs for filter options
        offset: 0,
        search: '',
        company: '',
        job_type: ''
      })
      
      if (response.success) {
        setAllJobs(response.jobs)
      }
    } catch (error) {
      console.error('Error fetching all jobs for filters:', error)
    }
  }

  useEffect(() => {
    fetchAllJobs()
  }, [])

  const uniqueCompanies = Array.from(new Set(allJobs.map(job => job.company_name))).sort()
  const uniqueTypes = Array.from(new Set(allJobs.map(job => job.job_type).filter(Boolean))).sort()

  const handleViewJob = (job: DatabaseJob) => {
    if (job.job_path) {
      window.open(job.job_path, '_blank', 'noopener,noreferrer')
    }
  }

  // Load user resumes
  const loadUserResumes = async () => {
    if (!user?.id) return
    
    setResumeLoading(true)
    try {
      const { authenticatedApiRequest } = await import('../../utils/apiUtils')
      const response = await authenticatedApiRequest('/resumes/user', user.id)
      
      if (response.ok) {
        const data = await response.json()
        setUserResumes(data.resumes || [])
        
        // Auto-select the most recent resume if available
        if (data.resumes && data.resumes.length > 0) {
          setSelectedResume(data.resumes[0])
        }
      }
    } catch (error) {
      console.error('Error loading resumes:', error)
    } finally {
      setResumeLoading(false)
    }
  }

  const handleAutoApply = async (job: DatabaseJob) => {
    setCurrentJob(job)
    
    // Load user resumes first
    await loadUserResumes()
    
    // Show resume selection if user has resumes
    if (userResumes.length > 0) {
      setShowResumeSelection(true)
      return
    }
    
    // If no resumes, proceed with auto-generation
    setShowAutoApplyModal(true)
    setAutoApplyStatus('running')
    setAutoApplyProgress(0)
    setCurrentStep(0)
    setAutoApplyError(null)

    try {
      if (!user?.id) {
        throw new Error('User not authenticated. Please log in to use auto-apply.')
      }
      
      const userId = user.id
      console.log('Starting auto-apply for user:', userId, 'job:', job.title, 'Job ID:', job.id)
      const response = await autoApplyApi.startAutoApply(userId, job.id)
      
      console.log('Auto-apply response:', response)
      
      if (response.success && response.data && typeof response.data === 'object' && 'session_key' in response.data) {
        const sessionKey = response.data.session_key
        if (sessionKey) {
          setSessionKey(sessionKey)
          
          // Start polling for progress
          const interval = setInterval(async () => {
            try {
              const progressResponse = await autoApplyApi.getProgress(sessionKey)
            if (progressResponse.success && progressResponse.data) {
              const progress = progressResponse.data
              
              // Type check to ensure we have the progress data structure
              if (typeof progress === 'object' && 'progress_percentage' in progress) {
                setAutoApplyProgress(progress.progress_percentage)
                setCurrentStep(progress.current_step)
                setAutoApplyStatus(progress.status)
                
                if (progress.status === 'completed') {
                  clearInterval(interval)
                  setProgressInterval(null)
                  // Auto-close modal after 3 seconds
                  setTimeout(() => {
                    closeAutoApplyModal()
                  }, 3000)
                } else if (progress.status === 'error') {
                  clearInterval(interval)
                  setProgressInterval(null)
                  setAutoApplyError(progress.error || 'An error occurred during auto-apply')
                }
              } else {
                console.warn('Invalid progress data structure:', progress)
              }
            }
          } catch (error) {
            console.error('Error polling progress:', error)
          }
          }, 1000) // Poll every second
          
          setProgressInterval(interval)
        }
      } else {
        setAutoApplyError(response.error || 'Failed to start auto-apply process')
        setAutoApplyStatus('error')
      }
    } catch (error) {
      console.error('Error starting auto-apply:', error)
      setAutoApplyError(error instanceof Error ? error.message : 'Unknown error occurred')
      setAutoApplyStatus('error')
    }
  }

  const handleResumeSelection = (resume: any) => {
    setSelectedResume(resume)
  }

  const proceedWithSelectedResume = async () => {
    if (!selectedResume || !currentJob) return
    
    setShowResumeSelection(false)
    setShowAutoApplyModal(true)
    setAutoApplyStatus('running')
    setAutoApplyProgress(0)
    setCurrentStep(0)
    setAutoApplyError(null)

    try {
      if (!user?.id) {
        throw new Error('User not authenticated. Please log in to use auto-apply.')
      }
      
      const userId = user.id
      console.log('Starting auto-apply with selected resume for user:', userId, 'job:', currentJob.id, 'resume:', selectedResume.id)
      
      // TODO: Modify auto-apply API to accept resume ID
      const response = await autoApplyApi.startAutoApply(userId, currentJob.id)
      
      console.log('Auto-apply response:', response)
      
      if (response.success && response.data && typeof response.data === 'object' && 'session_key' in response.data) {
        const sessionKey = response.data.session_key
        if (sessionKey) {
          setSessionKey(sessionKey)
          
          const interval = setInterval(async () => {
            try {
              const progressResponse = await autoApplyApi.getProgress(sessionKey)
              if (progressResponse.success && progressResponse.data) {
                const progress = progressResponse.data
                
                if (typeof progress === 'object' && 'progress_percentage' in progress) {
                  setAutoApplyProgress(progress.progress_percentage)
                  setCurrentStep(progress.current_step)
                  setAutoApplyStatus(progress.status)
                  
                  if (progress.status === 'completed') {
                    clearInterval(interval)
                    setProgressInterval(null)
                    setTimeout(() => {
                      closeAutoApplyModal()
                    }, 3000)
                  } else if (progress.status === 'error') {
                    clearInterval(interval)
                    setProgressInterval(null)
                    setAutoApplyError(progress.error || 'An error occurred during auto-apply')
                  }
                }
              }
            } catch (error) {
              console.error('Error polling progress:', error)
              clearInterval(interval)
              setProgressInterval(null)
              setAutoApplyError('Failed to track progress')
            }
          }, 2000)
          
          setProgressInterval(interval)
        }
      } else {
        setAutoApplyError('Failed to start auto-apply process')
      }
    } catch (error) {
      console.error('Auto-apply error:', error)
      setAutoApplyError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  const proceedWithAutoGeneration = () => {
    setShowResumeSelection(false)
    setShowAutoApplyModal(true)
    setAutoApplyStatus('running')
    setAutoApplyProgress(0)
    setCurrentStep(0)
    setAutoApplyError(null)

    // Continue with the existing auto-apply logic
    if (currentJob) {
      handleAutoApply(currentJob)
    }
  }

  const closeAutoApplyModal = () => {
    if (autoApplyStatus !== 'running') {
      // Clear progress interval if running
      if (progressInterval) {
        clearInterval(progressInterval)
        setProgressInterval(null)
      }
      
      setShowAutoApplyModal(false)
      setShowResumeSelection(false)
      setAutoApplyStatus('idle')
      setAutoApplyProgress(0)
      setCurrentStep(0)
      setAutoApplyError(null)
      setCurrentJob(null)
      setSessionKey(null)
      setSelectedResume(null)
    }
  }

  const cancelAutoApply = async () => {
    if (sessionKey && autoApplyStatus === 'running') {
      try {
        await autoApplyApi.cancelAutoApply(sessionKey)
        setAutoApplyStatus('cancelled')
        setAutoApplyError('Auto-apply process was cancelled')
      } catch (error) {
        console.error('Error cancelling auto-apply:', error)
      }
    }
  }

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval)
      }
    }
  }, [progressInterval])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Searching for jobs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Job Search</h1>
              <p className="text-slate-600">Find your next career opportunity</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewFormat('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewFormat === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewFormat('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewFormat === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Companies</option>
              {uniqueCompanies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button
              onClick={() => fetchJobs(1)}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all duration-300"
            >
              Search
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {filteredJobs.length} jobs found
            </h2>
            <p className="text-slate-600">
              {totalCount > 0 && `Showing ${filteredJobs.length} of ${totalCount} total jobs`}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="jobsPerPage" className="text-sm text-slate-600">
                Jobs per page:
              </label>
              <select
                id="jobsPerPage"
                value={jobsPerPage}
                onChange={(e) => setJobsPerPage(Number(e.target.value))}
                className="px-3 py-1 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs Display */}
        {viewFormat === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div key={job.job_id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                      {job.title}
                    </h3>
                    <div className="flex items-center text-slate-600 mb-2">
                      <Building2 className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">{job.company_name}</span>
                    </div>
                    {job.job_type && (
                      <div className="flex items-center text-slate-600 mb-2">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{job.job_type}</span>
                      </div>
                    )}
                    {job.budget_cost && (
                      <div className="flex items-center text-slate-600 mb-4">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">${job.budget_cost.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-slate-500 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Posted {new Date(job.creation_time).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAutoApply(job)}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium text-sm px-2 py-1 rounded border border-red-300 hover:bg-red-50 transition-colors"
                    >
                      <Zap className="h-4 w-4" />
                      <span>Auto-Apply</span>
                    </button>
                    <button
                      onClick={() => handleViewJob(job)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      <span>View Job</span>
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.job_id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {job.title}
                    </h3>
                    <div className="flex items-center space-x-6 text-slate-600 mb-3">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">{job.company_name}</span>
                      </div>
                      {job.job_type && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{job.job_type}</span>
                        </div>
                      )}
                      {job.budget_cost && (
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">${job.budget_cost.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-slate-500 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Posted {new Date(job.creation_time).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleAutoApply(job)}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium text-sm px-2 py-1 rounded border border-red-300 hover:bg-red-50 transition-colors"
                    >
                      <Zap className="h-4 w-4" />
                      <span>Auto-Apply</span>
                    </button>
                    <button
                      onClick={() => handleViewJob(job)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      <span>View Job</span>
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Debug Info */}
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Debug: totalPages = {totalPages}, totalCount = {totalCount}, jobsPerPage = {jobsPerPage}, currentPage = {currentPage}
          </p>
        </div>

        {/* Pagination Controls - Always show for debugging */}
        {true && (
          <div className="mt-8 flex items-center justify-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={() => fetchJobs(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="flex items-center space-x-1 px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => fetchJobs(pageNum)}
                    disabled={loading}
                    className={`px-3 py-2 text-sm rounded-lg transition-all duration-300 disabled:cursor-not-allowed ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => fetchJobs(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="flex items-center space-x-1 px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Pagination Info */}
        {totalPages > 1 && (
          <div className="mt-4 text-center text-slate-600 text-sm">
            <p>
              Page {currentPage} of {totalPages} • {totalCount} total jobs • {jobsPerPage} per page
            </p>
          </div>
        )}

        {/* No Jobs Message */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No jobs found</h3>
            <p className="text-slate-600">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>

      {/* Auto-Apply Modal */}
      {/* Resume Selection Modal */}
      {showResumeSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Select Resume for Auto-Apply</h2>
              <button
                onClick={() => setShowResumeSelection(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {currentJob && (
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-1">{currentJob.title}</h3>
                <p className="text-slate-600 text-sm">{currentJob.company_name}</p>
              </div>
            )}

            {resumeLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                <span className="ml-2 text-slate-600">Loading your resumes...</span>
              </div>
            ) : userResumes.length > 0 ? (
              <div className="space-y-4">
                <p className="text-slate-600 text-sm mb-4">
                  Choose a resume to use for this application. This will speed up the process significantly.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userResumes.map((resume, index) => (
                    <div
                      key={resume.id || index}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedResume?.id === resume.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => handleResumeSelection(resume)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 mb-1">
                            {resume.title || `Resume ${index + 1}`}
                          </h4>
                          <p className="text-sm text-slate-600 mb-2">
                            {resume.template || 'Professional Template'}
                          </p>
                          <p className="text-xs text-slate-500">
                            Created: {new Date(resume.createdAt || resume.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        {selectedResume?.id === resume.id && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={proceedWithSelectedResume}
                    disabled={!selectedResume}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Use Selected Resume
                  </button>
                  <button
                    onClick={proceedWithAutoGeneration}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Generate New Resume
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Resumes Found</h3>
                <p className="text-slate-600 mb-6">
                  You don't have any saved resumes yet. We can generate one for you automatically.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={proceedWithAutoGeneration}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Generate Resume with AI
                  </button>
                  <button
                    onClick={() => setShowResumeSelection(false)}
                    className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showAutoApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Auto-Apply Progress</h2>
              {autoApplyStatus !== 'running' && (
                <button
                  onClick={closeAutoApplyModal}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              )}
            </div>

            {currentJob && (
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-1">{currentJob.title}</h3>
                <p className="text-sm text-slate-600">{currentJob.company_name}</p>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Progress</span>
                <span className="text-sm text-slate-500">{Math.round(autoApplyProgress)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${autoApplyProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Steps List */}
            <div className="space-y-3">
              {autoApplySteps.map((step, index) => {
                const isCompleted = index < currentStep
                const isCurrent = index === currentStep
                const isPending = index > currentStep

                return (
                  <div key={step.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : isCurrent ? (
                        <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                          <span className="text-xs text-slate-400">{step.id}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium ${
                        isCompleted ? 'text-green-700' : 
                        isCurrent ? 'text-blue-700' : 
                        'text-slate-500'
                      }`}>
                        {step.title}
                      </h4>
                      <p className={`text-xs ${
                        isCompleted ? 'text-green-600' : 
                        isCurrent ? 'text-blue-600' : 
                        'text-slate-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Status Messages */}
            {autoApplyStatus === 'completed' && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-700 font-medium">Application submitted successfully!</span>
                </div>
                <p className="text-green-600 text-sm mt-1">
                  Your application has been automatically submitted and stored in our database.
                </p>
              </div>
            )}

            {autoApplyStatus === 'error' && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700 font-medium">Application failed</span>
                </div>
                <p className="text-red-600 text-sm mt-1">
                  {autoApplyError || 'An unexpected error occurred during the auto-apply process.'}
                </p>
                <button
                  onClick={closeAutoApplyModal}
                  className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                >
                  Close
                </button>
              </div>
            )}

            {autoApplyStatus === 'cancelled' && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-yellow-700 font-medium">Application cancelled</span>
                </div>
                <p className="text-yellow-600 text-sm mt-1">
                  The auto-apply process was cancelled by the user.
                </p>
                <button
                  onClick={closeAutoApplyModal}
                  className="mt-3 px-4 py-2 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors"
                >
                  Close
                </button>
              </div>
            )}

            {autoApplyStatus === 'running' && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Loader2 className="h-5 w-5 text-blue-500 mr-2 animate-spin" />
                    <span className="text-blue-700 font-medium">Processing application...</span>
                  </div>
                  <button
                    onClick={cancelAutoApply}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-blue-600 text-sm mt-1">
                  Please wait while we automatically apply to this job for you.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CleanJobSearch
