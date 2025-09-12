'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Building2, MapPin, DollarSign, Calendar, Bot, Hand, User, Settings, ExternalLink } from 'lucide-react'
import { jobApi } from '../../api/jobApi'
import { DatabaseJob, UserProfile } from '../../types'
import JobCard from '../ui/JobCard'
import UserProfileModal from '../ui/UserProfileModal'

interface JobStatistics {
  total_jobs: number
  recent_jobs: number
  top_companies: Array<{ name: string; count: number }>
  job_types: Array<{ type: string; count: number }>
}

export const ApplicationsDisplay: React.FC = () => {
  const [jobs, setJobs] = useState<DatabaseJob[]>([])
  const [statistics, setStatistics] = useState<JobStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCompany, setFilterCompany] = useState('')
  const [filterType, setFilterType] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  // Load user profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile))
      } catch (error) {
        console.error('Error parsing user profile:', error)
      }
    }
  }, [])

  const fetchJobs = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    
    try {
      const response = await jobApi.getJobs({
        limit: showAll ? 1000 : 50,
        offset: 0,
        search: searchTerm,
        company: filterCompany,
        job_type: filterType
      })
      
      if (response.success) {
        setJobs(response.jobs)
        setTotalCount(response.total_count)
        setStatistics(response.statistics)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }, [showAll, searchTerm, filterCompany, filterType])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const loadUserProfile = useCallback(() => {
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      try {
        return JSON.parse(savedProfile)
      } catch (error) {
        console.error('Error parsing user profile:', error)
        return null
      }
    }
    return null
  }, [])

  const saveUserProfile = useCallback((profile: UserProfile) => {
    setUserProfile(profile)
    localStorage.setItem('userProfile', JSON.stringify(profile))
  }, [])

  const handleAutoApply = useCallback((job: DatabaseJob) => {
    if (!userProfile) {
      setShowUserProfile(true)
      return
    }

    if (!job.job_path) {
      alert('❌ Job URL not available for this position.')
      return
    }

    try {
      console.log('🚀 Opening job URL for auto apply:', job.title)
      console.log('🌐 Job URL:', job.job_path)
      
      // Open job URL in new tab
      const newWindow = window.open(job.job_path, '_blank', 'noopener,noreferrer')
      
      if (newWindow) {
        // Show success message
        alert(`✅ Auto Apply: Job page opened!\n\nJob: ${job.title}\nCompany: ${job.company_name}\n\nComplete your application in the new tab.`)
      } else {
        alert('❌ Failed to open job URL. Please check your popup blocker settings.')
      }
    } catch (error) {
      console.error('❌ Auto apply error:', error)
      alert(`Auto apply error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [userProfile])

  const handleManualApply = useCallback((job: DatabaseJob) => {
    if (!userProfile) {
      setShowUserProfile(true)
      return
    }

    if (!job.job_path) {
      alert('❌ Job URL not available for this position.')
      return
    }

    try {
      console.log('🖱️ Opening job URL for manual apply:', job.title)
      console.log('🌐 Job URL:', job.job_path)
      
      // Open job URL in new tab
      const newWindow = window.open(job.job_path, '_blank', 'noopener,noreferrer')
      
      if (newWindow) {
        // Show success message
        alert(`✅ Manual Apply: Job page opened!\n\nJob: ${job.title}\nCompany: ${job.company_name}\n\nComplete your application in the new tab.`)
      } else {
        alert('❌ Failed to open job URL. Please check your popup blocker settings.')
      }
    } catch (error) {
      console.error('❌ Manual apply error:', error)
      alert(`Manual apply error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [userProfile])



  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCompany = !filterCompany || job.company_name === filterCompany
    const matchesType = !filterType || job.job_type === filterType
    
    return matchesSearch && matchesCompany && matchesType
  })

  const uniqueCompanies = Array.from(new Set(jobs.map(job => job.company_name))).sort()
  const uniqueTypes = Array.from(new Set(jobs.map(job => job.job_type).filter(Boolean))).sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading job opportunities...</p>
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
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Job Applications</h1>
              <p className="text-slate-600">Browse and apply to available job opportunities</p>
            </div>
            <button
              onClick={() => setShowUserProfile(true)}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Profile Settings</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Jobs</p>
                  <p className="text-2xl font-bold text-slate-900">{statistics.total_jobs.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Recent Jobs</p>
                  <p className="text-2xl font-bold text-slate-900">{statistics.recent_jobs}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Companies</p>
                  <p className="text-2xl font-bold text-slate-900">{statistics.top_companies.length}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Job Types</p>
                  <p className="text-2xl font-bold text-slate-900">{statistics.job_types.length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Filter className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

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
              onClick={() => setShowAll(!showAll)}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all duration-300"
            >
              {showAll ? 'Show Less' : 'Show All'}
            </button>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.job_id}
              job={job}
              onAutoApply={handleAutoApply}
              onManualApply={handleManualApply}
              isApplying={false}
            />
          ))}
        </div>

        {/* No Jobs Message */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No jobs found</h3>
            <p className="text-slate-600">Try adjusting your search criteria or filters</p>
          </div>
        )}

        {/* Modals */}
        {showUserProfile && userProfile && (
          <UserProfileModal
            profile={userProfile}
            onClose={() => setShowUserProfile(false)}
            onSave={saveUserProfile}
          />
        )}
      </div>
    </div>
  )
}

export default ApplicationsDisplay
