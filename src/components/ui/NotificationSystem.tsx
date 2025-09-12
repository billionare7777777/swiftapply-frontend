'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Bell, Sparkles, Zap, Star, Heart, Trophy, Gift, Rocket, Shield, Crown } from 'lucide-react'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info' | 'celebration' | 'achievement' | 'gift' | 'system'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ComponentType<{ className?: string }>
  showProgress?: boolean
  persistent?: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Initialize dark mode state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('dark-mode')
      const isDark = savedMode !== null ? savedMode === 'true' : true
      setIsDarkMode(isDark)
    }
  }, [])

  // Watch for dark mode changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark')
          setIsDarkMode(isDark)
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      id,
      duration: 5000,
      ...notification
    }

    setNotifications(prev => [...prev, newNotification])

    // Auto remove after duration
    if (!newNotification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearAllNotifications }}>
      {children}
      <NotificationContainer notifications={notifications} isDarkMode={isDarkMode} onRemove={removeNotification} />
    </NotificationContext.Provider>
  )
}

const NotificationContainer: React.FC<{
  notifications: Notification[]
  isDarkMode: boolean
  onRemove: (id: string) => void
}> = ({ notifications, isDarkMode, onRemove }) => {
  if (typeof window === 'undefined') return null

  return createPortal(
    <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-sm w-full">
      {notifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          isDarkMode={isDarkMode}
          onRemove={onRemove}
          index={index}
        />
      ))}
    </div>,
    document.body
  )
}

