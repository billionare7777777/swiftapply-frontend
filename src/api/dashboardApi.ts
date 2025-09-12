// Dashboard-related API endpoints

import { apiClient } from './client'
import { DashboardStats } from '../types'

export class DashboardApi {
  async getDashboardStats(): Promise<{
    stats: {
      jobs: {
        total: number
        last_updated: string | null
        job_types: Record<string, number>
        top_locations: Record<string, number>
        top_companies: Record<string, number>
      }
      applications: {
        total: number
        by_status: Record<string, number>
        success_rate: number
        recent_applications: number
      }
      summary: {
        total_jobs_available: number
        total_applications: number
        active_applications: number
        interviews_scheduled: number
      }
    }
    message: string
  }> {
    return apiClient.get('/dashboard/stats')
  }
}

export const dashboardApi = new DashboardApi()
