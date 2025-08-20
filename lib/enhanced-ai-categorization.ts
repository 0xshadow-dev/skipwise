import { TemptationCategory } from "./types";
import { settings } from "./settings";
import Fuse from "fuse.js";
import {
  regionalPatterns,
  globalBrands,
  multilingualPatterns,
  culturalMarkers,
  regionalCurrencies,
  type CulturalPattern,
} from "./regional-data";

// Enhanced fuzzy search configuration
const fuseOptions = {
  threshold: 0.6, // 0.0 = perfect match, 1.0 = match anything (more lenient)
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 2, // Allow shorter matches
  keys: ["name", "variations"],
};

interface CategoryMatch {
  category: TemptationCategory | string;
  score: number;
  confidence: number;
  source:
    | "regional"
    | "brand"
    | "keyword"
    | "multilingual"
    | "contextual"
    | "custom";
  region?: string;
  details?: string;
}

interface EnhancedPattern {
  primary: string[];
  secondary: string[];
  brands: string[];
  actions: string[];
  synonyms?: string[];
  phrases?: string[];
  weight: number;
  regional?: CulturalPattern;
}

// Enhanced category patterns with regional integration
const enhancedCategoryPatterns: Record<TemptationCategory, EnhancedPattern> = {
  [TemptationCategory.FOOD_DINING]: {
    primary: [
      "food",
      "restaurant",
      "meal",
      "dinner",
      "lunch",
      "breakfast",
      "eat",
      "dining",
      "hungry",
      "feast",
      "snack",
      "bite",
    ],
    secondary: [
      "pizza",
      "burger",
      "sushi",
      "ramen",
      "noodles",
      "chinese",
      "italian",
      "mexican",
      "indian",
      "thai",
      "cuisine",
      "dish",
      "menu",
      "recipe",
      "cooking",
    ],
    brands: [...globalBrands.food],
    actions: [
      "order",
      "delivery",
      "takeout",
      "dine out",
      "grab a bite",
      "eat out",
      "food craving",
      "treat myself",
      "splurge on food",
    ],
    synonyms: ["grub", "chow", "nosh", "munch", "devour", "consume"],
    phrases: [
      "im hungry",
      "food delivery",
      "order food",
      "restaurant night",
      "dinner date",
      "quick meal",
    ],
    weight: 1.0,
    regional: regionalPatterns.food_dining,
  },

  [TemptationCategory.COFFEE]: {
    primary: [
      "coffee",
      "latte",
      "cappuccino",
      "espresso",
      "americano",
      "tea",
      "chai",
      "mocha",
      "frappuccino",
      "caffeine",
    ],
    secondary: [
      "brew",
      "roast",
      "bean",
      "barista",
      "cafe",
      "coffeehouse",
      "espresso shot",
      "iced coffee",
      "hot drink",
    ],
    brands: [
      "starbucks",
      "dunkin",
      "dutch bros",
      "peets",
      "tim hortons",
      "costa",
      "caribou",
      "blue bottle",
      "philz",
      "pacific coffee",
      "gloria jean s",
      "second cup",
    ],
    actions: [
      "grab coffee",
      "coffee run",
      "quick coffee",
      "morning fix",
      "caffeine boost",
      "coffee break",
    ],
    synonyms: ["java", "joe", "cuppa", "brew"],
    phrases: [
      "need coffee",
      "coffee fix",
      "morning coffee",
      "coffee break",
      "grab a latte",
    ],
    weight: 1.2,
  },

  [TemptationCategory.SHOPPING]: {
    primary: [
      "buy",
      "purchase",
      "shopping",
      "store",
      "mall",
      "retail",
      "shop",
      "acquire",
      "get",
    ],
    secondary: [
      "sale",
      "discount",
      "deal",
      "bargain",
      "clearance",
      "item",
      "offer",
      "promotion",
      "markdown",
      "price drop",
    ],
    brands: [...globalBrands.retail],
    actions: [
      "browse",
      "window shopping",
      "online shopping",
      "impulse buy",
      "retail therapy",
      "shop around",
      "quick purchase",
    ],
    synonyms: ["acquire", "obtain", "procure", "snag", "score"],
    phrases: [
      "retail therapy",
      "impulse purchase",
      "shopping spree",
      "great deal",
      "must have",
      "on sale",
    ],
    weight: 0.7,
  },

  [TemptationCategory.ELECTRONICS]: {
    primary: [
      "phone",
      "laptop",
      "computer",
      "tablet",
      "headphones",
      "tv",
      "smartphone",
      "iphone",
      "android",
      "macbook",
    ],
    secondary: [
      "electronics",
      "gadget",
      "device",
      "tech",
      "technology",
      "digital",
      "smart",
      "wireless",
      "bluetooth",
    ],
    brands: [
      "apple",
      "samsung",
      "sony",
      "microsoft",
      "google",
      "dell",
      "hp",
      "lenovo",
      "lg",
      "nvidia",
      "amd",
      "xiaomi",
      "huawei",
      "oppo",
      "vivo",
      "oneplus",
    ],
    actions: [
      "upgrade",
      "new device",
      "tech purchase",
      "latest model",
      "tech upgrade",
      "new release",
    ],
    synonyms: ["gadget", "gizmo", "device", "gear"],
    phrases: [
      "new phone",
      "tech upgrade",
      "latest model",
      "smart device",
      "electronic gadget",
    ],
    weight: 1.1,
  },

  // Add other categories with basic patterns for now...
  [TemptationCategory.CLOTHES]: {
    primary: [
      "clothes",
      "shirt",
      "pants",
      "dress",
      "shoes",
      "jacket",
      "jeans",
      "sweater",
      "blouse",
      "skirt",
      "boots",
    ],
    secondary: [
      "fashion",
      "style",
      "outfit",
      "wardrobe",
      "accessory",
      "apparel",
      "attire",
      "clothing",
      "footwear",
    ],
    brands: [
      "nike",
      "adidas",
      "zara",
      "h&m",
      "uniqlo",
      "gap",
      "forever 21",
      "old navy",
      "banana republic",
      "levi s",
    ],
    actions: [
      "try on",
      "new outfit",
      "wardrobe update",
      "fashion shopping",
      "style upgrade",
      "clothing haul",
    ],
    synonyms: ["apparel", "attire", "garments", "threads", "duds"],
    phrases: [
      "new outfit",
      "wardrobe refresh",
      "fashion find",
      "clothing item",
      "style piece",
    ],
    weight: 1.0,
  },

  [TemptationCategory.ENTERTAINMENT]: {
    primary: ["movie", "concert", "show", "theater", "entertainment", "event"],
    secondary: ["cinema", "ticket", "performance", "comedy", "music venue"],
    brands: ["amc", "regal", "live nation", "ticketmaster", "stubhub"],
    actions: ["watch", "attend", "see show", "entertainment night"],
    weight: 1.1,
  },

  [TemptationCategory.BOOKS_EDUCATION]: {
    primary: [
      "book",
      "textbook",
      "novel",
      "course",
      "education",
      "learning",
      "study",
    ],
    secondary: ["ebook", "audiobook", "manual", "guide", "tutorial", "class"],
    brands: [
      "kindle",
      "audible",
      "coursera",
      "udemy",
      "masterclass",
      "barnes noble",
    ],
    actions: ["read", "learn", "study", "enroll", "download book"],
    weight: 1.3,
  },

  [TemptationCategory.BEAUTY_WELLNESS]: {
    primary: [
      "makeup",
      "skincare",
      "cosmetics",
      "beauty",
      "wellness",
      "spa",
      "massage",
    ],
    secondary: [
      "lipstick",
      "foundation",
      "moisturizer",
      "serum",
      "perfume",
      "cologne",
    ],
    brands: ["sephora", "ulta", "mac", "clinique", "lancome", "estee lauder"],
    actions: ["pamper", "treat myself", "beauty routine", "self care"],
    weight: 1.0,
  },

  [TemptationCategory.HOME_GARDEN]: {
    primary: [
      "furniture",
      "decor",
      "home",
      "garden",
      "plant",
      "decoration",
      "appliance",
    ],
    secondary: ["couch", "table", "lamp", "curtain", "rug", "tool", "seeds"],
    brands: [
      "ikea",
      "home depot",
      "lowes",
      "wayfair",
      "pottery barn",
      "west elm",
    ],
    actions: ["redecorate", "home improvement", "furnish", "organize"],
    weight: 0.9,
  },

  [TemptationCategory.SPORTS_FITNESS]: {
    primary: [
      "gym",
      "workout",
      "fitness",
      "sports",
      "exercise",
      "training",
      "membership",
    ],
    secondary: [
      "weights",
      "equipment",
      "yoga",
      "running",
      "cycling",
      "swimming",
    ],
    brands: [
      "nike",
      "adidas",
      "under armour",
      "lululemon",
      "peloton",
      "planet fitness",
    ],
    actions: ["join gym", "workout gear", "fitness class", "training session"],
    weight: 1.1,
  },

  [TemptationCategory.TRAVEL]: {
    primary: [
      "travel",
      "vacation",
      "trip",
      "flight",
      "hotel",
      "booking",
      "holiday",
    ],
    secondary: [
      "airbnb",
      "resort",
      "cruise",
      "tour",
      "adventure",
      "destination",
    ],
    brands: ["expedia", "booking.com", "airbnb", "marriott", "hilton", "delta"],
    actions: ["book trip", "vacation planning", "weekend getaway", "explore"],
    weight: 1.2,
  },

  [TemptationCategory.TRANSPORTATION]: {
    primary: ["uber", "lyft", "taxi", "ride", "gas", "fuel", "parking"],
    secondary: ["bus", "train", "metro", "subway", "flight", "car"],
    brands: ["uber", "lyft", "shell", "chevron", "bp"],
    actions: ["get a ride", "fill up", "book flight", "take taxi"],
    weight: 1.0,
  },

  [TemptationCategory.SUBSCRIPTIONS]: {
    primary: [
      "subscription",
      "monthly",
      "premium",
      "plan",
      "membership",
      "service",
    ],
    secondary: [
      "streaming",
      "software",
      "app",
      "magazine",
      "newspaper",
      "cloud",
    ],
    brands: [
      "netflix",
      "spotify",
      "adobe",
      "microsoft",
      "google",
      "amazon prime",
    ],
    actions: ["subscribe", "upgrade plan", "renew", "monthly fee"],
    weight: 1.4,
  },

  [TemptationCategory.GIFTS_CHARITY]: {
    primary: [
      "gift",
      "present",
      "donation",
      "charity",
      "birthday",
      "anniversary",
    ],
    secondary: [
      "surprise",
      "celebrate",
      "giving",
      "contribution",
      "fundraiser",
    ],
    brands: ["gofundme", "red cross", "unicef", "amazon gift", "etsy"],
    actions: ["buy gift", "donate", "contribute", "surprise someone"],
    weight: 1.0,
  },

  [TemptationCategory.HEALTH_MEDICAL]: {
    primary: [
      "medicine",
      "doctor",
      "health",
      "medical",
      "pharmacy",
      "treatment",
    ],
    secondary: ["prescription", "supplement", "vitamin", "checkup", "therapy"],
    brands: ["cvs", "walgreens", "rite aid", "kaiser", "blue cross"],
    actions: [
      "medical expense",
      "health check",
      "buy medicine",
      "doctor visit",
    ],
    weight: 1.5,
  },

  [TemptationCategory.HOBBIES_CRAFTS]: {
    primary: [
      "hobby",
      "craft",
      "art",
      "supplies",
      "materials",
      "project",
      "diy",
    ],
    secondary: ["paint", "brush", "canvas", "yarn", "fabric", "tools", "kit"],
    brands: [
      "michaels",
      "hobby lobby",
      "joann",
      "amazon craft",
      "etsy supplies",
    ],
    actions: ["craft project", "art supplies", "hobby gear", "creative work"],
    weight: 1.0,
  },

  [TemptationCategory.ALCOHOL_TOBACCO]: {
    primary: [
      "alcohol",
      "beer",
      "wine",
      "liquor",
      "cigarette",
      "tobacco",
      "vape",
    ],
    secondary: ["whiskey", "vodka", "rum", "cocktail", "smoking", "drinking"],
    brands: ["budweiser", "corona", "jack daniels", "marlboro", "juul"],
    actions: ["drink", "smoke", "party supplies", "bar night"],
    weight: 1.3,
  },

  [TemptationCategory.GAMING]: {
    primary: [
      "game",
      "gaming",
      "console",
      "controller",
      "steam",
      "playstation",
      "xbox",
    ],
    secondary: ["video game", "pc game", "mobile game", "dlc", "expansion"],
    brands: [
      "steam",
      "epic games",
      "playstation",
      "xbox",
      "nintendo",
      "blizzard",
    ],
    actions: ["buy game", "gaming session", "new release", "game purchase"],
    weight: 1.2,
  },

  [TemptationCategory.OTHER]: {
    primary: ["other", "misc", "miscellaneous", "various", "random"],
    secondary: [],
    brands: [],
    actions: [],
    weight: 0.1,
  },
};

