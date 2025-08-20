/**
 * Advanced Fuzzy Matching Engine for SkipWise
 *
 * This engine combines multiple fuzzy matching techniques to handle:
 * - Typos and spelling variations
 * - Phonetic similarities (sound-alike words)
 * - Abbreviations and acronyms
 * - Semantic similarities
 * - Multi-language variations
 * - Context-aware matching
 *
 * Teaching Moment: Why multiple algorithms?
 * Different users make different types of "mistakes":
 * 1. Typos: "cofee" → "coffee" (edit distance works best)
 * 2. Sound-alike: "nite" → "night" (phonetic matching)
 * 3. Abbreviations: "mcds" → "mcdonalds" (pattern recognition)
 * 4. Context: "grab something" → could be food/coffee based on other words
 */

import { TemptationCategory } from "./types";
// import { settings } from "./settings"; // Not used currently

// Enhanced match result with detailed scoring breakdown
export interface AdvancedFuzzyMatch {
  category: TemptationCategory | string;
  confidence: number; // Overall confidence 0-1
  score: number; // Raw matching score
  matches: MatchDetail[];
  source:
    | "exact"
    | "fuzzy"
    | "phonetic"
    | "semantic"
    | "abbreviation"
    | "context";
  explanation: string; // Human-readable explanation of why this matched
}

export interface MatchDetail {
  algorithm: string; // Which algorithm found this match
  matchedText: string; // What text was matched
  originalText: string; // Original vocabulary term
  score: number; // Algorithm-specific score
  confidence: number; // How confident this algorithm is
}

// Phonetic encoding algorithms for sound-alike matching
class PhoneticMatcher {
  /**
   * Soundex algorithm - groups words that sound similar
   * Teaching: Soundex converts words to a code based on pronunciation
   * Example: "Smith" and "Smyth" both become "S530"
   */
  private soundex(word: string): string {
    if (!word) return "";

    word = word.toUpperCase();
    let code = word[0]; // Keep first letter

    // Soundex mapping - similar sounds get same number
    const mapping: { [key: string]: string } = {
      B: "1",
      F: "1",
      P: "1",
      V: "1",
      C: "2",
      G: "2",
      J: "2",
      K: "2",
      Q: "2",
      S: "2",
      X: "2",
      Z: "2",
      D: "3",
      T: "3",
      L: "4",
      M: "5",
      N: "5",
      R: "6",
    };

    for (let i = 1; i < word.length; i++) {
      const char = word[i];
      const mapped = mapping[char] || "0";

      // Don't repeat same sound codes
      if (mapped !== "0" && mapped !== code[code.length - 1]) {
        code += mapped;
      }
    }

    // Pad to 4 characters or truncate
    return (code + "0000").substring(0, 4);
  }

  /**
   * Double Metaphone - more sophisticated phonetic matching
   * Teaching: Better than Soundex, handles more language variations
   */
  private doubleMetaphone(word: string): string[] {
    // Simplified implementation - in production you'd use a full library
    const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");

    // Handle common phonetic patterns
    let primary = cleaned;
    let secondary = cleaned;

    // Common substitutions that sound the same
    const patterns = [
      { from: /ph/g, to: "f" },
      { from: /gh/g, to: "f" },
      { from: /ck/g, to: "k" },
      { from: /qu/g, to: "kw" },
      { from: /x/g, to: "ks" },
      { from: /z/g, to: "s" },
      { from: /c([ei])/g, to: "s$1" }, // ce, ci → se, si
      { from: /c/g, to: "k" }, // other c → k
    ];

    patterns.forEach((pattern) => {
      primary = primary.replace(pattern.from, pattern.to);
      secondary = secondary.replace(pattern.from, pattern.to);
    });

    return [primary, secondary];
  }

  /**
   * Check if two words sound similar using phonetic matching
   */
  areSimilar(
    word1: string,
    word2: string
  ): { similar: boolean; confidence: number } {
    const soundex1 = this.soundex(word1);
    const soundex2 = this.soundex(word2);

    const metaphone1 = this.doubleMetaphone(word1);
    const metaphone2 = this.doubleMetaphone(word2);

    // Check Soundex match
    const soundexMatch = soundex1 === soundex2;

    // Check Metaphone match
    const metaphoneMatch = metaphone1.some((m1) =>
      metaphone2.some((m2) => m1 === m2)
    );

    if (soundexMatch && metaphoneMatch) {
      return { similar: true, confidence: 0.9 };
    } else if (soundexMatch || metaphoneMatch) {
      return { similar: true, confidence: 0.7 };
    }

    return { similar: false, confidence: 0 };
  }
}

