// Left Sidebar Navigation component

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter, usePathname } from 'next/navigation'
import { FileText, Send, Zap, LogIn, LogOut, User, Settings, Bell, Search, Menu, Star, BarChart3, Globe, Shield, Sparkles, ChevronDown, Home, Activity, Target, Rocket, BookOpen, Users, HelpCircle, Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../hooks/useNotification'
import Link from 'next/link'

interface Tab {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  path: string
  badge?: string
  color: string
  gradient: string
  category?: string
}

const tabs: Tab[] = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: Home, 
    description: 'Overview & Analytics', 
    path: '/dashboard',
    badge: 'Live',
    color: 'blue',
    gradient: 'from-blue-500 to-emerald-500',
    category: 'main'
  },
  { 
    id: 'job-search', 
    label: 'Job Search', 
    icon: Search, 
    description: 'Find Opportunities', 
    path: '/jobSearch',
    badge: '24',
    color: 'emerald',
    gradient: 'from-blue-500 to-cyan-500',
    category: 'main'
  },
  { 
    id: 'resume-generator', 
    label: 'Resume Generator', 
    icon: FileText, 
    description: 'AI-Powered CVs', 
    path: '/resumeGenerator',
    badge: 'AI',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    category: 'main'
  },
  { 
    id: 'applications', 
    label: 'Applications', 
    icon: Send, 
    description: 'Track Progress', 
    path: '/applications',
    badge: '12',
    color: 'orange',
    gradient: 'from-orange-500 to-red-500',
    category: 'main'
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: BarChart3, 
    description: 'Performance Insights', 
    path: '/analytics',
    badge: 'Pro',
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-500',
    category: 'main'
  },
  { 
    id: 'profile', 
    label: 'Profile', 
    icon: User, 
    description: 'Personal Profile', 
    path: '/profile',
    badge: 'You',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    category: 'tools'
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings, 
    description: 'Preferences', 
    path: '/settings',
    color: 'gray',
    gradient: 'from-gray-500 to-slate-500',
    category: 'tools'
  },
  { 
    id: 'help', 
    label: 'Help Center', 
    icon: HelpCircle, 
    description: 'Support & Docs', 
    path: '/help',
    color: 'teal',
    gradient: 'from-teal-500 to-cyan-500',
    category: 'tools'
  }
]

interface HeaderProps {
  children?: React.ReactNode
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()
  // Safe notification hook usage
  const { showSuccess, showInfo, showCelebration } = useNotification()
  