// Cultural context detection
function detectCulturalContext(description: string): string[] {
  const contexts: string[] = [];
  const desc = description.toLowerCase();

  // Language/script detection
  if (/[가-힣]/.test(description)) contexts.push("korean");
  if (/[ひらがなカタカナ]/.test(description)) contexts.push("japanese");
  if (/[一-龯]/.test(description)) contexts.push("chinese");
  if (/[ا-ي]/.test(description)) contexts.push("arabic");
  if (/[अ-ह]/.test(description)) contexts.push("hindi");
  if (/[α-ω]/.test(description)) contexts.push("greek");
  if (/[а-я]/.test(description)) contexts.push("russian");

  // Cultural marker detection
  Object.entries(culturalMarkers).forEach(([culture, markers]) => {
    if (markers.some((marker) => desc.includes(marker.toLowerCase()))) {
      contexts.push(culture);
    }
  });

  // Currency detection for regional context
  Object.entries(regionalCurrencies).forEach(([, data]) => {
    if (data.regex.test(description)) {
      contexts.push(...data.regions);
    }
  });

  return [...new Set(contexts)]; // Remove duplicates
}

// Enhanced fuzzy matching with regional awareness
function performFuzzyMatching(
  description: string,
  category: TemptationCategory,
  pattern: EnhancedPattern,
): CategoryMatch[] {
  const matches: CategoryMatch[] = [];
  const contexts = detectCulturalContext(description);

  // Create searchable items for fuzzy matching
  const searchItems: Array<{
    name: string;
    type: string;
    weight: number;
    region?: string;
  }> = [];

  // Add primary keywords
  pattern.primary.forEach((keyword) => {
    searchItems.push({ name: keyword, type: "primary", weight: 3.0 });
  });

  // Add secondary keywords
  pattern.secondary.forEach((keyword) => {
    searchItems.push({ name: keyword, type: "secondary", weight: 2.0 });
  });

  // Add brands
  pattern.brands.forEach((brand) => {
    searchItems.push({ name: brand, type: "brand", weight: 4.0 });
  });

  // Add regional items - always include all regional dishes, prioritize by context
  if (pattern.regional) {
    Object.entries(pattern.regional).forEach(([region, regionalData]) => {
      const isDetectedContext = contexts.includes(region);
      const contextBonus = isDetectedContext ? 1.5 : 1.0; // Bonus for detected cultural context
      
      regionalData.dishes?.forEach((dish) => {
        searchItems.push({
          name: dish,
          type: "regional_dish",
          weight: 5.0 * contextBonus,
          region: region,
        });
      });
      regionalData.brands?.forEach((brand) => {
        searchItems.push({
          name: brand,
          type: "regional_brand",
          weight: 4.5 * contextBonus,
          region: region,
        });
      });
      regionalData.keywords?.forEach((keyword) => {
        searchItems.push({
          name: keyword,
          type: "regional_keyword",
          weight: 3.5 * contextBonus,
          region: region,
        });
      });
    });
  }

  // Perform fuzzy search
  const fuse = new Fuse(searchItems, {
    ...fuseOptions,
    keys: ["name"],
  });

  const results = fuse.search(description);
  

  // Process results and calculate scores
  results.forEach((result) => {
    const item = result.item;
    const rawScore = result.score ?? 1.0; // Default to 1.0 if score is undefined
    const fuzzyScore = Math.max(0, 1 - rawScore); // Convert to positive score, ensure non-negative
    const finalScore = fuzzyScore * item.weight * pattern.weight;
    const confidence = Math.min(Math.max(fuzzyScore * 0.9, 0.1), 1.0); // Cap confidence between 10% and 100%

    if (!isNaN(finalScore) && !isNaN(confidence)) {
      matches.push({
        category,
        score: finalScore,
        confidence: confidence,
        source: item.type.includes("regional")
          ? "regional"
          : item.type === "brand"
            ? "brand"
            : "keyword",
        region: item.region,
        details: `Matched "${item.name}" (${item.type})`,
      });
    }
  });

  return matches;
}

