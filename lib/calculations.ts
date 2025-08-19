import { Temptation, UserProgress, CategoryStats, TemptationCategory } from './types'

export function calculateUserProgress(temptations: Temptation[]): UserProgress {
  const totalSaved = temptations
    .filter(t => t.resisted)
    .reduce((sum, t) => sum + t.amount, 0)

  const totalTemptations = temptations.length
  const resistedCount = temptations.filter(t => t.resisted).length
  const successRate = totalTemptations > 0 ? (resistedCount / totalTemptations) * 100 : 0

  const currentStreak = calculateCurrentStreak(temptations)
  const longestStreak = calculateLongestStreak(temptations)

  return {
    totalSaved,
    successRate: Math.round(successRate),
    currentStreak,
    longestStreak,
    lastUpdated: new Date()
  }
}

export function calculateCurrentStreak(temptations: Temptation[]): number {
  if (temptations.length === 0) return 0

  const sortedTemptations = [...temptations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  let streak = 0
  for (const temptation of sortedTemptations) {
    if (temptation.resisted) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export function calculateLongestStreak(temptations: Temptation[]): number {
  if (temptations.length === 0) return 0

  const sortedTemptations = [...temptations].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  let maxStreak = 0
  let currentStreak = 0

  for (const temptation of sortedTemptations) {
    if (temptation.resisted) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }

  return maxStreak
}

export function calculateCategoryStats(temptations: Temptation[]): CategoryStats[] {
  const categories = Object.values(TemptationCategory)
  
  return categories.map(category => {
    const categoryTemptations = temptations.filter(t => t.category === category)
    const resistedCount = categoryTemptations.filter(t => t.resisted).length
    const totalAmount = categoryTemptations.reduce((sum, t) => sum + t.amount, 0)
    const savedAmount = categoryTemptations
      .filter(t => t.resisted)
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      category,
      totalTemptations: categoryTemptations.length,
      resistedCount,
      successRate: categoryTemptations.length > 0 
        ? Math.round((resistedCount / categoryTemptations.length) * 100)
        : 0,
      totalAmount,
      savedAmount
    }
  }).filter(stat => stat.totalTemptations > 0)
}

export function formatCurrency(amount: number, currencySymbol?: string): string {
  if (currencySymbol) {
    return `${currencySymbol}${amount.toFixed(2)}`
  }
  
  // Try to use settings if available (client-side)
  if (typeof window !== 'undefined') {
    try {
      const { settings } = require('./settings')
      return settings.formatAmount(amount)
    } catch {
      // Fallback if settings not available
    }
  }
  
  return `$${amount.toFixed(2)}`
}

export function getTemptationsThisWeek(temptations: Temptation[]): Temptation[] {
  const now = new Date()
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
  
  return temptations.filter(t => new Date(t.createdAt) >= weekStart)
}

export function getTemptationsThisMonth(temptations: Temptation[]): Temptation[] {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  
  return temptations.filter(t => new Date(t.createdAt) >= monthStart)
}