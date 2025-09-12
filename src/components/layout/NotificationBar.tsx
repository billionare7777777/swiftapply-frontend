// NotificationBar component for displaying notifications

import React, { useEffect } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const NotificationBar: React.FC = () => {
  const { state, removeNotification } = useApp()

  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    state.notifications.forEach(notification => {
      setTimeout(() => {
        removeNotification(notification.id)
      }, 5000)
    })
  }, [state.notifications, removeNotification])

  if (state.notifications.length === 0) {
    return null
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50/90 backdrop-blur-sm border-emerald-200/50 text-emerald-800'
      case 'error':
        return 'bg-red-50/90 backdrop-blur-sm border-red-200/50 text-red-800'
      case 'warning':
        return 'bg-amber-50/90 backdrop-blur-sm border-amber-200/50 text-amber-800'
      default:
        return 'bg-blue-50/90 backdrop-blur-sm border-blue-200/50 text-blue-800'
    }
  }

  return (
    <div className="fixed top-24 right-6 z-50 space-y-3">
      {state.notifications.map((notification, index) => (
        <div
          key={notification.id}
          className={`max-w-sm w-full border rounded-2xl p-4 shadow-xl transform transition-all duration-500 ease-out ${getNotificationStyle(notification.type)}`}
          style={{
            animationDelay: `${index * 100}ms`,
            animation: 'slideInRight 0.5s ease-out'
          }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIcon(notification.type)}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold">
                {notification.message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => removeNotification(notification.id)}
                className="inline-flex text-slate-400 hover:text-slate-600 transition-colors duration-200 rounded-full p-1 hover:bg-white/50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NotificationBar
