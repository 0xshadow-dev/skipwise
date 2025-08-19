'use client'

// Types of haptic feedback
export enum HapticType {
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

// Haptic feedback utility
export class HapticManager {
  private static isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'vibrate' in navigator &&
      typeof navigator.vibrate === 'function'
    )
  }

  private static getVibratePattern(type: HapticType): number | number[] {
    switch (type) {
      case HapticType.LIGHT:
        return 10
      case HapticType.MEDIUM:
        return 20
      case HapticType.HEAVY:
        return 40
      case HapticType.SUCCESS:
        return [50, 50, 100]
      case HapticType.WARNING:
        return [100, 50, 100]
      case HapticType.ERROR:
        return [100, 50, 100, 50, 100]
      default:
        return 20
    }
  }

  public static vibrate(type: HapticType = HapticType.MEDIUM): void {
    if (!this.isSupported()) {
      return
    }

    try {
      const pattern = this.getVibratePattern(type)
      navigator.vibrate(pattern)
    } catch (error) {
      console.warn('Haptic feedback failed:', error)
    }
  }

  // Convenience methods
  public static light(): void {
    this.vibrate(HapticType.LIGHT)
  }

  public static medium(): void {
    this.vibrate(HapticType.MEDIUM)
  }

  public static heavy(): void {
    this.vibrate(HapticType.HEAVY)
  }

  public static success(): void {
    this.vibrate(HapticType.SUCCESS)
  }

  public static warning(): void {
    this.vibrate(HapticType.WARNING)
  }

  public static error(): void {
    this.vibrate(HapticType.ERROR)
  }

  // For button clicks and interactions
  public static tap(): void {
    this.vibrate(HapticType.LIGHT)
  }

  // For significant actions
  public static impact(): void {
    this.vibrate(HapticType.MEDIUM)
  }

  // For confirmations and completions
  public static notification(type: 'success' | 'warning' | 'error' = 'success'): void {
    switch (type) {
      case 'success':
        this.success()
        break
      case 'warning':
        this.warning()
        break
      case 'error':
        this.error()
        break
    }
  }
}

// Export singleton instance
export const haptics = HapticManager