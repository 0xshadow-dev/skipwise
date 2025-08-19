'use client'

import { memo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { CategoryStats, Temptation } from '@/lib/types'
import { formatCurrency } from '@/lib/calculations'

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16', '#ec4899']

interface SpendingTrendData {
  name: string
  spent: number
  saved: number
  successRate: number
}

interface CategoryData {
  name: string
  spent: number
  saved: number
  total: number
  successRate: number
  fill: string
}

interface HourlyData {
  hour: string
  temptations: number
  resisted: number
  spending: number
}

export const SpendingTrendsChart = memo(function SpendingTrendsChart({ temptations }: { temptations: Temptation[] }) {
  // Group by week for trend analysis
  const weeklyData: SpendingTrendData[] = []
  const now = new Date()

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000))
    const weekEnd = new Date(weekStart.getTime() + (7 * 24 * 60 * 60 * 1000))

    const weekTemptations = temptations.filter(t => {
      const date = new Date(t.createdAt)
      return date >= weekStart && date < weekEnd
    })

    const spent = weekTemptations.filter(t => !t.resisted).reduce((sum, t) => sum + t.amount, 0)
    const saved = weekTemptations.filter(t => t.resisted).reduce((sum, t) => sum + t.amount, 0)
    const successRate = weekTemptations.length > 0 ? (weekTemptations.filter(t => t.resisted).length / weekTemptations.length) * 100 : 0

    weeklyData.push({
      name: `Week ${12 - i}`,
      spent,
      saved,
      successRate
    })
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4">12-Week Spending Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="savedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={(value) => `$${value}`} />
              <Tooltip
                formatter={(value: number, name: string) => [formatCurrency(value), name === 'spent' ? 'Spent' : 'Saved']}
                labelFormatter={(label) => `${label}`}
              />
              <Area type="monotone" dataKey="spent" stackId="1" stroke="#ef4444" fill="url(#spentGradient)" />
              <Area type="monotone" dataKey="saved" stackId="1" stroke="#10b981" fill="url(#savedGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
})

export const CategoryBreakdownChart = memo(function CategoryBreakdownChart({ categoryStats }: { categoryStats: CategoryStats[] }) {
  const topCategories = categoryStats
    .filter(c => c.totalAmount > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 8)

  const data: CategoryData[] = topCategories.map((stat, index) => ({
    name: stat.category,
    spent: stat.totalAmount - stat.savedAmount,
    saved: stat.savedAmount,
    total: stat.totalAmount,
    successRate: stat.successRate,
    fill: COLORS[index % COLORS.length]
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Spending by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="total"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [formatCurrency(value), 'Total']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Success Rate by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} className="text-xs" />
                <YAxis dataKey="name" type="category" className="text-xs" width={80} />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Success Rate']}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar dataKey="successRate" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

export const HourlyPatternsChart = memo(function HourlyPatternsChart({ temptations }: { temptations: Temptation[] }) {
  const hourlyData: HourlyData[] = []

  for (let hour = 0; hour < 24; hour++) {
    const hourTemptations = temptations.filter(t => {
      const date = new Date(t.createdAt)
      return date.getHours() === hour
    })

    const resisted = hourTemptations.filter(t => t.resisted).length
    const spending = hourTemptations.filter(t => !t.resisted).reduce((sum, t) => sum + t.amount, 0)

    hourlyData.push({
      hour: `${hour}:00`,
      temptations: hourTemptations.length,
      resisted,
      spending
    })
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4">Temptations by Hour of Day</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="hour" className="text-xs" interval={1} />
              <YAxis className="text-xs" />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === 'spending' ? formatCurrency(value) : value,
                  name === 'temptations' ? 'Total Temptations' : name === 'resisted' ? 'Resisted' : 'Spending'
                ]}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="temptations" fill="#8884d8" opacity={0.6} />
              <Bar dataKey="resisted" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
})

export const SuccessRateProgressChart = memo(function SuccessRateProgressChart({ temptations }: { temptations: Temptation[] }) {
  // Show success rate over time (monthly)
  const monthlyData = []
  const now = new Date()

  for (let i = 11; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

    const monthTemptations = temptations.filter(t => {
      const date = new Date(t.createdAt)
      return date >= monthStart && date <= monthEnd
    })

    const successRate = monthTemptations.length > 0
      ? (monthTemptations.filter(t => t.resisted).length / monthTemptations.length) * 100
      : 0

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthName = monthNames[monthStart.getMonth()]

    monthlyData.push({
      month: monthName,
      successRate: Math.round(successRate),
      temptations: monthTemptations.length
    })
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4">Success Rate Progress</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} className="text-xs" />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === 'successRate' ? `${value}%` : value,
                  name === 'successRate' ? 'Success Rate' : 'Temptations'
                ]}
              />
              <Line
                type="monotone"
                dataKey="successRate"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
})
