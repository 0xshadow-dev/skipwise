/**
 * Fuzzy Matching Test Examples
 *
 * This file contains comprehensive test cases that demonstrate the power
 * and capabilities of our super fuzzy categorization system.
 *
 * Teaching Moment: Why extensive testing?
 * - Validates that our algorithms work with real user inputs
 * - Demonstrates the system's capabilities to stakeholders
 * - Helps identify edge cases and areas for improvement
 * - Provides examples for documentation and training
 */

import { TemptationCategory } from "./types";
import {
  smartCategorizeTemptation,
  enhancedFuzzyIntegration,
} from "./enhanced-fuzzy-integration";

type TestResult = {
  category: string;
  input: string;
  expected: TemptationCategory | string;
  actual: TemptationCategory | string;
  correct: boolean;
  confidence: number;
  explanation: string;
  processingTime: number;
};

// Test cases organized by difficulty level
export const testCases = {
  // Easy cases - exact or near-exact matches
  easy: [
    { input: "coffee", expected: TemptationCategory.COFFEE },
    { input: "starbucks", expected: TemptationCategory.COFFEE },
    { input: "pizza", expected: TemptationCategory.FOOD_DINING },
    { input: "mcdonalds", expected: TemptationCategory.FOOD_DINING },
    { input: "shopping", expected: TemptationCategory.SHOPPING },
    { input: "amazon", expected: TemptationCategory.SHOPPING },
    { input: "iphone", expected: TemptationCategory.ELECTRONICS },
    { input: "gym membership", expected: TemptationCategory.SPORTS_FITNESS },
  ],

  // Medium cases - abbreviations and common variations
  medium: [
    { input: "mcds", expected: TemptationCategory.FOOD_DINING },
    { input: "sbux", expected: TemptationCategory.COFFEE },
    { input: "amzn", expected: TemptationCategory.SHOPPING },
    { input: "bk", expected: TemptationCategory.FOOD_DINING }, // Burger King
    { input: "tbell", expected: TemptationCategory.FOOD_DINING }, // Taco Bell
    { input: "cofee", expected: TemptationCategory.COFFEE }, // Typo
    { input: "groc", expected: TemptationCategory.SHOPPING }, // Grocery
    { input: "comp upgrade", expected: TemptationCategory.ELECTRONICS },
  ],

  // Hard cases - contextual understanding required
  hard: [
    { input: "grab something quick", expected: TemptationCategory.COFFEE }, // Context: morning + quick
    { input: "order dinner", expected: TemptationCategory.FOOD_DINING },
    { input: "need caffeine boost", expected: TemptationCategory.COFFEE },
    { input: "retail therapy", expected: TemptationCategory.SHOPPING },
    { input: "treat myself", expected: TemptationCategory.SHOPPING }, // Could be various, but shopping is common
    { input: "quick bite", expected: TemptationCategory.FOOD_DINING },
    { input: "workout gear", expected: TemptationCategory.SPORTS_FITNESS },
    { input: "tech upgrade", expected: TemptationCategory.ELECTRONICS },
  ],

  // Expert cases - require advanced reasoning
  expert: [
    { input: "morning pick me up", expected: TemptationCategory.COFFEE },
    { input: "fuel for the road", expected: TemptationCategory.FOOD_DINING }, // Could be gas, but context suggests food
    {
      input: "something to help me focus",
      expected: TemptationCategory.COFFEE,
    },
    { input: "impulse purchase online", expected: TemptationCategory.SHOPPING },
    { input: "guilty pleasure meal", expected: TemptationCategory.FOOD_DINING },
    { input: "reward for hard work", expected: TemptationCategory.SHOPPING }, // Very contextual
    { input: "latest and greatest", expected: TemptationCategory.ELECTRONICS },
    {
      input: "subscription service",
      expected: TemptationCategory.SUBSCRIPTIONS,
    },
  ],

  // Real user examples (anonymized)
  realWorld: [
    { input: "dd iced coffee", expected: TemptationCategory.COFFEE }, // Dunkin Donuts
    { input: "mcd breakfast", expected: TemptationCategory.FOOD_DINING },
    { input: "amazon prime thing", expected: TemptationCategory.SHOPPING },
    { input: "new phone case", expected: TemptationCategory.ELECTRONICS },
    { input: "gym clothes", expected: TemptationCategory.SPORTS_FITNESS },
    {
      input: "netflix subscription",
      expected: TemptationCategory.SUBSCRIPTIONS,
    },
    { input: "late night snack", expected: TemptationCategory.FOOD_DINING },
    { input: "book from amazon", expected: TemptationCategory.BOOKS_EDUCATION },
    { input: "uber ride", expected: TemptationCategory.TRANSPORTATION },
    { input: "movie tickets", expected: TemptationCategory.ENTERTAINMENT },
  ],

  // Challenging edge cases
  edgeCases: [
    { input: "apple", expected: TemptationCategory.ELECTRONICS }, // Could be fruit or tech company
    { input: "target", expected: TemptationCategory.SHOPPING }, // Store vs goal
    { input: "gas", expected: TemptationCategory.TRANSPORTATION }, // Fuel
    { input: "medicine", expected: TemptationCategory.HEALTH_MEDICAL },
    { input: "gift for mom", expected: TemptationCategory.GIFTS_CHARITY },
    { input: "home improvement", expected: TemptationCategory.HOME_GARDEN },
    { input: "craft supplies", expected: TemptationCategory.HOBBIES_CRAFTS },
    { input: "beer", expected: TemptationCategory.ALCOHOL_TOBACCO },
  ],

  // Multilingual examples (if supported)
  multilingual: [
    { input: "café", expected: TemptationCategory.COFFEE },
    { input: "comida", expected: TemptationCategory.FOOD_DINING }, // Spanish for food
    { input: "compras", expected: TemptationCategory.SHOPPING }, // Spanish for shopping
    { input: "livre", expected: TemptationCategory.BOOKS_EDUCATION }, // French for book
  ],

  // Amount-based context examples
  amountBased: [
    { input: "$5 quick grab", expected: TemptationCategory.COFFEE },
    { input: "$15 lunch", expected: TemptationCategory.FOOD_DINING },
    { input: "$500 electronics", expected: TemptationCategory.ELECTRONICS },
    { input: "$1000 shopping spree", expected: TemptationCategory.SHOPPING },
    { input: "$50 monthly", expected: TemptationCategory.SUBSCRIPTIONS },
  ],
};

