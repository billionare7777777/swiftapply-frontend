// Custom hook for managing dashboard data and operations

import { useState, useEffect, useCallback } from 'react'
import { getDashboardService } from '../core/serviceRegistry'

export const useDashboard = () => {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dashboardService = getDashboardService()

  const fetchStats = useCallback(async (forceRefresh: boolean = false) => {
    if (!dashboardService) {
      setError('Dashboard service not available')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const fetchedStats = await dashboardService.getDashboardStats(forceRefresh)
      setStats(fetchedStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats')
    } finally {
      setLoading(false)
    }
  }, [dashboardService])

  const refreshStats = useCallback(async () => {
    await fetchStats(true)
  }, [fetchStats])

  const getFormattedStats = useCallback(() => {
    if (!dashboardService) return null
    return dashboardService.formatStatsForDisplay(stats)
  }, [dashboardService, stats])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    fetchStats,
    refreshStats,
    getFormattedStats
  }
}
