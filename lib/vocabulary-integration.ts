/**
 * Vocabulary Integration System for Advanced Fuzzy Engine
 *
 * This module extracts vocabulary from existing categorization systems
 * and feeds it into our advanced fuzzy matching engine.
 *
 * Teaching Moment: Why separate vocabulary integration?
 * - Keeps the fuzzy engine generic and reusable
 * - Allows us to easily add/remove vocabulary sources
 * - Makes it easy to update vocabulary without changing matching logic
 * - Enables vocabulary versioning and A/B testing
 */

import { TemptationCategory } from "./types";
import { settings } from "./settings";
import { AdvancedFuzzyEngine } from "./advanced-fuzzy-engine";
import { enhancedCategoryPatterns } from "./enhanced-ai-categorization";
import { categoryPatterns } from "./ai-categorization";
import { regionalPatterns, globalBrands } from "./regional-data";

export interface VocabularySource {
  name: string;
  priority: number; // Higher priority = more important for matching
  terms: Map<TemptationCategory | string, VocabularyTerm[]>;
}

export interface VocabularyTerm {
  term: string;
  variations: string[]; // Alternative spellings, abbreviations
  weight: number; // Importance of this term (0-1)
  source: string; // Where this term came from
  context?: string[]; // Context clues that boost this term
  region?: string; // Geographic region if applicable
}

export class VocabularyIntegrator {
  private sources: VocabularySource[] = [];
  private consolidatedVocabulary: Map<
    TemptationCategory | string,
    VocabularyTerm[]
  > = new Map();

  constructor() {
    this.initializeSources();
    this.consolidateVocabulary();
  }

  /**
   * Initialize all vocabulary sources
   * Teaching: We extract terms from multiple existing systems to create
   * a comprehensive vocabulary that covers all possible user inputs
   */
  private initializeSources() {
    // Source 1: Enhanced category patterns (highest priority)
    this.sources.push(this.extractFromEnhancedPatterns());

    // Source 2: Basic category patterns
    this.sources.push(this.extractFromBasicPatterns());

    // Source 3: Regional patterns
    this.sources.push(this.extractFromRegionalPatterns());

    // Source 4: Global brands
    this.sources.push(this.extractFromGlobalBrands());

    // Source 5: Custom user categories
    this.sources.push(this.extractFromCustomCategories());

    // Source 6: User-learned terms (from corrections)
    this.sources.push(this.extractFromUserLearning());
  }

  /**
   * Extract vocabulary from enhanced category patterns
   */
  private extractFromEnhancedPatterns(): VocabularySource {
    const terms = new Map<TemptationCategory | string, VocabularyTerm[]>();

    Object.entries(enhancedCategoryPatterns).forEach(([category, pattern]) => {
      const categoryTerms: VocabularyTerm[] = [];

      // Primary keywords (highest weight)
      pattern.primary.forEach((term) => {
        categoryTerms.push({
          term: term.toLowerCase(),
          variations: this.generateVariations(term),
          weight: 1.0,
          source: "enhanced_primary",
          context: pattern.phrases || [],
        });
      });

      // Secondary keywords (medium weight)
      pattern.secondary.forEach((term) => {
        categoryTerms.push({
          term: term.toLowerCase(),
          variations: this.generateVariations(term),
          weight: 0.8,
          source: "enhanced_secondary",
        });
      });

      // Brand names (high weight, very specific)
      pattern.brands.forEach((brand) => {
        categoryTerms.push({
          term: brand.toLowerCase(),
          variations: this.generateBrandVariations(brand),
          weight: 0.95,
          source: "enhanced_brand",
        });
      });

      // Action phrases (medium weight)
      pattern.actions.forEach((action) => {
        categoryTerms.push({
          term: action.toLowerCase(),
          variations: [action.toLowerCase()],
          weight: 0.7,
          source: "enhanced_action",
          context: [action.toLowerCase()],
        });
      });

      // Synonyms (medium weight)
      if (pattern.synonyms) {
        pattern.synonyms.forEach((synonym) => {
          categoryTerms.push({
            term: synonym.toLowerCase(),
            variations: this.generateVariations(synonym),
            weight: 0.75,
            source: "enhanced_synonym",
          });
        });
      }

      // Phrases (lower weight, more contextual)
      if (pattern.phrases) {
        pattern.phrases.forEach((phrase) => {
          categoryTerms.push({
            term: phrase.toLowerCase(),
            variations: [phrase.toLowerCase()],
            weight: 0.6,
            source: "enhanced_phrase",
            context: [phrase.toLowerCase()],
          });
        });
      }

      // Regional terms (location-specific)
      if (pattern.regional) {
        Object.entries(pattern.regional).forEach(([region, regionalData]) => {
          // Regional dishes
          regionalData.dishes?.forEach((dish) => {
            categoryTerms.push({
              term: dish.toLowerCase(),
              variations: this.generateVariations(dish),
              weight: 0.9,
              source: "enhanced_regional_dish",
              region,
            });
          });

          // Regional brands
          regionalData.brands?.forEach((brand) => {
            categoryTerms.push({
              term: brand.toLowerCase(),
              variations: this.generateBrandVariations(brand),
              weight: 0.85,
              source: "enhanced_regional_brand",
              region,
            });
          });

          // Regional keywords
          regionalData.keywords?.forEach((keyword) => {
            categoryTerms.push({
              term: keyword.toLowerCase(),
              variations: this.generateVariations(keyword),
              weight: 0.8,
              source: "enhanced_regional_keyword",
              region,
            });
          });
        });
      }

      terms.set(category as TemptationCategory, categoryTerms);
    });

    return {
      name: "enhanced_patterns",
      priority: 10, // Highest priority
      terms,
    };
  }

