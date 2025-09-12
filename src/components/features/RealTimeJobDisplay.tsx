'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Database, ExternalLink, Building2, DollarSign, Calendar, Filter, Search, RefreshCw, TrendingUp, Users, MapPin, Clock } from 'lucide-react'
import { jobApi } from '../../api/jobApi'
import { DatabaseJob } from '../../types'

interface JobStatistics {
  total_jobs: number
  recent_jobs: number
  top_companies: Array<{ name: string; count: number }>
  job_types: Array<{ type: string; count: number }>
}

export const RealTimeJobDisplay: React.FC = () => {
  const [jobs, setJobs] = useState<DatabaseJob[]>([])
  const [statistics, setStatistics] = useState<JobStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCompany, setFilterCompany] = useState('')
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Auto-refresh every 15 seconds when enabled
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchJobs(true) // Silent refresh
    }, 15000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  useEffect(() => {
    fetchJobs()
    fetchStatistics()
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
    
    return matchesSearch && matchesCompany
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Real-Time Job Database
              </h1>
              <p className="text-lg text-gray-600">
                Live data from PostgreSQL database • {totalCount} jobs available
              </p>
              {lastUpdated && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {new Date(lastUpdated).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="auto-refresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="auto-refresh" className="text-sm text-gray-600">
                  Auto-refresh (15s)
                </label>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics.total_jobs}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Recent Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics.recent_jobs}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Companies</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics.top_companies.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Filter className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Job Types</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics.job_types.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Companies */}
        {statistics && statistics.top_companies.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Companies</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {statistics.top_companies.slice(0, 10).map((company, index) => (
                <div key={company.name} className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{company.name}</p>
                  <p className="text-sm text-gray-600">{company.count} jobs</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>
            </div>
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            >
              <option value="">All Companies</option>
              {statistics?.top_companies.map((company) => (
                <option key={company.name} value={company.name}>
                  {company.name} ({company.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              Job Listings ({filteredJobs.length} of {totalCount})
            </h3>
          </div>
          <div className="p-6">
            {filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {filteredJobs.slice(0, 20).map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          {job.company_avatar_path && (
                            <img
                              src={job.company_avatar_path}
                              alt={`${job.company_name} logo`}
                              className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          )}
                          <div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h4>
                            <p className="text-lg text-gray-600 flex items-center">
                              <Building2 className="h-5 w-5 mr-2" />
                              {job.company_name}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Filter className="h-4 w-4 mr-2" />
                            <span className="font-medium">{job.job_type || 'Not specified'}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span className="font-medium">{formatCurrency(job.budget_cost)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span className="font-medium">Scraped {formatDate(job.scraped_time)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Database className="h-4 w-4 mr-2" />
                            <span className="font-medium">ID: {job.job_id}</span>
                          </div>
                        </div>
                      </div>
                      
                      {job.job_path && (
                        <a
                          href={job.job_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-6 p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View job posting"
                        >
                          <ExternalLink className="h-6 w-6" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredJobs.length > 20 && (
                  <div className="text-center pt-6">
                    <p className="text-gray-600">
                      Showing 20 of {filteredJobs.length} jobs. Use search and filters to narrow down results.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Jobs Found</h3>
                <p className="text-gray-600">
                  {jobs.length === 0 
                    ? "No jobs have been scraped yet. The database is empty."
                    : "No jobs match your current filters. Try adjusting your search criteria."
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RealTimeJobDisplay
