'use client'

import React, { useEffect, useState } from 'react'

interface FontLoaderProps {
  children: React.ReactNode
}

export const FontLoader: React.FC<FontLoaderProps> = ({ children }) => {
  const [fontLoaded, setFontLoaded] = useState(false)

  useEffect(() => {
    // Simple font loading check - no need for complex Google Fonts handling
    const checkFont = () => {
      try {
        // Check if Inter font is available locally
        if (document.fonts && document.fonts.check) {
          const isInterLoaded = document.fonts.check('16px Inter')
          if (isInterLoaded) {
            setFontLoaded(true)
          } else {
            // If Inter is not available, use fallback immediately
            setFontLoaded(true)
          }
        } else {
          // Fallback for browsers without font loading API
          setFontLoaded(true)
        }
      } catch (error) {
        console.warn('Font loading check failed:', error)
        setFontLoaded(true)
      }
    }

    // Check immediately
    checkFont()
    
    // Also check after a short delay to catch any late-loading fonts
    const timeout = setTimeout(checkFont, 100)
    
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className={fontLoaded ? 'font-loaded' : 'font-loading'}>
      {children}
    </div>
  )
}

export default FontLoader
