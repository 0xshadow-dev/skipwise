import { Temptation, UserProgress, CategoryStats, TemptationCategory } from './types'
import { settings } from './settings'

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

  let currentStreak = 0
  for (const temptation of sortedTemptations) {
    if (temptation.resisted) {
      currentStreak++
    } else {
      break
    }
  }

  return currentStreak
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

// This function is now deprecated, use settings.formatAmount instead
export function formatCurrency(amount: number): string {
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

export function getTemptationsByPeriod(temptations: Temptation[], period: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all'): Temptation[] {
  if (period === 'all') return temptations
  
  const now = new Date()
  let startDate: Date
  
  switch (period) {
    case 'day':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case 'week':
      startDate = new Date(now.getTime() - (now.getDay() * 24 * 60 * 60 * 1000))
      startDate.setHours(0, 0, 0, 0)
      break
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case 'quarter':
      const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3
      startDate = new Date(now.getFullYear(), quarterStartMonth, 1)
      break
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1)
      break
    default:
      return temptations
  }
  
  return temptations.filter(t => new Date(t.createdAt) >= startDate)
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
  
  const riskLevel: 'low' | 'medium' | 'high' = 
    highRiskCategories.length > 1 ? 'high' : 
    highRiskCategories.length > 0 ? 'medium' : 'low'
  
  return {
    highRiskCategories,
    highRiskHour,
    isWeekendSpender: isWeekendHeavy,
    riskLevel
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
      description: `Consider setting a monthly budget of ${settings.formatAmount(Math.round(avgSpending * 0.8))} to reduce spending by 20%.`,
      priority: 'high' as const
    })
  }

  // Time-based recommendations
  if (patterns.peakHour >= 9 && patterns.peakHour <= 17) {
    recommendations.push({
      type: 'timing',
      title: 'Work Hour Spending Alert',
      description: `Most of your temptations occur around ${patterns.peakHour}:00. Consider scheduling a brief walk or break instead.`,
      priority: 'medium' as const
    })
  }

  // Category-specific advice
  risks.highRiskCategories.forEach(category => {
    recommendations.push({
      type: 'category',
      title: `${category.category} Strategy`,
      description: `You resist only ${category.successRate}% of ${category.category.toLowerCase()} temptations. Try the 24-hour rule before purchasing.`,
      priority: 'high' as const
    })
  })

  // Amount-based strategies
  if (patterns.amountPatterns.large.resistanceRate < patterns.amountPatterns.small.resistanceRate) {
    recommendations.push({
      type: 'amount',
      title: 'Large Purchase Strategy',
      description: `You struggle with expensive items. Set a ${settings.formatAmount(100)}+ purchase approval rule with a trusted friend.`,
      priority: 'high' as const
    })
  }

  // Success reinforcement - focus on categories with significant spending AND good control
  const meaningfulCategories = categoryStats.filter(c => c.totalTemptations >= 3 && c.totalAmount >= 50)
  const bestCategory = meaningfulCategories.sort((a, b) => {
    // Weight by both success rate and financial impact
    const aScore = b.successRate * Math.log(b.totalAmount + 1)
    const bScore = a.successRate * Math.log(a.totalAmount + 1)
    return bScore - aScore
  })[0]
  
  if (bestCategory && bestCategory.successRate >= 70) {
    recommendations.push({
      type: 'success',
      title: `Excellent ${bestCategory.category} Control!`,
      description: `You've resisted ${bestCategory.successRate}% of ${bestCategory.category.toLowerCase()} temptations worth ${settings.formatAmount(bestCategory.totalAmount)}. Apply this discipline to your problem areas.`,
      priority: 'low' as const
    })
  }
  
  // Priority insights for problematic high-spending categories
  const problemCategories = categoryStats
    .filter(c => c.totalTemptations >= 2 && c.totalAmount >= 25)
    .sort((a, b) => {
      // Prioritize by: low success rate + high total amount + high average amount
      const aScore = (100 - a.successRate) * Math.log(a.totalAmount + 1) * (a.totalAmount / a.totalTemptations)
      const bScore = (100 - b.successRate) * Math.log(b.totalAmount + 1) * (b.totalAmount / b.totalTemptations)
      return bScore - aScore
    })
    .slice(0, 2)
  
  problemCategories.forEach(category => {
    const avgAmount = category.totalAmount / category.totalTemptations
    const spentAmount = category.totalAmount - category.savedAmount
    if (spentAmount > 0) {
      recommendations.unshift({
        type: 'priority',
        title: `Focus on ${category.category}`,
        description: `Your biggest opportunity: You've spent ${settings.formatAmount(spentAmount)} in ${category.category.toLowerCase()} with only ${category.successRate}% resistance rate (avg ${settings.formatAmount(avgAmount)} per temptation).`,
        priority: 'high' as const
      })
    }
  })

  return recommendations.slice(0, 6) // Return top 6 recommendations
}

