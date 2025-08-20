/**
 * Super Fuzzy Categorizer - The Ultimate Vocabulary Matching System
 *
 * This combines all our fuzzy matching techniques into one powerful system
 * that can handle any user input variation and match it to the right category.
 *
 * Teaching Moment: Why "Super Fuzzy"?
 * - Combines multiple algorithms (edit distance, phonetic, semantic, context)
 * - Learns from user corrections automatically
 * - Handles abbreviations, typos, slang, and regional variations
 * - Provides confidence scores and explanations
 * - Works with both built-in and custom categories
 */

import { TemptationCategory } from "./types";
import {
  AdvancedFuzzyEngine,
  AdvancedFuzzyMatch,
} from "./advanced-fuzzy-engine";
import {
  regionalPatterns,
  globalBrands,
  multilingualPatterns,
  culturalMarkers,
  type RegionalData,
} from "./regional-data";

// Enhanced result with detailed matching information
export interface SuperFuzzyResult {
  category: TemptationCategory | string;
  confidence: number; // Overall confidence 0-1
  explanation: string; // Human-readable explanation
  alternatives: Array<{
    category: TemptationCategory | string;
    confidence: number;
    reason: string;
  }>;
  matchDetails: {
    algorithm: string;
    matchedTerms: string[];
    userInput: string;
    processingSteps: string[];
  };
}

export class SuperFuzzyCategorizer {
  private advancedEngine: AdvancedFuzzyEngine;
  private vocabulary: Map<TemptationCategory | string, string[]> = new Map();
  private abbreviations: Map<string, string[]> = new Map();
  private learnedPatterns: Map<string, TemptationCategory | string> = new Map();

  constructor() {
    this.advancedEngine = new AdvancedFuzzyEngine();
    this.initializeVocabulary();
    this.initializeAbbreviations();
    this.loadLearnedPatterns();

    // Share our comprehensive vocabulary with the AdvancedFuzzyEngine
    // Teaching: This ensures both systems use the same regional data
    this.advancedEngine.setVocabulary(this.vocabulary);
  }

  /**
   * Initialize comprehensive vocabulary from multiple sources
   * Teaching: We build a massive vocabulary by combining all possible terms
   * users might type for each category, including thousands of regional dishes,
   * brands, and cultural variations from our regional-data.ts
   */
  private initializeVocabulary() {
    // Food & Dining - MASSIVE vocabulary from regional data
    this.initializeFoodVocabulary();

    // Coffee - enhanced with global coffee brands
    this.initializeCoffeeVocabulary();

    // Shopping - enhanced with global retail brands
    this.initializeShoppingVocabulary();

    // Electronics - enhanced with global tech brands
    this.initializeElectronicsVocabulary();

    // Initialize remaining categories with enhanced vocabularies
    this.initializeRemainingCategories();

    // Add multilingual support
    this.addMultilingualTerms();
  }

  /**
   * Initialize Food & Dining with comprehensive regional data
   * Teaching: This pulls in thousands of dishes from Asian, European, American,
   * Middle Eastern, African, and Latin American cuisines
   */
  private initializeFoodVocabulary() {
    const foodTerms: string[] = [
      // Basic terms
      "food",
      "eat",
      "meal",
      "hungry",
      "dinner",
      "lunch",
      "breakfast",
      "snack",
      "restaurant",
      "dining",
      "feast",
      "bite",
      "grub",
      "chow",
      "nosh",
      "cuisine",
      "takeout",
      "delivery",
      "dine out",
      "eat out",
      "order food",
      "grab food",
      "quick meal",
      "food craving",
      "restaurant visit",
      "food delivery",
    ];

    // Add ALL regional dishes from our comprehensive regional data
    Object.values(regionalPatterns.food_dining).forEach(
      (region: RegionalData) => {
        // Add dishes (thousands of them!)
        foodTerms.push(...region.dishes);
        // Add restaurant brands
        foodTerms.push(...region.brands);
        // Add keywords
        foodTerms.push(...region.keywords);
        // Add restaurant names
        foodTerms.push(...region.restaurants);
        // Add ingredients (for when people say "I want something with...")
        foodTerms.push(...region.ingredients);
      }
    );

    // Add global food brands
    foodTerms.push(...globalBrands.food);

    // Add multilingual food terms
    Object.values(multilingualPatterns.food).forEach(
      (translations: string[]) => {
        foodTerms.push(...translations);
      }
    );

    this.vocabulary.set(TemptationCategory.FOOD_DINING, [
      ...new Set(foodTerms),
    ]);
    console.log(
      `🍽️ Food vocabulary initialized with ${foodTerms.length} terms`
    );
  }

