// Component registry for managing UI components

import { ComponentType } from 'react'

export interface ComponentRegistry {
  [key: string]: ComponentType<any>
}

class ComponentRegistryManager {
  private components: ComponentRegistry = {}

  register(name: string, component: ComponentType<any>): void {
    if (this.components[name]) {
      console.warn(`Component '${name}' is already registered. Overwriting.`)
    }
    this.components[name] = component
    console.log(`Component '${name}' registered successfully`)
  }

  get<T extends ComponentType<any>>(name: string): T | null {
    const component = this.components[name]
    if (!component) {
      console.error(`Component '${name}' not found in registry`)
      return null
    }
    return component as T
  }

  unregister(name: string): boolean {
    if (this.components[name]) {
      delete this.components[name]
      console.log(`Component '${name}' unregistered successfully`)
      return true
    } else {
      console.warn(`Component '${name}' not found in registry`)
      return false
    }
  }

  listComponents(): string[] {
    return Object.keys(this.components)
  }

  clear(): void {
    this.components = {}
    console.log('Component registry cleared')
  }

  isInitialized(): boolean {
    return Object.keys(this.components).length > 0
  }
}

// Export singleton instance
export const componentRegistry = new ComponentRegistryManager()

// Helper function to get component with fallback
export const getComponent = <T extends ComponentType<any>>(
  name: string, 
  fallback?: T
): T | null => {
  const component = componentRegistry.get<T>(name)
  return component || fallback || null
}
