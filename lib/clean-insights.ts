import { Temptation, CategoryStats } from './types'
import { settings } from './settings'

export interface CleanInsight {
  id: string
  type: 'stat' | 'trend' | 'opportunity' | 'achievement'
  title: string
  value: string
  change?: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

export function generateCleanInsights(temptations: Temptation[], categoryStats: CategoryStats[]): CleanInsight[] {
  const insights: CleanInsight[] = []
  
  if (temptations.length === 0) return insights

  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  
  const thisMonthTemptations = temptations.filter(t => new Date(t.createdAt) >= thisMonthStart)
  const lastMonthTemptations = temptations.filter(t => {
    const date = new Date(t.createdAt)
    return date >= lastMonthStart && date <= lastMonthEnd
  })

  // 1. Monthly Savings
  const thisMonthSaved = thisMonthTemptations.filter(t => t.resisted).reduce((sum, t) => sum + t.amount, 0)
  const lastMonthSaved = lastMonthTemptations.filter(t => t.resisted).reduce((sum, t) => sum + t.amount, 0)
  const savingsChange = thisMonthSaved - lastMonthSaved
  
  insights.push({
    id: 'monthly-savings',
    type: 'stat',
    title: 'This Month Saved',
    value: settings.formatAmount(thisMonthSaved),
    change: savingsChange !== 0 ? `${savingsChange > 0 ? '+' : ''}${settings.formatAmount(savingsChange)}` : undefined,
    description: 'Total amount saved by resisting temptations',
    priority: 'high'
  })

  // 2. Success Rate
  const thisMonthSuccessRate = thisMonthTemptations.length > 0 ? 
    Math.round((thisMonthTemptations.filter(t => t.resisted).length / thisMonthTemptations.length) * 100) : 0
  const lastMonthSuccessRate = lastMonthTemptations.length > 0 ? 
    Math.round((lastMonthTemptations.filter(t => t.resisted).length / lastMonthTemptations.length) * 100) : 0
  const successRateChange = thisMonthSuccessRate - lastMonthSuccessRate

  insights.push({
    id: 'success-rate',
    type: 'stat',
    title: 'Success Rate',
    value: `${thisMonthSuccessRate}%`,
    change: successRateChange !== 0 ? `${successRateChange > 0 ? '+' : ''}${successRateChange}%` : undefined,
    description: 'Percentage of temptations resisted',
    priority: 'high'
  })

  // 3. Current Streak
  const sortedTemptations = [...temptations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  let currentStreak = 0
  for (const t of sortedTemptations) {
    if (t.resisted) currentStreak++
    else break
  }

  if (currentStreak > 0) {
    insights.push({
      id: 'current-streak',
      type: 'achievement',
      title: 'Current Streak',
      value: `${currentStreak} days`,
      description: currentStreak >= 7 ? 'Excellent momentum!' : 'Building good habits',
      priority: currentStreak >= 7 ? 'high' : 'medium'
    })
  }

  // 4. Biggest Opportunity Category
  const problemCategory = categoryStats
    .filter(c => c.totalTemptations >= 2 && c.successRate < 70)
    .sort((a, b) => (b.totalAmount - b.savedAmount) - (a.totalAmount - a.savedAmount))[0]

  if (problemCategory) {
    const lostAmount = problemCategory.totalAmount - problemCategory.savedAmount
    insights.push({
      id: 'biggest-opportunity',
      type: 'opportunity',
      title: 'Focus Area',
      value: problemCategory.category,
      description: `Lost ${settings.formatAmount(lostAmount)} • ${problemCategory.successRate}% success rate`,
      priority: 'high'
    })
  }

  // 5. Best Performance Category
  const bestCategory = categoryStats
    .filter(c => c.totalTemptations >= 2 && c.successRate >= 70)
    .sort((a, b) => b.successRate - a.successRate)[0]

  if (bestCategory) {
    insights.push({
      id: 'best-performance',
      type: 'achievement',
      title: 'Your Strength',
      value: bestCategory.category,
      description: `${bestCategory.successRate}% success rate • ${settings.formatAmount(bestCategory.savedAmount)} saved`,
      priority: 'medium'
    })
  }

  // 6. Weekly Trend
  const recentWeek = temptations.filter(t => 
    new Date(t.createdAt).getTime() > now.getTime() - (7 * 24 * 60 * 60 * 1000)
  )
  const previousWeek = temptations.filter(t => {
    const date = new Date(t.createdAt).getTime()
    return date > now.getTime() - (14 * 24 * 60 * 60 * 1000) && 
           date <= now.getTime() - (7 * 24 * 60 * 60 * 1000)
  })

  if (recentWeek.length > 0 && previousWeek.length > 0) {
    const recentSuccessRate = Math.round((recentWeek.filter(t => t.resisted).length / recentWeek.length) * 100)
    const previousSuccessRate = Math.round((previousWeek.filter(t => t.resisted).length / previousWeek.length) * 100)
    const trendChange = recentSuccessRate - previousSuccessRate

    if (Math.abs(trendChange) >= 10) {
      insights.push({
        id: 'weekly-trend',
        type: 'trend',
        title: 'Weekly Trend',
        value: trendChange > 0 ? 'Improving' : 'Declining',
        change: `${trendChange > 0 ? '+' : ''}${trendChange}%`,
        description: `Success rate ${trendChange > 0 ? 'increased' : 'decreased'} this week`,
        priority: Math.abs(trendChange) >= 20 ? 'high' : 'medium'
      })
    }
  }

  // 7. Peak Risk Time
  const hourlyPatterns = new Array(24).fill(0)
  temptations.filter(t => !t.resisted).forEach(t => {
    const hour = new Date(t.createdAt).getHours()
    hourlyPatterns[hour]++
  })
  
  const peakRiskHour = hourlyPatterns.indexOf(Math.max(...hourlyPatterns))
  if (hourlyPatterns[peakRiskHour] >= 2) {
    const timeStr = peakRiskHour === 0 ? '12 AM' : 
                   peakRiskHour < 12 ? `${peakRiskHour} AM` : 
                   peakRiskHour === 12 ? '12 PM' : `${peakRiskHour - 12} PM`
    
    insights.push({
      id: 'peak-risk-time',
      type: 'opportunity',
      title: 'Risk Time',
      value: timeStr,
      description: 'When you spend most often - plan ahead for this time',
      priority: 'medium'
    })
  }

  // 8. Average Temptation Value
  const avgTemptationValue = temptations.length > 0 ? 
    temptations.reduce((sum, t) => sum + t.amount, 0) / temptations.length : 0
  
  if (avgTemptationValue > 0) {
    insights.push({
      id: 'avg-temptation',
      type: 'stat',
      title: 'Avg. Temptation',
      value: settings.formatAmount(avgTemptationValue),
      description: 'Average value of each temptation you log',
      priority: 'low'
    })
  }

  // Sort by priority and limit to top 6 insights
  return insights
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
    .slice(0, 6)
}

export interface AIInsight {
  id: string
  type: 'behavioral' | 'financial' | 'pattern' | 'opportunity'
  title: string
  description: string
  confidence: number
  priority: 'high' | 'medium' | 'low'
}

export function generateAIInsights(temptations: Temptation[], categoryStats: CategoryStats[]): AIInsight[] {
  const insights: AIInsight[] = []
  
  if (temptations.length < 3) return insights

  const now = new Date()
  
  // 1. Spending Acceleration Detection
  const recentWeek = temptations.filter(t => 
    new Date(t.createdAt).getTime() > now.getTime() - (7 * 24 * 60 * 60 * 1000)
  )
  const previousWeek = temptations.filter(t => {
    const date = new Date(t.createdAt).getTime()
    return date > now.getTime() - (14 * 24 * 60 * 60 * 1000) && 
           date <= now.getTime() - (7 * 24 * 60 * 60 * 1000)
  })
  
  if (recentWeek.length >= 2 && previousWeek.length >= 2) {
    const recentSpending = recentWeek.filter(t => !t.resisted).reduce((sum, t) => sum + t.amount, 0)
    const previousSpending = previousWeek.filter(t => !t.resisted).reduce((sum, t) => sum + t.amount, 0)
    
    if (recentSpending > previousSpending * 1.5 && recentSpending > 50) {
      const increase = Math.round(((recentSpending - previousSpending) / Math.max(previousSpending, 1)) * 100)
      insights.push({
        id: 'spending-spike',
        type: 'financial',
        title: 'Spending Spike Detected',
        description: `Your spending increased ${increase}% this week. Consider implementing a cooling-off period.`,
        confidence: 85,
        priority: 'high'
      })
    }
  }

  // 2. Time Vulnerability Analysis
  const hourlyFailures = new Array(24).fill(0)
  temptations.filter(t => !t.resisted).forEach(t => {
    const hour = new Date(t.createdAt).getHours()
    hourlyFailures[hour]++
  })
  
  const peakFailureHour = hourlyFailures.indexOf(Math.max(...hourlyFailures))
  if (hourlyFailures[peakFailureHour] >= 2) {
    let timeDescription = ''
    let suggestion = ''
    
    if (peakFailureHour >= 14 && peakFailureHour <= 16) {
      timeDescription = 'afternoon energy dip'
      suggestion = 'Schedule a healthy snack or short walk during this time'
    } else if (peakFailureHour >= 20 || peakFailureHour <= 6) {
      timeDescription = 'late evening/night'
      suggestion = 'Avoid shopping apps when willpower is naturally lower'
    } else if (peakFailureHour >= 11 && peakFailureHour <= 13) {
      timeDescription = 'lunch break'
      suggestion = 'Plan lunch activities that don\'t involve shopping'
    } else {
      timeDescription = `${peakFailureHour}:00`
      suggestion = 'Be extra mindful during this vulnerable time'
    }
    
    insights.push({
      id: 'time-vulnerability',
      type: 'behavioral',
      title: `High-Risk Time: ${timeDescription}`,
      description: `Most spending failures occur during ${timeDescription}. ${suggestion}.`,
      confidence: 80,
      priority: 'medium'
    })
  }

  // 3. Category Momentum Analysis
  const recentCategoryPerformance = categoryStats.map(category => {
    const categoryTemptations = temptations.filter(t => t.category === category.category)
    const recentCategoryTemptations = categoryTemptations
      .filter(t => new Date(t.createdAt).getTime() > now.getTime() - (14 * 24 * 60 * 60 * 1000))
    
    if (recentCategoryTemptations.length >= 2) {
      const recentSuccessRate = (recentCategoryTemptations.filter(t => t.resisted).length / recentCategoryTemptations.length) * 100
      return { ...category, recentSuccessRate, hasRecentData: true }
    }
    return { ...category, recentSuccessRate: category.successRate, hasRecentData: false }
  }).filter(c => c.hasRecentData)

  // Find improving categories
  const improvingCategory = recentCategoryPerformance
    .filter(c => c.recentSuccessRate > c.successRate + 20)
    .sort((a, b) => (b.recentSuccessRate - b.successRate) - (a.recentSuccessRate - a.successRate))[0]
  
  if (improvingCategory) {
    insights.push({
      id: 'category-improvement',
      type: 'behavioral',
      title: `${improvingCategory.category} Breakthrough`,
      description: `Your ${improvingCategory.category.toLowerCase()} resistance improved to ${Math.round(improvingCategory.recentSuccessRate)}%. Apply these strategies to other areas.`,
      confidence: 75,
      priority: 'medium'
    })
  }

  // 4. Small Purchase Trap Detection
  const smallPurchases = temptations.filter(t => t.amount <= 25)
  const largePurchases = temptations.filter(t => t.amount > 100)
  
  if (smallPurchases.length >= 5 && largePurchases.length >= 2) {
    const smallSuccessRate = (smallPurchases.filter(t => t.resisted).length / smallPurchases.length) * 100
    const largeSuccessRate = (largePurchases.filter(t => t.resisted).length / largePurchases.length) * 100
    
    if (smallSuccessRate < largeSuccessRate - 15) {
      insights.push({
        id: 'small-purchase-trap',
        type: 'pattern',
        title: 'Small Purchase Blind Spot',
        description: `You resist ${Math.round(largeSuccessRate)}% of large purchases but only ${Math.round(smallSuccessRate)}% of small ones. Small amounts add up quickly.`,
        confidence: 90,
        priority: 'high'
      })
    }
  }

  // 5. Weekend vs Weekday Pattern
  const weekendTemptations = temptations.filter(t => {
    const day = new Date(t.createdAt).getDay()
    return day === 0 || day === 6
  })
  const weekdayTemptations = temptations.filter(t => {
    const day = new Date(t.createdAt).getDay()
    return day >= 1 && day <= 5
  })
  
  if (weekendTemptations.length >= 3 && weekdayTemptations.length >= 3) {
    const weekendSuccessRate = (weekendTemptations.filter(t => t.resisted).length / weekendTemptations.length) * 100
    const weekdaySuccessRate = (weekdayTemptations.filter(t => t.resisted).length / weekdayTemptations.length) * 100
    
    if (Math.abs(weekendSuccessRate - weekdaySuccessRate) > 20) {
      const betterPeriod = weekendSuccessRate > weekdaySuccessRate ? 'weekends' : 'weekdays'
      const worsePeriod = weekendSuccessRate > weekdaySuccessRate ? 'weekdays' : 'weekends'
      
      insights.push({
        id: 'weekend-weekday-pattern',
        type: 'behavioral',
        title: `${betterPeriod.charAt(0).toUpperCase() + betterPeriod.slice(1)} Advantage`,
        description: `You're ${Math.abs(weekendSuccessRate - weekdaySuccessRate).toFixed(0)}% more disciplined on ${betterPeriod}. Apply this mindset to ${worsePeriod}.`,
        confidence: 85,
        priority: 'medium'
      })
    }
  }

  // 6. Streak Analysis
  const sortedTemptations = [...temptations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  let currentStreak = 0
  for (const t of sortedTemptations) {
    if (t.resisted) currentStreak++
    else break
  }
  
  if (currentStreak >= 5) {
    insights.push({
      id: 'strong-streak',
      type: 'behavioral',
      title: `${currentStreak}-Day Streak Active`,
      description: `You're building strong resistance habits. Don't let psychological pressure to "reward yourself" break this momentum.`,
      confidence: 95,
      priority: 'medium'
    })
  }

  // 7. Emotional Spending Patterns
  const eveningTemptations = temptations.filter(t => {
    const hour = new Date(t.createdAt).getHours()
    return hour >= 18 && hour <= 22
  })
  const morningTemptations = temptations.filter(t => {
    const hour = new Date(t.createdAt).getHours()
    return hour >= 6 && hour <= 11
  })
  
  if (eveningTemptations.length >= 3 && morningTemptations.length >= 2) {
    const eveningSuccessRate = (eveningTemptations.filter(t => t.resisted).length / eveningTemptations.length) * 100
    const morningSuccessRate = (morningTemptations.filter(t => t.resisted).length / morningTemptations.length) * 100
    
    if (eveningSuccessRate < morningSuccessRate - 20) {
      insights.push({
        id: 'evening-vulnerability',
        type: 'behavioral',
        title: 'Evening Decision Fatigue',
        description: `Your willpower drops ${Math.round(morningSuccessRate - eveningSuccessRate)}% in the evening. This suggests decision fatigue from daily stress.`,
        confidence: 82,
        priority: 'medium'
      })
    }
  }

  // 8. Impulse Purchase Detection
  const quickTemptations = temptations.filter(t => {
    // Assume quick purchases are logged within the same hour they occurred
    const logTime = new Date(t.createdAt)
    const hour = logTime.getHours()
    return hour >= 9 && hour <= 21 // During active hours
  })
  
  if (quickTemptations.length >= 5) {
    const quickFailureRate = (quickTemptations.filter(t => !t.resisted).length / quickTemptations.length) * 100
    const totalFailureRate = (temptations.filter(t => !t.resisted).length / temptations.length) * 100
    
    if (quickFailureRate > totalFailureRate + 15) {
      insights.push({
        id: 'impulse-purchases',
        type: 'pattern',
        title: 'Impulse Purchase Vulnerability',
        description: `You're ${Math.round(quickFailureRate - totalFailureRate)}% more likely to spend on immediate temptations. Building delay habits could help.`,
        confidence: 75,
        priority: 'medium'
      })
    }
  }

  // 9. Category Cross-Contamination
  const categoryPairs = categoryStats
    .filter(c => c.totalTemptations >= 2)
    .map(category => {
      const categoryTemptations = temptations.filter(t => t.category === category.category)
      const categoryFailures = categoryTemptations.filter(t => !t.resisted)
      
      // Check if failures in this category correlate with other categories on same day
      const sameHourFailures = categoryFailures.filter(failure => {
        const failureTime = new Date(failure.createdAt)
        return temptations.some(t => 
          t.id !== failure.id && 
          !t.resisted && 
          Math.abs(new Date(t.createdAt).getTime() - failureTime.getTime()) < 2 * 60 * 60 * 1000 // Within 2 hours
        )
      })
      
      return {
        category: category.category,
        clusteredFailures: sameHourFailures.length,
        totalFailures: categoryFailures.length
      }
    })
    .filter(c => c.clusteredFailures >= 2)
    .sort((a, b) => (b.clusteredFailures / b.totalFailures) - (a.clusteredFailures / a.totalFailures))

  if (categoryPairs.length > 0) {
    const worstCategory = categoryPairs[0]
    const clusterRate = Math.round((worstCategory.clusteredFailures / worstCategory.totalFailures) * 100)
    
    if (clusterRate >= 50) {
      insights.push({
        id: 'spending-spirals',
        type: 'pattern',
        title: 'Spending Spiral Effect',
        description: `${clusterRate}% of your ${worstCategory.category.toLowerCase()} failures trigger other purchases within 2 hours. One "yes" leads to more.`,
        confidence: 88,
        priority: 'high'
      })
    }
  }

  // 10. Stress-Response Spending
  const dailyTemptationCounts = temptations.reduce((acc, t) => {
    const date = new Date(t.createdAt).toDateString()
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const highVolumeDays = Object.entries(dailyTemptationCounts)
    .filter(([, count]) => count >= 4)
    .length
  
  const totalDaysWithTemptations = Object.keys(dailyTemptationCounts).length
  
  if (highVolumeDays >= 2 && totalDaysWithTemptations >= 7) {
    const stressRate = Math.round((highVolumeDays / totalDaysWithTemptations) * 100)
    
    if (stressRate >= 25) {
      insights.push({
        id: 'stress-spending',
        type: 'behavioral',
        title: 'Stress-Response Pattern',
        description: `On ${stressRate}% of days, you face 4+ temptations, suggesting external stress triggers shopping urges.`,
        confidence: 78,
        priority: 'medium'
      })
    }
  }

  // 11. Price Anchoring Bias
  const priceRanges = {
    micro: temptations.filter(t => t.amount <= 10),
    small: temptations.filter(t => t.amount > 10 && t.amount <= 50),
    medium: temptations.filter(t => t.amount > 50 && t.amount <= 200),
    large: temptations.filter(t => t.amount > 200)
  }
  
  const rangeSuccessRates = Object.entries(priceRanges).map(([range, temps]) => ({
    range,
    successRate: temps.length > 0 ? (temps.filter(t => t.resisted).length / temps.length) * 100 : 0,
    count: temps.length
  })).filter(r => r.count >= 2)
  
  if (rangeSuccessRates.length >= 3) {
    const sortedBySuccess = rangeSuccessRates.sort((a, b) => a.successRate - b.successRate)
    const worst = sortedBySuccess[0]
    const best = sortedBySuccess[sortedBySuccess.length - 1]
    
    if (best.successRate - worst.successRate >= 30) {
      const priceLabels = { micro: 'under $10', small: '$10-50', medium: '$50-200', large: 'over $200' }
      insights.push({
        id: 'price-anchoring',
        type: 'pattern',
        title: 'Price Point Weakness',
        description: `You resist ${Math.round(best.successRate)}% of ${priceLabels[best.range as keyof typeof priceLabels]} items but only ${Math.round(worst.successRate)}% of ${priceLabels[worst.range as keyof typeof priceLabels]} purchases.`,
        confidence: 85,
        priority: 'medium'
      })
    }
  }

  // 12. Social Influence Detection
  const weekendEvening = temptations.filter(t => {
    const date = new Date(t.createdAt)
    const day = date.getDay()
    const hour = date.getHours()
    return (day === 5 || day === 6) && hour >= 18 && hour <= 23
  })
  
  if (weekendEvening.length >= 3) {
    const socialSpendingRate = (weekendEvening.filter(t => !t.resisted).length / weekendEvening.length) * 100
    const overallFailureRate = (temptations.filter(t => !t.resisted).length / temptations.length) * 100
    
    if (socialSpendingRate > overallFailureRate + 20) {
      insights.push({
        id: 'social-influence',
        type: 'behavioral',
        title: 'Social Spending Trigger',
        description: `Weekend evening spending is ${Math.round(socialSpendingRate - overallFailureRate)}% higher, suggesting social situations weaken resistance.`,
        confidence: 80,
        priority: 'medium'
      })
    }
  }

  // 13. Recovery Pattern Analysis
  let recoveryInsight: AIInsight | null = null
  const failures = temptations.filter(t => !t.resisted).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  
  if (failures.length >= 3) {
    const recoveryTimes = []
    for (let i = 0; i < failures.length - 1; i++) {
      const nextSuccess = temptations
        .filter(t => t.resisted && new Date(t.createdAt).getTime() > new Date(failures[i].createdAt).getTime())
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0]
      
      if (nextSuccess) {
        const hoursToRecover = (new Date(nextSuccess.createdAt).getTime() - new Date(failures[i].createdAt).getTime()) / (1000 * 60 * 60)
        recoveryTimes.push(hoursToRecover)
      }
    }
    
    if (recoveryTimes.length >= 2) {
      const avgRecovery = recoveryTimes.reduce((sum, time) => sum + time, 0) / recoveryTimes.length
      const fastRecoveries = recoveryTimes.filter(time => time <= 24).length
      
      if (fastRecoveries / recoveryTimes.length >= 0.7) {
        recoveryInsight = {
          id: 'quick-recovery',
          type: 'behavioral',
          title: 'Strong Recovery Pattern',
          description: `You bounce back from spending within ${Math.round(avgRecovery)} hours on average. Your resilience is a key strength.`,
          confidence: 82,
          priority: 'low'
        }
      } else if (avgRecovery > 72) {
        recoveryInsight = {
          id: 'slow-recovery',
          type: 'behavioral',
          title: 'Slow Recovery Pattern',
          description: `It takes you ${Math.round(avgRecovery / 24)} days on average to resist again after spending. Building bounce-back strategies could help.`,
          confidence: 78,
          priority: 'medium'
        }
      }
    }
  }
  
  if (recoveryInsight) {
    insights.push(recoveryInsight)
  }

  // 14. Decision Quality Under Pressure
  const recentPressure = temptations.filter(t => {
    const temptationTime = new Date(t.createdAt).getTime()
    // Check if there was another temptation within 4 hours before this one
    return temptations.some(other => 
      other.id !== t.id && 
      Math.abs(new Date(other.createdAt).getTime() - temptationTime) <= 4 * 60 * 60 * 1000 &&
      new Date(other.createdAt).getTime() < temptationTime
    )
  })
  
  if (recentPressure.length >= 3) {
    const pressureSuccessRate = (recentPressure.filter(t => t.resisted).length / recentPressure.length) * 100
    const normalSuccessRate = (temptations.filter(t => 
      t.resisted && !recentPressure.find(p => p.id === t.id)
    ).length / Math.max(1, temptations.length - recentPressure.length)) * 100
    
    if (normalSuccessRate - pressureSuccessRate >= 20) {
      insights.push({
        id: 'pressure-decisions',
        type: 'pattern',
        title: 'Decision Fatigue Effect',
        description: `Your resistance drops ${Math.round(normalSuccessRate - pressureSuccessRate)}% when facing multiple temptations in short periods.`,
        confidence: 83,
        priority: 'medium'
      })
    }
  }

  return insights
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return (priorityOrder[b.priority] * 10 + b.confidence) - (priorityOrder[a.priority] * 10 + a.confidence)
    })
    .slice(0, 8) // Return top 8 AI insights
}

export function generateAIRecommendations(temptations: Temptation[], categoryStats: CategoryStats[]): string[] {
  const recommendations: string[] = []
  
  if (temptations.length === 0) return recommendations

  // Advanced behavioral analysis for targeted recommendations
  const now = new Date()
  
  // 1. Spending Spiral Prevention
  const clusteredFailures = temptations.filter(t => {
    if (t.resisted) return false
    const failureTime = new Date(t.createdAt).getTime()
    return temptations.some(other => 
      other.id !== t.id && 
      !other.resisted && 
      Math.abs(new Date(other.createdAt).getTime() - failureTime) < 2 * 60 * 60 * 1000
    )
  })
  
  if (clusteredFailures.length >= 3) {
    recommendations.push('After any purchase, immediately log out of shopping apps and set a 2-hour "cooling off" timer')
  }

  // 2. Decision Fatigue Protection
  const eveningFailures = temptations.filter(t => {
    const hour = new Date(t.createdAt).getHours()
    return !t.resisted && hour >= 18 && hour <= 22
  })
  
  if (eveningFailures.length >= 2) {
    recommendations.push('Create an evening routine: dinner, exercise, or hobby before 8 PM to avoid decision fatigue spending')
  }

  // 3. Stress Response Management
  const dailyTemptationCounts = temptations.reduce((acc, t) => {
    const date = new Date(t.createdAt).toDateString()
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const highStressDays = Object.values(dailyTemptationCounts).filter(count => count >= 4).length
  if (highStressDays >= 2) {
    recommendations.push('Identify your stress triggers and create a "stressed = no shopping" rule with alternative activities')
  }

  // 4. Price Point Strategy
  const priceRanges = {
    micro: temptations.filter(t => t.amount <= 10),
    small: temptations.filter(t => t.amount > 10 && t.amount <= 50),
    medium: temptations.filter(t => t.amount > 50 && t.amount <= 200),
    large: temptations.filter(t => t.amount > 200)
  }
  
  const worstPriceRange = Object.entries(priceRanges)
    .map(([range, temps]) => ({
      range,
      failureRate: temps.length > 0 ? (temps.filter(t => !t.resisted).length / temps.length) * 100 : 0,
      count: temps.length
    }))
    .filter(r => r.count >= 3)
    .sort((a, b) => b.failureRate - a.failureRate)[0]
  
  if (worstPriceRange) {
    const strategies = {
      micro: 'Track micro-purchases in a dedicated app - they add up faster than you think',
      small: 'Use the "cost per use" calculation before buying anything $10-50',
      medium: 'Implement a 48-hour rule for all purchases $50-200',
      large: 'Require approval from a trusted friend for any purchase over $200'
    }
    recommendations.push(strategies[worstPriceRange.range as keyof typeof strategies])
  }

  // 5. Social Situation Management
  const weekendEveningFailures = temptations.filter(t => {
    const date = new Date(t.createdAt)
    const day = date.getDay()
    const hour = date.getHours()
    return !t.resisted && (day === 5 || day === 6) && hour >= 18 && hour <= 23
  })
  
  if (weekendEveningFailures.length >= 2) {
    recommendations.push('Plan weekend social activities that don\'t center around shopping (hiking, cooking, games)')
  }

  // 6. Category-Specific Strategies
  const problemCategory = categoryStats
    .filter(c => c.totalTemptations >= 2 && c.successRate < 60)
    .sort((a, b) => (b.totalAmount - b.savedAmount) - (a.totalAmount - a.savedAmount))[0]

  if (problemCategory) {
    const categoryStrategies = {
      'Food & Dining': 'Plan weekly meals and grocery lists to reduce impulse food purchases',
      'Coffee': 'Make coffee at home and track your daily coffee spending',
      'Shopping': 'Use the "one in, one out" rule - sell something before buying anything new',
      'Clothes': 'Take photos of items you want and wait 7 days before purchasing',
      'Electronics': 'Research alternatives and read reviews for 24 hours before tech purchases',
      'Entertainment': 'Use free library resources and streaming trials before paying for entertainment',
      'Books': 'Visit the library first, then consider purchasing if you love the book'
    }
    
    const strategy = categoryStrategies[problemCategory.category as keyof typeof categoryStrategies] || 
                    `Try the 24-hour rule for ${problemCategory.category.toLowerCase()} purchases`
    recommendations.push(strategy)
  }

  // 7. Recovery Acceleration
  const failures = temptations.filter(t => !t.resisted)
  if (failures.length >= 3) {
    const recentFailure = failures.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0]
    
    const hoursSinceFailure = (now.getTime() - new Date(recentFailure.createdAt).getTime()) / (1000 * 60 * 60)
    
    if (hoursSinceFailure <= 48) {
      recommendations.push('After spending, immediately plan your next resistance win to rebuild momentum')
    }
  }

  // 8. Impulse Control Strengthening
  const quickDecisions = temptations.filter(t => {
    const hour = new Date(t.createdAt).getHours()
    return hour >= 9 && hour <= 21 && !t.resisted
  })
  
  if (quickDecisions.length >= 3) {
    recommendations.push('Practice the "10-minute pause": set a timer before any unplanned purchase')
  }

  // 9. Success Pattern Reinforcement
  const bestCategory = categoryStats
    .filter(c => c.totalTemptations >= 2 && c.successRate >= 70)
    .sort((a, b) => b.successRate - a.successRate)[0]

  if (bestCategory && problemCategory) {
    recommendations.push(`Document what makes you successful with ${bestCategory.category.toLowerCase()} and apply it to ${problemCategory.category.toLowerCase()}`)
  }

  // 10. Environmental Design
  const mobileHourFailures = temptations.filter(t => {
    const hour = new Date(t.createdAt).getHours()
    return !t.resisted && (hour >= 20 || hour <= 7)
  })
  
  if (mobileHourFailures.length >= 2) {
    recommendations.push('Remove shopping apps from your phone home screen and enable purchase confirmation delays')
  }

  return recommendations.slice(0, 5) // Return top 5 recommendations
}