// Comprehensive test runner
export class FuzzyTestRunner {
  private results: Array<{
    category: string;
    input: string;
    expected: TemptationCategory | string;
    actual: TemptationCategory | string;
    correct: boolean;
    confidence: number;
    explanation: string;
    processingTime: number;
  }> = [];

  /**
   * Run all test categories
   */
  async runAllTests(): Promise<{
    totalTests: number;
    passedTests: number;
    accuracy: number;
    results: TestResult[];
    categoryBreakdown: Record<
      string,
      { total: number; passed: number; accuracy: number }
    >;
  }> {
    console.log("🧪 Starting comprehensive fuzzy matching tests...");

    // Run each category of tests
    for (const [category, cases] of Object.entries(testCases)) {
      console.log(`\n📋 Testing ${category} cases (${cases.length} tests)`);

      for (const testCase of cases) {
        await this.runSingleTest(category, testCase.input, testCase.expected);
      }
    }

    // Calculate overall results
    const totalTests = this.results.length;
    const passedTests = this.results.filter((r) => r.correct).length;
    const accuracy = totalTests > 0 ? passedTests / totalTests : 0;

    // Category breakdown
    const categoryBreakdown: Record<
      string,
      { total: number; passed: number; accuracy: number }
    > = {};

    for (const category of Object.keys(testCases)) {
      const categoryResults = this.results.filter(
        (r) => r.category === category
      );
      const categoryPassed = categoryResults.filter((r) => r.correct).length;

      categoryBreakdown[category] = {
        total: categoryResults.length,
        passed: categoryPassed,
        accuracy:
          categoryResults.length > 0
            ? categoryPassed / categoryResults.length
            : 0,
      };
    }

    console.log("\n📊 Test Results Summary:");
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Overall Accuracy: ${(accuracy * 100).toFixed(1)}%`);

    console.log("\n📈 Category Breakdown:");
    for (const [category, stats] of Object.entries(categoryBreakdown)) {
      console.log(
        `${category}: ${stats.passed}/${stats.total} (${(
          stats.accuracy * 100
        ).toFixed(1)}%)`
      );
    }

    return {
      totalTests,
      passedTests,
      accuracy,
      results: this.results,
      categoryBreakdown,
    };
  }

  /**
   * Run a single test case
   */
  private async runSingleTest(
    category: string,
    input: string,
    expected: TemptationCategory | string
  ): Promise<void> {
    const startTime = Date.now();

    try {
      // Get detailed result for analysis
      const result = await enhancedFuzzyIntegration.categorize(input);
      const processingTime = Date.now() - startTime;

      const correct = result.category === expected;

      this.results.push({
        category,
        input,
        expected,
        actual: result.category,
        correct,
        confidence: result.confidence,
        explanation: result.explanation,
        processingTime,
      });

      const status = correct ? "✅" : "❌";
      const confidenceStr = (result.confidence * 100).toFixed(0);

      console.log(
        `${status} "${input}" → ${result.category} (${confidenceStr}% confidence, ${processingTime}ms)`
      );

      if (!correct) {
        console.log(`   Expected: ${expected}`);
        console.log(`   Explanation: ${result.explanation}`);
      }
    } catch (error) {
      console.error(`❌ Error testing "${input}":`, error);

      this.results.push({
        category,
        input,
        expected,
        actual: "ERROR",
        correct: false,
        confidence: 0,
        explanation: error instanceof Error ? error.message : String(error),
        processingTime: Date.now() - startTime,
      });
    }
  }

  /**
   * Test learning capabilities
   */
  async testLearning(): Promise<void> {
    console.log("\n🎓 Testing learning capabilities...");

    const learningTests = [
      { input: "my custom coffee shop", category: TemptationCategory.COFFEE },
      { input: "special restaurant", category: TemptationCategory.FOOD_DINING },
      {
        input: "weird abbreviation xyz",
        category: TemptationCategory.SHOPPING,
      },
    ];

    for (const test of learningTests) {
      // Test before learning
      const beforeResult = await enhancedFuzzyIntegration.categorize(
        test.input
      );
      console.log(
        `Before learning: "${test.input}" → ${beforeResult.category}`
      );

      // Teach the system
      await enhancedFuzzyIntegration.learnFromCorrection(
        test.input,
        test.category
      );

      // Test after learning
      const afterResult = await enhancedFuzzyIntegration.categorize(test.input);
      console.log(`After learning: "${test.input}" → ${afterResult.category}`);

      if (afterResult.category === test.category) {
        console.log("✅ Learning successful!");
      } else {
        console.log("❌ Learning failed");
      }
    }
  }

  /**
   * Performance benchmarking
   */
  async benchmarkPerformance(): Promise<{
    averageProcessingTime: number;
    medianProcessingTime: number;
    fastest: number;
    slowest: number;
  }> {
    console.log("\n⚡ Running performance benchmark...");

    const benchmarkInputs = [
      "coffee",
      "mcdonalds",
      "amazon",
      "iphone",
      "gym",
      "mcds",
      "sbux",
      "amzn",
      "quick bite",
      "retail therapy",
      "morning pick me up",
      "latest and greatest",
    ];

    const times: number[] = [];

    for (let i = 0; i < 5; i++) {
      // Run 5 iterations
      for (const input of benchmarkInputs) {
        const startTime = Date.now();
        await smartCategorizeTemptation(input);
        times.push(Date.now() - startTime);
      }
    }

    times.sort((a, b) => a - b);

    const averageProcessingTime =
      times.reduce((sum, time) => sum + time, 0) / times.length;
    const medianProcessingTime = times[Math.floor(times.length / 2)];
    const fastest = times[0];
    const slowest = times[times.length - 1];

    console.log(
      `Average processing time: ${averageProcessingTime.toFixed(2)}ms`
    );
    console.log(`Median processing time: ${medianProcessingTime}ms`);
    console.log(`Fastest: ${fastest}ms`);
    console.log(`Slowest: ${slowest}ms`);

    return {
      averageProcessingTime,
      medianProcessingTime,
      fastest,
      slowest,
    };
  }

  /**
   * Export results for analysis
   */
  exportResults(): string {
    return JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        results: this.results,
        summary: {
          totalTests: this.results.length,
          passedTests: this.results.filter((r) => r.correct).length,
          accuracy:
            this.results.length > 0
              ? this.results.filter((r) => r.correct).length /
                this.results.length
              : 0,
        },
      },
      null,
      2
    );
  }

  /**
   * Get failed test cases for analysis
   */
  getFailedCases(): TestResult[] {
    return this.results.filter((r) => !r.correct);
  }

  /**
   * Get low confidence cases (might need attention)
   */
  getLowConfidenceCases(threshold: number = 0.5): TestResult[] {
    return this.results.filter((r) => r.confidence < threshold);
  }
}

// Export test runner instance
export const fuzzyTestRunner = new FuzzyTestRunner();

// Utility functions for manual testing
export async function testSingleInput(input: string): Promise<void> {
  console.log(`\n🔍 Testing: "${input}"`);

  const result = await enhancedFuzzyIntegration.debugCategorization(input);

  console.log(`Result: ${result.result.category}`);
  console.log(`Confidence: ${(result.result.confidence * 100).toFixed(1)}%`);
  console.log(`Source: ${result.result.source}`);
  console.log(`Explanation: ${result.result.explanation}`);

  if (result.result.alternatives && result.result.alternatives.length > 0) {
    console.log("Alternatives:");
    result.result.alternatives.forEach((alt, index) => {
      console.log(
        `  ${index + 1}. ${alt.category} (${(alt.confidence * 100).toFixed(
          1
        )}%) - ${alt.reason}`
      );
    });
  }

  if (result.fuzzyDebug) {
    console.log("Debug Info:", result.fuzzyDebug);
  }
}

export async function runQuickTest(): Promise<void> {
  console.log("🚀 Running quick fuzzy matching test...");

  const quickTests = [
    "coffee",
    "mcds",
    "grab something quick",
    "morning pick me up",
    "amazon prime",
    "new phone",
    "gym membership",
  ];

  for (const test of quickTests) {
    const result = await smartCategorizeTemptation(test);
    console.log(`"${test}" → ${result}`);
  }

  console.log("✅ Quick test completed!");
}
