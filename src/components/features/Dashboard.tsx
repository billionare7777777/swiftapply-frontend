// Dashboard component for displaying overview statistics

import React, { useState, useEffect } from 'react'
import { Briefcase, Building2, Users, Calendar, TrendingUp, Sparkles, Target, Zap, RefreshCw, Star, Award, Rocket, Globe, BarChart3, Activity, ArrowUpRight, ArrowDownRight, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useDashboard } from '../../hooks/useDashboard'
import { StatCard } from '../ui/StatCard'
import { CategoryCard } from '../ui/CategoryCard'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { ErrorMessage } from '../ui/ErrorMessage'
import { GreenhouseStatus } from './GreenhouseStatus'
import { JobScrapingProgress } from './JobScrapingProgress'
import { ScrapedJobsDisplay } from './ScrapedJobsDisplay'

export const Dashboard: React.FC = () => {
  const { stats, loading, error, refreshStats, getFormattedStats } = useDashboard()
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative group">
            {/* Glass morphism background */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-emerald-500/25 transition-all duration-500"></div>
            
            <div className="relative p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <RefreshCw className="h-10 w-10 text-white animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Loading Dashboard</h2>
              <p className="text-gray-300">Preparing your AI-powered job search command center...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative group">
            {/* Glass morphism background */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-red-500/25 transition-all duration-500"></div>
            
            <div className="relative p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <AlertCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Unable to Load Dashboard</h2>
              <p className="text-gray-300 mb-6">There was an error loading your dashboard statistics.</p>
              <button
                onClick={refreshStats}
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

  if (!formattedStats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative group">
            {/* Glass morphism background */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-yellow-500/25 transition-all duration-500"></div>
            
            <div className="relative p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No Data Available</h2>
              <p className="text-gray-300 mb-6">No dashboard data is currently available.</p>
              <button
                onClick={refreshStats}
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
      {/* Hero Header */}
      <div className={`mb-16 text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="relative inline-block mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
            <Star className="h-4 w-4 text-yellow-800" />
          </div>
          {/* Success rings animation */}
          <div className="absolute inset-0 rounded-3xl border-2 border-emerald-400 animate-ping opacity-75"></div>
          <div className="absolute inset-0 rounded-3xl border-2 border-emerald-400 animate-ping opacity-50 animation-delay-1000"></div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent animate-pulse">
            AI-Powered
          </span>
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Job Search
          </span>
          <br />
          <span className="text-3xl md:text-4xl bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent">
            Command Center
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
          Track opportunities, monitor applications, and accelerate your career growth with our intelligent automation platform.
          <span className="block mt-4 text-lg text-emerald-300">
            Stop searching. Start succeeding with SwiftApply.ai.
          </span>
        </p>

        {/* Decorative Elements */}
        <div className="flex justify-center space-x-4">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse animation-delay-200"></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse animation-delay-400"></div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Available Jobs Card */}
        <div 
          className="group relative"
          onMouseEnter={() => setHoveredCard('jobs')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="relative p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500 hover:transform hover:scale-105">
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-green-400">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-semibold">+12%</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                {formattedStats.totalJobs}
              </h3>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                Available Jobs
              </p>
              
              {/* Progress bar */}
              <div className="mt-4 w-full bg-white/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Companies Card */}
        <div 
          className="group relative"
          onMouseEnter={() => setHoveredCard('companies')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="relative p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-emerald-500/25 transition-all duration-500 hover:transform hover:scale-105">
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-green-400">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-semibold">+8%</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                {formattedStats.totalCompanies}
              </h3>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                Companies
              </p>
              
              {/* Progress bar */}
              <div className="mt-4 w-full bg-white/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-1000" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Card */}
        <div 
          className="group relative"
          onMouseEnter={() => setHoveredCard('applications')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="relative p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500 hover:transform hover:scale-105">
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-green-400">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-semibold">+15%</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                {formattedStats.totalApplications}
              </h3>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                Applications
              </p>
              
              {/* Progress bar */}
              <div className="mt-4 w-full bg-white/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated Card */}
        <div 
          className="group relative"
          onMouseEnter={() => setHoveredCard('updated')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="relative p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-orange-500/25 transition-all duration-500 hover:transform hover:scale-105">
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-semibold">Live</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors duration-300">
                {formattedStats.lastUpdated}
              </h3>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                Last Updated
              </p>
              
              {/* Progress bar */}
              <div className="mt-4 w-full bg-white/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Job Scraping Progress */}
      <div className={`mb-16 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="relative group">
          {/* Glass morphism background */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-emerald-500/25 transition-all duration-500"></div>
          
          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                  Job Scraping Progress
                </h2>
                <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                  Real-time monitoring of job discovery and application processes
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-8 w-8 text-white" />
              </div>
            </div>
        <JobScrapingProgress />
          </div>
        </div>
      </div>

      {/* Enhanced Scraped Jobs Display */}
      <div className={`mb-16 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="relative group">
          {/* Glass morphism background */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500"></div>
          
          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                  Discovered Jobs
                </h2>
                <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                  Latest job opportunities found by our AI-powered scraping system
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-8 w-8 text-white" />
              </div>
            </div>
        <ScrapedJobsDisplay />
          </div>
        </div>
      </div>

      {/* Enhanced Greenhouse Integration Status */}
      <div className={`mb-16 transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="relative group">
          {/* Glass morphism background */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500"></div>
          
          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                  Greenhouse Integration
                </h2>
                <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                  Monitor your Greenhouse job board connection and automation status
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
        <GreenhouseStatus />
          </div>
        </div>
      </div>

      {/* Enhanced Job Categories */}
      <div className={`mb-16 transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="relative group">
          {/* Glass morphism background */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-emerald-500/25 transition-all duration-500"></div>
          
          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
                <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                  Job Categories
                </h2>
                <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                  Explore opportunities by field and specialization
                </p>
          </div>
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Target className="h-8 w-8 text-white" />
          </div>
        </div>
            
        {Object.keys(formattedStats.jobCategories).length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Object.entries(formattedStats.jobCategories).map(([category, count], index) => {
              const colors = ['blue', 'emerald', 'purple', 'orange', 'rose', 'indigo', 'teal'] as const
              const color = colors[index % colors.length]
              return (
                    <div key={category} className="group/category">
                      <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105 group-hover/category:shadow-lg">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center group-hover/category:scale-110 transition-transform duration-300">
                            <BarChart3 className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-2 group-hover/category:text-emerald-300 transition-colors duration-300">
                            {category}
                          </h3>
                          <p className="text-2xl font-bold text-emerald-400 group-hover/category:text-emerald-300 transition-colors duration-300">
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
                <div className="relative inline-block mb-8">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-slate-500 to-slate-600 rounded-3xl flex items-center justify-center shadow-lg">
                    <Target className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                    <Star className="h-3 w-3 text-yellow-800" />
                  </div>
            </div>
                <h3 className="text-2xl font-semibold text-white mb-4">No Categories Available</h3>
                <p className="text-gray-300 mb-8 max-w-md mx-auto">
                  Job categories will appear here once jobs are loaded and analyzed by our AI system.
                </p>
            <button
              onClick={refreshStats}
                  className="group/btn relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
            >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-3">
                    <RefreshCw className="h-5 w-5 group-hover/btn:rotate-180 transition-transform duration-300" />
              <span>Load Jobs</span>
                  </div>
            </button>
          </div>
        )}
      </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className={`transform transition-all duration-1000 delay-1200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="relative group">
          {/* Glass morphism background */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500"></div>
          
          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
                <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                  Quick Actions
                </h2>
                <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                  Streamline your job search workflow with powerful tools
                </p>
          </div>
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-white" />
          </div>
        </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={refreshStats}
                className="group/action relative p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105 group-hover/action:shadow-lg"
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center group-hover/action:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover/action:text-emerald-300 transition-colors duration-300">
                    Refresh Stats
                  </h3>
                  <p className="text-sm text-gray-300 group-hover/action:text-white transition-colors duration-300">
                    Update all data
                  </p>
                </div>
              </button>
              
              <button className="group/action relative p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105 group-hover/action:shadow-lg">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover/action:scale-110 transition-transform duration-300">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover/action:text-blue-300 transition-colors duration-300">
                    Browse Jobs
                  </h3>
                  <p className="text-sm text-gray-300 group-hover/action:text-white transition-colors duration-300">
                    Explore opportunities
                  </p>
                </div>
              </button>
              
              <button className="group/action relative p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105 group-hover/action:shadow-lg">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover/action:scale-110 transition-transform duration-300">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover/action:text-purple-300 transition-colors duration-300">
                    Auto Apply
                  </h3>
                  <p className="text-sm text-gray-300 group-hover/action:text-white transition-colors duration-300">
                    Start automation
                  </p>
                </div>
          </button>
              
              <button className="group/action relative p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105 group-hover/action:shadow-lg">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover/action:scale-110 transition-transform duration-300">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover/action:text-orange-300 transition-colors duration-300">
                    Analytics
                  </h3>
                  <p className="text-sm text-gray-300 group-hover/action:text-white transition-colors duration-300">
                    View insights
                  </p>
                </div>
          </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
