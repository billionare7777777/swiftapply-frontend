// Dashboard service for managing dashboard data and operations

import { dashboardApi } from '../api/dashboardApi'
import { DashboardStats } from '../types'

export class DashboardService {
  private statsCache: any = null
  private lastFetchTime: number | null = null
  private readonly CACHE_DURATION = 2 * 60 * 1000 // 2 minutes

  async getDashboardStats(forceRefresh: boolean = false): Promise<any> {
    if (forceRefresh || this.shouldRefreshCache()) {
      await this.refreshStats()
    }
    return this.statsCache
  }

  async refreshStats(): Promise<void> {
    try {
      const response = await dashboardApi.getDashboardStats()
      this.statsCache = response.stats
      this.lastFetchTime = Date.now()
    } catch (error) {
      console.error('Error refreshing dashboard stats:', error)
      // Keep existing cache on error
    }
  }

  private shouldRefreshCache(): boolean {
    if (!this.lastFetchTime) return true
    return Date.now() - this.lastFetchTime > this.CACHE_DURATION
  }



  formatStatsForDisplay(stats: any): {
    totalJobs: number
    totalCompanies: number
    totalApplications: number
    activeApplications: number
    interviewsScheduled: number
    lastUpdated: string
    jobCategories: Record<string, number>
    topLocations: Record<string, number>
    topCompanies: Record<string, number>
  } {
    if (!stats) {
      return {
        totalJobs: 0,
        totalCompanies: 0,
        totalApplications: 0,
        activeApplications: 0,
        interviewsScheduled: 0,
        lastUpdated: 'Never',
        jobCategories: {},
        topLocations: {},
        topCompanies: {}
      }
    }

    return {
      totalJobs: stats.jobs?.total || 0,
      totalCompanies: Object.keys(stats.jobs?.top_companies || {}).length,
      totalApplications: stats.applications?.total || 0,
      activeApplications: stats.summary?.active_applications || 0,
      interviewsScheduled: stats.summary?.interviews_scheduled || 0,
      lastUpdated: this.formatLastUpdated(stats.jobs?.last_updated),
      jobCategories: stats.jobs?.job_types || {},
      topLocations: stats.jobs?.top_locations || {},
      topCompanies: stats.jobs?.top_companies || {}
    }
  }

  private formatLastUpdated(lastUpdated: string | null): string {
    if (!lastUpdated) return 'Never'
    
    const date = new Date(lastUpdated)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }
}

export const dashboardService = new DashboardService()
