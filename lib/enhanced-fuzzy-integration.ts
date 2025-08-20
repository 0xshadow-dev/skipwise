/**
 * Enhanced Fuzzy Integration - Seamless Integration Layer
 *
 * This module provides a drop-in replacement for the existing categorization
 * functions while leveraging our powerful super fuzzy engine behind the scenes.
 *
 * Teaching Moment: Why create an integration layer?
 * - Maintains backward compatibility with existing code
 * - Allows gradual migration to new fuzzy system
 * - Provides fallback mechanisms for reliability
 * - Enables A/B testing between old and new systems
 * - Centralizes all categorization logic in one place
 */

import { TemptationCategory } from "./types";
import {
  superFuzzyCategorizer,
  SuperFuzzyResult,
} from "./super-fuzzy-categorizer";
import {
  enhancedCategorizeTemptation,
  getEnhancedCategorySuggestions,
} from "./enhanced-ai-categorization";

// Configuration for the fuzzy integration
interface FuzzyConfig {
  enabled: boolean;
  confidenceThreshold: number; // Minimum confidence to trust fuzzy result
  fallbackToOldSystem: boolean; // Whether to fallback to old system on low confidence
  learningEnabled: boolean; // Whether to learn from user corrections
  debugMode: boolean; // Whether to log detailed matching information
}

// Default configuration
const DEFAULT_CONFIG: FuzzyConfig = {
  enabled: true,
  confidenceThreshold: 0.3, // Pretty lenient to catch more matches
  fallbackToOldSystem: true,
  learningEnabled: true,
  debugMode: false,
};

type FuzzyStats = {
  totalRequests: number;
  fuzzySuccesses: number;
  fallbackUsed: number;
  learningEvents: number;
};

// Enhanced categorization result with fuzzy information
export interface EnhancedCategorizationResult {
  category: TemptationCategory | string;
  confidence: number;
  source: "fuzzy" | "fallback" | "learned";
  explanation: string;
  alternatives?: Array<{
    category: TemptationCategory | string;
    confidence: number;
    reason: string;
  }>;
  debugInfo?: {
    fuzzyResult: SuperFuzzyResult;
    fallbackUsed: boolean;
    processingTime: number;
  };
}

export class EnhancedFuzzyIntegration {
  private config: FuzzyConfig;
  private stats: {
    totalRequests: number;
    fuzzySuccesses: number;
    fallbackUsed: number;
    learningEvents: number;
  } = {
    totalRequests: 0,
    fuzzySuccesses: 0,
    fallbackUsed: 0,
    learningEvents: 0,
  };

