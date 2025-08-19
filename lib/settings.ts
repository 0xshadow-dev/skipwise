'use client'

import { AppSettings, Currency, SUPPORTED_CURRENCIES } from './types'

const SETTINGS_KEY = 'skipwise-settings'

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  notifications: false,
  currency: SUPPORTED_CURRENCIES[0] // USD as default
}

export class SettingsManager {
  private settings: AppSettings

  constructor() {
    this.settings = this.loadSettings()
  }

  private loadSettings(): AppSettings {
    if (typeof window === 'undefined') {
      return DEFAULT_SETTINGS
    }

    try {
      const stored = localStorage.getItem(SETTINGS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Ensure currency is properly structured
        if (parsed.currency && typeof parsed.currency === 'string') {
          const currency = SUPPORTED_CURRENCIES.find(c => c.code === parsed.currency)
          parsed.currency = currency || DEFAULT_SETTINGS.currency
        }
        return { ...DEFAULT_SETTINGS, ...parsed }
      }
    } catch (error) {
      console.warn('Failed to load settings:', error)
    }

    return DEFAULT_SETTINGS
  }

  private saveSettings(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings))
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  getSettings(): AppSettings {
    return { ...this.settings }
  }

  getCurrency(): Currency {
    return this.settings.currency
  }

  setCurrency(currency: Currency): void {
    this.settings.currency = currency
    this.saveSettings()
  }

  getTheme(): 'light' | 'dark' | 'system' {
    return this.settings.theme
  }

  setTheme(theme: 'light' | 'dark' | 'system'): void {
    this.settings.theme = theme
    this.saveSettings()
  }

  getNotifications(): boolean {
    return this.settings.notifications
  }

  setNotifications(enabled: boolean): void {
    this.settings.notifications = enabled
    this.saveSettings()
  }

  formatAmount(amount: number): string {
    const currency = this.getCurrency()
    return `${currency.symbol}${amount.toFixed(2)}`
  }
}

// Global settings instance
export const settings = new SettingsManager()