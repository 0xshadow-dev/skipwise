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

export function calculateCategoryStats(temptations: Temptation[], customCategories: string[] = []): CategoryStats[] {
  // Combine built-in categories with custom ones
  const builtInCategories = Object.values(TemptationCategory)
  const allCategories = [...builtInCategories, ...customCategories]
  
  return allCategories.map(category => {
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

export function formatCurrency(amount: number, currencySymbol?: string, currencyCode?: string): string {
  if (currencySymbol && currencyCode) {
    // Format with proper locale handling
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    return formatter.format(amount)
  }
  
  if (currencySymbol) {
    // Handle special positioning for some currencies
    const symbolAfterCurrencies = ['kr', 'zł', 'Kč', 'Ft', 'lei', 'лв', 'kn']
    if (symbolAfterCurrencies.includes(currencySymbol)) {
      return `${amount.toFixed(2)} ${currencySymbol}`
    }
    return `${currencySymbol}${amount.toFixed(2)}`
  }
  
  // Default fallback
  
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

export function getTemptationsLastMonth(temptations: Temptation[]): Temptation[] {
  const now = new Date()
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  
  return temptations.filter(t => {
    const date = new Date(t.createdAt)
    return date >= lastMonthStart && date <= lastMonthEnd
  })
}

// Behavioral Pattern Analysis
export function analyzeSpendingPatterns(temptations: Temptation[]) {
  const hourlyPatterns = new Array(24).fill(0)
  const dailyPatterns = new Array(7).fill(0)
  const amountRanges = { small: 0, medium: 0, large: 0 }
  const resistanceByAmount = { small: 0, medium: 0, large: 0 }
  const totalByAmount = { small: 0, medium: 0, large: 0 }

  temptations.forEach(t => {
    const date = new Date(t.createdAt)
    const hour = date.getHours()
    const day = date.getDay()
    
    hourlyPatterns[hour]++
    dailyPatterns[day]++
    
    // Categorize amounts: small (<$25), medium ($25-100), large (>$100)
    if (t.amount < 25) {
      amountRanges.small++
      totalByAmount.small++
      if (t.resisted) resistanceByAmount.small++
    } else if (t.amount <= 100) {
      amountRanges.medium++
      totalByAmount.medium++
      if (t.resisted) resistanceByAmount.medium++
    } else {
      amountRanges.large++
      totalByAmount.large++
      if (t.resisted) resistanceByAmount.large++
    }
  })

  const peakHour = hourlyPatterns.indexOf(Math.max(...hourlyPatterns))
  const peakDay = dailyPatterns.indexOf(Math.max(...dailyPatterns))
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  
  return {
    peakHour,
    peakDay: dayNames[peakDay],
    hourlyDistribution: hourlyPatterns,
    dailyDistribution: dailyPatterns,
    amountPatterns: {
      small: { count: amountRanges.small, resistanceRate: totalByAmount.small > 0 ? Math.round((resistanceByAmount.small / totalByAmount.small) * 100) : 0 },
      medium: { count: amountRanges.medium, resistanceRate: totalByAmount.medium > 0 ? Math.round((resistanceByAmount.medium / totalByAmount.medium) * 100) : 0 },
      large: { count: amountRanges.large, resistanceRate: totalByAmount.large > 0 ? Math.round((resistanceByAmount.large / totalByAmount.large) * 100) : 0 }
    }
  }
}

// Trend Analysis
export function analyzeTrends(temptations: Temptation[]) {
  const thisMonth = getTemptationsThisMonth(temptations)
  const lastMonth = getTemptationsLastMonth(temptations)
  
  const thisMonthSpent = thisMonth.filter(t => !t.resisted).reduce((sum, t) => sum + t.amount, 0)
  const lastMonthSpent = lastMonth.filter(t => !t.resisted).reduce((sum, t) => sum + t.amount, 0)
  
  const thisMonthSaved = thisMonth.filter(t => t.resisted).reduce((sum, t) => sum + t.amount, 0)
  const lastMonthSaved = lastMonth.filter(t => t.resisted).reduce((sum, t) => sum + t.amount, 0)
  
  const thisMonthSuccessRate = thisMonth.length > 0 ? (thisMonth.filter(t => t.resisted).length / thisMonth.length) * 100 : 0
  const lastMonthSuccessRate = lastMonth.length > 0 ? (lastMonth.filter(t => t.resisted).length / lastMonth.length) * 100 : 0
  
  return {
    spendingTrend: thisMonthSpent - lastMonthSpent,
    savingsTrend: thisMonthSaved - lastMonthSaved,
    successRateTrend: thisMonthSuccessRate - lastMonthSuccessRate,
    thisMonth: { spent: thisMonthSpent, saved: thisMonthSaved, successRate: Math.round(thisMonthSuccessRate) },
    lastMonth: { spent: lastMonthSpent, saved: lastMonthSaved, successRate: Math.round(lastMonthSuccessRate) }
  }
}

// Risk Assessment
export function assessRisks(temptations: Temptation[], categoryStats: CategoryStats[]) {
  const patterns = analyzeSpendingPatterns(temptations)
  
  // Find high-risk categories (low resistance + high spending)
  const highRiskCategories = categoryStats
    .filter(cat => cat.successRate < 50 && cat.totalAmount > 100)
    .sort((a, b) => (a.successRate - b.successRate) + (b.totalAmount - a.totalAmount))
    .slice(0, 3)
  
  // Find high-risk times
  const highRiskHour = patterns.peakHour
  const isWeekendHeavy = patterns.dailyDistribution[0] + patterns.dailyDistribution[6] > 
                        patterns.dailyDistribution.slice(1, 6).reduce((a, b) => a + b, 0)
  
  return {
    highRiskCategories,
    highRiskHour,
    isWeekendSpender: isWeekendHeavy,
    riskLevel: highRiskCategories.length > 1 ? 'high' : highRiskCategories.length > 0 ? 'medium' : 'low'
  }
}

// Smart Recommendations
export function generateRecommendations(temptations: Temptation[], categoryStats: CategoryStats[]) {
  const patterns = analyzeSpendingPatterns(temptations)
  const trends = analyzeTrends(temptations)
  const risks = assessRisks(temptations, categoryStats)
  const recommendations = []

  // Budget recommendations
  if (trends.spendingTrend > 0) {
    const avgSpending = trends.thisMonth.spent
    recommendations.push({
      type: 'budget',
      title: 'Set Monthly Budget',
      description: `Consider setting a monthly budget of $${Math.round(avgSpending * 0.8)} to reduce spending by 20%.`,
      priority: 'high'
    })
  }

  // Time-based recommendations
  if (patterns.peakHour >= 9 && patterns.peakHour <= 17) {
    recommendations.push({
      type: 'timing',
      title: 'Work Hour Spending Alert',
      description: `Most of your temptations occur around ${patterns.peakHour}:00. Consider scheduling a brief walk or break instead.`,
      priority: 'medium'
    })
  }

  // Category-specific advice
  risks.highRiskCategories.forEach(category => {
    recommendations.push({
      type: 'category',
      title: `${category.category} Strategy`,
      description: `You resist only ${category.successRate}% of ${category.category.toLowerCase()} temptations. Try the 24-hour rule before purchasing.`,
      priority: 'high'
    })
  })

  // Amount-based strategies
  if (patterns.amountPatterns.large.resistanceRate < patterns.amountPatterns.small.resistanceRate) {
    recommendations.push({
      type: 'amount',
      title: 'Large Purchase Strategy',
      description: 'You struggle with expensive items. Set a $100+ purchase approval rule with a trusted friend.',
      priority: 'high'
    })
  }

  // Success reinforcement
  const bestCategory = categoryStats.filter(c => c.totalTemptations >= 3).sort((a, b) => b.successRate - a.successRate)[0]
  if (bestCategory && bestCategory.successRate > 70) {
    recommendations.push({
      type: 'success',
      title: `Great ${bestCategory.category} Control!`,
      description: `You're resisting ${bestCategory.successRate}% of ${bestCategory.category.toLowerCase()} temptations. Apply this same mindset to other categories.`,
      priority: 'low'
    })
  }

  return recommendations.slice(0, 5) // Return top 5 recommendations
}