  constructor(config: Partial<FuzzyConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Enhanced categorization that combines fuzzy matching with fallback
   * Teaching: This is the main entry point that orchestrates everything
   */
  async categorize(description: string): Promise<EnhancedCategorizationResult> {
    const startTime = Date.now();
    this.stats.totalRequests++;

    if (this.config.debugMode) {
      console.log(`🔍 Categorizing: "${description}"`);
    }

    // Step 1: Try super fuzzy categorizer first
    if (this.config.enabled) {
      try {
        const fuzzyResult = await superFuzzyCategorizer.categorize(description);

        if (fuzzyResult.confidence >= this.config.confidenceThreshold) {
          this.stats.fuzzySuccesses++;

          if (this.config.debugMode) {
            console.log(
              `✅ Fuzzy match: ${
                fuzzyResult.category
              } (${fuzzyResult.confidence.toFixed(2)})`
            );
            console.log(`📝 Explanation: ${fuzzyResult.explanation}`);
          }

          return {
            category: fuzzyResult.category,
            confidence: fuzzyResult.confidence,
            source:
              fuzzyResult.matchDetails.algorithm === "learned_pattern"
                ? "learned"
                : "fuzzy",
            explanation: fuzzyResult.explanation,
            alternatives: fuzzyResult.alternatives,
            debugInfo: {
              fuzzyResult,
              fallbackUsed: false,
              processingTime: Date.now() - startTime,
            },
          };
        }

        if (this.config.debugMode) {
          console.log(
            `⚠️ Low confidence fuzzy match: ${fuzzyResult.confidence.toFixed(
              2
            )}`
          );
        }

        // Low confidence - decide whether to use it or fallback
        if (!this.config.fallbackToOldSystem) {
          return {
            category: fuzzyResult.category,
            confidence: fuzzyResult.confidence,
            source: "fuzzy",
            explanation: `${fuzzyResult.explanation} (low confidence)`,
            alternatives: fuzzyResult.alternatives,
            debugInfo: {
              fuzzyResult,
              fallbackUsed: false,
              processingTime: Date.now() - startTime,
            },
          };
        }
      } catch (error) {
        console.warn("Fuzzy categorization failed:", error);
      }
    }

    // Step 2: Fallback to existing enhanced system
    if (this.config.fallbackToOldSystem) {
      this.stats.fallbackUsed++;

      if (this.config.debugMode) {
        console.log("🔄 Using fallback categorization");
      }

      try {
        const fallbackCategory = await enhancedCategorizeTemptation(
          description
        );
        const suggestions = getEnhancedCategorySuggestions(description, 3);

        return {
          category: fallbackCategory,
          confidence: suggestions.length > 0 ? suggestions[0].confidence : 0.5,
          source: "fallback",
          explanation: `Categorized using enhanced AI system`,
          alternatives: suggestions.slice(1).map((s) => ({
            category: s.category,
            confidence: s.confidence,
            reason: s.details || "Enhanced AI suggestion",
          })),
          debugInfo: {
            fuzzyResult: {
              category: fallbackCategory,
              confidence: 0.5,
              explanation: "Fallback system used",
              alternatives: [],
              matchDetails: {
                algorithm: "fallback",
                matchedTerms: [],
                userInput: description,
                processingSteps: [
                  "Used enhanced AI categorization as fallback",
                ],
              },
            },
            fallbackUsed: true,
            processingTime: Date.now() - startTime,
          },
        };
      } catch (error) {
        console.warn("Fallback categorization failed:", error);

        // Ultimate fallback
        return {
          category: TemptationCategory.OTHER,
          confidence: 0.1,
          source: "fallback",
          explanation: "Unable to categorize - defaulting to Other",
          debugInfo: {
            fuzzyResult: {
              category: TemptationCategory.OTHER,
              confidence: 0.1,
              explanation: "Ultimate fallback",
              alternatives: [],
              matchDetails: {
                algorithm: "ultimate_fallback",
                matchedTerms: [],
                userInput: description,
                processingSteps: ["All categorization methods failed"],
              },
            },
            fallbackUsed: true,
            processingTime: Date.now() - startTime,
          },
        };
      }
    }

    // If we get here, fuzzy is disabled and fallback is disabled
    return {
      category: TemptationCategory.OTHER,
      confidence: 0.1,
      source: "fallback",
      explanation: "Categorization disabled",
      debugInfo: {
        fuzzyResult: {
          category: TemptationCategory.OTHER,
          confidence: 0.1,
          explanation: "Categorization disabled",
          alternatives: [],
          matchDetails: {
            algorithm: "disabled",
            matchedTerms: [],
            userInput: description,
            processingSteps: ["Categorization is disabled"],
          },
        },
        fallbackUsed: false,
        processingTime: Date.now() - startTime,
      },
    };
  }

  /**
   * Get multiple category suggestions with fuzzy enhancement
   */
  async getSuggestions(
    description: string,
    maxSuggestions: number = 3
  ): Promise<
    Array<{
      category: TemptationCategory | string;
      confidence: number;
      source: "fuzzy" | "fallback";
      explanation: string;
    }>
  > {
    const suggestions: Array<{
      category: TemptationCategory | string;
      confidence: number;
      source: "fuzzy" | "fallback";
      explanation: string;
    }> = [];

    // Try fuzzy suggestions first
    if (this.config.enabled) {
      try {
        const fuzzyResult = await superFuzzyCategorizer.categorize(description);

        // Add the main result
        suggestions.push({
          category: fuzzyResult.category,
          confidence: fuzzyResult.confidence,
          source: "fuzzy",
          explanation: fuzzyResult.explanation,
        });

        // Add alternatives
        fuzzyResult.alternatives.forEach((alt) => {
          suggestions.push({
            category: alt.category,
            confidence: alt.confidence,
            source: "fuzzy",
            explanation: alt.reason,
          });
        });
      } catch (error) {
        console.warn("Fuzzy suggestions failed:", error);
      }
    }

    // Fill remaining slots with fallback suggestions
    if (
      suggestions.length < maxSuggestions &&
      this.config.fallbackToOldSystem
    ) {
      try {
        const fallbackSuggestions = getEnhancedCategorySuggestions(
          description,
          maxSuggestions - suggestions.length
        );

        fallbackSuggestions.forEach((s) => {
          // Avoid duplicates
          if (
            !suggestions.some((existing) => existing.category === s.category)
          ) {
            suggestions.push({
              category: s.category,
              confidence: s.confidence,
              source: "fallback",
              explanation: s.details || "Enhanced AI suggestion",
            });
          }
        });
      } catch (error) {
        console.warn("Fallback suggestions failed:", error);
      }
    }

    // Sort by confidence and limit results
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxSuggestions);
  }