// Multilingual keyword matching
function performMultilingualMatching(description: string): CategoryMatch[] {
  const matches: CategoryMatch[] = [];
  const desc = description.toLowerCase();

  Object.entries(multilingualPatterns).forEach(([categoryType, languages]) => {
    Object.entries(languages).forEach(([lang, keywords]) => {
      keywords.forEach((keyword) => {
        if (desc.includes(keyword.toLowerCase())) {
          const category =
            categoryType === "food"
              ? TemptationCategory.FOOD_DINING
              : categoryType === "shopping"
                ? TemptationCategory.SHOPPING
                : TemptationCategory.OTHER;

          matches.push({
            category,
            score: keyword.length * 2.5, // Base score on keyword length
            confidence: 0.8, // High confidence for multilingual matches
            source: "multilingual",
            details: `Matched "${keyword}" (${lang})`,
          });
        }
      });
    });
  });

  return matches;
}

// Custom category matching with fuzzy search
function checkCustomCategories(description: string): CategoryMatch[] {
  const matches: CategoryMatch[] = [];
  const customCategories = settings.getCustomCategories();

  if (customCategories.length === 0) return matches;

  // Create fuzzy search for custom categories
  const fuse = new Fuse(customCategories, {
    ...fuseOptions,
    keys: ["name"],
  });

  const results = fuse.search(description);

  results.forEach((result) => {
    const category = result.item;
    const fuzzyScore = 1 - result.score!;

    matches.push({
      category: category.name,
      score: fuzzyScore * 10, // High score for custom matches
      confidence: Math.min(fuzzyScore * 1.2, 1.0), // Boost confidence for custom categories
      source: "custom",
      details: `Custom category match`,
    });
  });

  return matches;
}