  /**
   * Extract vocabulary from basic category patterns
   */
  private extractFromBasicPatterns(): VocabularySource {
    const terms = new Map<TemptationCategory | string, VocabularyTerm[]>();

    Object.entries(categoryPatterns).forEach(([category, pattern]) => {
      const categoryTerms: VocabularyTerm[] = [];

      // Extract all term types from basic patterns
      const termTypes = [
        { terms: pattern.primary, weight: 0.9, source: "basic_primary" },
        { terms: pattern.secondary, weight: 0.7, source: "basic_secondary" },
        { terms: pattern.brands, weight: 0.85, source: "basic_brand" },
        { terms: pattern.actions, weight: 0.65, source: "basic_action" },
        { terms: pattern.synonyms || [], weight: 0.7, source: "basic_synonym" },
        { terms: pattern.phrases || [], weight: 0.55, source: "basic_phrase" },
      ];

      termTypes.forEach(({ terms: termList, weight, source }) => {
        termList.forEach((term) => {
          categoryTerms.push({
            term: term.toLowerCase(),
            variations: source.includes("brand")
              ? this.generateBrandVariations(term)
              : this.generateVariations(term),
            weight,
            source,
          });
        });
      });

      terms.set(category as TemptationCategory, categoryTerms);
    });

    return {
      name: "basic_patterns",
      priority: 8,
      terms,
    };
  }

  /**
   * Extract vocabulary from regional patterns
   */
  private extractFromRegionalPatterns(): VocabularySource {
    const terms = new Map<TemptationCategory | string, VocabularyTerm[]>();

    Object.entries(regionalPatterns).forEach(([region, patterns]) => {
      Object.entries(patterns).forEach(([category, regionalData]) => {
        if (!terms.has(category as TemptationCategory)) {
          terms.set(category as TemptationCategory, []);
        }

        const categoryTerms = terms.get(category as TemptationCategory)!;

        // Regional dishes
        regionalData.dishes?.forEach((dish) => {
          categoryTerms.push({
            term: dish.toLowerCase(),
            variations: this.generateVariations(dish),
            weight: 0.8,
            source: "regional_dish",
            region,
          });
        });

        // Regional brands
        regionalData.brands?.forEach((brand) => {
          categoryTerms.push({
            term: brand.toLowerCase(),
            variations: this.generateBrandVariations(brand),
            weight: 0.75,
            source: "regional_brand",
            region,
          });
        });

        // Regional keywords
        regionalData.keywords?.forEach((keyword) => {
          categoryTerms.push({
            term: keyword.toLowerCase(),
            variations: this.generateVariations(keyword),
            weight: 0.7,
            source: "regional_keyword",
            region,
          });
        });
      });
    });

    return {
      name: "regional_patterns",
      priority: 7,
      terms,
    };
  }

