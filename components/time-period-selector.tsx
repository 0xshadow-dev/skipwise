'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock, TrendingUp } from 'lucide-react'

export type TimePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all'

interface TimePeriodSelectorProps {
  selectedPeriod: TimePeriod
  onPeriodChange: (period: TimePeriod) => void
  className?: string
}

export function TimePeriodSelector({ selectedPeriod, onPeriodChange, className }: TimePeriodSelectorProps) {
  const periods: { key: TimePeriod; label: string; icon: any }[] = [
    { key: 'day', label: 'Today', icon: Clock },
    { key: 'week', label: 'This Week', icon: Calendar },
    { key: 'month', label: 'This Month', icon: TrendingUp },
    { key: 'quarter', label: 'Quarter', icon: TrendingUp },
    { key: 'year', label: 'This Year', icon: TrendingUp },
    { key: 'all', label: 'All Time', icon: TrendingUp }
  ]

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={16} />
          <span className="text-sm font-medium">Time Period</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {periods.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={selectedPeriod === key ? "default" : "outline"}
              size="sm"
              onClick={() => onPeriodChange(key)}
              className="flex items-center gap-1 h-8"
            >
              <Icon size={12} />
              {label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}