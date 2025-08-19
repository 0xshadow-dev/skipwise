'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, TrendingUp, Zap, Clock, Calendar, AlertTriangle, Lightbulb, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BottomNav } from '@/components/bottom-nav'
import { CategoryIcon } from '@/components/category-icon'
import { Temptation, CategoryStats } from '@/lib/types'
import { 
  calculateCategoryStats, 
  formatCurrency, 
  getTemptationsThisMonth,
  analyzeSpendingPatterns,
  analyzeTrends,
  assessRisks,
  generateRecommendations
} from '@/lib/calculations'
import db, { initializeDB } from '@/lib/storage'

interface SpendingPatterns {
  peakHour: number
  peakDay: string
  hourlyDistribution: number[]
  dailyDistribution: number[]
  amountPatterns: {
    small: { count: number; resistanceRate: number }
    medium: { count: number; resistanceRate: number }
    large: { count: number; resistanceRate: number }
  }
}

interface TrendAnalysis {
  spendingTrend: number
  savingsTrend: number
  successRateTrend: number
  thisMonth: { spent: number; saved: number; successRate: number }
  lastMonth: { spent: number; saved: number; successRate: number }
}

interface RiskAssessment {
  highRiskCategories: CategoryStats[]
  highRiskHour: number
  isWeekendSpender: boolean
  riskLevel: 'low' | 'medium' | 'high'
}

interface Recommendation {
  type: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
}