  /**
   * Initialize Coffee vocabulary with global coffee brands
   */
  private initializeCoffeeVocabulary() {
    const coffeeTerms = [
      // Basic coffee terms
      "coffee",
      "caffeine",
      "java",
      "joe",
      "cuppa",
      "brew",
      "espresso",
      "latte",
      "cappuccino",
      "americano",
      "macchiato",
      "mocha",
      "frappuccino",
      "cold brew",
      "iced coffee",
      "hot coffee",
      "coffee drink",
      "coffee shop",

      // Tea terms
      "tea",
      "chai",
      "green tea",
      "black tea",
      "herbal tea",
      "matcha",
      "bubble tea",
      "boba tea",
      "milk tea",
      "thai tea",
      "earl grey",

      // Coffee brands from global brands and regional data
      "starbucks",
      "dunkin",
      "dunkin donuts",
      "peets",
      "tim hortons",
      "dutch bros",
      "costa",
      "caribou",
      "blue bottle",
      "philz",
      "second cup",
      "gloria jeans",
      "the coffee bean",
      "pacific coffee",

      // Actions and context
      "grab coffee",
      "coffee run",
      "morning coffee",
      "coffee break",
      "need coffee",
      "coffee fix",
      "caffeine boost",
      "morning pick me up",
      "wake me up",
      "energy drink",
      "coffee date",
      "coffee meeting",
    ];

    this.vocabulary.set(TemptationCategory.COFFEE, [...new Set(coffeeTerms)]);
    console.log(
      `☕ Coffee vocabulary initialized with ${coffeeTerms.length} terms`
    );
  }

  /**
   * Initialize Shopping vocabulary with global retail brands
   */
  private initializeShoppingVocabulary() {
    const shoppingTerms = [
      // Basic shopping terms
      "shopping",
      "buy",
      "purchase",
      "shop",
      "store",
      "mall",
      "retail",
      "acquire",
      "get",
      "obtain",
      "browse",
      "window shopping",
      "online shopping",
      "website",
      "app",
      "marketplace",
      "outlet",
      "department store",

      // Sales and promotions
      "sale",
      "discount",
      "deal",
      "bargain",
      "clearance",
      "promotion",
      "markdown",
      "price drop",
      "special offer",
      "black friday",
      "cyber monday",

      // Shopping actions
      "impulse buy",
      "retail therapy",
      "shopping spree",
      "quick purchase",
      "browse online",
      "add to cart",
      "checkout",
      "wish list",
      "compare prices",

      // Global retail brands
      ...globalBrands.retail,

      // Additional major retailers
      "ebay",
      "etsy",
      "alibaba",
      "aliexpress",
      "wish",
      "overstock",
      "wayfair",
      "home depot",
      "lowes",
      "ikea",
      "bed bath beyond",
      "macys",
      "nordstrom",
      "saks",
      "bloomingdales",
      "kohls",
      "jcpenney",
    ];

    // Add multilingual shopping terms
    Object.values(multilingualPatterns.shopping).forEach(
      (translations: string[]) => {
        shoppingTerms.push(...translations);
      }
    );

    this.vocabulary.set(TemptationCategory.SHOPPING, [
      ...new Set(shoppingTerms),
    ]);
    console.log(
      `🛒 Shopping vocabulary initialized with ${shoppingTerms.length} terms`
    );
  }

