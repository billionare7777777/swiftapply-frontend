/**
 * Profile Service - Handles profile data management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://locust-one-mutt.ngrok-free.app/api'

export interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  bio: string
  jobTitle: string
  company: string
  skills: string[]
  education: {
    degree: string
    institution: string
    year: string
  }[]
  linkedin: string
  github: string
  twitter: string
  instagram: string
  employment: {
    title: string
    description: string
    date: string
  }[]
}

export interface ApiProfileData {
  id: number
  first_name: string
  last_name: string
  email: string
  phone_number: string
  location_city: string
  bio: string
  job_title: string
  company: string
  skills: string[]
  education: {
    degree: string
    institution: string
    year: string
  }[]
  linkedin: string
  github: string
  twitter: string
  instagram: string
  employment: {
    title: string
    description: string
    date: string
  }[]
  created_at: string
  updated_at: string
}

class ProfileService {
  private getAuthHeaders(): HeadersInit {
    const user = localStorage.getItem('user')
    if (!user) {
      throw new Error('User not authenticated')
    }
    
    const userData = JSON.parse(user)
    console.log('ProfileService: User data from localStorage:', userData)
    
    if (!userData.id) {
      throw new Error('User ID not found in user data')
    }
    
    return {
      'Content-Type': 'application/json',
      'X-User-ID': userData.id.toString(),
      'ngrok-skip-browser-warning': 'true'
    }
  }

  private transformToApiFormat(profileData: ProfileData): Partial<ApiProfileData> {
    return {
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      email: profileData.email,
      phone_number: profileData.phone,
      location_city: profileData.location,
      bio: profileData.bio,
      job_title: profileData.jobTitle,
      company: profileData.company,
      skills: profileData.skills,
      education: profileData.education,
      linkedin: profileData.linkedin,
      github: profileData.github,
      twitter: profileData.twitter,
      instagram: profileData.instagram,
      employment: profileData.employment
    }
  }

  private transformFromApiFormat(apiData: ApiProfileData): ProfileData {
    return {
      firstName: apiData.first_name,
      lastName: apiData.last_name,
      email: apiData.email,
      phone: apiData.phone_number || '',
      location: apiData.location_city || '',
      bio: apiData.bio || '',
      jobTitle: apiData.job_title || '',
      company: apiData.company || '',
      skills: apiData.skills || [],
      education: apiData.education || [],
      linkedin: apiData.linkedin || '',
      github: apiData.github || '',
      twitter: apiData.twitter || '',
      instagram: apiData.instagram || '',
      employment: apiData.employment || []
    }
  }

  async getProfile(): Promise<ProfileData> {
    try {
      const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`
      const response = await fetch(`${base}/profile/get`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 404) {
          // User not found - clear localStorage and redirect to login
          localStorage.removeItem('user')
          window.location.href = '/login'
          throw new Error('User session expired. Please log in again.')
        }
        
        throw new Error(`Failed to fetch profile: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch profile')
      }

      return this.transformFromApiFormat(data.profile)
    } catch (error) {
      console.error('Error fetching profile:', error)
      throw error
    }
  }

  async updateProfile(profileData: ProfileData): Promise<ProfileData> {
    try {
      const apiData = this.transformToApiFormat(profileData)
      console.log('ProfileService: Updating profile with data:', apiData)
      
      const headers = this.getAuthHeaders()
      console.log('ProfileService: Request headers:', headers)
      
      const base = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`
      const response = await fetch(`${base}/profile/update`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(apiData)
      })

      console.log('ProfileService: Response status:', response.status)
      console.log('ProfileService: Response ok:', response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('ProfileService: Error response:', errorText)
        
        // Handle specific error cases
        if (response.status === 404) {
          // User not found - clear localStorage and redirect to login
          localStorage.removeItem('user')
          window.location.href = '/login'
          throw new Error('User session expired. Please log in again.')
        }
        
        throw new Error(`Failed to update profile: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('ProfileService: Response data:', data)
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update profile')
      }

      return this.transformFromApiFormat(data.profile)
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }
}

export const profileService = new ProfileService()
