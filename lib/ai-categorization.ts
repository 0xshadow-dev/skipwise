import { TemptationCategory } from './types'
import { settings } from './settings'

// Enhanced keyword patterns with weights and contextual understanding
const categoryPatterns = {
  [TemptationCategory.FOOD_DINING]: {
    primary: ['food', 'restaurant', 'meal', 'dinner', 'lunch', 'breakfast', 'eat', 'dining'],
    secondary: ['pizza', 'burger', 'sushi', 'chinese', 'italian', 'mexican', 'indian', 'thai'],
    brands: ['mcdonalds', 'kfc', 'subway', 'dominos', 'taco bell', 'chipotle'],
    actions: ['order', 'delivery', 'takeout', 'dine out', 'grab a bite'],
    weight: 1.0
  },
  [TemptationCategory.COFFEE]: {
    primary: ['coffee', 'latte', 'cappuccino', 'espresso', 'americano', 'tea'],
    secondary: ['brew', 'roast', 'bean', 'barista', 'cafe'],
    brands: ['starbucks', 'dunkin', 'dutch bros', 'peets', 'tim hortons'],
    actions: ['grab coffee', 'coffee run', 'quick coffee'],
    weight: 1.2
  },
  [TemptationCategory.BOOKS_EDUCATION]: {
    primary: ['book', 'textbook', 'novel', 'course', 'education', 'learning', 'study'],
    secondary: ['ebook', 'audiobook', 'manual', 'guide', 'tutorial', 'class'],
    brands: ['kindle', 'audible', 'coursera', 'udemy', 'masterclass', 'barnes noble'],
    actions: ['read', 'learn', 'study', 'enroll', 'download book'],
    weight: 1.3
  },
  [TemptationCategory.BEAUTY_WELLNESS]: {
    primary: ['makeup', 'skincare', 'cosmetics', 'beauty', 'wellness', 'spa', 'massage'],
    secondary: ['lipstick', 'foundation', 'moisturizer', 'serum', 'perfume', 'cologne'],
    brands: ['sephora', 'ulta', 'mac', 'clinique', 'lancome', 'estee lauder'],
    actions: ['pamper', 'treat myself', 'beauty routine', 'self care'],
    weight: 1.0
  },
  [TemptationCategory.HOME_GARDEN]: {
    primary: ['furniture', 'decor', 'home', 'garden', 'plant', 'decoration', 'appliance'],
    secondary: ['couch', 'table', 'lamp', 'curtain', 'rug', 'tool', 'seeds'],
    brands: ['ikea', 'home depot', 'lowes', 'wayfair', 'pottery barn', 'west elm'],
    actions: ['redecorate', 'home improvement', 'furnish', 'organize'],
    weight: 0.9
  },
  [TemptationCategory.SPORTS_FITNESS]: {
    primary: ['gym', 'workout', 'fitness', 'sports', 'exercise', 'training', 'membership'],
    secondary: ['weights', 'equipment', 'yoga', 'running', 'cycling', 'swimming'],
    brands: ['nike', 'adidas', 'under armour', 'lululemon', 'peloton', 'planet fitness'],
    actions: ['join gym', 'workout gear', 'fitness class', 'training session'],
    weight: 1.1
  },
  [TemptationCategory.TRAVEL]: {
    primary: ['travel', 'vacation', 'trip', 'flight', 'hotel', 'booking', 'holiday'],
    secondary: ['airbnb', 'resort', 'cruise', 'tour', 'adventure', 'destination'],
    brands: ['expedia', 'booking.com', 'airbnb', 'marriott', 'hilton', 'delta'],
    actions: ['book trip', 'vacation planning', 'weekend getaway', 'explore'],
    weight: 1.2
  },
  [TemptationCategory.SUBSCRIPTIONS]: {
    primary: ['subscription', 'monthly', 'premium', 'plan', 'membership', 'service'],
    secondary: ['streaming', 'software', 'app', 'magazine', 'newspaper', 'cloud'],
    brands: ['netflix', 'spotify', 'adobe', 'microsoft', 'google', 'amazon prime'],
    actions: ['subscribe', 'upgrade plan', 'renew', 'monthly fee'],
    weight: 1.4
  },
  [TemptationCategory.GIFTS_CHARITY]: {
    primary: ['gift', 'present', 'donation', 'charity', 'birthday', 'anniversary'],
    secondary: ['surprise', 'celebrate', 'giving', 'contribution', 'fundraiser'],
    brands: ['gofundme', 'red cross', 'unicef', 'amazon gift', 'etsy'],
    actions: ['buy gift', 'donate', 'contribute', 'surprise someone'],
    weight: 1.0
  },
  [TemptationCategory.HEALTH_MEDICAL]: {
    primary: ['medicine', 'doctor', 'health', 'medical', 'pharmacy', 'treatment'],
    secondary: ['prescription', 'supplement', 'vitamin', 'checkup', 'therapy'],
    brands: ['cvs', 'walgreens', 'rite aid', 'kaiser', 'blue cross'],
    actions: ['medical expense', 'health check', 'buy medicine', 'doctor visit'],
    weight: 1.5
  },
  [TemptationCategory.HOBBIES_CRAFTS]: {
    primary: ['hobby', 'craft', 'art', 'supplies', 'materials', 'project', 'diy'],
    secondary: ['paint', 'brush', 'canvas', 'yarn', 'fabric', 'tools', 'kit'],
    brands: ['michaels', 'hobby lobby', 'joann', 'amazon craft', 'etsy supplies'],
    actions: ['craft project', 'art supplies', 'hobby gear', 'creative work'],
    weight: 1.0
  },
  [TemptationCategory.ALCOHOL_TOBACCO]: {
    primary: ['alcohol', 'beer', 'wine', 'liquor', 'cigarette', 'tobacco', 'vape'],
    secondary: ['whiskey', 'vodka', 'rum', 'cocktail', 'smoking', 'drinking'],
    brands: ['budweiser', 'corona', 'jack daniels', 'marlboro', 'juul'],
    actions: ['drink', 'smoke', 'party supplies', 'bar night'],
    weight: 1.3
  },
  [TemptationCategory.GAMING]: {
    primary: ['game', 'gaming', 'console', 'controller', 'steam', 'playstation', 'xbox'],
    secondary: ['video game', 'pc game', 'mobile game', 'dlc', 'expansion'],
    brands: ['steam', 'epic games', 'playstation', 'xbox', 'nintendo', 'blizzard'],
    actions: ['buy game', 'gaming session', 'new release', 'game purchase'],
    weight: 1.2
  },
  [TemptationCategory.ENTERTAINMENT]: {
    primary: ['movie', 'concert', 'show', 'theater', 'entertainment', 'event'],
    secondary: ['cinema', 'ticket', 'performance', 'comedy', 'music venue'],
    brands: ['amc', 'regal', 'live nation', 'ticketmaster', 'stubhub'],
    actions: ['watch', 'attend', 'see show', 'entertainment night'],
    weight: 1.1
  },
  [TemptationCategory.SHOPPING]: {
    primary: ['buy', 'purchase', 'shopping', 'store', 'mall', 'retail'],
    secondary: ['sale', 'discount', 'deal', 'bargain', 'clearance', 'item'],
    brands: ['amazon', 'target', 'walmart', 'costco', 'ebay'],
    actions: ['browse', 'window shopping', 'online shopping', 'impulse buy'],
    weight: 0.7
  },
  [TemptationCategory.CLOTHES]: {
    primary: ['clothes', 'shirt', 'pants', 'dress', 'shoes', 'jacket'],
    secondary: ['fashion', 'style', 'outfit', 'wardrobe', 'accessory'],
    brands: ['nike', 'adidas', 'zara', 'h&m', 'uniqlo', 'gap'],
    actions: ['try on', 'new outfit', 'wardrobe update'],
    weight: 1.0
  },
  [TemptationCategory.ELECTRONICS]: {
    primary: ['phone', 'laptop', 'computer', 'tablet', 'headphones', 'tv'],
    secondary: ['smartphone', 'electronics', 'gadget', 'device', 'tech'],
    brands: ['apple', 'samsung', 'sony', 'microsoft', 'google'],
    actions: ['upgrade', 'new device', 'tech purchase'],
    weight: 1.1
  },
  [TemptationCategory.TRANSPORTATION]: {
    primary: ['uber', 'lyft', 'taxi', 'ride', 'gas', 'fuel', 'parking'],
    secondary: ['bus', 'train', 'metro', 'subway', 'flight', 'car'],
    brands: ['uber', 'lyft', 'shell', 'chevron', 'bp'],
    actions: ['get a ride', 'fill up', 'book flight', 'take taxi'],
    weight: 1.0
  }
}

