'use client'

import React, { useState, useEffect } from 'react'
import { 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  Calendar, 
  Building2, 
  MapPin, 
  DollarSign,
  FileText,
  Eye,
  Filter,
  Search,
  TrendingUp,
  Users,
  Target,
  Zap,
  Star,
  Award,
  Rocket,
  Sparkles,
  Heart,
  ThumbsUp,
  MessageSquare,
  Download,
  Share2,
  Bookmark,
  MoreHorizontal
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { applicationsApi, JobApplication } from '../../api/applicationsApi'


interface ApplicationStats {
  total: number
  pending: number
  accepted: number
  rejected: number
  this_month: number
}

const ApplicationsPage: React.FC = () => {
  const { user } = useAuth()
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    this_month: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)

  useEffect(() => {
    if (user?.id) {
      fetchApplications()
    }
  }, [user?.id])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const data = await applicationsApi.getApplications(user?.id || 0, 100, 0)
      
      if (data.success) {
        setApplications(data.applications)
        calculateStats(data.applications)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (apps: JobApplication[]) => {
    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const newStats = {
      total: apps.length,
      pending: apps.filter(app => app.application_status === 'pending').length,
      accepted: apps.filter(app => app.application_status === 'accepted').length,
      rejected: apps.filter(app => app.application_status === 'rejected').length,
      this_month: apps.filter(app => new Date(app.applied_at) >= thisMonth).length
    }
    
    setStats(newStats)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3 text-amber-500" />
      case 'accepted':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'rejected':
        return <XCircle className="h-3 w-3 text-red-500" />
      default:
        return <AlertCircle className="h-3 w-3 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      case 'accepted':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'completed':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = !searchTerm || 
      app.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || app.application_status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Rocket className="h-10 w-10 text-white" />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-lg text-white font-semibold">Loading your applications...</p>
          <p className="text-sm text-purple-200 mt-2">Preparing your success dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    My Applications
                  </h1>
                  <p className="text-purple-200 text-sm">Track your journey to success</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right text-white">
                <p className="text-xs text-purple-200">Total Applications</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">{stats.total}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-200 mb-1">Total</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Target className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-200 mb-1">Pending</p>
                <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-200 mb-1">Accepted</p>
                <p className="text-2xl font-bold text-green-400">{stats.accepted}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-200 mb-1">Rejected</p>
                <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <XCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-200 mb-1">This Month</p>
                <p className="text-2xl font-bold text-purple-400">{stats.this_month}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-300" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/10 text-white placeholder-purple-300 backdrop-blur-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 text-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/10 text-white backdrop-blur-sm"
            >
              <option value="all" className="bg-slate-800">All Status</option>
              <option value="pending" className="bg-slate-800">Pending</option>
              <option value="accepted" className="bg-slate-800">Accepted</option>
              <option value="rejected" className="bg-slate-800">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">No applications found</h3>
              <p className="text-purple-200">
                {applications.length === 0 
                  ? "You haven't applied to any jobs yet. Start your job search to see applications here."
                  : "Try adjusting your search criteria or filters."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 hover:scale-105 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedApplication(application)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white truncate group-hover:text-purple-200 transition-colors">
                            {application.job_title}
                          </h3>
                          <p className="text-purple-200 text-sm">{application.company_name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-purple-200 mb-4">
                        {application.job_type && (
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>{application.job_type}</span>
                          </div>
                        )}
                        {application.budget_cost && (
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4" />
                            <span>${application.budget_cost.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-purple-300">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Applied {formatDate(application.applied_at)}</span>
                        </div>
                        {application.job_path && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(application.job_path, '_blank')
                            }}
                            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>View Job</span>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(application.application_status)}`}>
                        {getStatusIcon(application.application_status)}
                        <span className="ml-2 capitalize">{application.application_status}</span>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedApplication(application)
                        }}
                        className="p-2 text-purple-300 hover:text-white transition-colors"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-purple-300 mb-2">
                      <span>Application Progress</span>
                      <span>{application.application_status === 'accepted' ? '100%' : application.application_status === 'rejected' ? '100%' : '50%'}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          application.application_status === 'accepted' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          application.application_status === 'rejected' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                          'bg-gradient-to-r from-amber-500 to-orange-500'
                        }`}
                        style={{ width: application.application_status === 'accepted' || application.application_status === 'rejected' ? '100%' : '50%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Application Details</h2>
                  </div>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="p-3 text-purple-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-2">{selectedApplication.job_title}</h3>
                    <p className="text-purple-200 text-lg">{selectedApplication.company_name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <p className="font-semibold text-purple-200 mb-3">Status</p>
                      <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(selectedApplication.application_status)}`}>
                        {getStatusIcon(selectedApplication.application_status)}
                        <span className="ml-2 capitalize">{selectedApplication.application_status}</span>
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <p className="font-semibold text-purple-200 mb-3">Applied Date</p>
                      <p className="text-white text-lg">{formatDate(selectedApplication.applied_at)}</p>
                    </div>
                  </div>
                  
                  {selectedApplication.job_description && (
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <p className="text-lg font-bold text-white mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-purple-400" />
                        Job Description
                      </p>
                      <div className="text-sm text-purple-200 bg-white/5 rounded-xl p-4 max-h-40 overflow-y-auto leading-relaxed">
                        {selectedApplication.job_description}
                      </div>
                    </div>
                  )}
                  
                  {selectedApplication.resume && (
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <p className="text-lg font-bold text-white mb-4 flex items-center">
                        <Download className="h-5 w-5 mr-2 text-blue-400" />
                        Resume Used
                      </p>
                      <div className="text-sm text-purple-200 bg-white/5 rounded-xl p-4 max-h-40 overflow-y-auto leading-relaxed">
                        {selectedApplication.resume.substring(0, 500)}...
                      </div>
                    </div>
                  )}
                  
                  {selectedApplication.cover_letter && (
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <p className="text-lg font-bold text-white mb-4 flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2 text-green-400" />
                        Cover Letter
                      </p>
                      <div className="text-sm text-purple-200 bg-white/5 rounded-xl p-4 max-h-40 overflow-y-auto leading-relaxed">
                        {selectedApplication.cover_letter.substring(0, 500)}...
                      </div>
                    </div>
                  )}
                  
                  {selectedApplication.job_path && (
                    <div className="pt-6 border-t border-white/20">
                      <button
                        onClick={() => window.open(selectedApplication.job_path, '_blank')}
                        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-4 px-6 rounded-2xl text-lg font-bold hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl hover:shadow-purple-500/25"
                      >
                        <ExternalLink className="h-6 w-6" />
                        <span>View Original Job Posting</span>
                        <Rocket className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApplicationsPage
