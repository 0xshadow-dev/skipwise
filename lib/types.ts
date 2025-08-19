export interface Temptation {
  id: string
  amount: number
  description: string
  resisted: boolean
  category: TemptationCategory
  createdAt: Date
  updatedAt: Date
}

export enum TemptationCategory {
  FOOD_DINING = 'Food & Dining',
  SHOPPING = 'Shopping',
  ENTERTAINMENT = 'Entertainment',
  TRANSPORTATION = 'Transportation',
  COFFEE = 'Coffee',
  CLOTHES = 'Clothes',
  ELECTRONICS = 'Electronics'
}

export interface UserProgress {
  totalSaved: number
  successRate: number
  currentStreak: number
  longestStreak: number
  lastUpdated: Date
}

export interface CategoryStats {
  category: TemptationCategory
  totalTemptations: number
  resistedCount: number
  successRate: number
  totalAmount: number
  savedAmount: number
}

export interface AIInsight {
  id: string
  type: 'challenge' | 'success' | 'trend'
  title: string
  description: string
  category?: TemptationCategory
  amount?: number
  createdAt: Date
}

export interface FilterOptions {
  category?: TemptationCategory
  resisted?: boolean
  dateRange?: {
    start: Date
    end: Date
  }
  searchTerm?: string
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  currency: string
}