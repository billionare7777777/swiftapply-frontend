// Core type definitions for the Job Apply MVP Frontend

export interface Job {
  id: string
  title: string
  company: string
  company_avatar?: string
  location?: string
  job_type?: string
  salary_range?: string
  url?: string
  posted_date?: string
  scraped_at?: string
}

// Database job type (matches backend response)
export interface DatabaseJob {
  id: number
  job_id: string
  title: string
  company_name: string
  company_avatar_path?: string
  job_type?: string
  budget_cost?: number
  min_budget?: number
  max_budget?: number
  location?: string
  job_path?: string
  creation_time: string
  scraped_time: string
  is_active: boolean
  created_at?: string
  updated_at?: string
  scraped_by_user_id?: number
  session_id?: string
}

export interface JobSearchFilters {
  query?: string
  location?: string
  company?: string
  salary_min?: number
  job_type?: string
  experience_level?: string
}

export interface JobSearchResponse {
  jobs: Job[]
  total: number
  filters_applied?: JobSearchFilters
}

export interface DashboardStats {
  total_jobs: number
  companies_count: number
  locations_count: number
  categories: {
    engineering: number
    design: number
    data: number
    product: number
    marketing: number
    sales: number
  }
  remote_jobs: number
  onsite_jobs: number
  last_scrape: string | null
}

export interface Application {
  id: string
  job_id: string
  job_title: string
  company: string
  job_url: string
  application_date: string
  status: ApplicationStatus
  application_type: 'auto' | 'manual'
  resume_content?: string
  cover_letter?: string
  notes?: string
  match_score?: number
  follow_up_date?: string
  gpt_responses?: Record<string, string>
  custom_cv_path?: string
  created_at?: string
  updated_at?: string
}

export enum ApplicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  INTERVIEWED = 'interviewed',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
  WITHDRAWN = 'withdrawn'
}

export interface ResumeTemplate {
  id: string
  name: string
  description: string
  preview: string
}

export interface UserData {
  name: string
  email: string
  phoneNumber?: string
  location?: string
  summary: string
  skills: string[]
  experience: Experience[]
  education: Education[]
}

export interface Experience {
  company: string
  position: string
  duration: string
  description: string
}

export interface Education {
  institution: string
  degree: string
  field: string
  year: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ComponentRegistry {
  [key: string]: React.ComponentType<any>
}

export interface ServiceRegistry {
  [key: string]: any
}

export type TabType = 'dashboard' | 'job-search' | 'scraped-jobs' | 'resume-generator' | 'job-apply' | 'application-dashboard'

// New types for enhanced job application features
export interface JobApplicationRequest {
  job_id: string
  application_type: 'auto' | 'manual'
  user_data?: UserProfile
  custom_resume?: string
}

export interface UserProfile {
  name: string
  email: string
  phone?: string
  location?: string
  linkedin_url?: string
  portfolio_url?: string
  summary: string
  skills: string[]
  experience: Experience[]
  education: Education[]
  certifications?: string[]
  languages?: string[]
}

export interface JobApplicationResponse {
  success: boolean
  application_id?: string
  job_url?: string
  custom_cv_path?: string
  gpt_responses?: Record<string, string>
  error?: string
}

export interface JobDetails {
  id: string
  title: string
  company: string
  description: string
  requirements: string[]
  benefits: string[]
  application_questions: ApplicationQuestion[]
  application_url: string
  salary_range?: string
  location?: string
  job_type?: string
  posted_date?: string
}

export interface ApplicationQuestion {
  id: string
  question: string
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'file'
  required: boolean
  options?: string[]
  max_length?: number
}

export interface GPTResponse {
  question_id: string
  response: string
  confidence_score: number
  reasoning?: string
}

export interface ApplicationProgress {
  step: number
  total_steps: number
  current_action: string
  status: 'processing' | 'completed' | 'error'
  message?: string
}