// Enhanced categorization with comprehensive matching
export async function enhancedCategorizeTemptation(
  description: string,
): Promise<TemptationCategory | string> {
  
  try {
    const allMatches: CategoryMatch[] = [];

    // 1. Check custom categories first (highest priority)
    const customMatches = checkCustomCategories(description);
    allMatches.push(...customMatches);

    // 2. Perform multilingual matching
    const multilingualMatches = performMultilingualMatching(description);
    allMatches.push(...multilingualMatches);

    // 3. Perform fuzzy matching against all built-in categories
    Object.entries(enhancedCategoryPatterns).forEach(([category, pattern]) => {
      const categoryMatches = performFuzzyMatching(
        description,
        category as TemptationCategory,
        pattern,
      );
      allMatches.push(...categoryMatches);
    });

    // 4. Sort by score and confidence
    allMatches.sort((a, b) => {
      const scoreA = a.score * a.confidence;
      const scoreB = b.score * b.confidence;
      return scoreB - scoreA;
    });

    // 5. Return best match if confidence is reasonable
    if (allMatches.length > 0 && allMatches[0].confidence > 0.1) {
      return allMatches[0].category;
    }

    // 6. Fallback to contextual categorization
    return contextualFallback(description);
  } catch (error) {
    console.warn("Enhanced AI categorization failed:", error);
    return contextualFallback(description);
  }
}