// Abbreviation and acronym expansion
class AbbreviationExpander {
  private abbreviations: Map<string, string[]> = new Map();

  constructor() {
    this.initializeAbbreviations();
  }

  /**
   * Initialize common abbreviations and their expansions
   * Teaching: We pre-populate known abbreviations but also learn new ones
   */
  private initializeAbbreviations() {
    const commonAbbreviations = {
      // Fast food
      mcds: ["mcdonalds", "mcdonald"],
      kfc: ["kentucky fried chicken"],
      bk: ["burger king"],
      tbell: ["taco bell"],
      sbux: ["starbucks"],
      dunkin: ["dunkin donuts"],

      // General categories
      groc: ["grocery", "groceries"],
      groceries: ["grocery"],
      gym: ["fitness", "exercise", "workout"],
      meds: ["medicine", "medication"],
      doc: ["doctor"],
      appt: ["appointment"],
      rx: ["prescription"],

      // Tech
      app: ["application"],
      sw: ["software"],
      hw: ["hardware"],
      comp: ["computer"],
      phone: ["smartphone", "mobile"],

      // Shopping
      amzn: ["amazon"],
      tgt: ["target"],
      wmt: ["walmart"],
      costco: ["wholesale"],

      // Common words
      n: ["and"],
      w: ["with"],
      u: ["you"],
      ur: ["your", "you are"],
      thru: ["through"],
      nite: ["night"],
      lite: ["light"],
    };

    Object.entries(commonAbbreviations).forEach(([abbr, expansions]) => {
      this.abbreviations.set(abbr.toLowerCase(), expansions);
    });
  }

  /**
   * Expand abbreviations in text
   */
  expandText(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/);
    const expansions: string[] = [text]; // Always include original

    // Try expanding each word
    words.forEach((word, index) => {
      const cleanWord = word.replace(/[^\w]/g, "");
      const expanded = this.abbreviations.get(cleanWord);

      if (expanded) {
        expanded.forEach((expansion) => {
          const newWords = [...words];
          newWords[index] = expansion;
          expansions.push(newWords.join(" "));
        });
      }
    });

    return [...new Set(expansions)]; // Remove duplicates
  }

  /**
   * Learn new abbreviation from user behavior
   * Teaching: This makes the system smarter over time
   */
  learnAbbreviation(abbreviation: string, expansion: string) {
    const abbr = abbreviation.toLowerCase();
    const existing = this.abbreviations.get(abbr) || [];

    if (!existing.includes(expansion.toLowerCase())) {
      existing.push(expansion.toLowerCase());
      this.abbreviations.set(abbr, existing);

      // Persist to settings for future sessions
      this.saveToSettings();
    }
  }

  private saveToSettings() {
    // TODO: Implement abbreviation persistence when SettingsManager supports generic storage
    // For now, abbreviations are only stored in memory during the session
    console.log("Abbreviation learning saved to memory (session only)");
  }

  private loadFromSettings() {
    // TODO: Load abbreviations from persistent storage when SettingsManager supports it
    // For now, abbreviations are loaded fresh each session
  }
}

// Semantic similarity using simple word embedding approximation
class SemanticMatcher {
  private wordVectors: Map<string, number[]> = new Map();

  constructor() {
    this.initializeWordVectors();
  }

  /**
   * Initialize semantic word vectors (simplified)
   * Teaching: In a full implementation, you'd use pre-trained embeddings
   * like Word2Vec or GloVe. Here we use simple categorical groupings.
   */
  private initializeWordVectors() {
    // Simplified semantic categories - each word gets a vector
    // representing its semantic features
    const semanticGroups = {
      food: [
        "eat",
        "meal",
        "hungry",
        "taste",
        "flavor",
        "delicious",
        "restaurant",
        "kitchen",
        "cook",
      ],
      drink: [
        "coffee",
        "tea",
        "beverage",
        "liquid",
        "thirsty",
        "sip",
        "cup",
        "mug",
      ],
      shopping: [
        "buy",
        "purchase",
        "store",
        "mall",
        "retail",
        "spend",
        "money",
        "cart",
      ],
      fitness: [
        "exercise",
        "workout",
        "gym",
        "health",
        "strong",
        "muscle",
        "run",
        "lift",
      ],
      technology: [
        "computer",
        "software",
        "digital",
        "online",
        "internet",
        "app",
        "tech",
      ],
      entertainment: [
        "fun",
        "enjoy",
        "watch",
        "play",
        "movie",
        "game",
        "music",
        "show",
      ],
      travel: [
        "trip",
        "journey",
        "vacation",
        "flight",
        "hotel",
        "destination",
        "explore",
      ],
      home: [
        "house",
        "furniture",
        "decor",
        "clean",
        "organize",
        "room",
        "space",
      ],
    };

    // Create simple binary vectors for each word
    const allCategories = Object.keys(semanticGroups);

    Object.entries(semanticGroups).forEach(([category, words]) => {
      words.forEach((word) => {
        // Create a vector where this category is 1, others are 0
        const vector = allCategories.map((cat) => (cat === category ? 1 : 0));
        this.wordVectors.set(word.toLowerCase(), vector);
      });
    });
  }

  /**
   * Calculate semantic similarity between two words
   */
  getSimilarity(word1: string, word2: string): number {
    const vec1 = this.wordVectors.get(word1.toLowerCase());
    const vec2 = this.wordVectors.get(word2.toLowerCase());

    if (!vec1 || !vec2) return 0;

    // Calculate cosine similarity
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }

    const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  }

  /**
   * Find semantically similar words in vocabulary
   */
  findSimilarWords(
    word: string,
    vocabulary: string[],
    threshold: number = 0.5
  ): Array<{ word: string; similarity: number }> {
    return vocabulary
      .map((vocabWord) => ({
        word: vocabWord,
        similarity: this.getSimilarity(word, vocabWord),
      }))
      .filter((result) => result.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity);
  }
}

// Context-aware matching
class ContextMatcher {
  /**
   * Analyze context to boost certain category matches
   * Teaching: Context matters! "grab" could mean many things, but "grab coffee"
   * is clearly about coffee, while "grab dinner" is about food.
   */
  analyzeContext(text: string): Map<TemptationCategory, number> {
    const contextBoosts = new Map<TemptationCategory, number>();
    const lowerText = text.toLowerCase();

    // Time-based context
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 10) {
      // Morning - boost coffee and breakfast
      contextBoosts.set(TemptationCategory.COFFEE, 0.3);
      contextBoosts.set(TemptationCategory.FOOD_DINING, 0.2);
    } else if (hour >= 11 && hour <= 14) {
      // Lunch time - boost food
      contextBoosts.set(TemptationCategory.FOOD_DINING, 0.3);
    } else if (hour >= 17 && hour <= 21) {
      // Dinner time - boost food and alcohol
      contextBoosts.set(TemptationCategory.FOOD_DINING, 0.3);
      contextBoosts.set(TemptationCategory.ALCOHOL_TOBACCO, 0.1);
    }

    // Action context patterns
    const actionPatterns = [
      {
        pattern: /\b(grab|get|buy)\b.*\b(coffee|latte|cappuccino)\b/,
        category: TemptationCategory.COFFEE,
        boost: 0.4,
      },
      {
        pattern: /\b(order|get)\b.*\b(food|dinner|lunch|meal)\b/,
        category: TemptationCategory.FOOD_DINING,
        boost: 0.4,
      },
      {
        pattern: /\b(need|want)\b.*\b(new|buy)\b/,
        category: TemptationCategory.SHOPPING,
        boost: 0.2,
      },
      {
        pattern: /\b(gym|workout|exercise)\b/,
        category: TemptationCategory.SPORTS_FITNESS,
        boost: 0.3,
      },
      {
        pattern: /\b(book|read|learn)\b/,
        category: TemptationCategory.BOOKS_EDUCATION,
        boost: 0.3,
      },
    ];

    actionPatterns.forEach(({ pattern, category, boost }) => {
      if (pattern.test(lowerText)) {
        const existing = contextBoosts.get(category) || 0;
        contextBoosts.set(category, existing + boost);
      }
    });

    // Location context (if available)
    // This could be enhanced with actual location data
    if (lowerText.includes("mall") || lowerText.includes("store")) {
      contextBoosts.set(TemptationCategory.SHOPPING, 0.2);
      contextBoosts.set(TemptationCategory.CLOTHES, 0.2);
    }

    return contextBoosts;
  }
}

