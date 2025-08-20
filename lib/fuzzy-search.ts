/**
 * Advanced Fuzzy Search Library for SkipWise
 * Provides intelligent search with typo tolerance, multi-field matching,
 * result highlighting, and relevance scoring
 */

export interface SearchResult<T> {
  item: T;
  score: number;
  matches: SearchMatch[];
  highlights: SearchHighlight[];
}

export interface SearchMatch {
  field: string;
  value: string;
  score: number;
  indices: number[];
}

export interface SearchHighlight {
  field: string;
  value: string;
  highlights: { start: number; end: number; text: string }[];
}

export interface SearchOptions {
  threshold?: number; // Minimum score for results (0-1)
  maxResults?: number; // Maximum number of results
  includeScore?: boolean;
  includeMatches?: boolean;
  keys?: SearchKey[]; // Fields to search
  caseSensitive?: boolean;
  ignoreLocation?: boolean; // Don't care about where in string match occurs
  minMatchCharLength?: number;
  findAllMatches?: boolean;
}

export interface SearchKey<T = unknown> {
  name: string;
  weight?: number; // Higher weight = more important (default: 1)
  getFn?: (item: T) => string | string[];
}

/**
 * Calculate fuzzy match score between pattern and text
 * Returns score 0-1 where 1 is perfect match
 */
function calculateFuzzyScore(
  pattern: string,
  text: string,
  options: {
    caseSensitive?: boolean;
    penalizeDistance?: boolean;
    bonusConsecutive?: boolean;
  } = {}
): { score: number; indices: number[] } {
  if (!pattern || !text) return { score: 0, indices: [] };

  const normalizedPattern = options.caseSensitive
    ? pattern
    : pattern.toLowerCase();
  const normalizedText = options.caseSensitive ? text : text.toLowerCase();

  if (normalizedPattern === normalizedText) {
    return {
      score: 1,
      indices: Array.from({ length: pattern.length }, (_, i) => i),
    };
  }

  const patternLength = normalizedPattern.length;
  const textLength = normalizedText.length;

  if (patternLength > textLength) return { score: 0, indices: [] };

  // Perfect substring match
  const substringIndex = normalizedText.indexOf(normalizedPattern);
  if (substringIndex !== -1) {
    const indices = Array.from(
      { length: patternLength },
      (_, i) => substringIndex + i
    );
    // Bonus for match at start
    const positionBonus = substringIndex === 0 ? 0.2 : 0;
    const score = Math.min(1, 0.8 + positionBonus);
    return { score, indices };
  }

  // Fuzzy matching with character sequence scoring
  let patternIdx = 0;
  let textIdx = 0;
  let score = 0;
  const indices: number[] = [];
  let consecutiveMatches = 0;
  let lastMatchIdx = -1;

  while (patternIdx < patternLength && textIdx < textLength) {
    const patternChar = normalizedPattern[patternIdx];
    const textChar = normalizedText[textIdx];

    if (patternChar === textChar) {
      indices.push(textIdx);

      // Bonus for consecutive matches
      if (options.bonusConsecutive && textIdx === lastMatchIdx + 1) {
        consecutiveMatches++;
        score += 0.1 * consecutiveMatches;
      } else {
        consecutiveMatches = 1;
      }

      // Base score for character match
      score += 1;

      // Penalty for distance from previous match
      if (options.penalizeDistance && lastMatchIdx !== -1) {
        const distance = textIdx - lastMatchIdx - 1;
        score -= distance * 0.05;
      }

      lastMatchIdx = textIdx;
      patternIdx++;
    }
    textIdx++;
  }

  // Must match all pattern characters
  if (patternIdx < patternLength) {
    return { score: 0, indices: [] };
  }

  // Normalize score
  const maxPossibleScore = patternLength + patternLength * 0.1; // Base + max consecutive bonus
  const normalizedScore = Math.min(1, score / maxPossibleScore);

  // Bonus for pattern being significant portion of text
  const lengthBonus = (patternLength / textLength) * 0.2;

  return { score: Math.min(1, normalizedScore + lengthBonus), indices };
}

