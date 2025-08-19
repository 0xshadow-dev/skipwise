export interface Temptation {
  id: string
  amount: number
  description: string
  resisted: boolean
  category: TemptationCategory | string // Allow custom categories
  createdAt: Date
  updatedAt: Date
}

export enum TemptationCategory {
  FOOD_DINING = 'Food & Dining',
  COFFEE = 'Coffee',
  SHOPPING = 'Shopping',
  CLOTHES = 'Clothes',
  ELECTRONICS = 'Electronics',
  ENTERTAINMENT = 'Entertainment',
  BOOKS_EDUCATION = 'Books & Education',
  BEAUTY_WELLNESS = 'Beauty & Wellness',
  HOME_GARDEN = 'Home & Garden',
  SPORTS_FITNESS = 'Sports & Fitness',
  TRAVEL = 'Travel',
  TRANSPORTATION = 'Transportation',
  SUBSCRIPTIONS = 'Subscriptions',
  GIFTS_CHARITY = 'Gifts & Charity',
  HEALTH_MEDICAL = 'Health & Medical',
  HOBBIES_CRAFTS = 'Hobbies & Crafts',
  ALCOHOL_TOBACCO = 'Alcohol & Tobacco',
  GAMING = 'Gaming',
  OTHER = 'Other'
}

export interface UserProgress {
  totalSaved: number
  successRate: number
  currentStreak: number
  longestStreak: number
  lastUpdated: Date
}

export interface CategoryStats {
  category: TemptationCategory | string
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
  category?: TemptationCategory | string
  amount?: number
  createdAt: Date
}

export interface FilterOptions {
  category?: TemptationCategory | string
  resisted?: boolean
  dateRange?: {
    start: Date
    end: Date
  }
  searchTerm?: string
}

export interface Currency {
  code: string
  symbol: string
  name: string
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
  { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev' },
  { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
  { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
  { code: 'COP', symbol: '$', name: 'Colombian Peso' }
]

export interface UserCategory {
  id: string
  name: string
  color: string
  icon?: string
  createdAt: Date
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  currency: Currency
  customCategories: UserCategory[]
}