// Main Advanced Fuzzy Engine
export class AdvancedFuzzyEngine {
  private phoneticMatcher: PhoneticMatcher;
  private abbreviationExpander: AbbreviationExpander;
  private semanticMatcher: SemanticMatcher;
  private contextMatcher: ContextMatcher;
  private vocabulary: Map<TemptationCategory | string, string[]> = new Map();

  constructor(externalVocabulary?: Map<TemptationCategory | string, string[]>) {
    this.phoneticMatcher = new PhoneticMatcher();
    this.abbreviationExpander = new AbbreviationExpander();
    this.semanticMatcher = new SemanticMatcher();
    this.contextMatcher = new ContextMatcher();

    if (externalVocabulary) {
      this.vocabulary = externalVocabulary;
    } else {
      this.initializeVocabulary();
    }
  }

  /**
   * Initialize vocabulary from existing category patterns
   * Teaching: We extract all possible terms from our existing patterns
   * to create a comprehensive searchable vocabulary
   */
  private initializeVocabulary() {
    // This would be populated from your existing categoryPatterns and enhancedCategoryPatterns
    // For now, we'll use a simplified version

    const sampleVocabulary = {
      [TemptationCategory.FOOD_DINING]: [
        "food",
        "restaurant",
        "meal",
        "dinner",
        "lunch",
        "breakfast",
        "pizza",
        "burger",
        "sushi",
        "mcdonalds",
        "kfc",
        "subway",
      ],
      [TemptationCategory.COFFEE]: [
        "coffee",
        "latte",
        "cappuccino",
        "espresso",
        "starbucks",
        "dunkin",
      ],
      [TemptationCategory.SHOPPING]: [
        "shopping",
        "buy",
        "purchase",
        "store",
        "mall",
        "amazon",
        "target",
      ],
      [TemptationCategory.ELECTRONICS]: [
        "phone",
        "computer",
        "laptop",
        "iphone",
        "android",
        "apple",
        "samsung",
      ],
      [TemptationCategory.SPORTS_FITNESS]: [
        "gym",
        "workout",
        "exercise",
        "fitness",
        "sports",
        "running",
        "weights",
      ],
    };

    Object.entries(sampleVocabulary).forEach(([category, terms]) => {
      this.vocabulary.set(category as TemptationCategory, terms);
    });
  }

  /**
   * Main fuzzy matching function - combines all algorithms
   * Teaching: This is where the magic happens! We try multiple approaches
   * and combine their results for the best possible match.
   */
  match(userInput: string, maxResults: number = 5): AdvancedFuzzyMatch[] {
    const matches: AdvancedFuzzyMatch[] = [];
    const processedInputs = this.preprocessInput(userInput);

    // Try each algorithm for each processed input
    for (const input of processedInputs) {
      // 1. Exact matching first (highest confidence)
      matches.push(...this.exactMatch(input));

      // 2. Fuzzy string matching (typos, partial matches)
      matches.push(...this.fuzzyMatch(input));

      // 3. Phonetic matching (sound-alike words)
      matches.push(...this.phoneticMatch(input));

      // 4. Semantic matching (meaning-based)
      matches.push(...this.semanticMatch(input));

      // 5. Context-aware matching
      matches.push(...this.contextMatch(input));
    }

    // Combine and rank results
    return this.rankAndCombineResults(matches, userInput, maxResults);
  }

  /**
   * Preprocess input - handle abbreviations, cleaning, etc.
   */
  private preprocessInput(input: string): string[] {
    const inputs: string[] = [];

    // Original input
    inputs.push(input);

    // Expanded abbreviations
    const expansions = this.abbreviationExpander.expandText(input);
    inputs.push(...expansions);

    // Cleaned versions
    const cleaned = input
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .trim();
    if (cleaned !== input.toLowerCase()) {
      inputs.push(cleaned);
    }

    return [...new Set(inputs)]; // Remove duplicates
  }

