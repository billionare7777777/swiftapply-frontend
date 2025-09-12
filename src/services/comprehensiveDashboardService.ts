// Comprehensive Dashboard Service for all database tables

import { apiClient } from '../api/client'

export interface DashboardOverview {
  total_users: number
  verified_users: number
  new_users_30d: number
  total_jobs: number
  active_jobs: number
  jobs_last_7d: number
  unique_companies: number
  unique_job_types: number
  total_applications: number
  pending_applications: number
  accepted_applications: number
  rejected_applications: number
  applications_30d: number
  total_resumes: number
  resumes_30d: number
  users_with_resumes: number
  success_rate: number
  application_rate: number
}

export interface EngagementMetrics {
  users_with_applications: number
  avg_applications_per_user: number
}

export interface JobCategory {
  category: string
  count: number
}

export interface TopCompany {
  company: string
  job_count: number
}

export interface TrendData {
  date: string
  applications?: number
  jobs_scraped?: number
}

export interface RecentActivity {
  id: number
  type: string
  status: string
  job_title: string
  company: string
  user_name: string
  date: string
}

export interface UserApplicationStats {
  total: number
  pending: number
  accepted: number
  rejected: number
  last_30_days: number
  success_rate: number
}

export interface UserResumeStats {
  total: number
}

export interface UserRecentApplication {
  id: number
  job_title: string
  company: string
  job_type: string
  status: string
  applied_at: string
}

export interface UserJobPreference {
  job_type: string
  count: number
}

export interface UserDashboardStats {
  applications: UserApplicationStats
  resumes: UserResumeStats
  recent_applications: UserRecentApplication[]
  job_preferences: UserJobPreference[]
  last_updated: string
}

export interface JobTypeSuccess {
  job_type: string
  total_applications: number
  accepted_applications: number
  success_rate: number
}

export interface MonthlyTrend {
  month: string
  applications: number
  accepted: number
}

export interface CompanySuccess {
  company: string
  total_applications: number
  accepted_applications: number
  success_rate: number
}

export interface DashboardAnalytics {
  success_by_job_type: JobTypeSuccess[]
  monthly_trends: MonthlyTrend[]
  top_companies_by_success: CompanySuccess[]
}

export interface ComprehensiveDashboardData {
  overview: DashboardOverview
  engagement: EngagementMetrics
  job_categories: JobCategory[]
  top_companies: TopCompany[]
  trends: {
    application_trends: TrendData[]
    scraping_trends: TrendData[]
  }
  recent_activity: RecentActivity[]
  last_updated: string
}

export class ComprehensiveDashboardService {
  async getComprehensiveStats(): Promise<ComprehensiveDashboardData> {
    const response = await apiClient.get<{success: boolean, data: ComprehensiveDashboardData, message: string}>('/dashboard/comprehensive-stats')
    return response.data
  }

  async getUserStats(userId: number): Promise<UserDashboardStats> {
    const response = await apiClient.get<{success: boolean, data: UserDashboardStats, message: string}>(`/dashboard/user-stats/${userId}`)
    return response.data
  }

  async getAnalytics(): Promise<DashboardAnalytics> {
    const response = await apiClient.get<{success: boolean, data: DashboardAnalytics, message: string}>('/dashboard/analytics')
    return response.data
  }

  formatStatsForDisplay(data: ComprehensiveDashboardData) {
    return {
      // Overview stats
      totalJobs: data.overview.total_jobs,
      totalCompanies: data.overview.unique_companies,
      totalApplications: data.overview.total_applications,
      totalUsers: data.overview.total_users,
      totalResumes: data.overview.total_resumes,
      successRate: data.overview.success_rate,
      applicationRate: data.overview.application_rate,
      
      // Recent activity
      lastUpdated: new Date(data.last_updated).toLocaleString(),
      
      // Job categories
      jobCategories: data.job_categories.reduce((acc, category) => {
        acc[category.category] = category.count
        return acc
      }, {} as Record<string, number>),
      
      // Top companies
      topCompanies: data.top_companies.slice(0, 5),
      
      // Trends
      applicationTrends: data.trends.application_trends,
      scrapingTrends: data.trends.scraping_trends,
      
      // Recent activity
      recentActivity: data.recent_activity.slice(0, 5),
      
      // Additional metrics
      activeJobs: data.overview.active_jobs,
      pendingApplications: data.overview.pending_applications,
      acceptedApplications: data.overview.accepted_applications,
      rejectedApplications: data.overview.rejected_applications,
      newUsers30d: data.overview.new_users_30d,
      applications30d: data.overview.applications_30d,
      jobsLast7d: data.overview.jobs_last_7d,
      resumes30d: data.overview.resumes_30d,
      usersWithResumes: data.overview.users_with_resumes,
      usersWithApplications: data.engagement.users_with_applications,
      avgApplicationsPerUser: data.engagement.avg_applications_per_user
    }
  }

  formatUserStatsForDisplay(data: UserDashboardStats) {
    return {
      totalApplications: data.applications.total,
      pendingApplications: data.applications.pending,
      acceptedApplications: data.applications.accepted,
      rejectedApplications: data.applications.rejected,
      applications30d: data.applications.last_30_days,
      successRate: data.applications.success_rate,
      totalResumes: data.resumes.total,
      recentApplications: data.recent_applications,
      jobPreferences: data.job_preferences,
      lastUpdated: new Date(data.last_updated).toLocaleString()
    }
  }

  formatAnalyticsForDisplay(data: DashboardAnalytics) {
    return {
      successByJobType: data.success_by_job_type,
      monthlyTrends: data.monthly_trends,
      topCompaniesBySuccess: data.top_companies_by_success
    }
  }
}

export const comprehensiveDashboardService = new ComprehensiveDashboardService()
