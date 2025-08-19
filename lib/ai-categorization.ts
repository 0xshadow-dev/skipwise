import { TemptationCategory } from './types'

const categoryKeywords = {
  [TemptationCategory.FOOD_DINING]: [
    'food', 'restaurant', 'meal', 'dinner', 'lunch', 'breakfast', 'snack', 'eat', 'pizza', 
    'burger', 'sushi', 'chinese', 'italian', 'mexican', 'indian', 'thai', 'fast food',
    'takeout', 'delivery', 'dine', 'dining', 'cafe', 'bistro', 'bakery', 'dessert',
    'ice cream', 'donut', 'cookie', 'cake', 'pastry', 'bread', 'sandwich', 'salad'
  ],
  [TemptationCategory.COFFEE]: [
    'coffee', 'starbucks', 'latte', 'cappuccino', 'espresso', 'mocha', 'frappuccino',
    'cafe', 'barista', 'brew', 'bean', 'roast', 'americano', 'macchiato', 'tea',
    'chai', 'matcha', 'cold brew', 'iced coffee', 'dunkin', 'dutch bros'
  ],
  [TemptationCategory.SHOPPING]: [
    'shopping', 'buy', 'purchase', 'store', 'mall', 'retail', 'amazon', 'online',
    'sale', 'discount', 'deal', 'bargain', 'clearance', 'item', 'product', 'brand',
    'shop', 'boutique', 'outlet', 'marketplace', 'ebay', 'target', 'walmart',
    'costco', 'home goods', 'decor', 'furniture', 'appliance'
  ],
  [TemptationCategory.ENTERTAINMENT]: [
    'movie', 'cinema', 'theater', 'concert', 'show', 'ticket', 'netflix', 'streaming',
    'game', 'gaming', 'xbox', 'playstation', 'nintendo', 'app', 'subscription',
    'spotify', 'music', 'book', 'kindle', 'entertainment', 'fun', 'activity',
    'event', 'festival', 'comedy', 'sports', 'match', 'stadium'
  ],
  [TemptationCategory.TRANSPORTATION]: [
    'uber', 'lyft', 'taxi', 'ride', 'gas', 'fuel', 'parking', 'toll', 'bus', 'train',
    'metro', 'subway', 'flight', 'airline', 'car', 'rental', 'transportation',
    'commute', 'travel', 'trip', 'journey', 'scooter', 'bike', 'sharing'
  ],
  [TemptationCategory.CLOTHES]: [
    'clothes', 'clothing', 'shirt', 'pants', 'dress', 'shoes', 'sneakers', 'boots',
    'jacket', 'coat', 'sweater', 'jeans', 'skirt', 'blouse', 'fashion', 'style',
    'apparel', 'outfit', 'wardrobe', 'accessory', 'jewelry', 'watch', 'bag',
    'purse', 'wallet', 'belt', 'hat', 'scarf', 'socks', 'underwear', 'bra'
  ],
  [TemptationCategory.ELECTRONICS]: [
    'phone', 'smartphone', 'iphone', 'android', 'samsung', 'apple', 'laptop',
    'computer', 'tablet', 'ipad', 'headphones', 'earbuds', 'speaker', 'tv',
    'television', 'camera', 'smartwatch', 'fitbit', 'charger', 'cable',
    'electronics', 'gadget', 'device', 'tech', 'technology', 'software', 'app'
  ]
}

export function categorizeTemptation(description: string): TemptationCategory {
  const lowercaseDescription = description.toLowerCase()
  const scores: Record<TemptationCategory, number> = {} as any

  // Initialize scores
  Object.values(TemptationCategory).forEach(category => {
    scores[category] = 0
  })

  // Calculate scores based on keyword matches
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      if (lowercaseDescription.includes(keyword)) {
        scores[category as TemptationCategory] += keyword.length
      }
    })
  })

  // Find category with highest score
  let maxScore = 0
  let bestCategory = TemptationCategory.SHOPPING // default

  Object.entries(scores).forEach(([category, score]) => {
    if (score > maxScore) {
      maxScore = score
      bestCategory = category as TemptationCategory
    }
  })

  return bestCategory
}

export function getCategoryColor(category: TemptationCategory): string {
  const colors = {
    [TemptationCategory.FOOD_DINING]: 'bg-orange-500',
    [TemptationCategory.COFFEE]: 'bg-amber-600',
    [TemptationCategory.SHOPPING]: 'bg-blue-500',
    [TemptationCategory.ENTERTAINMENT]: 'bg-purple-500',
    [TemptationCategory.TRANSPORTATION]: 'bg-green-500',
    [TemptationCategory.CLOTHES]: 'bg-pink-500',
    [TemptationCategory.ELECTRONICS]: 'bg-cyan-500'
  }

  return colors[category] || 'bg-gray-500'
}