  /**
   * Exact matching - perfect or substring matches
   */
  private exactMatch(input: string): AdvancedFuzzyMatch[] {
    const matches: AdvancedFuzzyMatch[] = [];
    const lowerInput = input.toLowerCase();

    this.vocabulary.forEach((terms, category) => {
      for (const term of terms) {
        const lowerTerm = term.toLowerCase();

        if (lowerTerm === lowerInput) {
          // Perfect match
          matches.push({
            category,
            confidence: 1.0,
            score: 1.0,
            matches: [
              {
                algorithm: "exact_perfect",
                matchedText: term,
                originalText: input,
                score: 1.0,
                confidence: 1.0,
              },
            ],
            source: "exact",
            explanation: `Perfect match for "${term}"`,
          });
        } else if (
          lowerTerm.includes(lowerInput) ||
          lowerInput.includes(lowerTerm)
        ) {
          // Substring match
          const score =
            Math.min(lowerInput.length, lowerTerm.length) /
            Math.max(lowerInput.length, lowerTerm.length);
          matches.push({
            category,
            confidence: score * 0.9, // Slightly lower confidence for substring
            score,
            matches: [
              {
                algorithm: "exact_substring",
                matchedText: term,
                originalText: input,
                score,
                confidence: score * 0.9,
              },
            ],
            source: "exact",
            explanation: `Substring match with "${term}"`,
          });
        }
      }
    });

    return matches;
  }

  /**
   * Fuzzy string matching using edit distance
   */
  private fuzzyMatch(input: string): AdvancedFuzzyMatch[] {
    const matches: AdvancedFuzzyMatch[] = [];
    const inputLength = input.length;

    this.vocabulary.forEach((terms, category) => {
      for (const term of terms) {
        const distance = this.calculateEditDistance(
          input.toLowerCase(),
          term.toLowerCase()
        );
        const maxLength = Math.max(inputLength, term.length);

        if (distance <= Math.min(3, Math.floor(maxLength * 0.4))) {
          // Allow up to 40% differences
          const score = 1 - distance / maxLength;
          const confidence = score * 0.8; // Fuzzy matches get lower confidence

          if (score > 0.5) {
            // Only include decent matches
            matches.push({
              category,
              confidence,
              score,
              matches: [
                {
                  algorithm: "fuzzy_edit_distance",
                  matchedText: term,
                  originalText: input,
                  score,
                  confidence,
                },
              ],
              source: "fuzzy",
              explanation: `Fuzzy match with "${term}" (${distance} character differences)`,
            });
          }
        }
      }
    });

    return matches;
  }

  /**
   * Phonetic matching for sound-alike words
   */
  private phoneticMatch(input: string): AdvancedFuzzyMatch[] {
    const matches: AdvancedFuzzyMatch[] = [];

    this.vocabulary.forEach((terms, category) => {
      for (const term of terms) {
        const phoneticResult = this.phoneticMatcher.areSimilar(input, term);

        if (phoneticResult.similar) {
          matches.push({
            category,
            confidence: phoneticResult.confidence * 0.7, // Lower confidence for phonetic
            score: phoneticResult.confidence,
            matches: [
              {
                algorithm: "phonetic",
                matchedText: term,
                originalText: input,
                score: phoneticResult.confidence,
                confidence: phoneticResult.confidence * 0.7,
              },
            ],
            source: "phonetic",
            explanation: `Sounds similar to "${term}"`,
          });
        }
      }
    });

    return matches;
  }

  /**
   * Semantic matching based on word meaning
   */
  private semanticMatch(input: string): AdvancedFuzzyMatch[] {
    const matches: AdvancedFuzzyMatch[] = [];
    const inputWords = input.toLowerCase().split(/\s+/);

    this.vocabulary.forEach((terms, category) => {
      for (const term of terms) {
        const termWords = term.toLowerCase().split(/\s+/);

        let maxSimilarity = 0;
        let bestMatch = "";

        // Check similarity between all word combinations
        for (const inputWord of inputWords) {
          for (const termWord of termWords) {
            const similarity = this.semanticMatcher.getSimilarity(
              inputWord,
              termWord
            );
            if (similarity > maxSimilarity) {
              maxSimilarity = similarity;
              bestMatch = `${inputWord} → ${termWord}`;
            }
          }
        }

        if (maxSimilarity > 0.5) {
          matches.push({
            category,
            confidence: maxSimilarity * 0.6, // Lower confidence for semantic
            score: maxSimilarity,
            matches: [
              {
                algorithm: "semantic",
                matchedText: term,
                originalText: input,
                score: maxSimilarity,
                confidence: maxSimilarity * 0.6,
              },
            ],
            source: "semantic",
            explanation: `Semantically similar to "${term}" (${bestMatch})`,
          });
        }
      }
    });

    return matches;
  }