// Text preprocessing for better matching
function preprocessText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

// Calculate semantic similarity score
function calculateSemanticScore(description: string, pattern: { primary: string[], secondary: string[], brands: string[], actions: string[], weight: number }): number {
  const processedDesc = preprocessText(description)
  // const words = processedDesc.split(' ') // Will be used for future enhancements
  
  let score = 0
  let matchCount = 0
  
  // Primary keywords (highest weight)
  pattern.primary.forEach((keyword: string) => {
    if (processedDesc.includes(keyword)) {
      score += 3 * keyword.length
      matchCount++
    }
  })
  
  // Secondary keywords (medium weight)
  pattern.secondary.forEach((keyword: string) => {
    if (processedDesc.includes(keyword)) {
      score += 2 * keyword.length
      matchCount++
    }
  })
  
  // Brand names (high weight)
  pattern.brands.forEach((brand: string) => {
    if (processedDesc.includes(brand)) {
      score += 4 * brand.length
      matchCount++
    }
  })
  
  // Action phrases (medium weight with context bonus)
  pattern.actions.forEach((action: string) => {
    if (processedDesc.includes(action)) {
      score += 2.5 * action.length
      matchCount++
    }
  })
  
  // Apply category weight and match density bonus
  score *= pattern.weight
  if (matchCount > 1) {
    score *= 1.3 // Multi-match bonus
  }
  
  return score
}

