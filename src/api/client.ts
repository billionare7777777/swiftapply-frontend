// API client configuration and base functionality

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
console.log(API_BASE_URL);
export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Ensure we have the correct API URL structure
    const base = this.baseUrl.endsWith('/api') ? this.baseUrl : `${this.baseUrl}/api`
    const url = `${base}${endpoint}`
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...options.headers,
      },
    }

    const config = { ...defaultOptions, ...options }

    try {
      console.log(`Making API request to: ${url}`)
      const response = await fetch(url, config)
      if (!response.ok) {
        console.error(`API request failed with status ${response.status}: ${response.statusText}`)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log(`API response for ${endpoint}:`, data)
      
      // Always return the data, even for error responses
      // Let the calling code handle success/error based on the response content
      return data
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      console.error(`Request URL: ${url}`)
      console.error(`Request config:`, config)
      
      // Handle network errors gracefully
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to the server. Please make sure the backend server is running.')
      }
      
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
