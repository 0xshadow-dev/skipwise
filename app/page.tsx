'use client'

import { useState, useEffect } from 'react'
import { Plus, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BottomNav } from '@/components/bottom-nav'
import { NewTemptationModal } from '@/components/new-temptation-modal'
import { ProgressRing } from '@/components/progress-ring'
import { CategoryIcon } from '@/components/category-icon'
import { Temptation, UserProgress } from '@/lib/types'
import { calculateUserProgress, formatCurrency } from '@/lib/calculations'
import db, { initializeDB } from '@/lib/storage'

export default function Home() {
  const [temptations, setTemptations] = useState<Temptation[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        await initializeDB()
        const savedTemptations = await db.getTemptations()
        setTemptations(savedTemptations)
        
        if (savedTemptations.length > 0) {
          const progress = calculateUserProgress(savedTemptations)
          setUserProgress(progress)
          await db.updateUserProgress(progress)
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleNewTemptation = async (temptation: Temptation) => {
    const updatedTemptations = [temptation, ...temptations]
    setTemptations(updatedTemptations)
    
    const progress = calculateUserProgress(updatedTemptations)
    setUserProgress(progress)
    await db.updateUserProgress(progress)
  }

  const recentActivity = temptations.slice(0, 4)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b z-40">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Resist</h1>
          <Button variant="ghost" size="icon">
            <Settings size={20} />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Progress Section */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Saved</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(userProgress?.totalSaved || 0)}
                  </p>
                </div>
                <ProgressRing
                  progress={userProgress?.successRate || 0}
                  size={80}
                  strokeWidth={6}
                  className="text-primary"
                >
                  <span className="text-sm font-semibold">
                    {userProgress?.successRate || 0}%
                  </span>
                </ProgressRing>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className="text-sm font-medium">{userProgress?.successRate || 0}%</span>
                  </div>
                  <Progress value={userProgress?.successRate || 0} />
                </div>

                <Card className="bg-background/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Streak</p>
                        <p className="text-2xl font-bold">{userProgress?.currentStreak || 0} days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          
          {recentActivity.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No temptations logged yet</p>
                <p className="text-sm text-muted-foreground">
                  Tap the + button to log your first temptation
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((temptation) => (
                <Card key={temptation.id} className="transition-colors hover:bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        temptation.resisted ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'
                      }`}>
                        <CategoryIcon category={temptation.category} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{temptation.resisted ? 'Resisted' : 'Gave In'}</p>
                          <p className="text-sm font-semibold">{formatCurrency(temptation.amount)}</p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {temptation.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {temptation.category}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsModalOpen(true)}
        size="icon"
        className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50"
      >
        <Plus size={24} />
      </Button>

      <NewTemptationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewTemptation}
      />

      <BottomNav />
    </div>
  )
}
