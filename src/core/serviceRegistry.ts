// Service registry for managing application services

import { jobService } from '../services/jobService'
import { applicationService } from '../services/applicationService'
import { resumeService } from '../services/resumeService'
import { dashboardService } from '../services/dashboardService'
import { comprehensiveDashboardService } from '../services/comprehensiveDashboardService'

export interface ServiceRegistry {
  [key: string]: any
}

class ServiceRegistryManager {
  private services: ServiceRegistry = {}

  constructor() {
    this.initializeServices()
  }

  private initializeServices(): void {
    this.register('jobService', jobService)
    this.register('applicationService', applicationService)
    this.register('resumeService', resumeService)
    this.register('dashboardService', dashboardService)
    this.register('comprehensiveDashboardService', comprehensiveDashboardService)
  }

  register(name: string, service: any): void {
    if (this.services[name]) {
      console.warn(`Service '${name}' is already registered. Overwriting.`)
    }
    this.services[name] = service
    console.log(`Service '${name}' registered successfully`)
  }

  get<T>(name: string): T | null {
    const service = this.services[name]
    if (!service) {
      console.error(`Service '${name}' not found in registry`)
      return null
    }
    return service as T
  }

  unregister(name: string): boolean {
    if (this.services[name]) {
      delete this.services[name]
      console.log(`Service '${name}' unregistered successfully`)
      return true
    } else {
      console.warn(`Service '${name}' not found in registry`)
      return false
    }
  }

  listServices(): string[] {
    return Object.keys(this.services)
  }

  clear(): void {
    this.services = {}
    console.log('Service registry cleared')
  }

  isInitialized(): boolean {
    return Object.keys(this.services).length > 0
  }
}

// Export singleton instance
export const serviceRegistry = new ServiceRegistryManager()

// Export individual services for convenience
export const getJobService = () => serviceRegistry.get('jobService') as any
export const getApplicationService = () => serviceRegistry.get('applicationService') as any
export const getResumeService = () => serviceRegistry.get('resumeService') as any
export const getDashboardService = () => serviceRegistry.get('dashboardService') as any
export const getComprehensiveDashboardService = () => serviceRegistry.get('comprehensiveDashboardService') as any