// Enhanced contextual fallback with cultural awareness
function contextualFallback(description: string): TemptationCategory {
  const desc = description.toLowerCase();
  const contexts = detectCulturalContext(description);

  // Check for common food terms that should always be FOOD_DINING
  const commonFoodTerms = [
    'ramen', 'pho', 'sushi', 'pizza', 'burger', 'noodles', 'rice', 'soup',
    'curry', 'pasta', 'sandwich', 'taco', 'burrito', 'salad', 'chicken', 
    'beef', 'fish', 'pork', 'vada pav', 'biryani', 'dosa', 'samosa',
    'idli', 'chapati', 'naan', 'roti', 'dal', 'masala', 'tandoori', 'kebab',
    'tempura', 'yakitori', 'gyoza', 'dumpling', 'pad thai', 'laksa', 'satay'
  ];
  
  if (commonFoodTerms.some(term => desc.includes(term))) {
    return TemptationCategory.FOOD_DINING;
  }

  // Cultural context-based categorization
  if (
    contexts.includes("asian") ||
    contexts.includes("korean") ||
    contexts.includes("japanese") ||
    contexts.includes("chinese")
  ) {
    if (
      desc.includes("rice") ||
      desc.includes("noodle") ||
      desc.includes("soup")
    ) {
      return TemptationCategory.FOOD_DINING;
    }
  }

  // Amount-based hints with better regex
  const smallAmount =
    /\$([1-9]|[1-4]\d)(\.\d{2})?|\€([1-9]|[1-4]\d)(\.\d{2})?|£([1-9]|[1-4]\d)(\.\d{2})?|¥([1-9]\d{1,2})|₹([1-9]\d{2,3})/.test(
      description,
    );
  const largeAmount =
    /\$([2-9]\d{2}|\d{4,})(\.\d{2})?|\€([2-9]\d{2}|\d{4,})(\.\d{2})?|£([2-9]\d{2}|\d{4,})(\.\d{2})?|¥([5-9]\d{3}|\d{5,})|₹([1-9]\d{4,})/.test(
      description,
    );

  // Time-based contextual hints
  if (
    desc.includes("morning") ||
    desc.includes("wake up") ||
    desc.includes("breakfast")
  ) {
    return TemptationCategory.COFFEE;
  }
  if (
    desc.includes("lunch") ||
    desc.includes("dinner") ||
    desc.includes("hungry") ||
    desc.includes("meal")
  ) {
    return TemptationCategory.FOOD_DINING;
  }

  // Amount-based categorization
  if (smallAmount) {
    if (
      desc.includes("quick") ||
      desc.includes("grab") ||
      desc.includes("stop") ||
      desc.includes("coffee") ||
      desc.includes("tea")
    ) {
      return TemptationCategory.COFFEE;
    }
    return TemptationCategory.FOOD_DINING;
  }

  if (largeAmount) {
    if (
      desc.includes("online") ||
      desc.includes("website") ||
      desc.includes("app") ||
      desc.includes("tech")
    ) {
      return TemptationCategory.ELECTRONICS;
    }
    return TemptationCategory.SHOPPING;
  }

  // Location-based hints
  if (
    desc.includes("online") ||
    desc.includes("website") ||
    desc.includes("app") ||
    desc.includes("internet")
  ) {
    return TemptationCategory.SHOPPING;
  }
  if (
    desc.includes("store") ||
    desc.includes("mall") ||
    desc.includes("shop")
  ) {
    return TemptationCategory.SHOPPING;
  }
  if (
    desc.includes("restaurant") ||
    desc.includes("cafe") ||
    desc.includes("diner")
  ) {
    return TemptationCategory.FOOD_DINING;
  }

  return TemptationCategory.OTHER;
}

