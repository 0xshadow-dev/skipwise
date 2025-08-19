'use client'

import { useState, useEffect, useMemo } from 'react'
import { ArrowLeft, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BottomNav } from '@/components/bottom-nav'
import { CategoryIcon } from '@/components/category-icon'
import { Temptation, TemptationCategory } from '@/lib/types'
import { formatCurrency } from '@/lib/calculations'
import db, { initializeDB } from '@/lib/storage'
import { cn } from '@/lib/utils'

export default function History() {
  const [temptations, setTemptations] = useState<Temptation[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TemptationCategory | 'all'>('all')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'resisted' | 'gave-in'>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        await initializeDB()
        const savedTemptations = await db.getTemptations()
        setTemptations(savedTemptations)
      } catch (error) {
        console.error('Failed to load history:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredTemptations = useMemo(() => {
    return temptations.filter(temptation => {
      // Search filter
      if (searchTerm && !temptation.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Category filter
      if (selectedCategory !== 'all' && temptation.category !== selectedCategory) {
        return false
      }

      // Resisted filter
      if (selectedFilter === 'resisted' && !temptation.resisted) {
        return false
      }
      if (selectedFilter === 'gave-in' && temptation.resisted) {
        return false
      }

      return true
    })
  }, [temptations, searchTerm, selectedCategory, selectedFilter])

  const handleDeleteTemptation = async (id: string) => {
    try {
      await db.deleteTemptation(id)
      setTemptations(prev => prev.filter(t => t.id !== id))
    } catch (error) {
      console.error('Failed to delete temptation:', error)
    }
  }

  const categories = Object.values(TemptationCategory)
  const availableCategories = categories.filter(cat => 
    temptations.some(t => t.category === cat)
  )

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (d.toDateString() === today.toDateString()) {
      return 'Today'
    }
    if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    }
    return d.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading history...</p>
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
          <h1 className="text-xl font-bold">History</h1>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search temptations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 pb-4 space-y-3">
          {/* Status Filter */}
          <div className="flex gap-2">
            <Badge
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              className={cn(
                "cursor-pointer transition-colors",
                selectedFilter === 'all' && "bg-primary text-primary-foreground"
              )}
              onClick={() => setSelectedFilter('all')}
            >
              All
            </Badge>
            <Badge
              variant={selectedFilter === 'resisted' ? 'default' : 'outline'}
              className={cn(
                "cursor-pointer transition-colors",
                selectedFilter === 'resisted' && "bg-green-500 text-white hover:bg-green-600"
              )}
              onClick={() => setSelectedFilter('resisted')}
            >
              Resisted
            </Badge>
            <Badge
              variant={selectedFilter === 'gave-in' ? 'default' : 'outline'}
              className={cn(
                "cursor-pointer transition-colors",
                selectedFilter === 'gave-in' && "bg-red-500 text-white hover:bg-red-600"
              )}
              onClick={() => setSelectedFilter('gave-in')}
            >
              Gave In
            </Badge>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Badge
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Badge>
            {availableCategories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredTemptations.length} {filteredTemptations.length === 1 ? 'result' : 'results'}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* History List */}
        {filteredTemptations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-2">
                {temptations.length === 0 ? 'No temptations logged yet' : 'No results found'}
              </p>
              <p className="text-sm text-muted-foreground">
                {temptations.length === 0 
                  ? 'Start tracking your temptations to see your history'
                  : 'Try adjusting your search or filters'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTemptations.map((temptation, index) => {
              const prevTemptation = filteredTemptations[index - 1]
              const showDateHeader = !prevTemptation || 
                formatDate(temptation.createdAt) !== formatDate(prevTemptation.createdAt)

              return (
                <div key={temptation.id}>
                  {showDateHeader && (
                    <div className="sticky top-24 bg-background/95 backdrop-blur-sm py-2 mb-2 border-b">
                      <p className="text-sm font-medium text-muted-foreground">
                        {formatDate(temptation.createdAt)}
                      </p>
                    </div>
                  )}
                  
                  <Card className="group hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          temptation.resisted 
                            ? 'bg-green-500/20 text-green-600' 
                            : 'bg-red-500/20 text-red-600'
                        }`}>
                          <CategoryIcon category={temptation.category} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium truncate">
                              {temptation.resisted ? 'Resisted' : 'Gave In'}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold">
                                {formatCurrency(temptation.amount)}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDeleteTemptation(temptation.id)}
                              >
                                <Trash2 size={14} className="text-destructive" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground truncate mb-1">
                            {temptation.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {temptation.category}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              {new Date(temptation.createdAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}