'use client'

import { Card, CardContent } from '@/components/ui/card'
import { UserProgress } from '@/lib/types'

interface StreakTrackerProps {
  userProgress: UserProgress | null
}

export function StreakTracker({ userProgress }: StreakTrackerProps) {
  if (!userProgress) return null

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-2xl font-bold">{userProgress.currentStreak || 0} temptations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Best Streak</p>
              <p className="text-2xl font-bold">{userProgress.longestStreak || 0} temptations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