  /**
   * Context-aware matching
   */
  private contextMatch(input: string): AdvancedFuzzyMatch[] {
    const matches: AdvancedFuzzyMatch[] = [];
    const contextBoosts = this.contextMatcher.analyzeContext(input);

    // Apply context boosts to existing vocabulary
    contextBoosts.forEach((boost, category) => {
      if (this.vocabulary.has(category)) {
        const terms = this.vocabulary.get(category)!;

        // For context matching, we look for any relevant terms in the input
        for (const term of terms) {
          if (
            input.toLowerCase().includes(term.toLowerCase()) ||
            term.toLowerCase().includes(input.toLowerCase())
          ) {
            matches.push({
              category,
              confidence: boost,
              score: boost,
              matches: [
                {
                  algorithm: "context",
                  matchedText: term,
                  originalText: input,
                  score: boost,
                  confidence: boost,
                },
              ],
              source: "context",
              explanation: `Context suggests "${category}" based on current time/patterns`,
            });
          }
        }
      }
    });

    return matches;
  }

  /**
   * Rank and combine results from all algorithms
   * Teaching: We need to intelligently combine results from different algorithms,
   * avoiding duplicates and weighting them appropriately
   */
  private rankAndCombineResults(
    matches: AdvancedFuzzyMatch[],
    originalInput: string,
    maxResults: number
  ): AdvancedFuzzyMatch[] {
    // Group matches by category
    const categoryGroups = new Map<
      TemptationCategory | string,
      AdvancedFuzzyMatch[]
    >();

    matches.forEach((match) => {
      if (!categoryGroups.has(match.category)) {
        categoryGroups.set(match.category, []);
      }
      categoryGroups.get(match.category)!.push(match);
    });

    // For each category, combine the best matches from different algorithms
    const combinedMatches: AdvancedFuzzyMatch[] = [];

    categoryGroups.forEach((categoryMatches, _category) => {
      // Sort by confidence
      categoryMatches.sort((a, b) => b.confidence - a.confidence);

      // Take the best match, but combine information from multiple sources
      const bestMatch = categoryMatches[0];
      const allSources = [...new Set(categoryMatches.map((m) => m.source))];
      const allAlgorithms = categoryMatches.flatMap((m) =>
        m.matches.map((match) => match.algorithm)
      );

      // Calculate combined confidence - boost if multiple algorithms agree
      let combinedConfidence = bestMatch.confidence;
      if (allSources.length > 1) {
        combinedConfidence = Math.min(
          1,
          combinedConfidence * (1 + (allSources.length - 1) * 0.1)
        );
      }

      combinedMatches.push({
        ...bestMatch,
        confidence: combinedConfidence,
        matches: categoryMatches.flatMap((m) => m.matches),
        explanation:
          allSources.length > 1
            ? `Multiple algorithms agree: ${allAlgorithms.join(", ")}`
            : bestMatch.explanation,
      });
    });

    // Final ranking by combined confidence
    return combinedMatches
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxResults);
  }

  /**
   * Calculate edit distance between two strings
   */
  private calculateEditDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Learn from user corrections to improve future matching
   * Teaching: This is how the system gets smarter over time
   */
  learnFromCorrection(
    userInput: string,
    correctCategory: TemptationCategory | string
  ) {
    // Extract potential abbreviations
    const words = userInput.toLowerCase().split(/\s+/);
    const categoryTerms = this.vocabulary.get(correctCategory) || [];

    // Look for abbreviation patterns
    words.forEach((word) => {
      if (
        word.length <= 5 &&
        !categoryTerms.some((term) => term.includes(word))
      ) {
        // This might be an abbreviation - learn it
        this.abbreviationExpander.learnAbbreviation(
          word,
          correctCategory.toString()
        );
      }
    });

    // Add the user input as a new term for this category
    if (!categoryTerms.includes(userInput.toLowerCase())) {
      categoryTerms.push(userInput.toLowerCase());
      this.vocabulary.set(correctCategory, categoryTerms);
    }
  }

  /**
   * Set the entire vocabulary from external source
   * Teaching: This allows SuperFuzzyCategorizer to share its regional vocabulary
   */
  setVocabulary(vocabulary: Map<TemptationCategory | string, string[]>): void {
    this.vocabulary = vocabulary;
    console.log("🔧 AdvancedFuzzyEngine vocabulary updated with external data");
  }
}

// Export singleton instance
export const advancedFuzzyEngine = new AdvancedFuzzyEngine();
