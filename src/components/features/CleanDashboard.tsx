// Clean, modern Dashboard component

import React, { useState, useEffect, useCallback } from 'react'
import { Briefcase, Building2, Users, Calendar, TrendingUp, Sparkles, Target, Zap, BarChart3, FileText, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { jobApi } from '../../api/jobApi'
import { DatabaseJob } from '../../types'
import JobCard from '../ui/JobCard'

interface DashboardStats {
  totalJobs: number
  applicationsSent: number
  interviews: number
  successRate: number
  recentActivity: Array<{
    id: string
    type: string
    company: string
    status: string
    date: string
  }>
}

export const CleanDashboard: React.FC = () => {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    applicationsSent: 0,
    interviews: 0,
    successRate: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)
  const [featuredJobs, setFeaturedJobs] = useState<DatabaseJob[]>([])
  const [jobsLoading, setJobsLoading] = useState(true)

  // Fetch featured jobs
  const fetchFeaturedJobs = useCallback(async () => {
    setJobsLoading(true)
    try {
      const response = await jobApi.getJobs({
        limit: 6, // Show 6 featured jobs
        offset: 0,
        search: '',
        company: '',
        job_type: ''
      })
      
      if (response.success) {
        setFeaturedJobs(response.jobs)
        // Update stats with real data
        setStats(prevStats => ({
          ...prevStats,
          totalJobs: response.total_count
        }))
      }
    } catch (error) {
      console.error('Error fetching featured jobs:', error)
    } finally {
      setJobsLoading(false)
    }
  }, [])

  // Apply button handlers
  const handleAutoApply = useCallback((job: DatabaseJob) => {
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
  }, [])

  const handleManualApply = useCallback((job: DatabaseJob) => {
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
  }, [])

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats({
        totalJobs: 1247,
        applicationsSent: 24,
        interviews: 3,
        successRate: 12.5,
        recentActivity: [
          { id: '1', type: 'Application', company: 'Google', status: 'Sent', date: '2 hours ago' },
          { id: '2', type: 'Application', company: 'Microsoft', status: 'Processing', date: '4 hours ago' },
          { id: '3', type: 'Interview', company: 'Apple', status: 'Scheduled', date: '1 day ago' },
          { id: '4', type: 'Application', company: 'Meta', status: 'Sent', date: '2 days ago' },
          { id: '5', type: 'Application', company: 'Netflix', status: 'Sent', date: '3 days ago' }
        ]
      })
      setLoading(false)
    }

    loadDashboardData()
    fetchFeaturedJobs()
  }, [fetchFeaturedJobs])

  const quickActions = [
    {
      title: 'Browse Jobs',
      description: 'Find new opportunities',
      icon: Briefcase,
      color: 'from-blue-500 to-cyan-500',
      onClick: () => router.push('/jobSearch')
    },
    {
      title: 'Resume Generator',
      description: 'AI-powered CVs',
      icon: FileText,
      color: 'from-emerald-500 to-violet-500',
      onClick: () => router.push('/resumeGenerator')
    },
    {
      title: 'Applications',
      description: 'Track your progress',
      icon: Send,
      color: 'from-orange-500 to-red-500',
      onClick: () => router.push('/applications')
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600">Welcome back! Here's your job application overview</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Jobs</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalJobs.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Applications Sent</p>
                <p className="text-3xl font-bold text-slate-900">{stats.applicationsSent}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Send className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Interviews</p>
                <p className="text-3xl font-bold text-slate-900">{stats.interviews}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-bold text-slate-900">{stats.successRate}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="group bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 text-left"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{action.title}</h3>
                  <p className="text-slate-600 text-sm">{action.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Featured Jobs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Featured Jobs</h2>
            <button
              onClick={() => router.push('/applications')}
              className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors duration-300"
            >
              View All Jobs →
            </button>
          </div>
          
          {jobsLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 animate-pulse">
                  <div className="h-6 bg-slate-200 rounded mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded mb-4 w-3/4"></div>
                  <div className="h-10 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard
                  key={job.job_id}
                  job={job}
                  onAutoApply={handleAutoApply}
                  onManualApply={handleManualApply}
                  isApplying={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Jobs Available</h3>
              <p className="text-slate-600 mb-4">No featured jobs found at the moment.</p>
              <button
                onClick={() => router.push('/applications')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Browse All Jobs
              </button>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{activity.type} at {activity.company}</p>
                    <p className="text-sm text-slate-600">{activity.date}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  activity.status === 'Sent' ? 'bg-green-100 text-green-800' :
                  activity.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                  activity.status === 'Scheduled' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CleanDashboard