const NotificationItem: React.FC<{
  notification: Notification
  isDarkMode: boolean
  onRemove: (id: string) => void
  index: number
}> = ({ notification, isDarkMode, onRemove, index }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(100)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!notification.persistent && notification.duration && !isHovered) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (notification.duration! / 100))
          if (newProgress <= 0) {
            handleRemove()
            return 0
          }
          return newProgress
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [notification.duration, isHovered, notification.persistent])

  const handleRemove = () => {
    setIsVisible(false)
    setTimeout(() => onRemove(notification.id), 300)
  }

  const getNotificationConfig = () => {
    const configs = {
      success: {
        icon: CheckCircle,
        gradient: 'from-emerald-500 to-green-500',
        bgGradient: 'from-emerald-500/20 to-green-500/20',
        borderColor: 'border-emerald-400/50',
        iconColor: 'text-emerald-400',
        glowColor: 'shadow-emerald-500/25',
        animation: 'animate-pulse'
      },
      error: {
        icon: AlertCircle,
        gradient: 'from-red-500 to-rose-500',
        bgGradient: 'from-red-500/20 to-rose-500/20',
        borderColor: 'border-red-400/50',
        iconColor: 'text-red-400',
        glowColor: 'shadow-red-500/25',
        animation: 'animate-bounce'
      },
      warning: {
        icon: AlertTriangle,
        gradient: 'from-yellow-500 to-orange-500',
        bgGradient: 'from-yellow-500/20 to-orange-500/20',
        borderColor: 'border-yellow-400/50',
        iconColor: 'text-yellow-400',
        glowColor: 'shadow-yellow-500/25',
        animation: 'animate-pulse'
      },
      info: {
        icon: Info,
        gradient: 'from-blue-500 to-cyan-500',
        bgGradient: 'from-blue-500/20 to-cyan-500/20',
        borderColor: 'border-blue-400/50',
        iconColor: 'text-blue-400',
        glowColor: 'shadow-blue-500/25',
        animation: 'animate-pulse'
      },
      celebration: {
        icon: Sparkles,
        gradient: 'from-purple-500 to-pink-500',
        bgGradient: 'from-purple-500/20 to-pink-500/20',
        borderColor: 'border-purple-400/50',
        iconColor: 'text-purple-400',
        glowColor: 'shadow-purple-500/25',
        animation: 'animate-spin'
      },
      achievement: {
        icon: Trophy,
        gradient: 'from-yellow-500 to-amber-500',
        bgGradient: 'from-yellow-500/20 to-amber-500/20',
        borderColor: 'border-yellow-400/50',
        iconColor: 'text-yellow-400',
        glowColor: 'shadow-yellow-500/25',
        animation: 'animate-bounce'
      },
      gift: {
        icon: Gift,
        gradient: 'from-pink-500 to-rose-500',
        bgGradient: 'from-pink-500/20 to-rose-500/20',
        borderColor: 'border-pink-400/50',
        iconColor: 'text-pink-400',
        glowColor: 'shadow-pink-500/25',
        animation: 'animate-pulse'
      },
      system: {
        icon: Bell,
        gradient: 'from-slate-500 to-gray-500',
        bgGradient: 'from-slate-500/20 to-gray-500/20',
        borderColor: 'border-slate-400/50',
        iconColor: 'text-slate-400',
        glowColor: 'shadow-slate-500/25',
        animation: 'animate-pulse'
      }
    }

    return configs[notification.type] || configs.info
  }

  const config = getNotificationConfig()
  const IconComponent = notification.icon || config.icon

  return (
    <div
      className={`transform transition-all duration-500 ease-out ${
        isVisible 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
      }`}
      style={{
        animationDelay: `${index * 100}ms`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden group hover:scale-105 transition-all duration-300 ${
        isDarkMode
          ? `bg-gradient-to-r ${config.bgGradient} border ${config.borderColor}`
          : 'bg-white/90 border border-slate-200'
      }`}>
        {/* Animated background */}
        <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
        
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-2xl ${config.glowColor} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}></div>
        
        {/* Content */}
        <div className="relative p-4">
          <div className="flex items-start space-x-3">
            {/* Icon */}
            <div className={`flex-shrink-0 p-2 rounded-xl bg-gradient-to-r ${config.gradient} ${config.animation} group-hover:scale-110 transition-transform duration-300`}>
              <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
            </div>
            
            {/* Text content */}
            <div className="flex-1 min-w-0">
              <h4 className={`font-semibold text-sm ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                {notification.title}
              </h4>
              <p className={`text-xs mt-1 ${
                isDarkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                {notification.message}
              </p>
              
              {/* Action button */}
              {notification.action && (
                <button
                  onClick={notification.action.onClick}
                  className={`mt-2 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 ${
                    isDarkMode
                      ? 'bg-white/20 text-white hover:bg-white/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {notification.action.label}
                </button>
              )}
            </div>
            
            {/* Close button */}
            <button
              onClick={handleRemove}
              className={`flex-shrink-0 p-1 rounded-lg transition-all duration-300 hover:scale-110 ${
                isDarkMode
                  ? 'text-gray-400 hover:text-white hover:bg-white/10'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Progress bar */}
          {notification.showProgress && !notification.persistent && (
            <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${config.gradient} transition-all duration-100 ease-linear`}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
        
        {/* Floating particles effect for celebration notifications */}
        {notification.type === 'celebration' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Predefined notification templates
export const notificationTemplates = {
  success: (title: string, message: string, action?: { label: string; onClick: () => void }) => ({
    type: 'success' as const,
    title,
    message,
    action,
    showProgress: true
  }),
  
  error: (title: string, message: string, action?: { label: string; onClick: () => void }) => ({
    type: 'error' as const,
    title,
    message,
    action,
    showProgress: true
  }),
  
  warning: (title: string, message: string, action?: { label: string; onClick: () => void }) => ({
    type: 'warning' as const,
    title,
    message,
    action,
    showProgress: true
  }),
  
  info: (title: string, message: string, action?: { label: string; onClick: () => void }) => ({
    type: 'info' as const,
    title,
    message,
    action,
    showProgress: true
  }),
  
  celebration: (title: string, message: string, action?: { label: string; onClick: () => void }) => ({
    type: 'celebration' as const,
    title,
    message,
    action,
    showProgress: true,
    duration: 8000
  }),
  
  achievement: (title: string, message: string, action?: { label: string; onClick: () => void }) => ({
    type: 'achievement' as const,
    title,
    message,
    action,
    showProgress: true,
    duration: 10000
  }),
  
  gift: (title: string, message: string, action?: { label: string; onClick: () => void }) => ({
    type: 'gift' as const,
    title,
    message,
    action,
    showProgress: true,
    duration: 8000
  }),
  
  system: (title: string, message: string, action?: { label: string; onClick: () => void }) => ({
    type: 'system' as const,
    title,
    message,
    action,
    showProgress: true
  })
}

