'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Search, Filter, Building2, MapPin, DollarSign, Calendar, 
  Briefcase, Grid3X3, List, ExternalLink, Zap, RefreshCw, 
  Star, Heart, Eye, Bookmark, TrendingUp, Users, Award,
  Sparkles, Target, Globe, Clock, CheckCircle, AlertCircle,
  ArrowRight, ChevronDown, ChevronUp, X, Plus, Minus, FileText
} from 'lucide-react'
import { apiClient } from '../../api/client'
import { jobApi } from '../../api/jobApi'
import { autoApplyApi, AutoApplyProgress } from '../../api/autoApplyApi'
import { DatabaseJob } from '../../types'
import { useAuth } from '../../context/AuthContext'

export const CompactJobSearch: React.FC = () => {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<DatabaseJob[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('') // UI state for search input
  const [filterCompany, setFilterCompany] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [viewFormat, setViewFormat] = useState<'grid' | 'list'>('grid')
  const [totalCount, setTotalCount] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [favoriteJobs, setFavoriteJobs] = useState<Set<string>>(new Set())
  const [viewedJobs, setViewedJobs] = useState<Set<string>>(new Set())
  const [isVisible, setIsVisible] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [jobsPerPage, setJobsPerPage] = useState(20)
  const [selectedJobsPerPage, setSelectedJobsPerPage] = useState(20) // UI state for selector
  const [totalPages, setTotalPages] = useState(0)
  const [isChangingPageSize, setIsChangingPageSize] = useState(false)
  
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
    { id: 1, title: 'Navigating to job page', description: 'Automatically entering the relevant career path' },
    { id: 2, title: 'Extracting job details', description: 'Extracting the job description and requirements' },
    { id: 3, title: 'Filling form and submitting', description: 'Automatically filling form fields and applying' },
    { id: 4, title: 'Storing application', description: 'Storing the job application in database' }
  ]

  const fetchJobs = useCallback(async (page: number) => {
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
        console.log('🔍 Search results:', {
          searchTerm,
          jobsCount: response.jobs.length,
          totalCount: response.total_count,
          jobs: response.jobs.slice(0, 3).map(j => ({ title: j.title, company: j.company_name }))
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
  }, [jobsPerPage, searchTerm, filterCompany, filterType])

  useEffect(() => {
    setIsVisible(true)
    fetchJobs(1)
  }, [fetchJobs])

  // No automatic search - only on Enter key press

  // Refetch jobs when filters change (immediate for dropdowns)
  useEffect(() => {
    if (isVisible && (filterCompany || filterType || filterLocation)) {
      setCurrentPage(1)
      fetchJobs(1)
    }
  }, [filterCompany, filterType, filterLocation, fetchJobs, isVisible])

  // Debounced effect for jobs per page changes
  useEffect(() => {
    if (selectedJobsPerPage !== jobsPerPage && isVisible) {
      // Immediately update the UI state for better responsiveness
      setJobsPerPage(selectedJobsPerPage)
      setCurrentPage(1)
      
      setIsChangingPageSize(true)
      const timeoutId = setTimeout(() => {
        fetchJobs(1).finally(() => {
          setIsChangingPageSize(false)
        })
      }, 100) // Reduced to 100ms for better responsiveness

      return () => {
        clearTimeout(timeoutId)
        setIsChangingPageSize(false)
      }
    }
  }, [selectedJobsPerPage, jobsPerPage, isVisible, fetchJobs])

  // Debug modal state
  useEffect(() => {
    console.log('🎭 Modal state changed, showAutoApplyModal:', showAutoApplyModal)
  }, [showAutoApplyModal])

  // Get unique values for filter dropdowns (we'll need to fetch these separately)
  const [uniqueCompanies, setUniqueCompanies] = useState<string[]>([])
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([])
  const [uniqueLocations, setUniqueLocations] = useState<string[]>([])

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      // Get all jobs without pagination to build filter options
      const response = await jobApi.getJobs({
        limit: 1000, // Get more jobs to build comprehensive filter options
        offset: 0,
        search: '',
        company: '',
        job_type: ''
      })
      
      if (response.success) {
        const allJobs = response.jobs
        setUniqueCompanies(Array.from(new Set(allJobs.map(job => job.company_name))).sort())
        setUniqueTypes(Array.from(new Set(allJobs.map(job => job.job_type).filter(Boolean) as string[])).sort())
        setUniqueLocations(Array.from(new Set(allJobs.map(job => job.location).filter(Boolean) as string[])).sort())
      }
    } catch (error) {
      console.error('Error fetching filter options:', error)
    }
  }

  useEffect(() => {
    fetchFilterOptions()
  }, [])

  const handleViewJob = (job: DatabaseJob) => {
    if (job.job_path) {
      window.open(job.job_path, '_blank', 'noopener,noreferrer')
      setViewedJobs(prev => new Set(prev).add(job.job_id))
    }
  }

  const handleFavoriteJob = (jobId: string) => {
    setFavoriteJobs(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(jobId)) {
        newFavorites.delete(jobId)
      } else {
        newFavorites.add(jobId)
      }
      return newFavorites
    })
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // Only trigger search if there's actual input
      if (searchInput.trim()) {
        console.log('🔍 Starting search for:', searchInput.trim())
        setSearchTerm(searchInput.trim())
        setCurrentPage(1)
        setIsSearching(true)
        fetchJobs(1).finally(() => {
          setIsSearching(false)
        })
      } else {
        // Clear search if input is empty
        clearSearch()
      }
    }
  }

  const clearSearch = () => {
    setSearchInput('')
    setSearchTerm('')
    setCurrentPage(1)
    setIsSearching(true)
    fetchJobs(1).finally(() => {
      setIsSearching(false)
    })
  }

  const handleJobsPerPageChange = (newValue: number) => {
    setSelectedJobsPerPage(newValue)
    // The useEffect will handle the debounced API call
  }

  const clearAllFilters = () => {
    setSearchInput('')
    setSearchTerm('')
    setFilterCompany('')
    setFilterType('')
    setFilterLocation('')
    setCurrentPage(1)
    setIsSearching(true)
    fetchJobs(1).finally(() => {
      setIsSearching(false)
    })
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
    console.log('🚀 Auto-apply button clicked for job:', job.title)
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
    console.log('✅ Modal state set to true')
    setAutoApplyStatus('running')
    setAutoApplyProgress(0)
    setCurrentStep(0)
    setAutoApplyError(null)

    try {
      if (!user?.id) {
        throw new Error('User not authenticated. Please log in to use auto-apply.')
      }
      
      const userId = user.id
      console.log('Starting auto-apply for user:', userId, 'job:', job.id)
      
      const response = await autoApplyApi.startAutoApply(userId, job.id)
      
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
            }
          }, 1000)
          
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

  useEffect(() => {
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval)
      }
    }
  }, [progressInterval])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
            <RefreshCw className="h-8 w-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Loading Opportunities</h2>
          <p className="text-gray-300 text-sm">Discovering the best job matches for you...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Compact Header */}
        <div className={`mb-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Job Search</h1>
                <p className="text-gray-300 text-sm">{totalCount} opportunities available</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
                <button
                  onClick={() => setViewFormat('grid')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                    viewFormat === 'grid'
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Grid3X3 className="h-3 w-3" />
                  <span>Grid</span>
                </button>
                <button
                  onClick={() => setViewFormat('list')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                    viewFormat === 'list'
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <List className="h-3 w-3" />
                  <span>List</span>
                </button>
              </div>

              {/* Jobs per page selector */}
              <div className="relative flex items-center space-x-2">
                <select
                  value={selectedJobsPerPage}
                  onChange={(e) => handleJobsPerPageChange(Number(e.target.value))}
                  className={`px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs transition-all duration-200 ${
                    isChangingPageSize ? 'opacity-75' : 'hover:bg-white/20'
                  }`}
                >
                  <option value={10} className="bg-slate-800">10 per page</option>
                  <option value={20} className="bg-slate-800">20 per page</option>
                  <option value={50} className="bg-slate-800">50 per page</option>
                  <option value={100} className="bg-slate-800">100 per page</option>
                </select>
                {isChangingPageSize && (
                  <RefreshCw className="h-3 w-3 text-blue-400 animate-spin" />
                )}
              </div>
              
               <button
                 onClick={clearAllFilters}
                 disabled={loading || isChangingPageSize || isSearching}
                 className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 text-sm"
               >
                 <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                 <span>Clear All</span>
               </button>
            </div>
          </div>
        </div>

        {/* Compact Search and Filters */}
        <div className={`mb-6 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl p-4">
            {/* Main Search Bar */}
            <div className="flex items-center space-x-3 mb-4">
               <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                 <input
                   type="text"
                   placeholder="Search jobs, companies, or keywords... (Press Enter to search)"
                   value={searchInput}
                   onChange={(e) => setSearchInput(e.target.value)}
                   onKeyPress={handleSearchKeyPress}
                   className="w-full pl-10 pr-20 py-2.5 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                 />
                 {isSearching && (
                   <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                     <RefreshCw className="h-4 w-4 text-gray-400 animate-spin" />
                   </div>
                 )}
               </div>
               <button
                 onClick={() => {
                   if (searchInput.trim()) {
                     console.log('🔍 Search button clicked for:', searchInput.trim())
                     setSearchTerm(searchInput.trim())
                     setCurrentPage(1)
                     setIsSearching(true)
                     fetchJobs(1).finally(() => {
                       setIsSearching(false)
                     })
                   } else {
                     clearSearch()
                   }
                 }}
                 disabled={isSearching}
                 className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 text-sm"
               >
                 <Search className="h-4 w-4" />
                 <span>Search</span>
               </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2.5 bg-white/20 border border-white/30 text-white rounded-lg hover:bg-white/30 transition-all duration-300 text-sm"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-white/20">
                 <select
                   value={filterCompany}
                   onChange={(e) => setFilterCompany(e.target.value)}
                   disabled={isSearching}
                   className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   <option value="">All Companies</option>
                   {uniqueCompanies.map(company => (
                     <option key={company} value={company} className="bg-slate-800">{company}</option>
                   ))}
                 </select>
                 <select
                   value={filterType}
                   onChange={(e) => setFilterType(e.target.value)}
                   disabled={isSearching}
                   className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   <option value="">All Types</option>
                   {uniqueTypes.map(type => (
                     <option key={type} value={type} className="bg-slate-800">{type}</option>
                   ))}
                 </select>
                 <select
                   value={filterLocation}
                   onChange={(e) => setFilterLocation(e.target.value)}
                   disabled={isSearching}
                   className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   <option value="">All Locations</option>
                   {uniqueLocations.map(location => (
                     <option key={location} value={location} className="bg-slate-800">{location}</option>
                   ))}
                 </select>
              </div>
            )}
          </div>
        </div>

        {/* Compact Results Header */}
        <div className={`mb-4 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                 <div>
                   <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                     <span>{jobs.length} jobs found</span>
                     {isSearching && (
                       <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />
                     )}
                   </h2>
                   <p className="text-gray-300 text-xs">
                     {totalCount > 0 && `Showing ${jobs.length} of ${totalCount} total jobs (Page ${currentPage} of ${totalPages}) • ${jobsPerPage} per page`}
                     {searchTerm && (
                       <span className="ml-2 text-blue-300">• Searching for "{searchTerm}"</span>
                     )}
                     {isChangingPageSize && (
                       <span className="ml-2 text-yellow-300">• Updating page size...</span>
                     )}
                   </p>
                 </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-gray-300">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-400" />
                <span>{favoriteJobs.size} favorites</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3 text-blue-400" />
                <span>{viewedJobs.size} viewed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Jobs Display */}
        <div className={`transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {viewFormat === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {jobs.map((job) => (
                <div key={job.job_id} className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white mb-1 line-clamp-2 leading-tight">
                        {job.title}
                      </h3>
                      <div className="flex items-center text-gray-300 mb-1">
                        <Building2 className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="text-xs truncate">{job.company_name}</span>
                      </div>
                      {job.location && (
                        <div className="flex items-center text-gray-300 mb-1">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="text-xs truncate">{job.location}</span>
                        </div>
                      )}
                      {job.job_type && (
                        <div className="flex items-center text-gray-300 mb-2">
                          <Briefcase className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="text-xs">{job.job_type}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleFavoriteJob(job.job_id)}
                      className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <Heart className={`h-3 w-3 ${favoriteJobs.has(job.job_id) ? 'text-red-400 fill-current' : 'text-gray-400'}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{new Date(job.creation_time).toLocaleDateString()}</span>
                    </div>
                    {job.budget_cost && (
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        <span>${job.budget_cost.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAutoApply(job)}
                      className="flex-1 flex items-center justify-center space-x-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 px-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 text-xs"
                    >
                      <Zap className="h-3 w-3" />
                      <span>Auto-Apply</span>
                    </button>
                    <button
                      onClick={() => handleViewJob(job)}
                      className="flex-1 flex items-center justify-center space-x-1 bg-white/20 border border-white/30 text-white py-2 px-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-300 text-xs"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job.job_id} className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-bold text-white line-clamp-1">
                          {job.title}
                        </h3>
                        <button
                          onClick={() => handleFavoriteJob(job.job_id)}
                          className="ml-3 p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
                        >
                          <Heart className={`h-3 w-3 ${favoriteJobs.has(job.job_id) ? 'text-red-400 fill-current' : 'text-gray-400'}`} />
                        </button>
                      </div>
                      <div className="flex items-center space-x-4 text-gray-300 mb-2">
                        <div className="flex items-center">
                          <Building2 className="h-3 w-3 mr-1" />
                          <span className="text-xs">{job.company_name}</span>
                        </div>
                        {job.location && (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="text-xs">{job.location}</span>
                          </div>
                        )}
                        {job.job_type && (
                          <div className="flex items-center">
                            <Briefcase className="h-3 w-3 mr-1" />
                            <span className="text-xs">{job.job_type}</span>
                          </div>
                        )}
                        {job.budget_cost && (
                          <div className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            <span className="text-xs">${job.budget_cost.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-gray-400 text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Posted {new Date(job.creation_time).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleAutoApply(job)}
                        className="flex items-center space-x-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 px-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 text-xs"
                      >
                        <Zap className="h-3 w-3" />
                        <span>Auto-Apply</span>
                      </button>
                      <button
                        onClick={() => handleViewJob(job)}
                        className="flex items-center space-x-1 bg-white/20 border border-white/30 text-white py-2 px-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-300 text-xs"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className={`mt-8 transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center justify-center space-x-2">
              {/* Previous Button */}
               <button
                 onClick={() => fetchJobs(currentPage - 1)}
                 disabled={currentPage === 1 || loading || isSearching || isChangingPageSize}
                 className="flex items-center space-x-1 px-3 py-2 bg-white/10 border border-white/30 text-white rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
               >
                 <ArrowRight className="h-4 w-4 rotate-180" />
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
                       disabled={loading || isSearching || isChangingPageSize}
                       className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed ${
                         currentPage === pageNum
                           ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                           : 'bg-white/10 border border-white/30 text-white hover:bg-white/20'
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
                 disabled={currentPage === totalPages || loading || isSearching || isChangingPageSize}
                 className="flex items-center space-x-1 px-3 py-2 bg-white/10 border border-white/30 text-white rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
               >
                 <span>Next</span>
                 <ArrowRight className="h-4 w-4" />
               </button>
            </div>

            {/* Page Info */}
            <div className="text-center mt-4">
              <p className="text-gray-300 text-xs">
                Page {currentPage} of {totalPages} • {totalCount} total jobs
              </p>
            </div>
          </div>
        )}

        {/* No Jobs Message */}
        {jobs.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No jobs found</h3>
            <p className="text-gray-300 text-sm">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>

      {/* Auto-Apply Modal */}
      {/* Resume Selection Modal */}
      {showResumeSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Select Resume for Auto-Apply</h2>
              <button
                onClick={() => setShowResumeSelection(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
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
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Auto-Apply Progress</h2>
              {autoApplyStatus !== 'running' && (
                <button
                  onClick={closeAutoApplyModal}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {currentJob && (
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-1 text-sm">{currentJob.title}</h3>
                <p className="text-xs text-slate-600">{currentJob.company_name}</p>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-700">Progress</span>
                <span className="text-xs text-slate-500">{Math.round(autoApplyProgress)}%</span>
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
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : isCurrent ? (
                        <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-slate-300 flex items-center justify-center">
                          <span className="text-xs text-slate-400">{step.id}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xs font-medium ${
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
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-green-700 font-medium text-sm">Application submitted successfully!</span>
                </div>
                <p className="text-green-600 text-xs mt-1">
                  Your application has been automatically submitted and stored in our database.
                </p>
              </div>
            )}

            {autoApplyStatus === 'error' && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-red-700 font-medium text-sm">Application failed</span>
                </div>
                <p className="text-red-600 text-xs mt-1">
                  {autoApplyError || 'An unexpected error occurred during the auto-apply process.'}
                </p>
                <button
                  onClick={closeAutoApplyModal}
                  className="mt-3 px-3 py-1.5 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
                >
                  Close
                </button>
              </div>
            )}

            {autoApplyStatus === 'cancelled' && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                  <span className="text-yellow-700 font-medium text-sm">Application cancelled</span>
                </div>
                <p className="text-yellow-600 text-xs mt-1">
                  The auto-apply process was cancelled by the user.
                </p>
                <button
                  onClick={closeAutoApplyModal}
                  className="mt-3 px-3 py-1.5 bg-yellow-600 text-white text-xs rounded-md hover:bg-yellow-700 transition-colors"
                >
                  Close
                </button>
              </div>
            )}

            {autoApplyStatus === 'running' && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span className="text-blue-700 font-medium text-sm">Processing application...</span>
                  </div>
                  <button
                    onClick={cancelAutoApply}
                    className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-blue-600 text-xs mt-1">
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

export default CompactJobSearch
