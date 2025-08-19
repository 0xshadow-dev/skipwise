import { Temptation, CategoryStats } from './types'
import { formatCurrency, analyzeSpendingPatterns, analyzeTrends } from './calculations'

export interface AIInsight {
  id: string
  type: 'financial' | 'behavioral' | 'predictive' | 'comparative' | 'goal' | 'psychological'
  category: 'critical' | 'opportunity' | 'success' | 'warning' | 'info'
  title: string
  description: string
  actionable: string
  confidence: number // 0-100
  impact: 'high' | 'medium' | 'low'
  trend: 'improving' | 'declining' | 'stable'
  metric?: number
  comparison?: string
}

export function generateAdvancedAIInsights(temptations: Temptation[], categoryStats: CategoryStats[]): AIInsight[] {
  const insights: AIInsight[] = []
  
  if (temptations.length === 0) return insights

  const now = new Date()
  const patterns = analyzeSpendingPatterns(temptations)
  const trends = analyzeTrends(temptations)
  
  // 1. FINANCIAL VELOCITY ANALYSIS
  const recentTemptations = temptations.filter(t => 
    new Date(t.createdAt).getTime() > now.getTime() - (7 * 24 * 60 * 60 * 1000)
  )
  const previousWeekTemptations = temptations.filter(t => {
    const date = new Date(t.createdAt).getTime()
    return date > now.getTime() - (14 * 24 * 60 * 60 * 1000) && 
           date <= now.getTime() - (7 * 24 * 60 * 60 * 1000)
  })
  
  const recentSpending = recentTemptations.filter(t => !t.resisted).reduce((sum, t) => sum + t.amount, 0)
  const previousSpending = previousWeekTemptations.filter(t => !t.resisted).reduce((sum, t) => sum + t.amount, 0)
  
  if (recentSpending > previousSpending * 1.5 && recentSpending > 100) {
    insights.push({
      id: 'spending-acceleration',
      type: 'financial',
      category: 'critical',
      title: 'Spending Acceleration Alert',
      description: `Your spending has increased by ${Math.round(((recentSpending - previousSpending) / Math.max(previousSpending, 1)) * 100)}% this week (${formatCurrency(recentSpending)} vs ${formatCurrency(previousSpending)}).`,
      actionable: 'Consider implementing a 48-hour cooling-off period before any purchases over $25.',
      confidence: 95,
      impact: 'high',
      trend: 'declining',
      metric: recentSpending - previousSpending
    })
  }

  // 2. BEHAVIORAL PATTERN RECOGNITION
  const weekdayTemptations = temptations.filter(t => {
    const day = new Date(t.createdAt).getDay()
    return day >= 1 && day <= 5
  })
  const weekendTemptations = temptations.filter(t => {
    const day = new Date(t.createdAt).getDay()
    return day === 0 || day === 6
  })
  
  const weekdaySuccessRate = weekdayTemptations.length > 0 ? 
    (weekdayTemptations.filter(t => t.resisted).length / weekdayTemptations.length) * 100 : 0
  const weekendSuccessRate = weekendTemptations.length > 0 ? 
    (weekendTemptations.filter(t => t.resisted).length / weekendTemptations.length) * 100 : 0
  
  if (Math.abs(weekdaySuccessRate - weekendSuccessRate) > 20) {
    const betterPeriod = weekdaySuccessRate > weekendSuccessRate ? 'weekdays' : 'weekends'
    const worsePeriod = weekdaySuccessRate > weekendSuccessRate ? 'weekends' : 'weekdays'
    const difference = Math.abs(weekdaySuccessRate - weekendSuccessRate)
    
    insights.push({
      id: 'weekend-weekday-pattern',
      type: 'behavioral',
      category: 'opportunity',
      title: `${betterPeriod.charAt(0).toUpperCase() + betterPeriod.slice(1)} vs ${worsePeriod} Pattern`,
      description: `You're ${difference.toFixed(0)}% more disciplined on ${betterPeriod} (${betterPeriod === 'weekdays' ? weekdaySuccessRate.toFixed(0) : weekendSuccessRate.toFixed(0)}% success rate).`,
      actionable: `Apply your ${betterPeriod} mindset to ${worsePeriod}: plan activities, set shopping restrictions, or use accountability partners.`,
      confidence: 85,
      impact: 'medium',
      trend: 'stable',
      metric: difference
    })
  }

  // 3. PREDICTIVE SPENDING ANALYSIS
  const avgMonthlySpending = temptations.filter(t => !t.resisted).reduce((sum, t) => sum + t.amount, 0) / 
    Math.max(1, Math.ceil(temptations.length / 30))
  const currentMonthSpending = trends.thisMonth.spent
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const dayOfMonth = now.getDate()
  const projectedSpending = (currentMonthSpending / dayOfMonth) * daysInMonth
  
  if (projectedSpending > avgMonthlySpending * 1.3) {
    insights.push({
      id: 'spending-projection',
      type: 'predictive',
      category: 'warning',
      title: 'Monthly Spending Projection Alert',
      description: `On current pace, you'll spend ${formatCurrency(projectedSpending)} this month, ${Math.round(((projectedSpending - avgMonthlySpending) / avgMonthlySpending) * 100)}% above your average.`,
      actionable: `Reduce spending by ${formatCurrency((projectedSpending - avgMonthlySpending) / (daysInMonth - dayOfMonth))} per day for the rest of the month.`,
      confidence: 78,
      impact: 'high',
      trend: 'declining',
      metric: projectedSpending - avgMonthlySpending
    })
  }

  // 4. CATEGORY MOMENTUM ANALYSIS
  categoryStats.forEach(category => {
    if (category.totalTemptations >= 3) {
      const categoryTemptations = temptations.filter(t => t.category === category.category)
      const recentCategoryTemptations = categoryTemptations
        .filter(t => new Date(t.createdAt).getTime() > now.getTime() - (14 * 24 * 60 * 60 * 1000))
      
      if (recentCategoryTemptations.length >= 2) {
        const recentSuccessRate = (recentCategoryTemptations.filter(t => t.resisted).length / recentCategoryTemptations.length) * 100
        const overallSuccessRate = category.successRate
        
        if (recentSuccessRate > overallSuccessRate + 20) {
          insights.push({
            id: `category-improvement-${category.category}`,
            type: 'behavioral',
            category: 'success',
            title: `${category.category} Breakthrough!`,
            description: `Your ${category.category.toLowerCase()} resistance has improved to ${recentSuccessRate.toFixed(0)}% (up from ${overallSuccessRate}% overall).`,
            actionable: `Document what strategies are working for ${category.category.toLowerCase()} and apply them to other challenging categories.`,
            confidence: 82,
            impact: 'medium',
            trend: 'improving',
            metric: recentSuccessRate - overallSuccessRate
          })
        } else if (recentSuccessRate < overallSuccessRate - 20) {
          insights.push({
            id: `category-decline-${category.category}`,
            type: 'behavioral',
            category: 'warning',
            title: `${category.category} Slipping`,
            description: `Your ${category.category.toLowerCase()} resistance has dropped to ${recentSuccessRate.toFixed(0)}% recently (down from ${overallSuccessRate}% overall).`,
            actionable: `Review what changed in your ${category.category.toLowerCase()} approach. Consider setting stricter limits or seeking accountability.`,
            confidence: 78,
            impact: 'medium',
            trend: 'declining',
            metric: overallSuccessRate - recentSuccessRate
          })
        }
      }
    }
  })

  // 5. PSYCHOLOGICAL TRIGGER ANALYSIS
  const highAmountTemptations = temptations.filter(t => t.amount > 100)
  const highAmountSuccessRate = highAmountTemptations.length > 0 ? 
    (highAmountTemptations.filter(t => t.resisted).length / highAmountTemptations.length) * 100 : 0
  const lowAmountTemptations = temptations.filter(t => t.amount <= 25)
  const lowAmountSuccessRate = lowAmountTemptations.length > 0 ? 
    (lowAmountTemptations.filter(t => t.resisted).length / lowAmountTemptations.length) * 100 : 0
  
  if (lowAmountSuccessRate < highAmountSuccessRate - 15 && lowAmountTemptations.length >= 5) {
    insights.push({
      id: 'small-purchase-trap',
      type: 'psychological',
      category: 'opportunity',
      title: 'Small Purchase Trap',
      description: `You resist ${highAmountSuccessRate.toFixed(0)}% of expensive purchases but only ${lowAmountSuccessRate.toFixed(0)}% of small ones.`,
      actionable: 'Small purchases add up! Set a monthly budget for purchases under $25 and track them as carefully as big ones.',
      confidence: 88,
      impact: 'medium',
      trend: 'stable',
      metric: lowAmountSuccessRate,
      comparison: `vs ${highAmountSuccessRate.toFixed(0)}% for expensive items`
    })
  }

  // 6. TIME-BASED VULNERABILITY ANALYSIS
  if (patterns.peakHour >= 14 && patterns.peakHour <= 16) { // Afternoon slump
    const afternoonTemptations = temptations.filter(t => {
      const hour = new Date(t.createdAt).getHours()
      return hour >= 14 && hour <= 16
    })
    const afternoonSpent = afternoonTemptations.filter(t => !t.resisted).reduce((sum, t) => sum + t.amount, 0)
    
    if (afternoonSpent > 0) {
      insights.push({
        id: 'afternoon-vulnerability',
        type: 'behavioral',
        category: 'opportunity',
        title: 'Afternoon Spending Vulnerability',
        description: `You've spent ${formatCurrency(afternoonSpent)} during afternoon hours (2-4 PM) when energy typically dips.`,
        actionable: 'Schedule a healthy snack, short walk, or focused work session during 2-4 PM to avoid impulse purchases.',
        confidence: 75,
        impact: 'medium',
        trend: 'stable',
        metric: afternoonSpent
      })
    }
  }

  // 7. STREAK ANALYSIS AND MOTIVATION
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
      category: 'success',
      title: `🔥 ${currentStreak}-Day Resistance Streak!`,
      description: `You're on fire! ${currentStreak} consecutive temptations resisted. This momentum is valuable.`,
      actionable: `Don't break the streak! When tempted, remind yourself: "I'm someone who resists temptations - I've done it ${currentStreak} times in a row."`,
      confidence: 92,
      impact: 'high',
      trend: 'improving',
      metric: currentStreak
    })
  } else if (currentStreak === 0 && sortedTemptations.length > 0) {
    const lastResisted = sortedTemptations.find(t => t.resisted)
    if (lastResisted) {
      const daysSinceLastSuccess = Math.floor((now.getTime() - new Date(lastResisted.createdAt).getTime()) / (24 * 60 * 60 * 1000))
      if (daysSinceLastSuccess <= 3) {
        insights.push({
          id: 'quick-recovery',
          type: 'psychological',
          category: 'opportunity',
          title: 'Quick Recovery Opportunity',
          description: `Your last successful resistance was ${daysSinceLastSuccess} days ago. You can bounce back quickly.`,
          actionable: 'Start a new streak today! Resist the next temptation to rebuild momentum and confidence.',
          confidence: 70,
          impact: 'medium',
          trend: 'stable',
          metric: daysSinceLastSuccess
        })
      }
    }
  }

  // Sort by impact and confidence
  return insights.sort((a, b) => {
    const impactScore = { high: 3, medium: 2, low: 1 }
    const categoryScore = { critical: 4, warning: 3, opportunity: 2, success: 1, info: 0 }
    
    const aScore = impactScore[a.impact] * 10 + categoryScore[a.category] + a.confidence / 10
    const bScore = impactScore[b.impact] * 10 + categoryScore[b.category] + b.confidence / 10
    
    return bScore - aScore
  })
}

