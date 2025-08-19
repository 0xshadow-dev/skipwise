'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, TrendingUp, ArrowUp, ArrowDown, Target, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BottomNav } from '@/components/bottom-nav'
import { Temptation, CategoryStats } from '@/lib/types'
import { calculateCategoryStats } from '@/lib/calculations'
import { generateCleanInsights, generateAIRecommendations, generateAIInsights, CleanInsight, AIInsight } from '@/lib/clean-insights'
import db, { initializeDB } from '@/lib/storage'


export default function Insights() {
  const [temptations, setTemptations] = useState<Temptation[]>([])
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([])
  const [insights, setInsights] = useState<CleanInsight[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      await initializeDB()
      const savedTemptations = await db.getTemptations()
      
      if (savedTemptations.length > 0) {
        const stats = calculateCategoryStats(savedTemptations)
        const cleanInsights = generateCleanInsights(savedTemptations, stats)
        const aiInsightsData = generateAIInsights(savedTemptations, stats)
        const aiRecommendations = generateAIRecommendations(savedTemptations, stats)
        
        setTemptations(savedTemptations)
        setCategoryStats(stats)
        setInsights(cleanInsights)
        setAiInsights(aiInsightsData)
        setRecommendations(aiRecommendations)
      } else {
        setTemptations([])
        setCategoryStats([])
        setInsights([])
        setAiInsights([])
        setRecommendations([])
      }
    } catch (error) {
      console.error('Failed to load insights:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadData()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [loadData])

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

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp size={16} />
      case 'opportunity':
        return <Target size={16} />
      case 'achievement':
        return <TrendingUp size={16} />
      default:
        return <TrendingUp size={16} />
    }
  }

  const getInsightColor = (type: string, priority: string) => {
    if (priority === 'high') {
      return type === 'opportunity' ? 'text-orange-600' : 'text-blue-600'
    }
    return type === 'achievement' ? 'text-green-600' : 'text-gray-600'
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
        {/* Key Insights Grid */}
        {insights.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Key Insights</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {insights.map((insight) => (
                <Card key={insight.id} className="relative overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`p-1.5 rounded-full bg-muted/50 ${getInsightColor(insight.type, insight.priority)}`}>
                        {getInsightIcon(insight.type)}
                      </div>
                      {insight.change && (
                        <div className={`flex items-center gap-1 text-xs ${
                          insight.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {insight.change.startsWith('+') ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                          {insight.change}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{insight.value}</h3>
                      <p className="text-xs font-medium text-muted-foreground">{insight.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{insight.description}</p>
                    </div>
                    
                    {insight.priority === 'high' && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* AI Insights */}
        {aiInsights.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Target size={20} />
              AI Insights
            </h2>
            
            <div className="space-y-3">
              {aiInsights.map((insight) => (
                <Card key={insight.id} className={`${
                  insight.priority === 'high' ? 'border-orange-200 bg-orange-50/50 dark:bg-orange-950/20' : 
                  insight.type === 'financial' ? 'border-red-200 bg-red-50/50 dark:bg-red-950/20' :
                  'border-blue-200 bg-blue-50/50 dark:bg-blue-950/20'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        insight.priority === 'high' ? 'bg-orange-500/20' :
                        insight.type === 'financial' ? 'bg-red-500/20' :
                        'bg-blue-500/20'
                      }`}>
                        <TrendingUp className={`h-4 w-4 ${
                          insight.priority === 'high' ? 'text-orange-600' :
                          insight.type === 'financial' ? 'text-red-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm">{insight.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {insight.confidence}%
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Lightbulb size={20} />
              Recommendations
            </h2>
            
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-blue-500/10">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                      </div>
                      <p className="text-sm flex-1">{rec}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Top Categories - Simplified */}
        {categoryStats.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Category Performance</h2>
            
            <div className="space-y-2">
              {categoryStats.slice(0, 3).map((stat) => (
                <Card key={stat.category}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-xs">
                          {stat.category}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{stat.successRate}%</div>
                        <div className="text-xs text-muted-foreground">
                          {stat.totalTemptations} times
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {temptations.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No insights yet</h3>
              <p className="text-sm text-muted-foreground">
                Start logging temptations to see your insights
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  )
}