// Enhanced category suggestions with detailed scoring
export function getEnhancedCategorySuggestions(
  description: string,
  maxSuggestions: number = 3,
): Array<{
  category: TemptationCategory | string;
  confidence: number;
  source: string;
  details?: string;
}> {
  const allMatches: CategoryMatch[] = [];

  // Get all matches using the same logic as main categorization
  const customMatches = checkCustomCategories(description);
  allMatches.push(...customMatches);

  const multilingualMatches = performMultilingualMatching(description);
  allMatches.push(...multilingualMatches);

  Object.entries(enhancedCategoryPatterns).forEach(([category, pattern]) => {
    const categoryMatches = performFuzzyMatching(
      description,
      category as TemptationCategory,
      pattern,
    );
    allMatches.push(...categoryMatches);
  });

  // Group by category and take best match for each
  const categoryGroups = new Map<string, CategoryMatch>();
  allMatches.forEach((match) => {
    const categoryKey = match.category.toString();
    const existing = categoryGroups.get(categoryKey);
    
    // Only add if it's a new category or better match
    if (!existing) {
      categoryGroups.set(categoryKey, match);
    } else {
      const existingScore = existing.score * existing.confidence;
      const currentScore = match.score * match.confidence;
      
      // Replace if current match is significantly better or same category from higher priority source
      if (currentScore > existingScore || 
          (currentScore === existingScore && match.source === 'regional' && existing.source !== 'regional')) {
        categoryGroups.set(categoryKey, match);
      }
    }
  });

  // Convert to array and sort
  const suggestions = Array.from(categoryGroups.values())
    .sort((a, b) => b.score * b.confidence - a.score * a.confidence)
    .slice(0, maxSuggestions)
    .map((match) => ({
      category: match.category,
      confidence: Math.min(match.confidence, 1.0),
      source: match.source + (match.region ? ` (${match.region})` : ""),
      details: match.details,
    }));

  // Add fallback if no good suggestions
  if (suggestions.length === 0 || suggestions[0].confidence < 0.2) {
    const fallback = contextualFallback(description);
    suggestions.unshift({
      category: fallback,
      confidence: 0.15,
      source: "contextual",
      details: "Contextual fallback",
    });
  }

  return suggestions;
}

// Export the enhanced categorization functions
export { enhancedCategorizeTemptation as categorizeTemptation };
// export { enhancedCategorizeTemptation };

// Re-export other functions for compatibility
export {
  getCategorySuggestions,
  getCategoryColor,
  getAllCategories,
} from "./ai-categorization";
