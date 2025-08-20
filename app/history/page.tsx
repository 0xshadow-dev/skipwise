"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { ArrowLeft, Search, Trash2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/bottom-nav";
import { CategoryIcon } from "@/components/category-icon";
import { Temptation, TemptationCategory } from "@/lib/types";
import { settings } from "@/lib/settings";
import db, { initializeDB } from "@/lib/storage";
import { cn } from "@/lib/utils";
import {
  FuzzySearcher,
  SearchResult,
  // createDebouncedSearch, // Available for future use
} from "@/lib/fuzzy-search";

export default function History() {
  const [temptations, setTemptations] = useState<Temptation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    TemptationCategory | "all"
  >("all");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "resisted" | "gave-in"
  >("all");
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<
    SearchResult<Temptation>[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [useTypoTolerance, setUseTypoTolerance] = useState(false);

  // Initialize fuzzy searcher
  const fuzzySearcher = useMemo(() => {
    const searcher = new FuzzySearcher<Temptation>([], {
      threshold: 0.1,
      maxResults: 100,
      keys: [
        { name: "description", weight: 3 },
        { name: "category", weight: 2 },
        {
          name: "amount",
          weight: 1,
          getFn: (item: unknown) =>
            settings.formatAmount((item as Temptation).amount),
        },
      ],
      caseSensitive: false,
      minMatchCharLength: 1,
    });
    searcher.setCollection(temptations);
    return searcher;
  }, [temptations]);

  // Debounced search function (available for future use)
  // const debouncedSearch = useMemo(() => {
  //   return createDebouncedSearch(fuzzySearcher, 200);
  // }, [fuzzySearcher]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await initializeDB();
        const savedTemptations = await db.getTemptations();
        setTemptations(savedTemptations);
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle search with fuzzy matching
  const handleSearch = useCallback(
    (query: string) => {
      setSearchTerm(query);
      setIsSearching(true);

      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        setUseTypoTolerance(false);
        return;
      }

      // Perform search immediately for testing
      const results = fuzzySearcher.search(query);
      console.log(
        `Search for "${query}" found ${results.length} results:`,
        results
      );

      if (results.length === 0 && query.length > 2) {
        // Try with typo tolerance if no results found
        const typoResults = fuzzySearcher.searchWithTypoTolerance(query, 2);
        console.log(
          `Typo search for "${query}" found ${typoResults.length} results:`,
          typoResults
        );
        setSearchResults(typoResults);
        setUseTypoTolerance(typoResults.length > 0);
      } else {
        setSearchResults(results);
        setUseTypoTolerance(false);
      }
      setIsSearching(false);
    },
    [fuzzySearcher]
  );

  const filteredTemptations = useMemo(() => {
    let results = searchTerm ? searchResults.map((r) => r.item) : temptations;

    // Apply category filter
    if (selectedCategory !== "all") {
      results = results.filter(
        (temptation) => temptation.category === selectedCategory
      );
    }

    // Apply status filter
    if (selectedFilter === "resisted") {
      results = results.filter((temptation) => temptation.resisted);
    } else if (selectedFilter === "gave-in") {
      results = results.filter((temptation) => !temptation.resisted);
    }

    return results;
  }, [
    temptations,
    searchResults,
    searchTerm,
    selectedCategory,
    selectedFilter,
  ]);

  // Get search highlights for a temptation
  const getHighlights = useCallback(
    (temptation: Temptation) => {
      if (!searchTerm || !searchResults.length) return null;

      const result = searchResults.find((r) => r.item.id === temptation.id);
      return result?.highlights || null;
    },
    [searchTerm, searchResults]
  );

  // Component to render highlighted text
  const HighlightedText = ({
    text,
    highlights,
    field,
  }: {
    text: string;
    highlights: Array<{
      field: string;
      highlights: Array<{ start: number; end: number }>;
    }> | null;
    field: string;
  }) => {
    if (!highlights) return <span>{text}</span>;

    const fieldHighlights = highlights.find(
      (h) => h.field === field
    )?.highlights;
    if (!fieldHighlights || fieldHighlights.length === 0)
      return <span>{text}</span>;

    const result = [];
    let lastIndex = 0;

    for (const highlight of fieldHighlights) {
      // Add text before highlight
      if (highlight.start > lastIndex) {
        result.push(text.slice(lastIndex, highlight.start));
      }

      // Add highlighted text
      result.push(
        <mark
          key={highlight.start}
          className="bg-yellow-200 dark:bg-yellow-800 px-1 py-0.5 rounded-sm font-medium"
        >
          {text.slice(highlight.start, highlight.end)}
        </mark>
      );

      lastIndex = highlight.end;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }

    return <span>{result}</span>;
  };

  const handleDeleteTemptation = async (id: string) => {
    try {
      await db.deleteTemptation(id);
      setTemptations((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete temptation:", error);
    }
  };

  const categories = Object.values(TemptationCategory);
  const availableCategories = categories.filter((cat) =>
    temptations.some((t) => t.category === cat)
  );

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (d.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return d.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b z-40">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">History</h1>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            )}
            <Input
              placeholder="Smart search: descriptions, categories, amounts..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10"
            />
          </div>
          {useTypoTolerance && (
            <div className="flex items-center gap-2 mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-md">
              <Zap size={14} className="text-orange-600 dark:text-orange-400" />
              <p className="text-xs text-orange-600 dark:text-orange-400">
                Showing results with typo correction
              </p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="px-4 pb-4 space-y-3">
          {/* Status Filter */}
          <div className="flex gap-2">
            <Badge
              variant={selectedFilter === "all" ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors",
                selectedFilter === "all" && "bg-primary text-primary-foreground"
              )}
              onClick={() => setSelectedFilter("all")}
            >
              All
            </Badge>
            <Badge
              variant={selectedFilter === "resisted" ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors",
                selectedFilter === "resisted" &&
                  "bg-green-500 text-white hover:bg-green-600"
              )}
              onClick={() => setSelectedFilter("resisted")}
            >
              Resisted
            </Badge>
            <Badge
              variant={selectedFilter === "gave-in" ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors",
                selectedFilter === "gave-in" &&
                  "bg-red-500 text-white hover:bg-red-600"
              )}
              onClick={() => setSelectedFilter("gave-in")}
            >
              Gave In
            </Badge>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Badge
              variant={selectedCategory === "all" ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setSelectedCategory("all")}
            >
              All Categories
            </Badge>
            {availableCategories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredTemptations.length}{" "}
            {filteredTemptations.length === 1 ? "result" : "results"}
            {searchTerm && (
              <>
                {" "}
                for{" "}
                <span className="font-medium">&quot;{searchTerm}&quot;</span>
                {searchResults.length > 0 && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Ranked by relevance
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {/* History List */}
        {filteredTemptations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-2">
                {temptations.length === 0
                  ? "No temptations logged yet"
                  : "No results found"}
              </p>
              <p className="text-sm text-muted-foreground">
                {temptations.length === 0
                  ? "Start tracking your temptations to see your history"
                  : "Try adjusting your search or filters"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTemptations.map((temptation, index) => {
              const prevTemptation = filteredTemptations[index - 1];
              const showDateHeader =
                !prevTemptation ||
                formatDate(temptation.createdAt) !==
                  formatDate(prevTemptation.createdAt);

              const highlights = getHighlights(temptation);
              const searchResult = searchTerm
                ? searchResults.find((r) => r.item.id === temptation.id)
                : null;

              return (
                <div key={temptation.id}>
                  {showDateHeader && (
                    <div className="sticky top-24 bg-background/95 backdrop-blur-sm py-2 mb-2 border-b">
                      <p className="text-sm font-medium text-muted-foreground">
                        {formatDate(temptation.createdAt)}
                      </p>
                    </div>
                  )}

                  <Card
                    className={cn(
                      "group hover:bg-muted/50 transition-colors",
                      searchResult && "ring-1 ring-primary/20 bg-primary/5"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`relative p-2 rounded-full ${
                            temptation.resisted
                              ? "bg-green-500/20 text-green-600"
                              : "bg-red-500/20 text-red-600"
                          }`}
                        >
                          <CategoryIcon category={temptation.category} />
                          {searchResult && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-[8px] text-primary-foreground font-bold">
                                {Math.round(searchResult.score * 100)}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium truncate">
                              {temptation.resisted ? "Resisted" : "Gave In"}
                              {searchResult && (
                                <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                  {Math.round(searchResult.score * 100)}% match
                                </span>
                              )}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold">
                                <HighlightedText
                                  text={settings.formatAmount(
                                    temptation.amount
                                  )}
                                  highlights={highlights}
                                  field="amount"
                                />
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                onClick={() =>
                                  handleDeleteTemptation(temptation.id)
                                }
                              >
                                <Trash2
                                  size={14}
                                  className="text-destructive"
                                />
                              </Button>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-1 break-words">
                            <HighlightedText
                              text={temptation.description}
                              highlights={highlights}
                              field="description"
                            />
                          </p>

                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              <HighlightedText
                                text={temptation.category}
                                highlights={highlights}
                                field="category"
                              />
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              {new Date(
                                temptation.createdAt
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
