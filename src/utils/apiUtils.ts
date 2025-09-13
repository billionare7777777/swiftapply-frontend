/**
 * API Utility Functions
 * Handles consistent API URL construction across the application
 */

/**
 * Constructs the full API URL by handling the base URL and endpoint properly
 * @param endpoint - The API endpoint (e.g., '/resumes/user', '/jobs/search')
 * @returns The complete API URL
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://chemurgic-scalably-selena.ngrok-free.dev/api'
  
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  
  // Check if base URL already ends with '/api'
  if (baseUrl.endsWith('/api')) {
    return `${baseUrl}/${cleanEndpoint}`
  } else {
    return `${baseUrl}/api/${cleanEndpoint}`
  }
}

/**
 * Creates a fetch request with proper headers for API calls
 * @param endpoint - The API endpoint
 * @param options - Fetch options
 * @returns Promise<Response>
 */
export async function apiRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const url = getApiUrl(endpoint)
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    ...options.headers
  }
  
  return fetch(url, {
    ...options,
    headers: defaultHeaders
  })
}

/**
 * Creates an authenticated API request with user ID header
 * @param endpoint - The API endpoint
 * @param userId - The user ID
 * @param options - Fetch options
 * @returns Promise<Response>
 */
export async function authenticatedApiRequest(
  endpoint: string, 
  userId: string | number, 
  options: RequestInit = {}
): Promise<Response> {
  return apiRequest(endpoint, {
    ...options,
    headers: {
      'X-User-ID': userId.toString(),
      ...options.headers
    }
  })
}
