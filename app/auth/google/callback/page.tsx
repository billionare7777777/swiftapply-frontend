'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../../../src/context/AuthContext'
import { googleAuthService } from '../../../../src/services/googleAuth'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')

        if (error) {
          setStatus('error')
          setMessage('Authentication was cancelled or failed')
          return
        }

        if (!code || !state) {
          setStatus('error')
          setMessage('Invalid authentication response')
          return
        }

        // Handle the Google OAuth callback
        const result = await googleAuthService.handleCallback(code, state)

        if (result.success && result.user) {
          // Transform Google user to match User interface
          const userData = {
            id: parseInt(result.user.id) || 0,
            email: result.user.email,
            first_name: result.user.given_name,
            last_name: result.user.family_name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          // Login the user
          login(userData)
          
          setStatus('success')
          setMessage('Successfully signed in with Google!')
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            const redirectUrl = localStorage.getItem('google_auth_redirect') || '/dashboard'
            localStorage.removeItem('google_auth_redirect')
            router.push(redirectUrl)
          }, 2000)
        } else {
          setStatus('error')
          setMessage(result.error || 'Authentication failed')
        }
      } catch (error) {
        console.error('Google callback error:', error)
        setStatus('error')
        setMessage('An unexpected error occurred')
      }
    }

    handleCallback()
  }, [searchParams, login, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="relative group">
          {/* Glass morphism background */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"></div>
          
          <div className="relative p-8 text-center">
            {status === 'loading' && (
              <>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Authenticating...</h2>
                <p className="text-gray-300">Please wait while we complete your Google sign-in</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
                <p className="text-gray-300 mb-4">{message}</p>
                <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Authentication Failed</h2>
                <p className="text-gray-300 mb-6">{message}</p>
                <button
                  onClick={() => router.push('/login')}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
