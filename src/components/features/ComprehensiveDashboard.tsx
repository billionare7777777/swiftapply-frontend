// Comprehensive Dashboard component displaying data from all database tables

import React, { useState, useEffect } from 'react'
import { 
  Briefcase, Building2, Users, Calendar, TrendingUp, Sparkles, Target, Zap, 
  RefreshCw, Star, Award, Rocket, Globe, BarChart3, Activity, ArrowUpRight, 
  ArrowDownRight, CheckCircle, Clock, AlertCircle, FileText, Send, 
  UserCheck, Database, PieChart, LineChart, TrendingDown, Eye, 
  BookOpen, UserPlus, FileCheck, Activity as ActivityIcon
} from 'lucide-react'
import { useComprehensiveDashboard } from '../../hooks/useComprehensiveDashboard'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { ErrorMessage } from '../ui/ErrorMessage'

interface ComprehensiveDashboardProps {
  userId?: number
}

export const ComprehensiveDashboard: React.FC<ComprehensiveDashboardProps> = ({ userId }) => {
  const {
    comprehensiveData,
    userData,
    analyticsData,
    loading,
    error,
    refreshAllData,
    getFormattedStats,
    getFormattedUserStats,
    getFormattedAnalytics
  } = useComprehensiveDashboard(userId)

  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'user'>('overview')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (loading && !comprehensiveData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative group">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-emerald-500/25 transition-all duration-500"></div>
            <div className="relative p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <RefreshCw className="h-10 w-10 text-white animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Loading Dashboard</h2>
              <p className="text-gray-300">Analyzing all database tables and preparing comprehensive insights...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    const isConnectionError = error.includes('Unable to connect to the server') || error.includes('Failed to fetch')
    
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative group">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-red-500/25 transition-all duration-500"></div>
            <div className="relative p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <AlertCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Unable to Load Dashboard</h2>
              <p className="text-gray-300 mb-6">
                {isConnectionError 
                  ? 'Unable to connect to the backend server. Please make sure the backend server is running on https://locust-one-mutt.ngrok-free.app.'
                  : 'There was an error loading your comprehensive dashboard data.'
                }
              </p>
              {isConnectionError && (
                <div className="mb-6 p-4 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                  <p className="text-yellow-200 text-sm">
                    <strong>To start the backend server:</strong><br />
                    1. Open a terminal in the <code className="bg-black/20 px-2 py-1 rounded">backend</code> directory<br />
                    2. Run <code className="bg-black/20 px-2 py-1 rounded">python app.py</code><br />
                    3. Wait for "Running on https://locust-one-mutt.ngrok-free.app" message
                  </p>
                </div>
              )}
              <button
                onClick={refreshAllData}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formattedStats = getFormattedStats()
  const formattedUserStats = getFormattedUserStats()
  const formattedAnalytics = getFormattedAnalytics()

  if (!formattedStats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative group">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-yellow-500/25 transition-all duration-500"></div>
            <div className="relative p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No Data Available</h2>
              <p className="text-gray-300 mb-6">No comprehensive dashboard data is currently available.</p>
              <button
                onClick={refreshAllData}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
              >
                Load Data
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Navigation */}
        <div className={`mb-16 text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'overview'
                ? 'bg-white/20 text-white shadow-lg'
                : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/15'
            }`}
          >
            <BarChart3 className="h-5 w-5 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'analytics'
                ? 'bg-white/20 text-white shadow-lg'
                : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/15'
            }`}
          >
            <LineChart className="h-5 w-5 inline mr-2" />
            Analytics
          </button>
          {userId && (
            <button
              onClick={() => setActiveTab('user')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'user'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/15'
              }`}
            >
              <UserCheck className="h-5 w-5 inline mr-2" />
              Personal
            </button>
          )}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className={`transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Total Users */}
            <div 
              className="group relative"
              onMouseEnter={() => setHoveredCard('users')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500 hover:transform hover:scale-105">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-green-400">
                      <ArrowUpRight className="h-4 w-4" />
                      <span className="text-sm font-semibold">+{formattedStats.newUsers30d}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                    {formattedStats.totalUsers?.toLocaleString() || 0}
                  </h3>
                  <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    Total Users
                  </p>
                  <div className="mt-4 w-full bg-white/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Jobs */}
            <div 
              className="group relative"
              onMouseEnter={() => setHoveredCard('jobs')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-emerald-500/25 transition-all duration-500 hover:transform hover:scale-105">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <Briefcase className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-green-400">
                      <ArrowUpRight className="h-4 w-4" />
                      <span className="text-sm font-semibold">+{formattedStats.jobsLast7d}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                    {formattedStats.totalJobs?.toLocaleString() || 0}
                  </h3>
                  <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    Total Jobs
                  </p>
                  <div className="mt-4 w-full bg-white/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Applications */}
            <div 
              className="group relative"
              onMouseEnter={() => setHoveredCard('applications')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500 hover:transform hover:scale-105">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <Send className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-green-400">
                      <ArrowUpRight className="h-4 w-4" />
                      <span className="text-sm font-semibold">+{formattedStats.applications30d}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                    {formattedStats.totalApplications?.toLocaleString() || 0}
                  </h3>
                  <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    Applications
                  </p>
                  <div className="mt-4 w-full bg-white/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Resumes */}
            <div 
              className="group relative"
              onMouseEnter={() => setHoveredCard('resumes')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-orange-500/25 transition-all duration-500 hover:transform hover:scale-105">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-green-400">
                      <ArrowUpRight className="h-4 w-4" />
                      <span className="text-sm font-semibold">+{formattedStats.resumes30d}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors duration-300">
                    {formattedStats.totalResumes?.toLocaleString() || 0}
                  </h3>
                  <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    Resumes
                  </p>
                  <div className="mt-4 w-full bg-white/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-1000" style={{ width: '55%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Success Rate */}
            <div className="group relative p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-green-500/25 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <h3 className="text-3xl font-bold text-white">{formattedStats.successRate}%</h3>
                  <p className="text-gray-300">Success Rate</p>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(formattedStats.successRate, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Application Rate */}
            <div className="group relative p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <ActivityIcon className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <h3 className="text-3xl font-bold text-white">{formattedStats.applicationRate}%</h3>
                  <p className="text-gray-300">Application Rate</p>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(formattedStats.applicationRate, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Active Jobs */}
            <div className="group relative p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <h3 className="text-3xl font-bold text-white">{formattedStats.activeJobs?.toLocaleString() || 0}</h3>
                  <p className="text-gray-300">Active Jobs</p>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${(formattedStats.activeJobs / formattedStats.totalJobs) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Job Categories */}
          <div className="mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-emerald-500/25 transition-all duration-500"></div>
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                      Job Categories Distribution
                    </h2>
                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                      Breakdown of jobs by category across all database tables
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <PieChart className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                {Object.keys(formattedStats.jobCategories).length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {Object.entries(formattedStats.jobCategories).map(([category, count], index) => {
                      const colors = ['blue', 'emerald', 'purple', 'orange', 'rose', 'indigo', 'teal', 'cyan'] as const
                      const color = colors[index % colors.length]
                      return (
                        <div key={category} className="group/category">
                          <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105 group-hover/category:shadow-lg">
                            <div className="text-center">
                              <div className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-xl flex items-center justify-center group-hover/category:scale-110 transition-transform duration-300`}>
                                <BarChart3 className="h-6 w-6 text-white" />
                              </div>
                              <h3 className="text-lg font-semibold text-white mb-2 group-hover/category:text-emerald-300 transition-colors duration-300">
                                {category}
                              </h3>
                              <p className={`text-2xl font-bold text-${color}-400 group-hover/category:text-${color}-300 transition-colors duration-300`}>
                                {count as number}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-slate-500 to-slate-600 rounded-3xl flex items-center justify-center shadow-lg mb-8">
                      <BarChart3 className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4">No Categories Available</h3>
                    <p className="text-gray-300 mb-8 max-w-md mx-auto">
                      Job categories will appear here once jobs are loaded and analyzed.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500"></div>
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                      Recent Activity
                    </h2>
                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                      Latest applications and user activities across all tables
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                {formattedStats.recentActivity && formattedStats.recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {formattedStats.recentActivity.map((activity, index) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <Send className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{activity.type} at {activity.company}</p>
                            <p className="text-sm text-gray-300">{activity.job_title}</p>
                            <p className="text-xs text-gray-400">{activity.user_name} • {new Date(activity.date).toLocaleString()}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          activity.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          activity.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                          activity.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-slate-500 to-slate-600 rounded-3xl flex items-center justify-center shadow-lg mb-8">
                      <Activity className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4">No Recent Activity</h3>
                    <p className="text-gray-300 mb-8 max-w-md mx-auto">
                      Recent activities will appear here as users interact with the system.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && formattedAnalytics && (
        <div className={`transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Success Rate by Job Type */}
          <div className="mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-green-500/25 transition-all duration-500"></div>
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors duration-300">
                      Success Rate by Job Type
                    </h2>
                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                      Application success rates across different job categories
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                {formattedAnalytics.successByJobType.length > 0 ? (
                  <div className="space-y-4">
                    {formattedAnalytics.successByJobType.map((item, index) => (
                      <div key={item.job_type} className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-white">{item.job_type}</h3>
                          <span className="text-2xl font-bold text-green-400">{item.success_rate}%</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-300">
                          <span>{item.total_applications} total applications</span>
                          <span>{item.accepted_applications} accepted</span>
                        </div>
                        <div className="mt-3 w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000" 
                            style={{ width: `${Math.min(item.success_rate, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-slate-500 to-slate-600 rounded-3xl flex items-center justify-center shadow-lg mb-8">
                      <TrendingUp className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4">No Analytics Data</h3>
                    <p className="text-gray-300 mb-8 max-w-md mx-auto">
                      Analytics data will appear here as more applications are processed.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500"></div>
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                      Monthly Application Trends
                    </h2>
                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                      Application volume and success over the past 12 months
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <LineChart className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                {formattedAnalytics.monthlyTrends.length > 0 ? (
                  <div className="space-y-4">
                    {formattedAnalytics.monthlyTrends.slice(0, 6).map((trend, index) => (
                      <div key={trend.month} className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {new Date(trend.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </h3>
                          <div className="flex items-center space-x-4">
                            <span className="text-blue-400 font-semibold">{trend.applications} applications</span>
                            <span className="text-green-400 font-semibold">{trend.accepted} accepted</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-white/20 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000" 
                              style={{ width: `${(trend.applications / Math.max(...formattedAnalytics.monthlyTrends.map(t => t.applications))) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-300">
                            {trend.applications > 0 ? Math.round((trend.accepted / trend.applications) * 100) : 0}% success
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-slate-500 to-slate-600 rounded-3xl flex items-center justify-center shadow-lg mb-8">
                      <LineChart className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4">No Trend Data</h3>
                    <p className="text-gray-300 mb-8 max-w-md mx-auto">
                      Monthly trends will appear here as more data is collected.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Tab */}
      {activeTab === 'user' && formattedUserStats && (
        <div className={`transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* User Application Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="group relative p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Send className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <h3 className="text-3xl font-bold text-white">{formattedUserStats.totalApplications}</h3>
                  <p className="text-gray-300">Total Applications</p>
                </div>
              </div>
            </div>

            <div className="group relative p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-green-500/25 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <h3 className="text-3xl font-bold text-white">{formattedUserStats.successRate}%</h3>
                  <p className="text-gray-300">Success Rate</p>
                </div>
              </div>
            </div>

            <div className="group relative p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <h3 className="text-3xl font-bold text-white">{formattedUserStats.totalResumes}</h3>
                  <p className="text-gray-300">Resumes</p>
                </div>
              </div>
            </div>

            <div className="group relative p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-orange-500/25 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <h3 className="text-3xl font-bold text-white">{formattedUserStats.applications30d}</h3>
                  <p className="text-gray-300">Last 30 Days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500"></div>
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                      Your Recent Applications
                    </h2>
                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                      Track your application progress and status
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                {formattedUserStats.recentApplications.length > 0 ? (
                  <div className="space-y-4">
                    {formattedUserStats.recentApplications.map((application, index) => (
                      <div key={application.id} className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{application.job_title}</p>
                            <p className="text-sm text-gray-300">{application.company} • {application.job_type}</p>
                            <p className="text-xs text-gray-400">{new Date(application.applied_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          application.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                          application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {application.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-slate-500 to-slate-600 rounded-3xl flex items-center justify-center shadow-lg mb-8">
                      <Send className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4">No Applications Yet</h3>
                    <p className="text-gray-300 mb-8 max-w-md mx-auto">
                      Start applying to jobs to see your application history here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={refreshAllData}
          disabled={loading}
          className="group/btn relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-center space-x-3">
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : 'group-hover/btn:rotate-180'} transition-transform duration-300`} />
            <span>{loading ? 'Refreshing...' : 'Refresh All Data'}</span>
          </div>
        </button>
      </div>
    </div>
  )
}

export default ComprehensiveDashboard
