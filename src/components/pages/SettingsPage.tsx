'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Moon, Bell, Settings, Shield, Save, X, CheckCircle, AlertCircle, Eye, EyeOff, Key, Lock, Trash2, User, Mail, Phone, MapPin, Calendar, Edit3, Camera, Upload, Award, Briefcase, GraduationCap, Star, Globe, Linkedin, Github, Twitter, Instagram, Plus, Minus } from 'lucide-react'
import { useRouter } from 'next/navigation'

const SettingsPage = () => {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [settings, setSettings] = useState({
    // Theme Settings
    darkMode: true,
    autoTheme: false,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    
    // Sidebar Settings
    autoCollapse: false,
    rememberState: true,
    
    // Privacy Settings
    profileVisibility: 'public',
    dataCollection: true,
    analyticsTracking: true,
    
    // Account Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginNotifications: true
  })

  // Initialize dark mode state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('dark-mode')
      const isDark = savedMode !== null ? savedMode === 'true' : true
      setIsDarkMode(isDark)
      setSettings(prev => ({ ...prev, darkMode: isDark }))
      
      // Apply dark mode to document
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
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

  const handleBackClick = () => {
    router.back()
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    setSettings(prev => ({ ...prev, darkMode: newDarkMode }))
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('dark-mode', newDarkMode.toString())
      if (newDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Save settings to localStorage or API
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-settings', JSON.stringify(settings))
      
      // Apply dark mode setting immediately
      if (settings.darkMode) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('dark-mode', 'true')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('dark-mode', 'false')
      }
    }
    setIsEditing(false)
    // Show success message
    alert('Settings saved successfully!')
  }

  const handleCancel = () => {
    // Reset to saved settings
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('app-settings')
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings(parsedSettings)
        
        // Reset dark mode to saved state
        if (parsedSettings.darkMode) {
          document.documentElement.classList.add('dark')
          setIsDarkMode(true)
        } else {
          document.documentElement.classList.remove('dark')
          setIsDarkMode(false)
        }
      } else {
        // Reset to default settings
        const defaultSettings = {
          darkMode: true,
          autoTheme: false,
          emailNotifications: true,
          pushNotifications: true,
          marketingEmails: false,
          autoCollapse: false,
          rememberState: true,
          profileVisibility: 'public',
          dataCollection: true,
          analyticsTracking: true,
          twoFactorAuth: false,
          sessionTimeout: 30,
          loginNotifications: true
        }
        setSettings(defaultSettings)
        document.documentElement.classList.add('dark')
        setIsDarkMode(true)
      }
    }
    setIsEditing(false)
  }

  return (
    <div className={`min-h-screen p-6 transition-all duration-500 ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'
    }`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackClick}
            className={`flex items-center space-x-2 px-4 py-3 backdrop-blur-xl rounded-xl transition-all duration-300 hover:scale-105 mb-6 ${
              isDarkMode
                ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                : 'bg-white/80 border border-slate-200 text-slate-700 hover:bg-white/90'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-semibold">Back</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                Settings & Preferences
              </h1>
              <p className={`text-lg ${
                isDarkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Customize your experience and manage your account
              </p>
            </div>
            
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                      isDarkMode
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <X className="h-4 w-4 inline mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                    isDarkMode
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Edit3 className="h-4 w-4 inline mr-2" />
                  Edit Settings
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Theme Settings */}
          <div className={`backdrop-blur-xl rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
            isDarkMode
              ? 'bg-white/5 border border-white/10'
              : 'bg-white/80 border border-slate-200'
          }`}>
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                <Moon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  Theme Settings
                </h2>
                <p className={`${
                  isDarkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Customize your visual experience
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <span className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Dark Mode
                  </span>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    Switch between light and dark themes
                  </p>
                </div>
                <button
                  onClick={toggleDarkMode}
                  disabled={!isEditing}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                    settings.darkMode ? 'bg-blue-500' : 'bg-gray-300'
                  } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <span className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Auto Theme
                  </span>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    Automatically switch based on system preference
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoTheme}
                  onChange={(e) => handleSettingChange('autoTheme', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className={`backdrop-blur-xl rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
            isDarkMode
              ? 'bg-white/5 border border-white/10'
              : 'bg-white/80 border border-slate-200'
          }`}>
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  Notifications
                </h2>
                <p className={`${
                  isDarkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Manage your notification preferences
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <span className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Email Notifications
                  </span>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    Receive updates via email
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <span className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Push Notifications
                  </span>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    Get real-time browser notifications
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <span className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Marketing Emails
                  </span>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    Receive promotional content and updates
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.marketingEmails}
                  onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className={`backdrop-blur-xl rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
            isDarkMode
              ? 'bg-white/5 border border-white/10'
              : 'bg-white/80 border border-slate-200'
          }`}>
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  Privacy & Security
                </h2>
                <p className={`${
                  isDarkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Control your privacy and security settings
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5">
                <label className={`block font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  Profile Visibility
                </label>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full p-3 rounded-lg ${
                    isDarkMode
                      ? 'bg-white/10 border border-white/20 text-white'
                      : 'bg-slate-100 border border-slate-300 text-slate-800'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends Only</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <span className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Data Collection
                  </span>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    Allow data collection for service improvement
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dataCollection}
                  onChange={(e) => handleSettingChange('dataCollection', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <span className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Two-Factor Authentication
                  </span>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    Add an extra layer of security
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className={`backdrop-blur-xl rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
            isDarkMode
              ? 'bg-white/5 border border-white/10'
              : 'bg-white/80 border border-slate-200'
          }`}>
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  Interface Settings
                </h2>
                <p className={`${
                  isDarkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  Customize your interface preferences
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <span className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Auto Collapse Sidebar
                  </span>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    Automatically collapse sidebar on small screens
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoCollapse}
                  onChange={(e) => handleSettingChange('autoCollapse', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <span className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Remember State
                  </span>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    Remember sidebar and theme preferences
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.rememberState}
                  onChange={(e) => handleSettingChange('rememberState', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <label className={`block font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  disabled={!isEditing}
                  className={`w-full p-3 rounded-lg ${
                    isDarkMode
                      ? 'bg-white/10 border border-white/20 text-white'
                      : 'bg-slate-100 border border-slate-300 text-slate-800'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