  /**
   * Learn from user correction to improve future categorization
   * Teaching: This feeds corrections back into the fuzzy system for learning
   */
  async learnFromCorrection(
    userInput: string,
    correctCategory: TemptationCategory | string,
    previousResult?: EnhancedCategorizationResult
  ): Promise<void> {
    if (!this.config.learningEnabled) {
      return;
    }

    this.stats.learningEvents++;

    if (this.config.debugMode) {
      console.log(`📚 Learning: "${userInput}" → ${correctCategory}`);
      if (previousResult) {
        console.log(
          `   Previous: ${
            previousResult.category
          } (${previousResult.confidence.toFixed(2)})`
        );
      }
    }

    // Feed the correction to the super fuzzy categorizer
    try {
      superFuzzyCategorizer.learnFromCorrection(
        userInput,
        correctCategory,
        0.9
      );
    } catch (error) {
      console.warn("Failed to learn from correction:", error);
    }
  }

  /**
   * Get comprehensive debugging information for a categorization
   */
  async debugCategorization(description: string): Promise<{
    result: EnhancedCategorizationResult;
    fuzzyDebug?: Record<string, unknown>;
    stats: FuzzyStats;
    config: FuzzyConfig;
  }> {
    // Temporarily enable debug mode
    const originalDebugMode = this.config.debugMode;
    this.config.debugMode = true;

    const result = await this.categorize(description);

    let fuzzyDebug: Record<string, unknown> | undefined;
    if (this.config.enabled) {
      try {
        fuzzyDebug = await superFuzzyCategorizer.debugMatch(description);
      } catch (error) {
        fuzzyDebug = {
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }

    // Restore original debug mode
    this.config.debugMode = originalDebugMode;

    return {
      result,
      fuzzyDebug,
      stats: { ...this.stats },
      config: { ...this.config },
    };
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<FuzzyConfig>): void {
    this.config = { ...this.config, ...updates };

    if (this.config.debugMode) {
      console.log("🔧 Updated fuzzy integration config:", this.config);
    }
  }

  /**
   * Get performance statistics
   */
  getStats(): typeof this.stats & {
    fuzzySuccessRate: number;
    fallbackRate: number;
    averageProcessingTime?: number;
  } {
    return {
      ...this.stats,
      fuzzySuccessRate:
        this.stats.totalRequests > 0
          ? this.stats.fuzzySuccesses / this.stats.totalRequests
          : 0,
      fallbackRate:
        this.stats.totalRequests > 0
          ? this.stats.fallbackUsed / this.stats.totalRequests
          : 0,
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      totalRequests: 0,
      fuzzySuccesses: 0,
      fallbackUsed: 0,
      learningEvents: 0,
    };
  }
}

// Export singleton instance with default configuration
export const enhancedFuzzyIntegration = new EnhancedFuzzyIntegration();

// Export convenience functions that match existing API
export async function smartCategorizeTemptation(
  description: string
): Promise<TemptationCategory | string> {
  const result = await enhancedFuzzyIntegration.categorize(description);
  return result.category;
}

export async function getSmartCategorySuggestions(
  description: string,
  maxSuggestions: number = 3
): Promise<
  Array<{ category: TemptationCategory | string; confidence: number }>
> {
  const suggestions = await enhancedFuzzyIntegration.getSuggestions(
    description,
    maxSuggestions
  );
  return suggestions.map((s) => ({
    category: s.category,
    confidence: s.confidence,
  }));
}

export async function learnFromUserCorrection(
  userInput: string,
  correctCategory: TemptationCategory | string
): Promise<void> {
  return enhancedFuzzyIntegration.learnFromCorrection(
    userInput,
    correctCategory
  );
}

/**
 * Performance monitoring and A/B testing utilities
 */
export class FuzzyPerformanceMonitor {
  private performanceData: Array<{
    input: string;
    result: EnhancedCategorizationResult;
    timestamp: Date;
    userCorrection?: TemptationCategory | string;
  }> = [];

  /**
   * Record a categorization result for performance analysis
   */
  recordCategorization(
    input: string,
    result: EnhancedCategorizationResult
  ): void {
    this.performanceData.push({
      input,
      result,
      timestamp: new Date(),
    });

    // Keep only last 1000 entries to prevent memory issues
    if (this.performanceData.length > 1000) {
      this.performanceData = this.performanceData.slice(-1000);
    }
  }

  /**
   * Record user correction for accuracy analysis
   */
  recordCorrection(
    input: string,
    correctCategory: TemptationCategory | string
  ): void {
    const entry = this.performanceData.find((e) => e.input === input);
    if (entry) {
      entry.userCorrection = correctCategory;
    }
  }

  /**
   * Get accuracy statistics
   */
  getAccuracyStats(): {
    totalCategorizations: number;
    correctPredictions: number;
    accuracy: number;
    fuzzyAccuracy: number;
    fallbackAccuracy: number;
  } {
    const total = this.performanceData.length;
    const withCorrections = this.performanceData.filter(
      (e) => e.userCorrection !== undefined
    );

    if (withCorrections.length === 0) {
      return {
        totalCategorizations: total,
        correctPredictions: 0,
        accuracy: 0,
        fuzzyAccuracy: 0,
        fallbackAccuracy: 0,
      };
    }

    const correct = withCorrections.filter(
      (e) => e.result.category === e.userCorrection
    );
    const fuzzyCorrect = withCorrections.filter(
      (e) =>
        e.result.source === "fuzzy" && e.result.category === e.userCorrection
    );
    const fallbackCorrect = withCorrections.filter(
      (e) =>
        e.result.source === "fallback" && e.result.category === e.userCorrection
    );

    const fuzzyTotal = withCorrections.filter(
      (e) => e.result.source === "fuzzy"
    ).length;
    const fallbackTotal = withCorrections.filter(
      (e) => e.result.source === "fallback"
    ).length;

    return {
      totalCategorizations: total,
      correctPredictions: correct.length,
      accuracy: correct.length / withCorrections.length,
      fuzzyAccuracy: fuzzyTotal > 0 ? fuzzyCorrect.length / fuzzyTotal : 0,
      fallbackAccuracy:
        fallbackTotal > 0 ? fallbackCorrect.length / fallbackTotal : 0,
    };
  }

  /**
   * Export performance data for analysis
   */
  exportData(): string {
    return JSON.stringify(this.performanceData, null, 2);
  }
}

// Export performance monitor instance
export const fuzzyPerformanceMonitor = new FuzzyPerformanceMonitor();

// Export debug utilities for testing
export const debugFuzzySystem = {
  checkVocabulary: (searchTerm: string) => {
    return superFuzzyCategorizer.debugVocabulary(searchTerm);
  },

  testCategorization: async (input: string) => {
    console.log(`🔍 Testing categorization for: "${input}"`);
    const result = await enhancedFuzzyIntegration.categorize(input);
    console.log("Result:", result);
    return result;
  },

  getVocabularyStats: () => {
    const stats = superFuzzyCategorizer.debugVocabulary("");
    return stats.categories.map((cat) => ({
      category: cat.category,
      vocabularySize: cat.vocabularySize,
    }));
  },
};

// Make it globally available for browser console testing
if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).debugFuzzySystem =
    debugFuzzySystem;
}
