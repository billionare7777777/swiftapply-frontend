'use client'

import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Camera, Upload, Award, Briefcase, GraduationCap, Star, Settings, Shield, Bell, Globe, Linkedin, Github, Twitter, Instagram, Eye, EyeOff, Key, Lock, Trash2, Plus, Minus, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'
import { profileService, ProfileData } from '../../services/profileService'
import { useNotification } from '../../hooks/useNotification'


export const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { showSuccess, showError } = useNotification()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [showPassword, setShowPassword] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showAccountSettings, setShowAccountSettings] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: 'Passionate developer with a love for creating amazing user experiences.',
    jobTitle: 'Senior Software Engineer',
    company: 'Tech Corp',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
    education: [
      {
        degree: 'Bachelor of Computer Science',
        institution: 'University of Technology',
        year: '2019'
      }
    ],
    linkedin: '',
    github: '',
    twitter: '',
    instagram: '',
    employment: [
      {
        title: 'Employee of the Year',
        description: 'Recognized for outstanding performance and innovation',
        date: '2023'
      },
      {
        title: 'Certified AWS Developer',
        description: 'Successfully completed AWS Developer Associate certification',
        date: '2022'
      }
    ]
  })

  const [newSkill, setNewSkill] = useState('')
  const [newEmployment, setNewEmployment] = useState({ title: '', description: '', date: '' })

  useEffect(() => {
    setIsVisible(true)
    
    // Redirect to login if no user
    if (!user) {
      router.push('/login')
      return
    }
    
    loadProfileData()
  }, [user, router])

  const loadProfileData = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      const profile = await profileService.getProfile()
      setProfileData(profile)
    } catch (error) {
      console.error('Error loading profile:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      // If it's a session expired error, show a specific message
      if (errorMessage.includes('session expired') || errorMessage.includes('Please log in again')) {
        showError('Session Expired', 'Your session has expired. Please log in again.')
        // The ProfileService will handle the redirect
        return
      }
      
      // For other errors, show a generic message but keep the default data
      showError('Error', 'Failed to load profile data. Using default values.')
    } finally {
      setIsLoading(false)
    }
  }

  const saveProfileData = async () => {
    try {
      console.log('ProfilePage: Starting to save profile data:', profileData)
      setIsSaving(true)
      
      const result = await profileService.updateProfile(profileData)
      console.log('ProfilePage: Profile saved successfully:', result)
      
      showSuccess('Success', 'Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      console.error('ProfilePage: Error saving profile:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      showError('Error', `Failed to save profile: ${errorMessage}`)
    } finally {
      setIsSaving(false)
    }
  }

  // Detect dark mode changes
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark')
      setIsDarkMode(isDark)
    }

    // Check initial state
    checkDarkMode()

    // Listen for dark mode changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  const handleSave = () => {
    saveProfileData()
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const addEmployment = () => {
    if (newEmployment.title.trim() && newEmployment.description.trim()) {
      setProfileData(prev => ({
        ...prev,
        employment: [...prev.employment, { ...newEmployment }]
      }))
      setNewEmployment({ title: '', description: '', date: '' })
    }
  }

  const removeEmployment = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      employment: prev.employment.filter((_, i) => i !== index)
    }))
  }

  const handleBackClick = () => {
    router.back()
  }

  const handleAccountSettings = () => {
    setShowAccountSettings(true)
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'employment', label: 'Employment', icon: Award },
    { id: 'social', label: 'Social Links', icon: Globe }
  ]

  return (
    <div className={`min-h-screen p-6 transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl animate-pulse ${
          isDarkMode ? 'bg-blue-500/10' : 'bg-blue-500/5'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000 ${
          isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-500/5'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000 ${
          isDarkMode ? 'bg-purple-500/10' : 'bg-purple-500/5'
        }`}></div>
      </div>
      <div className="relative max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBackClick}
            className={`flex items-center space-x-2 px-4 py-3 backdrop-blur-xl rounded-xl transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20' 
                : 'bg-white/80 border border-slate-200 text-slate-700 hover:bg-white/90'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-semibold">Back</span>
          </button>
        </div>
        
        {/* Header Section */}
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-4xl font-bold mb-2 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-white via-blue-200 to-emerald-200 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-slate-800 via-blue-600 to-emerald-600 bg-clip-text text-transparent'
              }`}>
                Profile Settings
              </h1>
              <p className={`text-lg ${
                isDarkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>Manage your personal and professional information</p>
            </div>
            <div className="flex items-center space-x-4">
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl border border-red-500/30 transition-all duration-300 hover:scale-105"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="p-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl border border-emerald-500/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-400"></div>
                    ) : (
                      <Save className="h-5 w-5" />
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl border border-blue-500/30 transition-all duration-300 hover:scale-105"
                >
                  <Edit3 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Card */}
          <div className={`lg:col-span-1 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className={`backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center transition-all duration-500 ${
              isDarkMode 
                ? 'bg-white/10 border border-white/20' 
                : 'bg-white/80 border border-slate-200'
            }`}>
              {/* Profile Picture */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                  <User className="h-16 w-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* User Info */}
              <h2 className={`text-2xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className={`mb-4 ${
                isDarkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>{profileData.jobTitle}</p>
              <p className={`text-sm mb-6 ${
                isDarkMode ? 'text-gray-400' : 'text-slate-500'
              }`}>{profileData.bio}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`rounded-xl p-3 ${
                  isDarkMode ? 'bg-white/10' : 'bg-slate-100'
                }`}>
                  <div className="text-2xl font-bold text-emerald-400">{profileData.skills.length}</div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>Skills</div>
                </div>
                <div className={`rounded-xl p-3 ${
                  isDarkMode ? 'bg-white/10' : 'bg-slate-100'
                }`}>
                  <div className="text-2xl font-bold text-blue-400">{profileData.employment.length}</div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-500'
                  }`}>Employment</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                {/* <button className="w-full p-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-300">
                  <Upload className="h-4 w-4 inline mr-2" />
                  Upload Resume
                </button> */}
                <button 
                  onClick={handleAccountSettings}
                  className={`w-full p-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-300 ${
                    isDarkMode 
                      ? 'bg-white/10 text-white hover:bg-white/20' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Settings className="h-4 w-4 inline mr-2" />
                  Account Settings
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={`lg:col-span-3 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Tab Navigation */}
            <div className={`backdrop-blur-xl rounded-2xl shadow-2xl p-2 mb-6 transition-all duration-500 ${
              isDarkMode 
                ? 'bg-white/10 border border-white/20' 
                : 'bg-white/80 border border-slate-200'
            }`}>
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                          : isDarkMode 
                            ? 'text-gray-300 hover:text-white hover:bg-white/10'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-semibold">{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className={`backdrop-blur-xl rounded-2xl shadow-2xl p-8 transition-all duration-500 ${
              isDarkMode 
                ? 'bg-white/10 border border-white/20' 
                : 'bg-white/80 border border-slate-200'
            }`}>
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <h3 className={`text-2xl font-bold mb-6 flex items-center ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    <User className="h-6 w-6 mr-3 text-blue-400" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>First Name</label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                        className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                          isDarkMode 
                            ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                            : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>Last Name</label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                        className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                          isDarkMode 
                            ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                            : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                          isDarkMode 
                            ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                            : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                          isDarkMode 
                            ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                            : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-500'
                        }`}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>Location</label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        disabled={!isEditing}
                        className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                          isDarkMode 
                            ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                            : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-500'
                        }`}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        disabled={!isEditing}
                        rows={4}
                        className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none ${
                          isDarkMode 
                            ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                            : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'professional' && (
                <div className="space-y-6">
                  <h3 className={`text-2xl font-bold mb-6 flex items-center ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    <Briefcase className="h-6 w-6 mr-3 text-emerald-400" />
                    Professional Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>Job Title</label>
                      <input
                        type="text"
                        value={profileData.jobTitle}
                        onChange={(e) => setProfileData(prev => ({ ...prev, jobTitle: e.target.value }))}
                        disabled={!isEditing}
                        className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 ${
                          isDarkMode 
                            ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                            : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>Company</label>
                      <input
                        type="text"
                        value={profileData.company}
                        onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                        disabled={!isEditing}
                        className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 ${
                          isDarkMode 
                            ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                            : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div>
                    <label className={`block text-sm font-medium mb-4 ${
                      isDarkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}>Skills</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profileData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border border-blue-500/30 rounded-full px-4 py-2"
                        >
                          <span className={`text-sm ${
                            isDarkMode ? 'text-white' : 'text-slate-800'
                          }`}>{skill}</span>
                          {isEditing && (
                            <button
                              onClick={() => removeSkill(index)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-300"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add a skill"
                          className={`flex-1 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDarkMode 
                              ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                              : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-500'
                          }`}
                        />
                        <button
                          onClick={addSkill}
                          className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-300"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'education' && (
                <div className="space-y-6">
                  <h3 className={`text-2xl font-bold mb-6 flex items-center ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    <GraduationCap className="h-6 w-6 mr-3 text-purple-400" />
                    Education
                  </h3>
                  
                  <div className="space-y-4">
                    {profileData.education.map((edu, index) => (
                      <div key={index} className={`rounded-xl p-6 ${
                        isDarkMode 
                          ? 'bg-white/5 border border-white/10' 
                          : 'bg-slate-50 border border-slate-200'
                      }`}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>Degree</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => {
                                const newEducation = [...profileData.education]
                                newEducation[index].degree = e.target.value
                                setProfileData(prev => ({ ...prev, education: newEducation }))
                              }}
                              disabled={!isEditing}
                              className={`w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 ${
                                isDarkMode 
                                  ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                                  : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-500'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>Institution</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => {
                                const newEducation = [...profileData.education]
                                newEducation[index].institution = e.target.value
                                setProfileData(prev => ({ ...prev, education: newEducation }))
                              }}
                              disabled={!isEditing}
                              className={`w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 ${
                                isDarkMode 
                                  ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                                  : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-500'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>Year</label>
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) => {
                                const newEducation = [...profileData.education]
                                newEducation[index].year = e.target.value
                                setProfileData(prev => ({ ...prev, education: newEducation }))
                              }}
                              disabled={!isEditing}
                              className={`w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 ${
                                isDarkMode 
                                  ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                                  : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-500'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'employment' && (
                <div className="space-y-6">
                  <h3 className={`text-2xl font-bold mb-6 flex items-center ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    <Award className="h-6 w-6 mr-3 text-yellow-400" />
                      Employment History
                  </h3>
                  
                  <div className="space-y-4">
                    {profileData.employment.map((employment, index) => (
                      <div key={index} className={`rounded-xl p-6 ${
                        isDarkMode 
                          ? 'bg-white/5 border border-white/10' 
                          : 'bg-slate-50 border border-slate-200'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`text-lg font-semibold mb-2 ${
                              isDarkMode ? 'text-white' : 'text-slate-800'
                            }`}>{employment.title}</h4>
                            <p className={`mb-2 ${
                              isDarkMode ? 'text-gray-300' : 'text-slate-600'
                            }`}>{employment.description}</p>
                            <p className={`text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-slate-500'
                            }`}>{employment.date}</p>
                          </div>
                          {isEditing && (
                            <button
                              onClick={() => removeEmployment(index)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-300 p-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {isEditing && (
                      <div className={`rounded-xl p-6 border-dashed ${
                        isDarkMode 
                          ? 'bg-white/5 border border-white/10' 
                          : 'bg-slate-50 border border-slate-200'
                      }`}>
                        <h4 className={`text-lg font-semibold mb-4 ${
                          isDarkMode ? 'text-white' : 'text-slate-800'
                        }`}>Add New Achievement</h4>
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={newEmployment.title}
                            onChange={(e) => setNewEmployment(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Achievement title"
                            className={`w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                              isDarkMode 
                                ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                                : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-500'
                            }`}
                          />
                          <textarea
                            value={newEmployment.description}
                            onChange={(e) => setNewEmployment(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Description"
                            rows={3}
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                          />
                          <div className="flex space-x-4">
                            <input
                              type="text"
                              value={newEmployment.date}
                              onChange={(e) => setNewEmployment(prev => ({ ...prev, date: e.target.value }))}
                              placeholder="Year"
                              className="flex-1 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                            <button
                              onClick={addEmployment}
                              className="p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-colors duration-300"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div className="space-y-6">
                  <h3 className={`text-2xl font-bold mb-6 flex items-center ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    <Globe className="h-6 w-6 mr-3 text-cyan-400" />
                    Social Links
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 flex items-center ${
                        isDarkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        <Linkedin className="h-4 w-4 mr-2 text-blue-400" />
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={profileData.linkedin}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          linkedin: e.target.value
                        }))}
                        disabled={!isEditing}
                        className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 ${
                          isDarkMode 
                            ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                            : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-500'
                        }`}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 flex items-center ${
                        isDarkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        <Github className="h-4 w-4 mr-2 text-gray-400" />
                        GitHub
                      </label>
                      <input
                        type="url"
                        value={profileData.github}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          github: e.target.value
                        }))}
                        disabled={!isEditing}
                        className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 ${
                          isDarkMode 
                            ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                            : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-500'
                        }`}
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 flex items-center ${
                        isDarkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                        Twitter
                      </label>
                      <input
                        type="url"
                        value={profileData.twitter}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          twitter: e.target.value
                        }))}
                        disabled={!isEditing}
                        className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 ${
                          isDarkMode 
                            ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                            : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-500'
                        }`}
                        placeholder="https://twitter.com/yourusername"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 flex items-center ${
                        isDarkMode ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                        <Instagram className="h-4 w-4 mr-2 text-pink-400" />
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={profileData.instagram}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          instagram: e.target.value
                        }))}
                        disabled={!isEditing}
                        className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 ${
                          isDarkMode 
                            ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                            : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-500'
                        }`}
                        placeholder="https://instagram.com/yourusername"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Account Settings Modal */}
      {showAccountSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/20 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Account Settings</h2>
                <button
                  onClick={() => setShowAccountSettings(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-300"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Change Password */}
                <div className={`rounded-xl p-4 ${
                  isDarkMode 
                    ? 'bg-white/5' 
                    : 'bg-slate-50'
                }`}>
                  <h3 className={`text-lg font-semibold mb-3 ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>Change Password</h3>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Current password"
                      className={`w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode 
                          ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                          : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-500'
                      }`}
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      className={`w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode 
                          ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                          : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-500'
                      }`}
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className={`w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode 
                          ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400' 
                          : 'bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-500'
                      }`}
                    />
                    <button className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300">
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Account Actions */}
                <div className={`rounded-xl p-4 ${
                  isDarkMode 
                    ? 'bg-white/5' 
                    : 'bg-slate-50'
                }`}>
                  <h3 className={`text-lg font-semibold mb-3 ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>Account Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300">
                      <Key className="h-4 w-4 inline mr-2" />
                      Export Data
                    </button>
                    <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300">
                      <Trash2 className="h-4 w-4 inline mr-2" />
                      Delete Account
                    </button>
                  </div>
                </div>

                {/* Save Changes */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAccountSettings(false)}
                    className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