  /**
   * Initialize Electronics vocabulary with global tech brands
   */
  private initializeElectronicsVocabulary() {
    const electronicsTerms = [
      // Devices
      "phone",
      "smartphone",
      "iphone",
      "android",
      "laptop",
      "computer",
      "tablet",
      "ipad",
      "macbook",
      "pc",
      "desktop",
      "monitor",
      "tv",
      "television",
      "smart tv",
      "headphones",
      "earbuds",
      "speaker",
      "smartwatch",
      "fitness tracker",
      "gaming console",
      "camera",
      "drone",
      "smart home",
      "alexa",
      "google home",
      "echo",

      // Tech brands
      ...globalBrands.brands,

      // Additional tech terms
      "upgrade",
      "new device",
      "tech purchase",
      "latest model",
      "tech upgrade",
      "new release",
      "pre order",
      "early adopter",
      "flagship",
      "premium",
      "pro model",
      "max",
      "plus",

      // Categories
      "electronics",
      "gadget",
      "device",
      "tech",
      "technology",
      "digital",
      "smart",
      "wireless",
      "bluetooth",
      "wifi",
      "gaming",
      "console",
      "accessories",
      "charger",
      "case",
    ];

    this.vocabulary.set(TemptationCategory.ELECTRONICS, [
      ...new Set(electronicsTerms),
    ]);
    console.log(
      `📱 Electronics vocabulary initialized with ${electronicsTerms.length} terms`
    );
  }

  /**
   * Add multilingual terms to all categories
   * Teaching: This allows the system to understand terms in multiple languages
   */
  private addMultilingualTerms() {
    // Add cultural context markers to help with regional disambiguation
    Object.entries(culturalMarkers).forEach(
      ([, markers]: [string, string[]]) => {
        // These help identify cultural context for better matching
        const existingFood =
          this.vocabulary.get(TemptationCategory.FOOD_DINING) || [];
        existingFood.push(...markers);
        this.vocabulary.set(TemptationCategory.FOOD_DINING, [
          ...new Set(existingFood),
        ]);
      }
    );

    console.log("🌍 Multilingual and cultural terms added to vocabulary");
  }

  /**
   * Initialize remaining categories with comprehensive vocabularies
   */
  private initializeRemainingCategories() {
    // Fitness & Sports
    this.vocabulary.set(TemptationCategory.SPORTS_FITNESS, [
      "gym",
      "workout",
      "exercise",
      "fitness",
      "training",
      "sports",
      "membership",
      "personal trainer",
      "yoga",
      "pilates",
      "crossfit",
      "running",
      "jogging",
      "cycling",
      "swimming",
      "weightlifting",
      "nike",
      "adidas",
      "under armour",
      "lululemon",
      "peloton",
      "planet fitness",
      "la fitness",
      "24 hour fitness",
    ]);

    // Travel
    this.vocabulary.set(TemptationCategory.TRAVEL, [
      "travel",
      "vacation",
      "trip",
      "holiday",
      "getaway",
      "tour",
      "flight",
      "airline",
      "hotel",
      "resort",
      "airbnb",
      "booking",
      "cruise",
      "road trip",
      "adventure",
      "explore",
      "destination",
      "expedia",
      "booking.com",
      "kayak",
      "priceline",
      "marriott",
      "hilton",
    ]);

    // Entertainment
    this.vocabulary.set(TemptationCategory.ENTERTAINMENT, [
      "movie",
      "cinema",
      "theater",
      "concert",
      "show",
      "performance",
      "ticket",
      "entertainment",
      "music",
      "comedy",
      "drama",
      "netflix",
      "disney plus",
      "hulu",
      "amazon prime",
      "spotify",
      "ticketmaster",
      "stubhub",
      "amc",
      "regal",
    ]);

    // Add other categories similarly...
  }

  /**
   * Initialize common abbreviations and their expansions
   * Teaching: Users often type abbreviations - we need to recognize them
   */
  private initializeAbbreviations() {
    // Food abbreviations
    this.abbreviations.set("mcds", ["mcdonalds"]);
    this.abbreviations.set("mcd", ["mcdonalds"]);
    this.abbreviations.set("bk", ["burger king"]);
    this.abbreviations.set("kfc", ["kentucky fried chicken"]);
    this.abbreviations.set("tbell", ["taco bell"]);
    this.abbreviations.set("sbux", ["starbucks"]);
    this.abbreviations.set("dd", ["dunkin donuts"]);

    // General abbreviations
    this.abbreviations.set("gym", ["fitness", "workout", "exercise"]);
    this.abbreviations.set("groc", ["grocery", "groceries"]);
    this.abbreviations.set("meds", ["medicine", "medication"]);
    this.abbreviations.set("doc", ["doctor"]);
    this.abbreviations.set("app", ["application", "software"]);

    // Shopping abbreviations
    this.abbreviations.set("amzn", ["amazon"]);
    this.abbreviations.set("tgt", ["target"]);
    this.abbreviations.set("wmt", ["walmart"]);

    // Tech abbreviations
    this.abbreviations.set("comp", ["computer"]);
    this.abbreviations.set("hw", ["hardware"]);
    this.abbreviations.set("sw", ["software"]);

    // Common text speak
    this.abbreviations.set("u", ["you"]);
    this.abbreviations.set("ur", ["your"]);
    this.abbreviations.set("n", ["and"]);
    this.abbreviations.set("w", ["with"]);
    this.abbreviations.set("thru", ["through"]);
    this.abbreviations.set("nite", ["night"]);
  }

  /**
   * Load previously learned patterns from user corrections
   */
  private loadLearnedPatterns() {
    if (typeof window === "undefined") return;

    try {
      const learned = localStorage.getItem("skipwise-learned-fuzzy-patterns");
      if (learned) {
        const patterns = JSON.parse(learned) as Record<string, string>;
        Object.entries(patterns).forEach(([input, category]) => {
          this.learnedPatterns.set(input.toLowerCase(), category);
        });
      }
    } catch (error) {
      console.warn("Failed to load learned patterns:", error);
    }
  }

  /**
   * Main categorization function - the heart of the super fuzzy system
   * Teaching: This orchestrates all our matching techniques in order of confidence
   */
  async categorize(userInput: string): Promise<SuperFuzzyResult> {
    const processingSteps: string[] = [];
    const originalInput = userInput.trim();

    processingSteps.push(`Starting categorization for: "${originalInput}"`);

    // Step 1: Check learned patterns first (highest confidence)
    const learnedMatch = this.checkLearnedPatterns(originalInput);
    if (learnedMatch) {
      processingSteps.push("Found exact match in learned patterns");
      return {
        category: learnedMatch,
        confidence: 0.98,
        explanation: `Previously learned that "${originalInput}" belongs to ${learnedMatch}`,
        alternatives: [],
        matchDetails: {
          algorithm: "learned_pattern",
          matchedTerms: [originalInput],
          userInput: originalInput,
          processingSteps,
        },
      };
    }

    // Step 2: Expand abbreviations
    const expandedInputs = this.expandAbbreviations(originalInput);
    processingSteps.push(`Expanded to: ${expandedInputs.join(", ")}`);

    // Step 3: Try exact matching on all variations
    for (const input of expandedInputs) {
      const exactMatch = this.findExactMatch(input);
      if (exactMatch) {
        processingSteps.push(`Found exact match: ${exactMatch.category}`);
        return {
          category: exactMatch.category,
          confidence: 0.95,
          explanation: `Exact match found for "${input}" in ${exactMatch.category}`,
          alternatives: [],
          matchDetails: {
            algorithm: "exact_match",
            matchedTerms: [exactMatch.matchedTerm],
            userInput: originalInput,
            processingSteps,
          },
        };
      }
    }

    // Step 4: Use advanced fuzzy engine for comprehensive matching
    processingSteps.push("Using advanced fuzzy matching algorithms");
    const fuzzyMatches = this.advancedEngine.match(originalInput, 5);

    if (fuzzyMatches.length > 0) {
      const bestMatch = fuzzyMatches[0];
      const alternatives = fuzzyMatches.slice(1, 4).map((match) => ({
        category: match.category,
        confidence: match.confidence,
        reason: match.explanation,
      }));

      processingSteps.push(
        `Best fuzzy match: ${
          bestMatch.category
        } (${bestMatch.confidence.toFixed(2)} confidence)`
      );

      return {
        category: bestMatch.category,
        confidence: bestMatch.confidence,
        explanation: bestMatch.explanation,
        alternatives,
        matchDetails: {
          algorithm: bestMatch.source,
          matchedTerms: bestMatch.matches.map((m) => m.matchedText),
          userInput: originalInput,
          processingSteps,
        },
      };
    }

    // Step 5: Contextual fallback
    processingSteps.push("Using contextual fallback");
    const contextualMatch = this.contextualFallback(originalInput);

    return {
      category: contextualMatch.category,
      confidence: contextualMatch.confidence,
      explanation: contextualMatch.explanation,
      alternatives: [],
      matchDetails: {
        algorithm: "contextual_fallback",
        matchedTerms: [],
        userInput: originalInput,
        processingSteps,
      },
    };
  }

  /**
   * Check if we've learned this pattern before
   */
  private checkLearnedPatterns(
    input: string
  ): TemptationCategory | string | null {
    return this.learnedPatterns.get(input.toLowerCase()) || null;
  }

  /**
   * Expand abbreviations to full terms
   */
  private expandAbbreviations(input: string): string[] {
    const variations = [input]; // Always include original
    const words = input.toLowerCase().split(/\s+/);

    // Check each word for abbreviations
    words.forEach((word, index) => {
      const expanded = this.abbreviations.get(word);
      if (expanded) {
        expanded.forEach((expansion) => {
          const newWords = [...words];
          newWords[index] = expansion;
          variations.push(newWords.join(" "));
        });
      }
    });

    return [...new Set(variations)]; // Remove duplicates
  }

  /**
   * Find exact matches in vocabulary
   */
  private findExactMatch(
    input: string
  ): { category: TemptationCategory | string; matchedTerm: string } | null {
    const lowerInput = input.toLowerCase();

    for (const [category, terms] of this.vocabulary.entries()) {
      for (const term of terms) {
        const lowerTerm = term.toLowerCase();

        // Perfect match
        if (lowerTerm === lowerInput) {
          return { category, matchedTerm: term };
        }

        // Substring match (both directions)
        if (lowerInput.includes(lowerTerm) || lowerTerm.includes(lowerInput)) {
          // Only accept if it's a significant match
          const minLength = Math.min(lowerInput.length, lowerTerm.length);
          const maxLength = Math.max(lowerInput.length, lowerTerm.length);

          if (minLength / maxLength >= 0.7) {
            // At least 70% overlap
            return { category, matchedTerm: term };
          }
        }
      }
    }

    return null;
  }

  /**
   * Contextual fallback when no good matches are found
   */
  private contextualFallback(input: string): {
    category: TemptationCategory;
    confidence: number;
    explanation: string;
  } {
    const lowerInput = input.toLowerCase();
    const hour = new Date().getHours();

    // Time-based context
    if (hour >= 6 && hour <= 10) {
      // Morning - likely coffee or breakfast
      if (lowerInput.includes("grab") || lowerInput.includes("quick")) {
        return {
          category: TemptationCategory.COFFEE,
          confidence: 0.4,
          explanation: "Morning time context suggests coffee",
        };
      }
    }

    // Amount-based context
    const hasSmallAmount = /\$([1-9]|[1-4]\d)(\.\d{2})?/.test(input);
    const hasLargeAmount = /\$([2-9]\d{2}|\d{4,})(\.\d{2})?/.test(input);

    if (hasSmallAmount && !hasLargeAmount) {
      return {
        category: TemptationCategory.FOOD_DINING,
        confidence: 0.3,
        explanation: "Small amount suggests food or coffee",
      };
    }

    if (hasLargeAmount) {
      return {
        category: TemptationCategory.SHOPPING,
        confidence: 0.3,
        explanation: "Large amount suggests shopping",
      };
    }

    // Default fallback
    return {
      category: TemptationCategory.OTHER,
      confidence: 0.1,
      explanation: "No clear category match found",
    };
  }

  /**
   * Learn from user corrections to improve future matching
   * Teaching: This is how the system gets smarter over time!
   */
  learnFromCorrection(
    userInput: string,
    correctCategory: TemptationCategory | string,
    _confidence: number = 0.9
  ) {
    // Store the learned pattern
    this.learnedPatterns.set(userInput.toLowerCase(), correctCategory);

    // Persist to localStorage
    if (typeof window !== "undefined") {
      try {
        const currentLearned = JSON.parse(
          localStorage.getItem("skipwise-learned-fuzzy-patterns") || "{}"
        ) as Record<string, string>;
        currentLearned[userInput.toLowerCase()] = correctCategory.toString();
        localStorage.setItem(
          "skipwise-learned-fuzzy-patterns",
          JSON.stringify(currentLearned)
        );
      } catch (error) {
        console.warn("Failed to save learned pattern:", error);
      }
    }

    // Also add to vocabulary for this category
    if (!this.vocabulary.has(correctCategory)) {
      this.vocabulary.set(correctCategory, []);
    }

    const categoryVocab = this.vocabulary.get(correctCategory)!;
    if (!categoryVocab.includes(userInput.toLowerCase())) {
      categoryVocab.push(userInput.toLowerCase());
    }

    // Learn potential abbreviations
    this.learnAbbreviations(userInput, correctCategory);

    console.log(`Learned: "${userInput}" → ${correctCategory}`);
  }

  /**
   * Learn abbreviation patterns from user corrections
   */
  private learnAbbreviations(
    userInput: string,
    category: TemptationCategory | string
  ) {
    const words = userInput.toLowerCase().split(/\s+/);
    const categoryTerms = this.vocabulary.get(category) || [];

    // Look for potential abbreviations (short words that don't match existing terms)
    words.forEach((word) => {
      if (word.length <= 5 && word.length >= 2) {
        const isKnownTerm = categoryTerms.some(
          (term) => term.includes(word) || word.includes(term)
        );

        if (!isKnownTerm) {
          // This might be an abbreviation
          if (!this.abbreviations.has(word)) {
            this.abbreviations.set(word, []);
          }

          const expansions = this.abbreviations.get(word)!;
          if (!expansions.includes(category.toString().toLowerCase())) {
            expansions.push(category.toString().toLowerCase());
          }
        }
      }
    });
  }

  /**
   * Get statistics about the fuzzy matching system
   */
  getStats(): {
    vocabularySize: number;
    learnedPatterns: number;
    abbreviations: number;
    categoriesSupported: number;
  } {
    let totalVocab = 0;
    this.vocabulary.forEach((terms) => (totalVocab += terms.length));

    return {
      vocabularySize: totalVocab,
      learnedPatterns: this.learnedPatterns.size,
      abbreviations: this.abbreviations.size,
      categoriesSupported: this.vocabulary.size,
    };
  }

  /**
   * Get detailed matching information for debugging
   */
  async debugMatch(userInput: string): Promise<{
    originalInput: string;
    expandedInputs: string[];
    exactMatches: Array<{ category: string; term: string }>;
    fuzzyMatches: AdvancedFuzzyMatch[];
    finalResult: SuperFuzzyResult;
  }> {
    const expandedInputs = this.expandAbbreviations(userInput);
    const exactMatches: Array<{ category: string; term: string }> = [];

    // Find all exact matches
    for (const input of expandedInputs) {
      const match = this.findExactMatch(input);
      if (match) {
        exactMatches.push({
          category: match.category.toString(),
          term: match.matchedTerm,
        });
      }
    }

    // Get fuzzy matches
    const fuzzyMatches = this.advancedEngine.match(userInput, 10);

    // Get final result
    const finalResult = await this.categorize(userInput);

    return {
      originalInput: userInput,
      expandedInputs,
      exactMatches,
      fuzzyMatches,
      finalResult,
    };
  }

  /**
   * Debug method to check if a term exists in vocabulary
   * Teaching: This helps us verify that our regional data integration is working
   */
  debugVocabulary(searchTerm: string): {
    found: boolean;
    categories: Array<{
      category: TemptationCategory | string;
      vocabularySize: number;
      containsTerm: boolean;
    }>;
  } {
    const results: Array<{
      category: TemptationCategory | string;
      vocabularySize: number;
      containsTerm: boolean;
    }> = [];

    let found = false;

    this.vocabulary.forEach((terms, category) => {
      const containsTerm = terms.some(
        (term) =>
          term.toLowerCase().includes(searchTerm.toLowerCase()) ||
          searchTerm.toLowerCase().includes(term.toLowerCase())
      );

      if (containsTerm) {
        found = true;
      }

      results.push({
        category,
        vocabularySize: terms.length,
        containsTerm,
      });
    });

    return { found, categories: results };
  }
}

// Export singleton instance
export const superFuzzyCategorizer = new SuperFuzzyCategorizer();
