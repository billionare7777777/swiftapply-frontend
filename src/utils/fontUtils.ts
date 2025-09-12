// Font utility functions for better font loading handling

export const preloadFont = (fontFamily: string, fontUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.type = 'font/woff2'
    link.crossOrigin = 'anonymous'
    link.href = fontUrl
    
    link.onload = () => {
      console.log(`Font ${fontFamily} preloaded successfully`)
      resolve()
    }
    
    link.onerror = () => {
      console.warn(`Failed to preload font ${fontFamily}, using fallback`)
      resolve() // Still resolve to continue with fallback
    }
    
    document.head.appendChild(link)
    
    // Timeout after 3 seconds
    setTimeout(() => {
      console.warn(`Font ${fontFamily} preload timeout, using fallback`)
      resolve()
    }, 3000)
  })
}

export const checkFontLoaded = (fontFamily: string): boolean => {
  try {
    if (document.fonts && document.fonts.check) {
      return document.fonts.check(`16px ${fontFamily}`)
    }
    return false
  } catch (error) {
    console.warn('Font check failed:', error)
    return false
  }
}

export const waitForFont = (fontFamily: string, timeout: number = 5000): Promise<boolean> => {
  return new Promise((resolve) => {
    if (checkFontLoaded(fontFamily)) {
      resolve(true)
      return
    }
    
    const startTime = Date.now()
    const checkInterval = setInterval(() => {
      if (checkFontLoaded(fontFamily)) {
        clearInterval(checkInterval)
        resolve(true)
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval)
        console.warn(`Font ${fontFamily} loading timeout`)
        resolve(false)
      }
    }, 100)
  })
}

export const getFontFallback = (): string => {
  return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
}
