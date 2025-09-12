'use client'

import React from 'react'
import { useNotification } from '../../hooks/useNotification'
import { Bell, Sparkles, Zap, Star, Heart, Trophy, Gift, Rocket, Shield, Crown } from 'lucide-react'

const NotificationDemo = () => {
  const {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showCelebration,
    showAchievement,
    showGift,
    showSystem,
    clearAllNotifications
  } = useNotification()

  const handleSuccess = () => {
    showSuccess(
      'Success! 🎉',
      'Your application has been submitted successfully!',
      { label: 'View Application', onClick: () => console.log('View Application clicked') }
    )
  }

  const handleError = () => {
    showError(
      'Error Occurred',
      'Failed to submit your application. Please try again.',
      { label: 'Retry', onClick: () => console.log('Retry clicked') }
    )
  }

  const handleWarning = () => {
    showWarning(
      'Warning ⚠️',
      'Your session will expire in 5 minutes. Please save your work.',
      { label: 'Extend Session', onClick: () => console.log('Extend Session clicked') }
    )
  }

  const handleInfo = () => {
    showInfo(
      'New Feature Available',
      'Check out our new AI-powered resume optimization tool!',
      { label: 'Learn More', onClick: () => console.log('Learn More clicked') }
    )
  }

  const handleCelebration = () => {
    showCelebration(
      'Congratulations! 🎊',
      'You\'ve completed your profile setup! Welcome to the platform!',
      { label: 'Get Started', onClick: () => console.log('Get Started clicked') }
    )
  }

  const handleAchievement = () => {
    showAchievement(
      'Achievement Unlocked! 🏆',
      'You\'ve applied to 10 jobs! Keep up the great work!',
      { label: 'View Achievements', onClick: () => console.log('View Achievements clicked') }
    )
  }

  const handleGift = () => {
    showGift(
      'Special Offer! 🎁',
      'Get 50% off premium features for the next 24 hours!',
      { label: 'Claim Offer', onClick: () => console.log('Claim Offer clicked') }
    )
  }

  const handleSystem = () => {
    showSystem(
      'System Update',
      'We\'ve improved our job matching algorithm. Your results will be more accurate now.',
      { label: 'Learn More', onClick: () => console.log('Learn More clicked') }
    )
  }

  const handleMultiple = () => {
    showSuccess('First notification', 'This is a success message')
    setTimeout(() => showInfo('Second notification', 'This is an info message'), 500)
    setTimeout(() => showWarning('Third notification', 'This is a warning message'), 1000)
    setTimeout(() => showCelebration('Fourth notification', 'This is a celebration message'), 1500)
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
            <Bell className="h-10 w-10 mr-4 text-blue-400" />
            Notification System Demo
          </h1>
          <p className="text-xl text-gray-300">
            Experience our fantastic, amazing, beautiful and cool notification system!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Success Notification */}
          <button
            onClick={handleSuccess}
            className="group p-6 bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-400/30 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-emerald-500/25 hover:shadow-xl"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Success</h3>
            </div>
            <p className="text-gray-300 text-sm">Show success notifications with emerald theme</p>
          </button>

          {/* Error Notification */}
          <button
            onClick={handleError}
            className="group p-6 bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-400/30 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-red-500/25 hover:shadow-xl"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Error</h3>
            </div>
            <p className="text-gray-300 text-sm">Show error notifications with red theme</p>
          </button>

          {/* Warning Notification */}
          <button
            onClick={handleWarning}
            className="group p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-yellow-500/25 hover:shadow-xl"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Warning</h3>
            </div>
            <p className="text-gray-300 text-sm">Show warning notifications with yellow theme</p>
          </button>

          {/* Info Notification */}
          <button
            onClick={handleInfo}
            className="group p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-blue-500/25 hover:shadow-xl"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Info</h3>
            </div>
            <p className="text-gray-300 text-sm">Show info notifications with blue theme</p>
          </button>

          {/* Celebration Notification */}
          <button
            onClick={handleCelebration}
            className="group p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-purple-500/25 hover:shadow-xl"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Celebration</h3>
            </div>
            <p className="text-gray-300 text-sm">Show celebration notifications with purple theme</p>
          </button>

          {/* Achievement Notification */}
          <button
            onClick={handleAchievement}
            className="group p-6 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-400/30 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-yellow-500/25 hover:shadow-xl"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Achievement</h3>
            </div>
            <p className="text-gray-300 text-sm">Show achievement notifications with gold theme</p>
          </button>

          {/* Gift Notification */}
          <button
            onClick={handleGift}
            className="group p-6 bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-400/30 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-pink-500/25 hover:shadow-xl"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Gift</h3>
            </div>
            <p className="text-gray-300 text-sm">Show gift notifications with pink theme</p>
          </button>

          {/* System Notification */}
          <button
            onClick={handleSystem}
            className="group p-6 bg-gradient-to-br from-slate-500/20 to-gray-500/20 border border-slate-400/30 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-slate-500/25 hover:shadow-xl"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-r from-slate-500 to-gray-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">System</h3>
            </div>
            <p className="text-gray-300 text-sm">Show system notifications with gray theme</p>
          </button>

          {/* Multiple Notifications */}
          <button
            onClick={handleMultiple}
            className="group p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-indigo-500/25 hover:shadow-xl"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Multiple</h3>
            </div>
            <p className="text-gray-300 text-sm">Show multiple notifications at once</p>
          </button>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={clearAllNotifications}
            className="px-8 py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-2xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
          >
            Clear All Notifications
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationDemo
