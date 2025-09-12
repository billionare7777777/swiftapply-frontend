'use client'

import React, { useState, useEffect } from 'react'
import { AppProvider } from '../../src/context/AppContext'
import { StepByStepResumeGenerator } from '../../src/components/features/StepByStepResumeGenerator'
import { Header } from '../../src/components/layout/Header'
import { NotificationBar } from '../../src/components/layout/NotificationBar'
import { NotificationProvider } from '../../src/components/ui/NotificationSystem'
import ProtectedRoute from '../../src/components/auth/ProtectedRoute'

export default function ResumeGeneratorPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <ProtectedRoute>
      <AppProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating Orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
            
            {/* Particle System */}
            <div className="absolute inset-0">
              {[...Array(70)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                />
              ))}
            </div>

            {/* Mouse Follower */}
            <div
              className="absolute w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 pointer-events-none transition-all duration-300"
              style={{
                left: mousePosition.x - 64,
                top: mousePosition.y - 64,
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 min-h-screen">
            <NotificationProvider>
              <Header>
                <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <StepByStepResumeGenerator />
                </div>
              </Header>
              <NotificationBar />
            </NotificationProvider>
          </div>
        </div>
      </AppProvider>
    </ProtectedRoute>
  )
}
