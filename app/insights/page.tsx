'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, TrendingUp, Target, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BottomNav } from '@/components/bottom-nav'
import { CategoryIcon } from '@/components/category-icon'
import { Temptation, CategoryStats } from '@/lib/types'
import { calculateCategoryStats, formatCurrency, getTemptationsThisMonth } from '@/lib/calculations'
import db, { initializeDB } from '@/lib/storage'

export default function Insights() {
  const [temptations, setTemptations] = useState<Temptation[]>([])
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        await initializeDB()
        const savedTemptations = await db.getTemptations()
        setTemptations(savedTemptations)
        
        const stats = calculateCategoryStats(savedTemptations)
        setCategoryStats(stats.sort((a, b) => b.totalAmount - a.totalAmount))
      } catch (error) {
        console.error('Failed to load insights:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const thisMonthTemptations = getTemptationsThisMonth(temptations)
  const thisMonthSpent = thisMonthTemptations
    .filter(t => !t.resisted)
    .reduce((sum, t) => sum + t.amount, 0)
  const thisMonthSaved = thisMonthTemptations
    .filter(t => t.resisted)
    .reduce((sum, t) => sum + t.amount, 0)

  const biggestChallenge = categoryStats[0]
  const bestPerformance = categoryStats
    .filter(cat => cat.totalTemptations >= 3)
    .sort((a, b) => b.successRate - a.successRate)[0]

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
        {/* Spending Patterns */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Spending Patterns</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">This Month</p>
                  <p className="text-xl font-bold text-red-500">
                    -{formatCurrency(thisMonthSpent)}
                  </p>
                  <p className="text-xs text-muted-foreground">Spent</p>
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Spending by Category */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Spending by Category</h2>
          
          <div className="space-y-3">
            {categoryStats.slice(0, 6).map((stat) => (
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

        {/* AI Insights */}
        {(biggestChallenge || bestPerformance) && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">AI Insights</h2>
            
            <div className="space-y-3">
              {biggestChallenge && (
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-950/20 dark:to-orange-900/20 dark:border-orange-800/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-orange-500/20">
                        <Target className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                          Your biggest challenge: {biggestChallenge.category}
                        </h3>
                        <p className="text-sm text-orange-800 dark:text-orange-200">
                          You've spent {formatCurrency(biggestChallenge.totalAmount - biggestChallenge.savedAmount)} 
                          on {biggestChallenge.category.toLowerCase()} this period. 
                          Consider setting a weekly budget or finding alternatives to reduce temptation.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {bestPerformance && (
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-950/20 dark:to-green-900/20 dark:border-green-800/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-green-500/20">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                          Great job with {bestPerformance.category}!
                        </h3>
                        <p className="text-sm text-green-800 dark:text-green-200">
                          You're resisting {bestPerformance.successRate}% of {bestPerformance.category.toLowerCase()} 
                          temptations and have saved {formatCurrency(bestPerformance.savedAmount)}. 
                          Keep up the excellent self-control!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Success Rates */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Success Rates</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {categoryStats.slice(0, 4).map((stat) => (
              <Card key={`success-${stat.category}`}>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="mb-3">
                      <CategoryIcon category={stat.category} className="mx-auto mb-2 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {stat.category.split(' ')[0]}
                      </p>
                    </div>
                    <p className="text-2xl font-bold mb-1">{stat.successRate}%</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.resistedCount}/{stat.totalTemptations}
                    </p>
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
                Start logging your temptations to see personalized insights
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  )
}