  const [isVisible, setIsVisible] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar-collapsed') === 'true'
    }
    return false
  })
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [userButtonRect, setUserButtonRect] = useState<DOMRect | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('dark-mode')
      return savedMode !== null ? savedMode === 'true' : true // Default to dark mode
    }
    return true // Default to dark mode
  })
  const [notifications, setNotifications] = useState(3)
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  const handleLogout = async () => {
    try {
      // Call backend logout API if user is logged in
      if (user?.email) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://chemurgic-scalably-selena.ngrok-free.dev/api'
        const logoutApiUrl = baseUrl.endsWith('/api') ? `${baseUrl}/auth/logout` : `${baseUrl}/api/auth/logout`
        await fetch(logoutApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({ email: user.email }),
        })
      }
    } catch (error) {
      console.error('Logout API call failed:', error)
      // Continue with logout even if API call fails
    } finally {
      // Use auth context logout
      logout()
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery)
    }
  }

  const mainTabs = tabs.filter(tab => tab.category === 'main')
  const toolTabs = tabs.filter(tab => tab.category === 'tools')

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('dark-mode', newDarkMode.toString())
    
    // Apply dark mode to document
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Handle sidebar collapse toggle
  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    localStorage.setItem('sidebar-collapsed', newCollapsed.toString())
  }

  // Initialize dark mode and sidebar state on mount
  useEffect(() => {
    // Apply dark mode from localStorage or default to dark
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Set initial dark mode if not already set
    if (localStorage.getItem('dark-mode') === null) {
      localStorage.setItem('dark-mode', 'true')
    }
  }, [isDarkMode])

  // Persist sidebar state on change
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', isCollapsed.toString())
  }, [isCollapsed])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen) {
        const target = event.target as Element
        const userMenu = document.querySelector('[data-user-menu]')
        const userButton = document.querySelector('[data-user-button]')
        
        if (userMenu && userButton && !userMenu.contains(target) && !userButton.contains(target)) {
          setIsUserMenuOpen(false)
        }
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  return (
    <>
      {/* Left Sidebar */}
      <aside className={`fixed left-0 top-0 h-full backdrop-blur-xl border-r shadow-2xl z-50 transition-all duration-500 overflow-visible ${
        isCollapsed ? 'w-20' : 'w-80'
      } ${
        isDarkMode 
          ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-white/10' 
          : 'bg-gradient-to-b from-white via-slate-50 to-white border-slate-200'
      }`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative h-full flex flex-col">
          {/* Header Section */}
          <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <Link href={"/"}>
                  <div className={`flex items-center space-x-4 group transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="relative">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl shadow-2xl group-hover:scale-110 transition-transform duration-300">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                        <Star className="h-1.5 w-1.5 text-yellow-800" />
                      </div>
                      <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 animate-ping opacity-75"></div>
                    </div>
                    {!isCollapsed && (
                      <div className="transform transition-all duration-300">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white via-blue-200 to-emerald-200 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                          SwiftApply.ai
                        </h1>
                        <p className="text-xs text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
                          Automated Job Application
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
                <button
                  onClick={toggleSidebar}
                  className={`p-2 backdrop-blur-sm rounded-xl border transition-all duration-300 hover:scale-110 ${
                    isDarkMode 
                      ? 'bg-white/10 border-white/20 hover:border-white/40' 
                      : 'bg-slate-100 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isCollapsed ? (
                    <ChevronRight className={`h-4 w-4 ${isDarkMode ? 'text-white' : 'text-slate-600'}`} />
                  ) : (
                    <ChevronLeft className={`h-4 w-4 ${isDarkMode ? 'text-white' : 'text-slate-600'}`} />
                  )}
                </button>
              </div>
          </div>

          {/* Navigation Section */}
          {isAuthenticated && (
            <div className="flex-1 overflow-y-auto py-4 sidebar-scroll">
              {/* Main Navigation */}
              <div className="px-4 mb-6">
                {!isCollapsed && (
                  <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 px-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    Main Navigation
                  </h3>
                )}
                <div className="space-y-2">
                  {mainTabs.map((tab, index) => {
                    const Icon = tab.icon
                    const isActive = pathname === tab.path
                    const isHovered = hoveredTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => router.push(tab.path)}
                        onMouseEnter={() => setHoveredTab(tab.id)}
                        onMouseLeave={() => setHoveredTab(null)}
                        className={`group relative w-full flex items-center rounded-2xl transition-all duration-300 hover:scale-105 ${
                          isCollapsed 
                            ? 'justify-center px-2 py-3' 
                            : 'space-x-3 px-4 py-3'
                        } ${
                          isActive
                            ? `text-white shadow-2xl bg-gradient-to-r ${tab.gradient}`
                            : isDarkMode 
                              ? 'text-gray-300 hover:text-white hover:bg-white/10'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="relative">
                          <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                          {isActive && (
                            <div className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-75"></div>
                          )}
                        </div>
                        {!isCollapsed && (
                          <>
                            <div className="flex-1 text-left">
                              <span className="font-semibold text-sm whitespace-nowrap">{tab.label}</span>
                              <p className="text-xs opacity-80">{tab.description}</p>
                            </div>
                            {tab.badge && (
                              <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                                isActive 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-white/10 text-gray-300 group-hover:text-white'
                              }`}>
                                {tab.badge}
                              </div>
                            )}
                          </>
                        )}
                        {/* Tooltip for collapsed state */}
                        {isCollapsed && isHovered && (
                          <div className={`absolute left-full ml-2 px-3 py-2 text-sm rounded-lg shadow-lg z-50 whitespace-nowrap pointer-events-none ${
                            isDarkMode 
                              ? 'bg-slate-800 text-white' 
                              : 'bg-white text-slate-900 border border-slate-200'
                          }`}
              style={{
                            top: '50%',
                            transform: 'translateY(-50%)',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {tab.label}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Tools Section */}
              <div className="px-4">
                {!isCollapsed && (
                  <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 px-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    Tools & Settings
                  </h3>
                )}
                <div className="space-y-2">
                  {toolTabs.map((tab, index) => {
                    const Icon = tab.icon
                    const isActive = pathname === tab.path
                    const isHovered = hoveredTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => router.push(tab.path)}
                        onMouseEnter={() => setHoveredTab(tab.id)}
                        onMouseLeave={() => setHoveredTab(null)}
                        className={`group relative w-full flex items-center rounded-2xl transition-all duration-300 hover:scale-105 ${
                          isCollapsed 
                            ? 'justify-center px-2 py-3' 
                            : 'space-x-3 px-4 py-3'
                        } ${
                          isActive
                            ? `text-white shadow-2xl bg-gradient-to-r ${tab.gradient}`
                            : isDarkMode 
                              ? 'text-gray-300 hover:text-white hover:bg-white/10'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                        style={{ animationDelay: `${(mainTabs.length + index) * 100}ms` }}
                      >
                        <div className="relative">
                          <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                          {isActive && (
                            <div className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-75"></div>
                          )}
                        </div>
                        {!isCollapsed && (
                          <>
                            <div className="flex-1 text-left">
                              <span className="font-semibold text-sm whitespace-nowrap">{tab.label}</span>
                              <p className="text-xs opacity-80">{tab.description}</p>
                            </div>
                            {tab.badge && (
                              <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                                isActive 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-white/10 text-gray-300 group-hover:text-white'
                              }`}>
                                {tab.badge}
            </div>
                            )}
                          </>
                        )}
                        {/* Tooltip for collapsed state */}
                        {isCollapsed && isHovered && (
                          <div className={`absolute left-full ml-2 px-3 py-2 text-sm rounded-lg shadow-lg z-50 whitespace-nowrap pointer-events-none ${
                            isDarkMode 
                              ? 'bg-slate-800 text-white' 
                              : 'bg-white text-slate-900 border border-slate-200'
                          }`}
                style={{
                            top: '50%',
                            transform: 'translateY(-50%)',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {tab.label}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* User Section */}
          <div className={`p-4 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
            {user ? (
              <div className="relative overflow-visible">
                <button
                  onClick={() => {
                    if (!isUserMenuOpen) {
                      const button = document.querySelector('[data-user-button]') as HTMLElement
                      if (button) {
                        setUserButtonRect(button.getBoundingClientRect())
                      }
                    }
                    setIsUserMenuOpen(!isUserMenuOpen)
                  }}
                  data-user-button
                  className={`w-full flex items-center space-x-3 p-3 backdrop-blur-sm rounded-2xl border transition-all duration-300 hover:scale-105 group ${
                    isCollapsed ? 'justify-center' : ''
                  } ${
                    isDarkMode 
                      ? 'bg-white/10 border-white/20 hover:border-white/40' 
                      : 'bg-slate-100 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  {!isCollapsed && (
                    <>
                      <div className="text-left flex-1">
                        <p className={`text-sm font-medium transition-colors duration-300 ${
                          isDarkMode 
                            ? 'text-white group-hover:text-purple-300' 
                            : 'text-slate-900 group-hover:text-purple-600'
                        }`}>
                          {user.first_name} {user.last_name}
                        </p>
                        <p className={`text-xs transition-colors duration-300 ${
                          isDarkMode 
                            ? 'text-gray-400 group-hover:text-white' 
                            : 'text-slate-500 group-hover:text-slate-700'
                        }`}>
                          {user.email}
                        </p>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''} ${
                        isDarkMode ? 'text-gray-400' : 'text-slate-500'
                      }`} />
                    </>
                  )}
                </button>

                {/* User Dropdown Menu - Portal */}
                {isUserMenuOpen && userButtonRect && typeof window !== 'undefined' && createPortal(
                  <div 
                    data-user-menu
                    className={`fixed backdrop-blur-xl rounded-2xl shadow-2xl py-2 z-[9999] ${
                      isDarkMode 
                        ? 'bg-slate-800/90 border border-slate-700' 
                        : 'bg-white/90 border border-slate-200'
                    }`}
                    style={{
                      left: isCollapsed ? '20px' : `${userButtonRect.left}px`,
                      bottom: `${window.innerHeight - userButtonRect.top + 10}px`,
                      width: isCollapsed ? '320px' : `${userButtonRect.width}px`,
                      minWidth: '280px'
                    }}
                  >
                    <div className={`px-4 py-3 border-b ${
                      isDarkMode ? 'border-white/10' : 'border-slate-200'
                    }`}>
                      <p className={`text-sm font-medium ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {user.first_name} {user.last_name}
                      </p>
                      <p className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-slate-500'
                      }`}>
                        {user.email}
                      </p>
                    </div>
                    <div className="py-2">
                      <button 
                        onClick={() => {
                          router.push('/profile')
                          setIsUserMenuOpen(false)
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2 transition-colors duration-300 ${
                          isDarkMode 
                            ? 'text-white hover:bg-white/10' 
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </button>
                      <button 
                        onClick={() => {
                          router.push('/settings')
                          setIsUserMenuOpen(false)
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2 transition-colors duration-300 ${
                          isDarkMode 
                            ? 'text-white hover:bg-white/10' 
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}>
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </button>
                      <button 
                        onClick={() => {
                          showCelebration('Notification Demo! 🎉', 'Check out our amazing notification system!')
                          setIsUserMenuOpen(false)
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2 transition-colors duration-300 ${
                          isDarkMode 
                            ? 'text-white hover:bg-white/10' 
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}>
                        <Bell className="h-4 w-4" />
                        <span>Notification Demo</span>
                      </button>
                      <button className={`w-full flex items-center space-x-3 px-4 py-2 transition-colors duration-300 ${
                        isDarkMode 
                          ? 'text-white hover:bg-white/10' 
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}>
                        <HelpCircle className="h-4 w-4" />
                        <span>Help & Support</span>
                      </button>
                      <div className={`border-t my-2 ${
                        isDarkMode ? 'border-white/10' : 'border-slate-200'
                      }`}></div>
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center space-x-3 px-4 py-2 transition-colors duration-300 ${
                          isDarkMode 
                            ? 'text-red-400 hover:bg-red-500/10' 
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>,
                  document.body
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className={`group relative w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 ${
                  isCollapsed ? 'px-2' : ''
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-2">
                <LogIn className="h-4 w-4" />
                  {!isCollapsed && <span>Login</span>}
                </div>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`transition-all duration-500 ${isCollapsed ? 'ml-20' : 'ml-80'}`}>
        {/* Top Bar for notifications and quick actions */}
        <div className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-sm ${
          isDarkMode 
            ? 'bg-slate-900/90 border-slate-700' 
            : 'bg-white/90 border-slate-200'
        }`}>
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              {/* Notifications */}
        {isAuthenticated && (
                <div className="relative group">
                  <button className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                    isDarkMode 
                      ? 'bg-slate-800 hover:bg-slate-700' 
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}>
                    <Bell className={`h-5 w-5 transition-colors duration-300 ${
                      isDarkMode 
                        ? 'text-slate-300 group-hover:text-yellow-400' 
                        : 'text-slate-600 group-hover:text-yellow-500'
                    }`} />
                  </button>
                  {notifications > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-xs font-bold text-white">{notifications}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                  isDarkMode 
                    ? 'bg-slate-800 hover:bg-slate-700' 
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-600" />
                  )}
                </button>
            </div>

            <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
        
        {/* Page Content */}
        {children}
      </div>

    </>
  )
}

export default Header