  /**
   * Extract vocabulary from global brands
   */
  private extractFromGlobalBrands(): VocabularySource {
    const terms = new Map<TemptationCategory | string, VocabularyTerm[]>();

    Object.entries(globalBrands).forEach(([category, brands]) => {
      const categoryTerms: VocabularyTerm[] = [];

      brands.forEach((brand) => {
        categoryTerms.push({
          term: brand.toLowerCase(),
          variations: this.generateBrandVariations(brand),
          weight: 0.8,
          source: "global_brand",
        });
      });

      // Map category names to TemptationCategory enum
      const mappedCategory = this.mapCategoryName(category);
      if (mappedCategory) {
        terms.set(mappedCategory, categoryTerms);
      }
    });

    return {
      name: "global_brands",
      priority: 6,
      terms,
    };
  }

  /**
   * Extract vocabulary from custom user categories
   */
  private extractFromCustomCategories(): VocabularySource {
    const terms = new Map<TemptationCategory | string, VocabularyTerm[]>();
    const customCategories = settings.getCustomCategories();

    customCategories.forEach((customCategory) => {
      const categoryTerms: VocabularyTerm[] = [];

      // Add the category name itself as a term
      categoryTerms.push({
        term: customCategory.name.toLowerCase(),
        variations: this.generateVariations(customCategory.name),
        weight: 0.9,
        source: "custom_category",
      });

      // If the category has associated keywords (stored in settings)
      const keywords =
        (settings.get(
          `customCategoryKeywords_${customCategory.name}`
        ) as string[]) || [];
      keywords.forEach((keyword) => {
        categoryTerms.push({
          term: keyword.toLowerCase(),
          variations: this.generateVariations(keyword),
          weight: 0.8,
          source: "custom_keyword",
        });
      });

      terms.set(customCategory.name, categoryTerms);
    });

    return {
      name: "custom_categories",
      priority: 9, // High priority for user-defined categories
      terms,
    };
  }

  /**
   * Extract vocabulary from user learning (corrections and additions)
   */
  private extractFromUserLearning(): VocabularySource {
    const terms = new Map<TemptationCategory | string, VocabularyTerm[]>();

    // Get learned terms from settings
    const learnedTerms =
      (settings.get("learnedVocabulary") as Record<string, string[]>) || {};

    Object.entries(learnedTerms).forEach(([category, termList]) => {
      const categoryTerms: VocabularyTerm[] = [];

      termList.forEach((term) => {
        categoryTerms.push({
          term: term.toLowerCase(),
          variations: this.generateVariations(term),
          weight: 0.95, // High weight for user-confirmed terms
          source: "user_learned",
        });
      });

      terms.set(category, categoryTerms);
    });

    return {
      name: "user_learning",
      priority: 11, // Highest priority - user knows best!
      terms,
    };
  }

  /**
   * Generate spelling and abbreviation variations for a term
   * Teaching: Users type in many different ways - we need to anticipate
   * common variations, typos, and abbreviations
   */
  private generateVariations(term: string): string[] {
    const variations: string[] = [term.toLowerCase()];
    const cleanTerm = term.toLowerCase();

    // Common abbreviation patterns
    if (cleanTerm.length > 4) {
      // First few letters
      variations.push(cleanTerm.substring(0, 3));
      variations.push(cleanTerm.substring(0, 4));

      // Remove vowels (common texting abbreviation)
      const noVowels = cleanTerm.replace(/[aeiou]/g, "");
      if (noVowels.length >= 2 && noVowels !== cleanTerm) {
        variations.push(noVowels);
      }
    }

    // Common spelling variations
    const spellingVariations = [
      // Double letters
      cleanTerm.replace(/([bcdfghjklmnpqrstvwxyz])\1/g, "$1"),
      // Add double letters to common positions
      cleanTerm.replace(/([bcdfghjklmnpqrstvwxyz])/g, "$1$1"),
      // Common letter substitutions
      cleanTerm.replace(/ph/g, "f"),
      cleanTerm.replace(/ck/g, "k"),
      cleanTerm.replace(/qu/g, "kw"),
      cleanTerm.replace(/x/g, "ks"),
      // Ending variations
      cleanTerm.replace(/ies$/, "y"),
      cleanTerm.replace(/s$/, ""),
      cleanTerm + "s",
    ];

    // Filter out invalid variations and add unique ones
    spellingVariations.forEach((variation) => {
      if (variation.length >= 2 && !variations.includes(variation)) {
        variations.push(variation);
      }
    });

    return variations;
  }