export function generateComparativeInsights(temptations: Temptation[]): AIInsight[] {
  const insights: AIInsight[] = []
  
  if (temptations.length < 10) return insights
  
  // const totalSpent = temptations.filter(t => !t.resisted).reduce((sum, t) => sum + t.amount, 0)
  // const totalSaved = temptations.filter(t => t.resisted).reduce((sum, t) => sum + t.amount, 0)
  const successRate = (temptations.filter(t => t.resisted).length / temptations.length) * 100
  
  // Generate realistic benchmarks (these would come from anonymized user data in production)
  const benchmarks = {
    averageSuccessRate: 65,
    averageMonthlySaved: 280,
    topPerformerSuccessRate: 85
  }
  
  if (successRate > benchmarks.topPerformerSuccessRate) {
    insights.push({
      id: 'top-performer',
      type: 'comparative',
      category: 'success',
      title: 'Top 10% Performance!',
      description: `Your ${successRate.toFixed(0)}% success rate puts you in the top 10% of users who track spending temptations.`,
      actionable: 'Consider sharing your strategies with others or mentoring someone who is struggling with impulse spending.',
      confidence: 95,
      impact: 'high',
      trend: 'stable',
      metric: successRate,
      comparison: `vs ${benchmarks.topPerformerSuccessRate}% top performer threshold`
    })
  } else if (successRate > benchmarks.averageSuccessRate) {
    insights.push({
      id: 'above-average',
      type: 'comparative',
      category: 'success',
      title: 'Above Average Performance',
      description: `Your ${successRate.toFixed(0)}% success rate is above the average of ${benchmarks.averageSuccessRate}%.`,
      actionable: `You're doing well! Focus on consistency to potentially join the top performers (${benchmarks.topPerformerSuccessRate}%+ success rate).`,
      confidence: 88,
      impact: 'medium',
      trend: 'stable',
      metric: successRate,
      comparison: `vs ${benchmarks.averageSuccessRate}% average`
    })
  }
  
  return insights
}

