// JobSearch component for searching and displaying jobs

import React, { useState, useEffect } from 'react'
import { RefreshCw, Search, Sparkles, Target, Zap, Grid3X3, List, Star, Globe, TrendingUp, Filter, ArrowRight, CheckCircle, Clock, AlertCircle, Rocket, Award, Heart, Users, MapPin, Briefcase, DollarSign, Calendar, Eye, Bookmark, Share2, ThumbsUp, MessageCircle, Bell, Gift, Crown, Trophy, Flame, Rainbow, Sun, Moon, Zap as Lightning } from 'lucide-react'
import { useJobs } from '../../hooks/useJobs'
import { Job, JobSearchFilters, DatabaseJob } from '../../types'
import JobCard from '../ui/JobCard'
import { JobListItem } from '../ui/JobListItem'
import { SearchFilters } from '../ui/SearchFilters'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { ErrorMessage } from '../ui/ErrorMessage'

interface JobSearchProps {
  onStatsUpdate?: () => void
}

export const JobSearch: React.FC<JobSearchProps> = ({ onStatsUpdate }) => {
  const {
    jobs,
    loading,
    error,
    lastUpdated,
    fetchJobs,
    searchJobs,
    forceScrape
  } = useJobs()

  const [searchResults, setSearchResults] = useState<Job[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchFilters, setSearchFilters] = useState<JobSearchFilters>({
    query: '',
    location: '',
    company: '',
    salary_min: 0,
    job_type: '',
    experience_level: ''
  })
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [viewFormat, setViewFormat] = useState<'list' | 'card'>('list')
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [favoriteJobs, setFavoriteJobs] = useState<Set<string>>(new Set())
  const [viewedJobs, setViewedJobs] = useState<Set<string>>(new Set())
  const [showCelebration, setShowCelebration] = useState(false)
  const [particleAnimation, setParticleAnimation] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<'day' | 'night'>('day')

  useEffect(() => {
    setIsVisible(true)
    if (onStatsUpdate) {
      onStatsUpdate()
    }
  }, [jobs, onStatsUpdate])

  const handleSearch = async () => {
    setIsSearching(true)
    try {
      const results = await searchJobs(searchFilters)
      setSearchResults(results)
      setShowSearchResults(true)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleForceScrape = async () => {
    const result = await forceScrape()
    if (result.success) {
      setShowSearchResults(false)
    }
  }


  const handleAutoApply = (job: Job) => {
    if (!job.url) {
      alert('❌ Job URL not available for this position.')
      return
    }

    try {
      console.log('🚀 Opening job URL for auto apply:', job.title)
      console.log('🌐 Job URL:', job.url)
      
      // Open job URL in new tab
      const newWindow = window.open(job.url, '_blank', 'noopener,noreferrer')
      
      if (newWindow) {
        // Show success message
        alert(`✅ Auto Apply: Job page opened!\n\nJob: ${job.title}\nCompany: ${job.company}\n\nComplete your application in the new tab.`)
      } else {
        alert('❌ Failed to open job URL. Please check your popup blocker settings.')
      }
    } catch (error) {
      console.error('❌ Auto apply error:', error)
      alert(`Auto apply error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleManualApply = (job: Job) => {
    if (!job.url) {
      alert('❌ Job URL not available for this position.')
      return
    }

    try {
      console.log('🖱️ Opening job URL for manual apply:', job.title)
      console.log('🌐 Job URL:', job.url)
      
      // Open job URL in new tab
      const newWindow = window.open(job.url, '_blank', 'noopener,noreferrer')
      
      if (newWindow) {
        // Show success message
        alert(`✅ Manual Apply: Job page opened!\n\nJob: ${job.title}\nCompany: ${job.company}\n\nComplete your application in the new tab.`)
      } else {
        alert('❌ Failed to open job URL. Please check your popup blocker settings.')
      }
    } catch (error) {
      console.error('❌ Manual apply error:', error)
      alert(`Manual apply error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleFavoriteJob = (jobId: string) => {
    setFavoriteJobs(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(jobId)) {
        newFavorites.delete(jobId)
      } else {
        newFavorites.add(jobId)
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 2000)
      }
      return newFavorites
    })
  }

  const handleViewJob = (jobId: string) => {
    setViewedJobs(prev => new Set(prev).add(jobId))
  }

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'day' ? 'night' : 'day')
    setParticleAnimation(true)
    setTimeout(() => setParticleAnimation(false), 1000)
  }

  const displayJobs = showSearchResults ? searchResults : jobs

  // Convert Job to DatabaseJob for compatibility with components
  const convertJobToDatabaseJob = (job: Job): DatabaseJob => ({
    id: parseInt(job.id) || 0,
    job_id: job.id,
    title: job.title,
    company_name: job.company,
    company_avatar_path: job.company_avatar,
    job_type: job.job_type,
    location: job.location,
    job_path: job.url,
    creation_time: job.posted_date || new Date().toISOString(),
    scraped_time: job.scraped_at || new Date().toISOString(),
    is_active: true,
    created_at: job.posted_date,
    updated_at: job.scraped_at
  })

  const handleAutoApplyDatabase = (job: DatabaseJob) => {
    const jobForApply: Job = {
      id: job.job_id,
      title: job.title,
      company: job.company_name,
      company_avatar: job.company_avatar_path,
      location: job.location,
      job_type: job.job_type,
      url: job.job_path,
      posted_date: job.creation_time,
      scraped_at: job.scraped_time
    }
    handleAutoApply(jobForApply)
  }

  const handleManualApplyDatabase = (job: DatabaseJob) => {
    const jobForApply: Job = {
      id: job.job_id,
      title: job.title,
      company: job.company_name,
      company_avatar: job.company_avatar_path,
      location: job.location,
      job_type: job.job_type,
      url: job.job_path,
      posted_date: job.creation_time,
      scraped_at: job.scraped_time
    }
    handleManualApply(jobForApply)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Floating Particles Background */}
      {particleAnimation && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className={`mb-16 text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="relative inline-block mb-8 group">
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500 group-hover:rotate-12">
            <Search className="h-16 w-16 text-white group-hover:scale-110 transition-transform duration-300" />
          </div>
          
          {/* Multiple floating elements */}
          <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
            <Star className="h-5 w-5 text-yellow-800" />
          </div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center animate-pulse">
            <Heart className="h-4 w-4 text-white" />
          </div>
          <div className="absolute top-1/2 -left-6 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center animate-ping">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
          
          {/* Enhanced success rings */}
          <div className="absolute inset-0 rounded-3xl border-2 border-blue-400 animate-ping opacity-75"></div>
          <div className="absolute inset-0 rounded-3xl border-2 border-emerald-400 animate-ping opacity-50 animation-delay-1000"></div>
          <div className="absolute inset-0 rounded-3xl border-2 border-purple-400 animate-ping opacity-25 animation-delay-2000"></div>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold mb-6">
          <span className="bg-gradient-to-r from-white via-blue-200 to-emerald-200 bg-clip-text text-transparent animate-pulse">
            🚀 AI-Powered
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
            Dream Job
          </span>
          <br />
          <span className="text-4xl md:text-5xl bg-gradient-to-r from-pink-300 via-yellow-300 to-emerald-300 bg-clip-text text-transparent">
            Discovery Engine ✨
          </span>
        </h1>
        
        <p className="text-2xl text-gray-300 max-w-5xl mx-auto mb-8 leading-relaxed">
          <span className="text-white font-semibold">🌟 Discover your next career adventure</span> with our intelligent job matching system that understands your dreams.
          <span className="block mt-4 text-xl text-blue-300">
            💫 Find the perfect role that matches your skills, passions, and aspirations.
          </span>
          <span className="block mt-2 text-lg text-emerald-300">
            🎯 Your dream job is just one search away!
          </span>
        </p>

        {/* Interactive Stats */}
        <div className="flex justify-center items-center space-x-8 mb-8">
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:scale-105 transition-transform duration-300">
            <Users className="h-5 w-5 text-blue-400" />
            <span className="text-white font-semibold">10K+ Jobs</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:scale-105 transition-transform duration-300">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <span className="text-white font-semibold">95% Match Rate</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:scale-105 transition-transform duration-300">
            <Lightning className="h-5 w-5 text-purple-400" />
            <span className="text-white font-semibold">Instant Results</span>
          </div>
        </div>

        {/* Theme Toggle and Last Updated */}
        <div className="flex justify-center items-center space-x-6 mb-8">
          <button
            onClick={toggleTheme}
            className="group relative p-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            {currentTheme === 'day' ? (
              <Sun className="h-6 w-6 text-yellow-400 group-hover:rotate-180 transition-transform duration-500" />
            ) : (
              <Moon className="h-6 w-6 text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
            )}
          </button>

          {lastUpdated && (
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:scale-105 transition-transform duration-300">
              <Clock className="h-4 w-4 text-blue-300" />
              <span className="text-sm text-gray-300">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Enhanced Decorative Elements */}
        <div className="flex justify-center items-center space-x-6 mt-8">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
          <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-pulse animation-delay-200 shadow-lg shadow-emerald-400/50"></div>
          <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse animation-delay-400 shadow-lg shadow-purple-400/50"></div>
          <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse animation-delay-600 shadow-lg shadow-yellow-400/50"></div>
          <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-pulse animation-delay-800 shadow-lg shadow-red-400/50"></div>
        </div>
      </div>

      {/* Enhanced Search Filters */}
      <div className={`mb-16 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="relative group">
          {/* Glass morphism background */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500"></div>
          
          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Floating elements around the search box */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center animate-pulse">
            <Heart className="h-3 w-3 text-white" />
          </div>
          
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                  🎯 Smart Search Magic
                </h2>
                <p className="text-gray-300 group-hover:text-white transition-colors duration-300 text-lg">
                  ✨ Find jobs that match your skills and preferences with AI-powered matching that understands your dreams
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-white">🤖 AI-Powered Matching</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1 text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-semibold">Active</span>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Crown className="h-4 w-4" />
                      <span className="text-sm font-semibold">Premium</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleForceScrape}
                disabled={loading}
                className="group/btn relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <RefreshCw className={`h-6 w-6 ${loading ? 'animate-spin' : 'group-hover/btn:rotate-180'} transition-transform duration-300`} />
                  <span className="text-lg">{loading ? '🔄 Scraping...' : '🚀 Refresh Jobs'}</span>
                  {!loading && <Rocket className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />}
                </div>
              </button>
            </div>

            <SearchFilters
              filters={searchFilters}
              onFiltersChange={setSearchFilters}
              onSearch={handleSearch}
              loading={isSearching}
            />
          </div>
        </div>
      </div>

      {/* Enhanced Action Buttons */}
      <div className={`mb-12 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {displayJobs.length > 0 ? `${displayJobs.length} opportunities found` : 'No jobs found'}
                </div>
                {displayJobs.length > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-blue-300">
                    <Zap className="h-4 w-4" />
                    <span>Ready to apply</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View Format Toggle */}
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
              <button
                onClick={() => setViewFormat('list')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  viewFormat === 'list'
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setViewFormat('card')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  viewFormat === 'card'
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="hidden sm:inline">Cards</span>
              </button>
            </div>

            {showSearchResults && (
              <button
                onClick={() => setShowSearchResults(false)}
                className="group/btn relative px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <Search className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-300" />
                  <span>Show All Jobs</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Results */}
      <div className={`transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative group">
              {/* Glass morphism background */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500"></div>
              
              <div className="relative p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <RefreshCw className="h-10 w-10 text-white animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Loading Opportunities</h2>
                <p className="text-gray-300">Discovering the best job matches for you...</p>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative group">
              {/* Glass morphism background */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-red-500/25 transition-all duration-500"></div>
              
              <div className="relative p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <AlertCircle className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Failed to Load Jobs</h2>
                <p className="text-gray-300 mb-6">There was an error loading job opportunities.</p>
                <button
                  onClick={() => fetchJobs()}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        ) : displayJobs.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative group">
              {/* Glass morphism background */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-yellow-500/25 transition-all duration-500"></div>
              
              <div className="relative p-12 text-center">
                <div className="relative inline-block mb-8">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Search className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                    <Star className="h-3 w-3 text-yellow-800" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  {showSearchResults ? 'No Opportunities Found' : 'No Jobs Available'}
                </h3>
                <p className="text-gray-300 mb-8 max-w-md mx-auto text-lg">
                  {showSearchResults 
                    ? 'Try adjusting your search criteria to find more opportunities.' 
                    : 'Refresh the job listings to discover new opportunities.'
                  }
                </p>
                <button
                  onClick={handleForceScrape}
                  className="group/btn relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-3">
                    <RefreshCw className="h-5 w-5 group-hover/btn:rotate-180 transition-transform duration-300" />
                    <span>Refresh Jobs</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={viewFormat === 'list' ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}>
            {displayJobs.map((job, index) => {
              const databaseJob = convertJobToDatabaseJob(job)
              return viewFormat === 'list' ? (
                <div 
                  key={job.id}
                  className="transform transition-all duration-500 hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <JobListItem
                    job={job}
                    onAutoApply={handleAutoApply}
                    onManualApply={handleManualApply}
                  />
                </div>
              ) : (
                <div 
                  key={job.id}
                  className="transform transition-all duration-500 hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <JobCard
                    job={databaseJob}
                    onAutoApply={handleAutoApplyDatabase}
                    onManualApply={handleManualApplyDatabase}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default JobSearch