  /**
   * Generate brand-specific variations (often have unique abbreviation patterns)
   */
  private generateBrandVariations(brand: string): string[] {
    const variations = this.generateVariations(brand);
    const cleanBrand = brand.toLowerCase();

    // Brand-specific patterns
    const brandPatterns = {
      mcdonalds: ["mcds", "mcd", "micky ds", "golden arches"],
      starbucks: ["sbux", "bucks", "starbs"],
      "dunkin donuts": ["dunkin", "dd", "dunkies"],
      "burger king": ["bk", "burger k"],
      "taco bell": ["tbell", "tb", "taco b"],
      "kentucky fried chicken": ["kfc"],
      "pizza hut": ["ph", "hut"],
      dominos: ["doms"],
      subway: ["subs"],
      chipotle: ["chip", "chipotle mexican grill"],
      wendys: ["wendies"],
      "olive garden": ["og", "olive g"],
      "tim hortons": ["tims", "timmy ho", "timmy hos"],
      "papa johns": ["pj", "papa j"],
      "dairy queen": ["dq"],
      "in-n-out": ["innout", "in n out"],
      "jack in the box": ["jack in box", "jitb"],
      "white castle": ["wc"],
      sonic: ["sonic drive in"],
      arbys: ["arbies"],
      popeyes: ["popeye"],
      panera: ["panera bread"],
      "panda express": ["panda"],
      qdoba: ["q doba"],
      "five guys": ["5 guys"],
      "shake shack": ["shake"],
      whataburger: ["whata"],
      culvers: ["culver"],
      zaxbys: ["zax"],
      "raising canes": ["canes"],
      bojangles: ["bo"],
      hardees: ["hardee"],
      "carls jr": ["carls", "carl jr"],
      "del taco": ["del"],
      "el pollo loco": ["el pollo"],
      amazon: ["amzn", "amz"],
      walmart: ["wmt", "wally world"],
      target: ["tgt"],
      costco: ["cost"],
      "best buy": ["bb"],
      "home depot": ["hd"],
      lowes: ["lowe"],
      macys: ["macy"],
      nordstrom: ["nord"],
      apple: ["aapl"],
      microsoft: ["msft", "ms"],
      google: ["googl", "goog"],
      facebook: ["fb", "meta"],
      netflix: ["nflx"],
      spotify: ["spot"],
      adobe: ["adbe"],
    };

    const knownVariations = brandPatterns[cleanBrand];
    if (knownVariations) {
      variations.push(...knownVariations);
    }

    return [...new Set(variations)];
  }

  /**
   * Map category names from different sources to TemptationCategory enum
   */
  private mapCategoryName(
    categoryName: string
  ): TemptationCategory | string | null {
    const mappings: Record<string, TemptationCategory> = {
      food: TemptationCategory.FOOD_DINING,
      coffee: TemptationCategory.COFFEE,
      shopping: TemptationCategory.SHOPPING,
      clothes: TemptationCategory.CLOTHES,
      electronics: TemptationCategory.ELECTRONICS,
      entertainment: TemptationCategory.ENTERTAINMENT,
      books: TemptationCategory.BOOKS_EDUCATION,
      education: TemptationCategory.BOOKS_EDUCATION,
      beauty: TemptationCategory.BEAUTY_WELLNESS,
      wellness: TemptationCategory.BEAUTY_WELLNESS,
      home: TemptationCategory.HOME_GARDEN,
      garden: TemptationCategory.HOME_GARDEN,
      sports: TemptationCategory.SPORTS_FITNESS,
      fitness: TemptationCategory.SPORTS_FITNESS,
      travel: TemptationCategory.TRAVEL,
      transportation: TemptationCategory.TRANSPORTATION,
      subscriptions: TemptationCategory.SUBSCRIPTIONS,
      gifts: TemptationCategory.GIFTS_CHARITY,
      charity: TemptationCategory.GIFTS_CHARITY,
      health: TemptationCategory.HEALTH_MEDICAL,
      medical: TemptationCategory.HEALTH_MEDICAL,
      hobbies: TemptationCategory.HOBBIES_CRAFTS,
      crafts: TemptationCategory.HOBBIES_CRAFTS,
      alcohol: TemptationCategory.ALCOHOL_TOBACCO,
      tobacco: TemptationCategory.ALCOHOL_TOBACCO,
      gaming: TemptationCategory.GAMING,
    };

    return mappings[categoryName.toLowerCase()] || categoryName;
  }