export function generateGoalBasedInsights(temptations: Temptation[], monthlyGoal?: number): AIInsight[] {
  const insights: AIInsight[] = []
  
  if (!monthlyGoal || temptations.length === 0) return insights
  
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisMonthTemptations = temptations.filter(t => new Date(t.createdAt) >= monthStart)
  const thisMonthSaved = thisMonthTemptations.filter(t => t.resisted).reduce((sum, t) => sum + t.amount, 0)
  
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const dayOfMonth = now.getDate()
  const progressPercentage = (thisMonthSaved / monthlyGoal) * 100
  const expectedProgress = (dayOfMonth / daysInMonth) * 100
  
  if (progressPercentage >= 100) {
    insights.push({
      id: 'goal-achieved',
      type: 'goal',
      category: 'success',
      title: 'Monthly Goal Achieved!',
      description: `🎉 You've saved ${formatCurrency(thisMonthSaved)} this month, exceeding your ${formatCurrency(monthlyGoal)} goal!`,
      actionable: 'Consider setting a higher goal for next month or maintaining this excellent discipline.',
      confidence: 100,
      impact: 'high',
      trend: 'improving',
      metric: thisMonthSaved - monthlyGoal
    })
  } else if (progressPercentage > expectedProgress + 10) {
    insights.push({
      id: 'goal-ahead',
      type: 'goal',
      category: 'success',
      title: 'Ahead of Goal Pace',
      description: `You're ${(progressPercentage - expectedProgress).toFixed(0)}% ahead of pace on your ${formatCurrency(monthlyGoal)} monthly savings goal.`,
      actionable: 'Excellent progress! Stay consistent to easily achieve your goal.',
      confidence: 85,
      impact: 'medium',
      trend: 'improving',
      metric: progressPercentage - expectedProgress
    })
  } else if (progressPercentage < expectedProgress - 20) {
    const needed = monthlyGoal - thisMonthSaved
    const daysLeft = daysInMonth - dayOfMonth
    const dailyNeed = needed / Math.max(daysLeft, 1)
    
    insights.push({
      id: 'goal-behind',
      type: 'goal',
      category: 'warning',
      title: 'Goal Recovery Needed',
      description: `You need to save ${formatCurrency(needed)} more to reach your monthly goal (${formatCurrency(dailyNeed)}/day).`,
      actionable: 'Focus on resisting higher-value temptations or identify additional saving opportunities.',
      confidence: 90,
      impact: 'high',
      trend: 'declining',
      metric: needed
    })
  }
  
  return insights
}