/**
 * Calculate edit distance between two strings (Levenshtein distance)
 */
function calculateEditDistance(str1: string, str2: string): number {
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
 * Advanced fuzzy search with typo tolerance and multi-field support
 */
export class FuzzySearcher<T> {
  private items: T[] = [];
  private options: Required<SearchOptions>;

  constructor(items: T[] = [], options: SearchOptions = {}) {
    this.items = items;
    this.options = {
      threshold: 0.1,
      maxResults: 50,
      includeScore: true,
      includeMatches: true,
      keys: [{ name: "name", weight: 1 }],
      caseSensitive: false,
      ignoreLocation: false,
      minMatchCharLength: 1,
      findAllMatches: false,
      ...options,
    };
  }

  setCollection(items: T[]): void {
    this.items = items;
  }

  search(query: string): SearchResult<T>[] {
    if (!query || query.trim().length < this.options.minMatchCharLength) {
      return this.items.map((item) => ({
        item,
        score: 1,
        matches: [],
        highlights: [],
      }));
    }

    const results: SearchResult<T>[] = [];
    const trimmedQuery = query.trim().toLowerCase();

    console.log(`Searching ${this.items.length} items for: "${trimmedQuery}"`);

    for (const item of this.items) {
      let totalScore = 0;
      let matchFound = false;
      const matches: SearchMatch[] = [];
      const highlights: SearchHighlight[] = [];

      for (const key of this.options.keys) {
        const weight = key.weight || 1;
        let value: string;

        try {
          if (key.getFn) {
            const result = key.getFn(item);
            value = Array.isArray(result) ? result.join(" ") : String(result);
          } else {
            value = String((item as Record<string, unknown>)[key.name] || "");
          }
        } catch (error) {
          console.warn(`Error getting value for key ${key.name}:`, error);
          continue;
        }

        if (!value) continue;

        const textValues = Array.isArray(value) ? value : [value];

        for (const textValue of textValues) {
          const normalizedText = String(textValue).toLowerCase();

          // Simple substring match first
          if (normalizedText.includes(trimmedQuery)) {
            const score = 0.8; // High score for substring match
            const weightedScore = score * weight;
            totalScore += weightedScore;
            matchFound = true;

            // Find match indices for highlighting
            const startIndex = normalizedText.indexOf(trimmedQuery);
            const indices = Array.from(
              { length: trimmedQuery.length },
              (_, i) => startIndex + i
            );

            if (this.options.includeMatches) {
              matches.push({
                field: key.name,
                value: textValue,
                score,
                indices,
              });
            }

            // Generate highlights
            highlights.push({
              field: key.name,
              value: textValue,
              highlights: [
                {
                  start: startIndex,
                  end: startIndex + trimmedQuery.length,
                  text: textValue.slice(
                    startIndex,
                    startIndex + trimmedQuery.length
                  ),
                },
              ],
            });
          } else {
            // Try fuzzy matching
            const fuzzyResult = calculateFuzzyScore(
              trimmedQuery,
              normalizedText,
              {
                caseSensitive: false,
                penalizeDistance: true,
                bonusConsecutive: true,
              }
            );

            if (fuzzyResult.score > 0.3) {
              // Lower threshold for fuzzy matches
              const weightedScore = fuzzyResult.score * weight * 0.6; // Penalty for fuzzy vs exact
              totalScore += weightedScore;
              matchFound = true;

              if (this.options.includeMatches) {
                matches.push({
                  field: key.name,
                  value: textValue,
                  score: fuzzyResult.score,
                  indices: fuzzyResult.indices,
                });
              }

              // Generate highlights for fuzzy matches
              if (fuzzyResult.indices.length > 0) {
                const highlightRanges: {
                  start: number;
                  end: number;
                  text: string;
                }[] = [];
                let start = fuzzyResult.indices[0];
                let end = start;

                for (let i = 1; i < fuzzyResult.indices.length; i++) {
                  if (fuzzyResult.indices[i] === end + 1) {
                    end = fuzzyResult.indices[i];
                  } else {
                    highlightRanges.push({
                      start,
                      end: end + 1,
                      text: textValue.slice(start, end + 1),
                    });
                    start = fuzzyResult.indices[i];
                    end = start;
                  }
                }

                // Add the last range
                highlightRanges.push({
                  start,
                  end: end + 1,
                  text: textValue.slice(start, end + 1),
                });

                highlights.push({
                  field: key.name,
                  value: textValue,
                  highlights: highlightRanges,
                });
              }
            }
          }
        }
      }

      if (matchFound) {
        // Normalize score
        const normalizedScore = Math.min(
          1,
          totalScore / this.options.keys.length
        );

        if (normalizedScore >= this.options.threshold) {
          results.push({
            item,
            score: normalizedScore,
            matches: this.options.includeMatches ? matches : [],
            highlights,
          });
        }
      }
    }

    console.log(`Found ${results.length} matching results`);

    // Sort by score (highest first) and limit results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, this.options.maxResults);
  }

  /**
   * Search with typo tolerance using edit distance
   */
  searchWithTypoTolerance(
    query: string,
    maxTypos: number = 2
  ): SearchResult<T>[] {
    const baseResults = this.search(query);

    if (baseResults.length > 0) {
      return baseResults;
    }

    // Try with typo tolerance
    const typoResults: SearchResult<T>[] = [];

    for (const item of this.items) {
      let bestScore = 0;
      const matches: SearchMatch[] = [];
      const highlights: SearchHighlight[] = [];

      for (const key of this.options.keys) {
        const weight = key.weight || 1;
        const value = key.getFn
          ? key.getFn(item)
          : (item as Record<string, unknown>)[key.name];

        if (!value) continue;

        const textValues = Array.isArray(value) ? value : [String(value)];

        for (const textValue of textValues) {
          const words = textValue.toLowerCase().split(/\s+/);

          for (const word of words) {
            const editDistance = calculateEditDistance(
              query.toLowerCase(),
              word
            );

            if (editDistance <= maxTypos && word.length > 2) {
              const typoScore = Math.max(
                0,
                1 - editDistance / Math.max(query.length, word.length)
              );
              const weightedScore = typoScore * weight * 0.7; // Penalty for typo matching

              bestScore = Math.max(bestScore, weightedScore);

              if (this.options.includeMatches) {
                matches.push({
                  field: key.name,
                  value: textValue,
                  score: typoScore,
                  indices: [], // Could implement fuzzy indices for typo matches
                });
              }
            }
          }
        }
      }

      if (bestScore >= this.options.threshold * 0.5) {
        // Lower threshold for typo matches
        typoResults.push({
          item,
          score: bestScore,
          matches: this.options.includeMatches ? matches : [],
          highlights,
        });
      }
    }

    return typoResults
      .sort((a, b) => b.score - a.score)
      .slice(0, this.options.maxResults);
  }
}

/**
 * Utility function to highlight search matches in text
 */
export function highlightMatches(
  text: string,
  highlights: { start: number; end: number; text: string }[],
  className: string = "bg-yellow-200 dark:bg-yellow-800"
): string {
  if (!highlights.length) return text;

  let result = "";
  let lastIndex = 0;

  for (const highlight of highlights) {
    // Add text before highlight
    result += text.slice(lastIndex, highlight.start);

    // Add highlighted text
    result += `<mark class="${className}">${highlight.text}</mark>`;

    lastIndex = highlight.end;
  }

  // Add remaining text
  result += text.slice(lastIndex);

  return result;
}

/**
 * Debounced search function for performance
 */
export function createDebouncedSearch<T>(
  searcher: FuzzySearcher<T>,
  delay: number = 300
): (query: string, callback: (results: SearchResult<T>[]) => void) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (query: string, callback: (results: SearchResult<T>[]) => void) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      const results = searcher.search(query);
      callback(results);
    }, delay);
  };
}
