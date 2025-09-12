import { useNotifications } from '../components/ui/NotificationSystem'
import { notificationTemplates } from '../components/ui/NotificationSystem'

export const useNotification = () => {
  // Safe context usage - return empty functions if context is not available
  let contextHooks = null
  try {
    contextHooks = useNotifications()
  } catch (error) {
    // Context not available, return empty functions
    contextHooks = {
      addNotification: () => {},
      removeNotification: () => {},
      clearAllNotifications: () => {}
    }
  }
  
  const { addNotification, removeNotification, clearAllNotifications } = contextHooks

  const showSuccess = (title: string, message: string, action?: { label: string; onClick: () => void }) => {
    addNotification(notificationTemplates.success(title, message, action))
  }

  const showError = (title: string, message: string, action?: { label: string; onClick: () => void }) => {
    addNotification(notificationTemplates.error(title, message, action))
  }

  const showWarning = (title: string, message: string, action?: { label: string; onClick: () => void }) => {
    addNotification(notificationTemplates.warning(title, message, action))
  }

  const showInfo = (title: string, message: string, action?: { label: string; onClick: () => void }) => {
    addNotification(notificationTemplates.info(title, message, action))
  }

  const showCelebration = (title: string, message: string, action?: { label: string; onClick: () => void }) => {
    addNotification(notificationTemplates.celebration(title, message, action))
  }

  const showAchievement = (title: string, message: string, action?: { label: string; onClick: () => void }) => {
    addNotification(notificationTemplates.achievement(title, message, action))
  }

  const showGift = (title: string, message: string, action?: { label: string; onClick: () => void }) => {
    addNotification(notificationTemplates.gift(title, message, action))
  }

  const showSystem = (title: string, message: string, action?: { label: string; onClick: () => void }) => {
    addNotification(notificationTemplates.system(title, message, action))
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showCelebration,
    showAchievement,
    showGift,
    showSystem,
    removeNotification,
    clearAllNotifications
  }
}

export default useNotification