// Check if description matches custom categories
function checkCustomCategories(description: string): string | null {
  const customCategories = settings.getCustomCategories()
  const processedDesc = preprocessText(description)
  
  // Simple keyword matching for custom categories
  for (const category of customCategories) {
    const categoryWords = preprocessText(category.name).split(' ')
    const hasMatch = categoryWords.some(word => 
      word.length > 2 && processedDesc.includes(word)
    )
    
    if (hasMatch) {
      return category.name
    }
  }
  
  return null
}

// Fallback categorization using enhanced keyword matching
function fallbackCategorization(description: string): TemptationCategory | string {
  // First check custom categories
  const customMatch = checkCustomCategories(description)
  if (customMatch) {
    return customMatch
  }
  
  const scores: Record<TemptationCategory, number> = {} as Record<TemptationCategory, number>
  
  // Calculate scores for each built-in category
  Object.entries(categoryPatterns).forEach(([category, pattern]) => {
    scores[category as TemptationCategory] = calculateSemanticScore(description, pattern)
  })
  
  // Find best match
  let maxScore = 0
  let bestCategory: TemptationCategory = TemptationCategory.OTHER
  
  Object.entries(scores).forEach(([category, score]) => {
    if (score > maxScore) {
      maxScore = score
      bestCategory = category as TemptationCategory
    }
  })
  
  // If no clear match found, use contextual hints
  if (maxScore === 0) {
    const desc = description.toLowerCase()
    
    // Amount-based hints
    if (/\$[1-9]\d{0,1}(\.\d{2})?/.test(description) && !/\$[1-9]\d{2,}/.test(description)) {
      // Small amounts often food/coffee
      if (desc.includes('quick') || desc.includes('grab')) {
        return TemptationCategory.COFFEE
      }
      return TemptationCategory.FOOD_DINING
    }
    
    // Time-based hints
    if (desc.includes('morning')) return TemptationCategory.COFFEE
    if (desc.includes('lunch') || desc.includes('dinner')) return TemptationCategory.FOOD_DINING
    
    // Location hints
    if (desc.includes('online') || desc.includes('website')) return TemptationCategory.SHOPPING
    if (desc.includes('store') || desc.includes('mall')) return TemptationCategory.SHOPPING
    
    // Default to OTHER for unclear cases
    return TemptationCategory.OTHER
  }
  
  return bestCategory
}

export async function categorizeTemptation(description: string): Promise<TemptationCategory | string> {
  try {
    // For now, use the enhanced fallback system
    // In the future, this could be extended with a custom TensorFlow.js model
    return fallbackCategorization(description)
  } catch (error) {
    console.warn('AI categorization failed, using fallback:', error)
    return fallbackCategorization(description)
  }
}

export function getCategoryColor(category: TemptationCategory | string): string {
  // Check if it's a custom category
  if (!Object.values(TemptationCategory).includes(category as TemptationCategory)) {
    const customCategories = settings.getCustomCategories()
    const customCategory = customCategories.find(c => c.name === category)
    if (customCategory) {
      return `bg-[${customCategory.color}]`
    }
    return 'bg-gray-500'
  }
  
  // Handle built-in categories
  const colors = {
    [TemptationCategory.FOOD_DINING]: 'bg-orange-500',
    [TemptationCategory.COFFEE]: 'bg-amber-600',
    [TemptationCategory.SHOPPING]: 'bg-blue-500',
    [TemptationCategory.CLOTHES]: 'bg-pink-500',
    [TemptationCategory.ELECTRONICS]: 'bg-cyan-500',
    [TemptationCategory.ENTERTAINMENT]: 'bg-purple-500',
    [TemptationCategory.BOOKS_EDUCATION]: 'bg-indigo-500',
    [TemptationCategory.BEAUTY_WELLNESS]: 'bg-rose-500',
    [TemptationCategory.HOME_GARDEN]: 'bg-emerald-500',
    [TemptationCategory.SPORTS_FITNESS]: 'bg-red-500',
    [TemptationCategory.TRAVEL]: 'bg-sky-500',
    [TemptationCategory.TRANSPORTATION]: 'bg-green-500',
    [TemptationCategory.SUBSCRIPTIONS]: 'bg-violet-500',
    [TemptationCategory.GIFTS_CHARITY]: 'bg-teal-500',
    [TemptationCategory.HEALTH_MEDICAL]: 'bg-red-600',
    [TemptationCategory.HOBBIES_CRAFTS]: 'bg-yellow-500',
    [TemptationCategory.ALCOHOL_TOBACCO]: 'bg-amber-700',
    [TemptationCategory.GAMING]: 'bg-lime-500',
    [TemptationCategory.OTHER]: 'bg-gray-500'
  }

  return colors[category as TemptationCategory] || 'bg-gray-500'
}

// Get all available categories (built-in + custom)
export function getAllCategories(): Array<{name: string, isCustom: boolean, color?: string}> {
  const builtInCategories = Object.values(TemptationCategory).map(cat => ({
    name: cat,
    isCustom: false
  }))
  
  const customCategories = settings.getCustomCategories().map(cat => ({
    name: cat.name,
    isCustom: true,
    color: cat.color
  }))
  
  return [...builtInCategories, ...customCategories]
}