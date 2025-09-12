import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/jobSearch',
  '/applications',
  '/resumeGenerator'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Get the user token from cookies
  const userToken = request.cookies.get('user')?.value
  
  // If accessing a protected route without authentication
  if (isProtectedRoute && !userToken) {
    // Redirect to login page
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // If accessing login/register while already authenticated
  if ((pathname === '/login' || pathname === '/register') && userToken) {
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/jobSearch/:path*',
    '/applications/:path*',
    '/resumeGenerator/:path*',
    '/login',
    '/register'
  ],
}
