'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, TrendingUp, Zap, Clock, Calendar, AlertTriangle, Lightbulb, BarChart3, PieChart, Activity, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BottomNav } from '@/components/bottom-nav'
import { CategoryIcon } from '@/components/category-icon'
import { SpendingTrendsChart, CategoryBreakdownChart, HourlyPatternsChart, SuccessRateProgressChart } from '@/components/insights-charts'
import { TimePeriodSelector, TimePeriod } from '@/components/time-period-selector'
import { Temptation, CategoryStats } from '@/lib/types'
import { 
  calculateCategoryStats, 
  formatCurrency, 
  getTemptationsThisMonth,
  getTemptationsByPeriod,
  analyzeSpendingPatterns,
  analyzeTrends,
  assessRisks,
  generateRecommendations,
  generateAdvancedInsights
} from '@/lib/calculations'
import { generateAdvancedAIInsights, generateComparativeInsights, generateGoalBasedInsights, AIInsight } from '@/lib/advanced-ai-insights'
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
  const [advancedInsights, setAdvancedInsights] = useState<any[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month')
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    try {
      setIsLoading(true)
      await initializeDB()
      const savedTemptations = await db.getTemptations()
      
      // Batch all state updates to prevent multiple re-renders
      if (savedTemptations.length > 0) {
        // Filter by selected period
        const filteredTemptations = getTemptationsByPeriod(savedTemptations, selectedPeriod)
        const stats = calculateCategoryStats(filteredTemptations)
        
        // Run all analysis functions on filtered data
        const spendingPatterns = analyzeSpendingPatterns(filteredTemptations)
        const trendAnalysis = analyzeTrends(savedTemptations) // Use all data for trends
        const riskAssessment = assessRisks(filteredTemptations, stats)
        const smartRecommendations = generateRecommendations(filteredTemptations, stats)
        const advancedInsightsData = generateAdvancedInsights(filteredTemptations, stats)
        const aiInsightsData = [
          ...generateAdvancedAIInsights(filteredTemptations, stats),
          ...generateComparativeInsights(filteredTemptations),
          ...generateGoalBasedInsights(filteredTemptations)
        ]
        
        // Batch all state updates together to prevent flickering
        setTemptations(savedTemptations)
        setCategoryStats(stats.sort((a, b) => b.totalAmount - a.totalAmount))
        setPatterns(spendingPatterns)
        setTrends(trendAnalysis)
        setRisks(riskAssessment)
        setRecommendations(smartRecommendations)
        setAdvancedInsights(advancedInsightsData)
        setAiInsights(aiInsightsData)
      } else {
        // Clear data if no temptations
        setTemptations([])
        setCategoryStats([])
        setPatterns(null)
        setTrends(null)
        setRisks(null)
        setRecommendations([])
        setAdvancedInsights([])
        setAiInsights([])
      }
    } catch (error) {
      console.error('Failed to load insights:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedPeriod]) // Re-run when period changes
  
  useEffect(() => {
    // Only refresh data when the page becomes visible after being hidden
    // This prevents constant flickering while still keeping data fresh
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadData()
      }
    }
    
    // Listen only for page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, []) // Only set up once

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
        {/* Enhanced Monthly Summary */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 size={20} />
            Financial Overview
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                  <p className="text-xl font-bold text-blue-500">
                    {trends ? trends.thisMonth.successRate : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground">Resisted</p>
                  {trends && trends.successRateTrend !== 0 && (
                    <Badge variant={trends.successRateTrend > 0 ? "secondary" : "destructive"} className="mt-1">
                      {trends.successRateTrend > 0 ? "↑" : "↓"} {Math.abs(trends.successRateTrend).toFixed(1)}%
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Net Impact</p>
                  <p className={`text-xl font-bold ${thisMonthSaved > thisMonthSpent ? 'text-green-500' : 'text-red-500'}`}>
                    {thisMonthSaved > thisMonthSpent ? '+' : ''}{formatCurrency(thisMonthSaved - thisMonthSpent)}
                  </p>
                  <p className="text-xs text-muted-foreground">Net Result</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Time Period Selector */}
        <TimePeriodSelector 
          selectedPeriod={selectedPeriod} 
          onPeriodChange={setSelectedPeriod}
        />
        
        {/* Advanced AI Insights */}
        {aiInsights.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp size={20} />
              AI-Powered Insights
            </h2>
            
            <div className="space-y-3">
              {aiInsights.slice(0, 6).map((insight) => (
                <Card key={insight.id} className={`${
                  insight.category === 'critical' 
                    ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-red-950/20 dark:to-red-900/20 dark:border-red-800/30'
                    : insight.category === 'warning'
                    ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-950/20 dark:to-orange-900/20 dark:border-orange-800/30'
                    : insight.category === 'success'
                    ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-950/20 dark:to-green-900/20 dark:border-green-800/30'
                    : insight.category === 'opportunity'
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950/20 dark:to-blue-900/20 dark:border-blue-800/30'
                    : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full flex-shrink-0 ${
                        insight.category === 'critical' ? 'bg-red-500/20' :
                        insight.category === 'warning' ? 'bg-orange-500/20' :
                        insight.category === 'success' ? 'bg-green-500/20' :
                        insight.category === 'opportunity' ? 'bg-blue-500/20' :
                        'bg-gray-500/20'
                      }`}>
                        <TrendingUp className={`h-4 w-4 ${
                          insight.category === 'critical' ? 'text-red-600' :
                          insight.category === 'warning' ? 'text-orange-600' :
                          insight.category === 'success' ? 'text-green-600' :
                          insight.category === 'opportunity' ? 'text-blue-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className={`font-semibold text-sm ${
                            insight.category === 'critical' ? 'text-red-900 dark:text-red-100' :
                            insight.category === 'warning' ? 'text-orange-900 dark:text-orange-100' :
                            insight.category === 'success' ? 'text-green-900 dark:text-green-100' :
                            insight.category === 'opportunity' ? 'text-blue-900 dark:text-blue-100' :
                            'text-gray-900 dark:text-gray-100'
                          }`}>
                            {insight.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant="outline" className="text-xs">
                              {insight.confidence}% confidence
                            </Badge>
                            <Badge variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'secondary' : 'outline'} className="text-xs">
                              {insight.impact} impact
                            </Badge>
                          </div>
                        </div>
                        <p className={`text-sm mb-3 ${
                          insight.category === 'critical' ? 'text-red-800 dark:text-red-200' :
                          insight.category === 'warning' ? 'text-orange-800 dark:text-orange-200' :
                          insight.category === 'success' ? 'text-green-800 dark:text-green-200' :
                          insight.category === 'opportunity' ? 'text-blue-800 dark:text-blue-200' :
                          'text-gray-800 dark:text-gray-200'
                        }`}>
                          {insight.description}
                        </p>
                        <div className={`text-xs font-medium p-2 rounded ${
                          insight.category === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' :
                          insight.category === 'warning' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200' :
                          insight.category === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                          insight.category === 'opportunity' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' :
                          'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200'
                        }`}>
                          💡 Action: {insight.actionable}
                        </div>
                        {insight.comparison && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {insight.comparison}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* Visual Analytics */}
        {temptations.length >= 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Activity size={20} />
              Visual Analytics
            </h2>
            
            <SpendingTrendsChart temptations={getTemptationsByPeriod(temptations, selectedPeriod)} />
            <CategoryBreakdownChart categoryStats={categoryStats} />
            <HourlyPatternsChart temptations={getTemptationsByPeriod(temptations, selectedPeriod)} />
            <SuccessRateProgressChart temptations={temptations} />
          </div>
        )}

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

        {/* Key Insights */}
        {advancedInsights.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Target size={20} />
              Key Insights
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advancedInsights.slice(0, 4).map((insight, index) => (
                <Card key={index} className={`${
                  insight.priority === 'high' 
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950/20 dark:to-blue-900/20 dark:border-blue-800/30'
                    : insight.type === 'success' || insight.type === 'strength'
                    ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-950/20 dark:to-green-900/20 dark:border-green-800/30'
                    : insight.type === 'opportunity'
                    ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-950/20 dark:to-orange-900/20 dark:border-orange-800/30'
                    : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        insight.type === 'success' || insight.type === 'strength' ? 'bg-green-500/20' :
                        insight.type === 'opportunity' ? 'bg-orange-500/20' :
                        'bg-blue-500/20'
                      }`}>
                        {insight.type === 'success' || insight.type === 'strength' ? (
                          <TrendingUp className={`h-5 w-5 text-green-600`} />
                        ) : insight.type === 'opportunity' ? (
                          <Target className={`h-5 w-5 text-orange-600`} />
                        ) : (
                          <Clock className={`h-5 w-5 text-blue-600`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-2 ${
                          insight.type === 'success' || insight.type === 'strength' ? 'text-green-900 dark:text-green-100' :
                          insight.type === 'opportunity' ? 'text-orange-900 dark:text-orange-100' :
                          'text-blue-900 dark:text-blue-100'
                        }`}>
                          {insight.title}
                        </h3>
                        <p className={`text-sm ${
                          insight.type === 'success' || insight.type === 'strength' ? 'text-green-800 dark:text-green-200' :
                          insight.type === 'opportunity' ? 'text-orange-800 dark:text-orange-200' :
                          'text-blue-800 dark:text-blue-200'
                        }`}>
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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