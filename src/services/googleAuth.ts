// Google OAuth service for authentication

export interface GoogleUser {
  id: string
  email: string
  name: string
  picture: string
  given_name: string
  family_name: string
  auth_provider?: string
}

export interface GoogleAuthResponse {
  success: boolean
  user?: GoogleUser
  error?: string
}

export interface GoogleTokenResponse {
  success: boolean
  access_token?: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
  error?: string
}

class GoogleAuthService {
  private clientId: string
  private redirectUri: string

  constructor() {
    // These should be environment variables in production
    this.clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
    this.redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/auth/google/callback`
    
    // Debug logging
    if (typeof window !== 'undefined') {
      console.log('Google OAuth Service initialized:')
      console.log('- Client ID:', this.clientId ? `${this.clientId.substring(0, 8)}...` : 'NOT SET')
      console.log('- Redirect URI:', this.redirectUri)
      console.log('- Available:', !!this.clientId)
    }
  }

  /**
   * Initiate Google OAuth flow
   */
  async signInWithGoogle(): Promise<void> {
    if (!this.clientId) {
      throw new Error('Google Client ID not configured')
    }

    if (typeof window === 'undefined') {
      throw new Error('Google OAuth can only be used in browser environment')
    }

    const scope = 'openid email profile'
    const responseType = 'code'
    const accessType = 'offline'
    const prompt = 'consent'

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    authUrl.searchParams.set('client_id', this.clientId)
    authUrl.searchParams.set('redirect_uri', this.redirectUri)
    authUrl.searchParams.set('response_type', responseType)
    authUrl.searchParams.set('scope', scope)
    authUrl.searchParams.set('access_type', accessType)
    authUrl.searchParams.set('prompt', prompt)
    authUrl.searchParams.set('state', this.generateState())

    // Store the current URL to redirect back after authentication
    localStorage.setItem('google_auth_redirect', window.location.pathname)

    console.log('Redirecting to Google OAuth:', authUrl.toString())
    
    // Redirect to Google OAuth
    window.location.href = authUrl.toString()
  }

  /**
   * Handle Google OAuth callback
   */
  async handleCallback(code: string, state: string): Promise<GoogleAuthResponse> {
    try {
      // Verify state parameter
      if (!this.verifyState(state)) {
        throw new Error('Invalid state parameter')
      }

      console.log('Exchanging authorization code for tokens...')

      // Exchange authorization code for tokens
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://chemurgic-scalably-selena.ngrok-free.dev/api'
      const tokenApiUrl = baseUrl.endsWith('/api') ? `${baseUrl}/auth/google/token` : `${baseUrl}/api/auth/google/token`
      const tokenResponse = await fetch(tokenApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirect_uri: this.redirectUri,
        }),
      })

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to exchange authorization code')
      }

      const tokenData: GoogleTokenResponse = await tokenResponse.json()

      if (!tokenData.success || !tokenData.access_token) {
        throw new Error(tokenData.error || 'Failed to get access token')
      }

      console.log('Getting user information from Google...')

      // Get user info from Google
      const userApiUrl = baseUrl.endsWith('/api') ? `${baseUrl}/auth/google/user` : `${baseUrl}/api/auth/google/user`
      const userResponse = await fetch(userApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      })

      if (!userResponse.ok) {
        const errorData = await userResponse.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to get user information')
      }

      const userData = await userResponse.json()

      if (!userData.success || !userData.user) {
        throw new Error(userData.error || 'Failed to process user data')
      }

      console.log('Google OAuth successful:', userData.user.email)

      return {
        success: true,
        user: userData.user,
      }
    } catch (error) {
      console.error('Google OAuth callback error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      }
    }
  }

  /**
   * Generate a random state parameter for CSRF protection
   */
  private generateState(): string {
    if (typeof window === 'undefined') {
      throw new Error('State generation requires browser environment')
    }
    
    const state = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15) +
                  Date.now().toString(36)
    sessionStorage.setItem('google_oauth_state', state)
    return state
  }

  /**
   * Verify the state parameter
   */
  private verifyState(state: string): boolean {
    if (typeof window === 'undefined') {
      return false
    }
    
    const storedState = sessionStorage.getItem('google_oauth_state')
    sessionStorage.removeItem('google_oauth_state')
    return storedState === state
  }

  /**
   * Check if Google OAuth is available
   */
  isAvailable(): boolean {
    return !!this.clientId
  }
}

export const googleAuthService = new GoogleAuthService()

/**
 * Hook for Google authentication
 */
export const useGoogleAuth = () => {
  const signInWithGoogle = async (): Promise<void> => {
    try {
      if (!googleAuthService.isAvailable()) {
        throw new Error('Google OAuth is not available. Please check your configuration.')
      }
      
      await googleAuthService.signInWithGoogle()
    } catch (error) {
      console.error('Google sign-in error:', error)
      throw error
    }
  }

  const signUpWithGoogle = async (): Promise<void> => {
    // For Google OAuth, sign-in and sign-up are the same process
    return signInWithGoogle()
  }

  const isGoogleAvailable = googleAuthService.isAvailable()

  return {
    signInWithGoogle,
    signUpWithGoogle,
    isGoogleAvailable,
  }
}
