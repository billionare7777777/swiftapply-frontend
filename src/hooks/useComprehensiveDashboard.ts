// Comprehensive Dashboard Hook for all database tables

import { useState, useEffect, useCallback } from 'react'
import { 
  comprehensiveDashboardService, 
  ComprehensiveDashboardData, 
  UserDashboardStats, 
  DashboardAnalytics 
} from '../services/comprehensiveDashboardService'

export const useComprehensiveDashboard = (userId?: number) => {
  const [comprehensiveData, setComprehensiveData] = useState<ComprehensiveDashboardData | null>(null)
  const [userData, setUserData] = useState<UserDashboardStats | null>(null)
  const [analyticsData, setAnalyticsData] = useState<DashboardAnalytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchComprehensiveData = useCallback(async (forceRefresh: boolean = false) => {
    if (!forceRefresh && comprehensiveData) return

    try {
      setLoading(true)
      setError(null)
      const data = await comprehensiveDashboardService.getComprehensiveStats()
      setComprehensiveData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comprehensive dashboard data')
    } finally {
      setLoading(false)
    }
  }, [comprehensiveData])

  const fetchUserData = useCallback(async (userId: number, forceRefresh: boolean = false) => {
    if (!forceRefresh && userData) return

    try {
      setLoading(true)
      setError(null)
      const data = await comprehensiveDashboardService.getUserStats(userId)
      setUserData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user dashboard data')
    } finally {
      setLoading(false)
    }
  }, [userData])

  const fetchAnalyticsData = useCallback(async (forceRefresh: boolean = false) => {
    if (!forceRefresh && analyticsData) return

    try {
      setLoading(true)
      setError(null)
      const data = await comprehensiveDashboardService.getAnalytics()
      setAnalyticsData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data')
    } finally {
      setLoading(false)
    }
  }, [analyticsData])

  const refreshAllData = useCallback(async () => {
    await Promise.all([
      fetchComprehensiveData(true),
      userId ? fetchUserData(userId, true) : Promise.resolve(),
      fetchAnalyticsData(true)
    ])
  }, [fetchComprehensiveData, fetchUserData, fetchAnalyticsData, userId])

  const getFormattedStats = useCallback(() => {
    if (!comprehensiveData) return null
    return comprehensiveDashboardService.formatStatsForDisplay(comprehensiveData)
  }, [comprehensiveData])

  const getFormattedUserStats = useCallback(() => {
    if (!userData) return null
    return comprehensiveDashboardService.formatUserStatsForDisplay(userData)
  }, [userData])

  const getFormattedAnalytics = useCallback(() => {
    if (!analyticsData) return null
    return comprehensiveDashboardService.formatAnalyticsForDisplay(analyticsData)
  }, [analyticsData])

  useEffect(() => {
    fetchComprehensiveData()
    if (userId) {
      fetchUserData(userId)
    }
    fetchAnalyticsData()
  }, [fetchComprehensiveData, fetchUserData, fetchAnalyticsData, userId])

  return {
    // Data
    comprehensiveData,
    userData,
    analyticsData,
    
    // Loading states
    loading,
    error,
    
    // Actions
    fetchComprehensiveData,
    fetchUserData,
    fetchAnalyticsData,
    refreshAllData,
    
    // Formatted data
    getFormattedStats,
    getFormattedUserStats,
    getFormattedAnalytics
  }
}