// Enhanced insights for better understanding
export function generateAdvancedInsights(temptations: Temptation[], categoryStats: CategoryStats[]) {
  const patterns = analyzeSpendingPatterns(temptations)
  // const trends = analyzeTrends(temptations)
  // const risks = assessRisks(temptations, categoryStats)
  
  const insights = []
  
  // Financial impact insights
  const totalSpent = temptations.filter(t => !t.resisted).reduce((sum, t) => sum + t.amount, 0)
  const totalSaved = temptations.filter(t => t.resisted).reduce((sum, t) => sum + t.amount, 0)
  // const avgTemptationAmount = temptations.length > 0 ? (totalSpent + totalSaved) / temptations.length : 0
  
  if (totalSaved > totalSpent) {
    insights.push({
      type: 'success',
      title: 'Winning the Battle!',
      description: `You've saved ${settings.formatAmount(totalSaved - totalSpent)} more than you've spent. Your discipline is paying off!`,
      priority: 'high' as const,
      metric: totalSaved - totalSpent
    })
  }
  
  // Behavior pattern insights
  if (patterns.peakHour >= 20 || patterns.peakHour <= 6) {
    insights.push({
      type: 'timing',
      title: 'Late Night Temptations',
      description: `Most temptations happen around ${patterns.peakHour}:00. Consider setting a "no shopping after 8 PM" rule.`,
      priority: 'medium' as const,
      metric: patterns.peakHour
    })
  }
  
  // Category performance insights
  const strongestCategory = categoryStats
    .filter(c => c.totalTemptations >= 3 && c.totalAmount >= 25)
    .sort((a, b) => b.successRate - a.successRate)[0]
    
  if (strongestCategory && strongestCategory.successRate >= 80) {
    insights.push({
      type: 'strength',
      title: `${strongestCategory.category} Mastery`,
      description: `${strongestCategory.successRate}% success rate in ${strongestCategory.category.toLowerCase()}! You've saved ${settings.formatAmount(strongestCategory.savedAmount)} here.`,
      priority: 'low' as const,
      metric: strongestCategory.successRate
    })
  }
  
  // Improvement opportunities
  const worstCategory = categoryStats
    .filter(c => c.totalTemptations >= 2 && c.totalAmount >= 50)
    .sort((a, b) => a.successRate - b.successRate)[0]
    
  if (worstCategory && worstCategory.successRate < 50) {
    const lostAmount = worstCategory.totalAmount - worstCategory.savedAmount
    insights.push({
      type: 'opportunity',
      title: `${worstCategory.category} Challenge`,
      description: `Only ${worstCategory.successRate}% success in ${worstCategory.category.toLowerCase()}. You've lost ${settings.formatAmount(lostAmount)} here - your biggest opportunity!`,
      priority: 'high' as const,
      metric: lostAmount
    })
  }
  
  return insights.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}