  /**
   * Consolidate all vocabulary sources into a single, optimized vocabulary
   * Teaching: We merge vocabularies intelligently, handling conflicts and
   * optimizing for search performance
   */
  private consolidateVocabulary() {
    // Sort sources by priority (highest first)
    this.sources.sort((a, b) => b.priority - a.priority);

    // Merge terms, with higher priority sources taking precedence
    const termsByCategory = new Map<
      TemptationCategory | string,
      Map<string, VocabularyTerm>
    >();

    this.sources.forEach((source) => {
      source.terms.forEach((terms, category) => {
        if (!termsByCategory.has(category)) {
          termsByCategory.set(category, new Map());
        }

        const categoryTerms = termsByCategory.get(category)!;

        terms.forEach((term) => {
          const existingTerm = categoryTerms.get(term.term);

          if (
            !existingTerm ||
            source.priority > this.getPriorityForSource(existingTerm.source)
          ) {
            // New term or higher priority source
            categoryTerms.set(term.term, {
              ...term,
              variations: [
                ...new Set([
                  ...term.variations,
                  ...(existingTerm?.variations || []),
                ]),
              ], // Merge variations
            });
          } else if (
            source.priority === this.getPriorityForSource(existingTerm.source)
          ) {
            // Same priority - merge information
            categoryTerms.set(term.term, {
              ...existingTerm,
              weight: Math.max(existingTerm.weight, term.weight),
              variations: [
                ...new Set([...existingTerm.variations, ...term.variations]),
              ],
              context: [
                ...new Set([
                  ...(existingTerm.context || []),
                  ...(term.context || []),
                ]),
              ],
            });
          }
        });
      });
    });

    // Convert to final format
    termsByCategory.forEach((terms, category) => {
      this.consolidatedVocabulary.set(category, Array.from(terms.values()));
    });
  }

  /**
   * Get priority for a source name
   */
  private getPriorityForSource(sourceName: string): number {
    const source = this.sources.find(
      (s) =>
        s.name === sourceName ||
        s.terms.values().next().value?.[0]?.source === sourceName
    );
    return source?.priority || 0;
  }

  /**
   * Get the consolidated vocabulary for use by the fuzzy engine
   */
  getConsolidatedVocabulary(): Map<
    TemptationCategory | string,
    VocabularyTerm[]
  > {
    return this.consolidatedVocabulary;
  }

  /**
   * Get vocabulary statistics for debugging/monitoring
   */
  getVocabularyStats(): {
    totalCategories: number;
    totalTerms: number;
    totalVariations: number;
    sourceBreakdown: Record<string, number>;
    categoryBreakdown: Record<string, number>;
  } {
    let totalTerms = 0;
    let totalVariations = 0;
    const sourceBreakdown: Record<string, number> = {};
    const categoryBreakdown: Record<string, number> = {};

    this.consolidatedVocabulary.forEach((terms, category) => {
      categoryBreakdown[category.toString()] = terms.length;
      totalTerms += terms.length;

      terms.forEach((term) => {
        totalVariations += term.variations.length;
        sourceBreakdown[term.source] = (sourceBreakdown[term.source] || 0) + 1;
      });
    });

    return {
      totalCategories: this.consolidatedVocabulary.size,
      totalTerms,
      totalVariations,
      sourceBreakdown,
      categoryBreakdown,
    };
  }

  /**
   * Add learned vocabulary from user corrections
   */
  addLearnedTerm(
    term: string,
    category: TemptationCategory | string,
    confidence: number = 0.8
  ) {
    // Add to learned vocabulary in settings
    const learnedVocabulary =
      (settings.get("learnedVocabulary") as Record<string, string[]>) || {};

    if (!learnedVocabulary[category.toString()]) {
      learnedVocabulary[category.toString()] = [];
    }

    if (!learnedVocabulary[category.toString()].includes(term.toLowerCase())) {
      learnedVocabulary[category.toString()].push(term.toLowerCase());
      settings.set("learnedVocabulary", learnedVocabulary);

      // Re-consolidate vocabulary to include new term
      this.initializeSources();
      this.consolidateVocabulary();
    }
  }
}

// Export singleton instance
export const vocabularyIntegrator = new VocabularyIntegrator();
