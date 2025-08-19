'use client'

import { useEffect } from 'react'

// Extend the Window interface to include workbox
declare global {
  interface Window {
    workbox?: {
      addEventListener: (event: string, callback: (event: Event) => void) => void
      register: () => Promise<void>
    }
  }
}

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox
      
      // Add event listeners to handle any of the generated workbox events
      wb.addEventListener('installed', (event) => {
        console.log('Service Worker installed:', event)
      })

      wb.addEventListener('controlling', (event) => {
        console.log('Service Worker controlling:', event)
      })

      wb.addEventListener('activated', (event) => {
        console.log('Service Worker activated:', event)
      })

      // Register the service worker
      wb.register()
    } else if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator
    ) {
      // Manual registration fallback
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }
  }, [])

  return null
}