export default function Insights() {
  const [temptations, setTemptations] = useState<Temptation[]>([])
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([])
  const [patterns, setPatterns] = useState<SpendingPatterns | null>(null)
  const [trends, setTrends] = useState<TrendAnalysis | null>(null)
  const [risks, setRisks] = useState<RiskAssessment | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    try {
      setIsLoading(true)
      await initializeDB()
      const savedTemptations = await db.getTemptations()
      setTemptations(savedTemptations)
      
      if (savedTemptations.length > 0) {
        const stats = calculateCategoryStats(savedTemptations)
        setCategoryStats(stats.sort((a, b) => b.totalAmount - a.totalAmount))
        
        // Run all new analysis functions
        const spendingPatterns = analyzeSpendingPatterns(savedTemptations)
        const trendAnalysis = analyzeTrends(savedTemptations)
        const riskAssessment = assessRisks(savedTemptations, stats)
        const smartRecommendations = generateRecommendations(savedTemptations, stats)
        
        setPatterns(spendingPatterns)
        setTrends(trendAnalysis)
        setRisks(riskAssessment)
        setRecommendations(smartRecommendations)
      }
    } catch (error) {
      console.error('Failed to load insights:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    
    // Refresh data when the page becomes visible/focused
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadData()
      }
    }
    
    const handleFocus = () => {
      loadData()
    }
    
    // Set up periodic refresh to catch updates
    const intervalId = setInterval(() => {
      if (!document.hidden) {
        loadData()
      }
    }, 5000) // Refresh every 5 seconds when page is visible
    
    // Listen for page visibility changes and focus events
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    
    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const thisMonthTemptations = getTemptationsThisMonth(temptations)
  const thisMonthSpent = thisMonthTemptations
    .filter(t => !t.resisted)
    .reduce((sum, t) => sum + t.amount, 0)
  const thisMonthSaved = thisMonthTemptations
    .filter(t => t.resisted)
    .reduce((sum, t) => sum + t.amount, 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading insights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b z-40">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Insights</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Monthly Summary */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 size={20} />
            Monthly Summary
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">This Month</p>
                  <p className="text-xl font-bold text-red-500">
                    -{formatCurrency(thisMonthSpent)}
                  </p>
                  <p className="text-xs text-muted-foreground">Spent</p>
                  {trends && trends.spendingTrend !== 0 && (
                    <Badge variant={trends.spendingTrend > 0 ? "destructive" : "secondary"} className="mt-1">
                      {trends.spendingTrend > 0 ? "↑" : "↓"} {formatCurrency(Math.abs(trends.spendingTrend))}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">This Month</p>
                  <p className="text-xl font-bold text-green-500">
                    +{formatCurrency(thisMonthSaved)}
                  </p>
                  <p className="text-xs text-muted-foreground">Saved</p>
                  {trends && trends.savingsTrend !== 0 && (
                    <Badge variant={trends.savingsTrend > 0 ? "secondary" : "destructive"} className="mt-1">
                      {trends.savingsTrend > 0 ? "↑" : "↓"} {formatCurrency(Math.abs(trends.savingsTrend))}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Behavioral Patterns */}
        {patterns && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock size={20} />
              Your Spending Patterns
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Peak Temptation Time</h3>
                        <p className="text-sm text-muted-foreground">
                          Most temptations occur around {patterns.peakHour}:00
                        </p>
                      </div>
                      <Badge variant="outline">{patterns.peakHour}:00</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Peak Day</h3>
                        <p className="text-sm text-muted-foreground">
                          {patterns.peakDay} is your highest temptation day
                        </p>
                      </div>
                      <Badge variant="outline">{patterns.peakDay}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {patterns.amountPatterns && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3">Resistance by Amount</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Small purchases (&lt;$25)</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{patterns.amountPatterns.small.resistanceRate}%</span>
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{width: `${patterns.amountPatterns.small.resistanceRate}%`}}></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Medium purchases ($25-$100)</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{patterns.amountPatterns.medium.resistanceRate}%</span>
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500" style={{width: `${patterns.amountPatterns.medium.resistanceRate}%`}}></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Large purchases (&gt;$100)</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{patterns.amountPatterns.large.resistanceRate}%</span>
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-red-500" style={{width: `${patterns.amountPatterns.large.resistanceRate}%`}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Risk Assessment */}
        {risks && risks.highRiskCategories.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle size={20} />
              Risk Assessment
            </h2>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-950/20 dark:to-orange-900/20 dark:border-orange-800/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-orange-500/20">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                      High-Risk Categories
                    </h3>
                    <div className="space-y-2">
                      {risks.highRiskCategories.slice(0, 3).map((category) => (
                        <div key={category.category} className="flex items-center justify-between">
                          <span className="text-sm text-orange-800 dark:text-orange-200">{category.category}</span>
                          <Badge variant="destructive" className="text-xs">
                            {category.successRate}% success
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {risks.isWeekendSpender && (
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950/20 dark:to-blue-900/20 dark:border-blue-800/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-blue-500/20">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Weekend Spending Pattern
                      </h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        You tend to spend more on weekends. Consider planning weekend activities that don&apos;t involve shopping.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Smart Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Lightbulb size={20} />
              Smart Recommendations
            </h2>
            
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <Card key={index} className={`${
                  rec.priority === 'high' 
                    ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 dark:from-yellow-950/20 dark:to-yellow-900/20 dark:border-yellow-800/30'
                    : rec.type === 'success'
                    ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-950/20 dark:to-green-900/20 dark:border-green-800/30'
                    : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        rec.priority === 'high' 
                          ? 'bg-yellow-500/20'
                          : rec.type === 'success'
                          ? 'bg-green-500/20'
                          : 'bg-blue-500/20'
                      }`}>
                        {rec.type === 'success' ? (
                          <TrendingUp className={`h-5 w-5 ${
                            rec.priority === 'high' 
                              ? 'text-yellow-600'
                              : rec.type === 'success'
                              ? 'text-green-600'
                              : 'text-blue-600'
                          }`} />
                        ) : (
                          <Lightbulb className={`h-5 w-5 ${
                            rec.priority === 'high' 
                              ? 'text-yellow-600'
                              : rec.type === 'success'
                              ? 'text-green-600'
                              : 'text-blue-600'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-semibold ${
                            rec.priority === 'high' 
                              ? 'text-yellow-900 dark:text-yellow-100'
                              : rec.type === 'success'
                              ? 'text-green-900 dark:text-green-100'
                              : 'text-blue-900 dark:text-blue-100'
                          }`}>
                            {rec.title}
                          </h3>
                          {rec.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs">High Priority</Badge>
                          )}
                        </div>
                        <p className={`text-sm ${
                          rec.priority === 'high' 
                            ? 'text-yellow-800 dark:text-yellow-200'
                            : rec.type === 'success'
                            ? 'text-green-800 dark:text-green-200'
                            : 'text-blue-800 dark:text-blue-200'
                        }`}>
                          {rec.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Top Categories */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Top Spending Categories</h2>
          
          <div className="space-y-3">
            {categoryStats.slice(0, 5).map((stat) => (
              <Card key={stat.category}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-muted">
                      <CategoryIcon category={stat.category} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{stat.category}</span>
                        <span className="text-sm font-semibold">
                          {formatCurrency(stat.totalAmount)}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{stat.totalTemptations} temptations</span>
                          <span>{stat.successRate}% resisted</span>
                        </div>
                        <Progress value={stat.successRate} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {temptations.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No insights yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start logging your temptations to see personalized insights and recommendations
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  )
}