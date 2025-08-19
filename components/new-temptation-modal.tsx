'use client'

import { useState, useEffect } from 'react'
import { X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { Temptation, TemptationCategory, Currency } from '@/lib/types'
import { categorizeTemptation, getCategorySuggestions, getCategoryColor, getAllCategories } from '@/lib/ai-categorization'
import { CategoryIcon } from '@/components/category-icon'
import { settings } from '@/lib/settings'
import { haptics } from '@/lib/haptics'
import db from '@/lib/storage'
import { cn } from '@/lib/utils'

interface NewTemptationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (temptation: Temptation) => void
}

export function NewTemptationModal({ isOpen, onClose, onSubmit }: NewTemptationModalProps) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [resisted, setResisted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [manualCategory, setManualCategory] = useState<TemptationCategory | string | null>(null)
  const [showCategorySelector, setShowCategorySelector] = useState(false)
  const [predictedCategory, setPredictedCategory] = useState<TemptationCategory | string | null>(null)
  const [categorySuggestions, setCategorySuggestions] = useState<Array<{category: TemptationCategory | string, confidence: number}>>([])
  const [allCategories, setAllCategories] = useState(getAllCategories())
  const [currency] = useState<Currency>(settings.getCurrency())

  const handleDescriptionChange = async (value: string) => {
    setDescription(value)
    if (value.trim().length > 3) {
      try {
        const predicted = await categorizeTemptation(value.trim())
        setPredictedCategory(predicted)
        
        // Get multiple suggestions for better UX
        const suggestions = getCategorySuggestions(value.trim(), 3)
        setCategorySuggestions(suggestions)
      } catch (error) {
        console.warn('Failed to predict category:', error)
        setCategorySuggestions([])
      }
    } else {
      setPredictedCategory(null)
      setCategorySuggestions([])
    }
  }

  // Update categories list when settings change
  useEffect(() => {
    setAllCategories(getAllCategories())
  }, [])

  const getSelectedCategory = () => manualCategory || predictedCategory || TemptationCategory.OTHER

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || !description.trim()) return

    haptics.impact()
    setIsSubmitting(true)
    
    try {
      const category = getSelectedCategory()
      
      const temptation: Temptation = {
        id: crypto.randomUUID(),
        amount: parseFloat(amount),
        description: description.trim(),
        resisted,
        category,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await db.addTemptation(temptation)
      onSubmit(temptation)
      
      // Haptic feedback based on resistance
      if (resisted) {
        haptics.success()
      } else {
        haptics.warning()
      }
      
      // Reset form
      setAmount('')
      setDescription('')
      setResisted(false)
      setManualCategory(null)
      setPredictedCategory(null)
      setCategorySuggestions([])
      setShowCategorySelector(false)
      onClose()
    } catch (error) {
      console.error('Failed to save temptation:', error)
      haptics.error()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <Card className="relative w-full max-w-md mx-4 mb-4 bg-background border-0 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">New Temptation</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount */}
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium text-muted-foreground">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {currency.symbol}
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 bg-muted/30"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Describe your temptation"
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className="bg-muted/30 min-h-20 resize-none"
                required
              />
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Category
              </label>
              <div className="space-y-2">
                {/* AI Suggestions Display */}
                {categorySuggestions.length > 0 && !manualCategory && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground mb-2">
                      AI Suggestions
                    </div>
                    {categorySuggestions.slice(0, 3).map((suggestion, index) => (
                      <button
                        key={suggestion.category}
                        type="button"
                        onClick={() => {
                          haptics.tap()
                          setManualCategory(suggestion.category)
                        }}
                        className={cn(
                          "flex items-center justify-between w-full p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors border border-dashed",
                          index === 0 && "border-primary/30 bg-primary/5"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <CategoryIcon category={suggestion.category} className="text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {suggestion.category}
                          </span>
                          {index === 0 && (
                            <span className="text-xs text-primary font-medium px-1.5 py-0.5 rounded bg-primary/10">
                              Best match
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all",
                                suggestion.confidence > 0.7 ? "bg-green-500" :
                                suggestion.confidence > 0.4 ? "bg-yellow-500" : "bg-red-500"
                              )}
                              style={{ width: `${suggestion.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">
                            {Math.round(suggestion.confidence * 100)}%
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Manual Category Selector */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between bg-muted/30 hover:bg-muted/50"
                  onClick={() => setShowCategorySelector(!showCategorySelector)}
                >
                  <div className="flex items-center gap-2">
                    <CategoryIcon category={getSelectedCategory()} className="text-muted-foreground" />
                    <span>
                      {manualCategory ? `${manualCategory} (Manual)` : 
                       predictedCategory ? `${predictedCategory} (AI${categorySuggestions[0]?.confidence ? ` - ${Math.round(categorySuggestions[0].confidence * 100)}%` : ''})` : 
                       'Select Category'}
                    </span>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", showCategorySelector && "rotate-180")} />
                </Button>

                {/* Category Grid */}
                {showCategorySelector && (
                  <div className="grid grid-cols-2 gap-2 p-2 border rounded-lg bg-background max-h-64 overflow-y-auto">
                    {/* Built-in categories */}
                    <div className="col-span-2 text-xs font-semibold text-muted-foreground px-2 py-1 border-b">
                      Built-in Categories
                    </div>
                    {allCategories.filter(cat => !cat.isCustom).map((categoryItem) => (
                      <button
                        key={categoryItem.name}
                        type="button"
                        onClick={() => {
                          haptics.tap()
                          setManualCategory(categoryItem.name as TemptationCategory)
                          setShowCategorySelector(false)
                        }}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-md text-left text-sm transition-colors hover:bg-muted",
                          manualCategory === categoryItem.name && "bg-muted ring-1 ring-primary"
                        )}
                      >
                        <div className={cn("p-1.5 rounded-full", getCategoryColor(categoryItem.name as TemptationCategory))}>
                          <CategoryIcon category={categoryItem.name as TemptationCategory} className="text-white" />
                        </div>
                        <span className="text-xs font-medium">{categoryItem.name}</span>
                      </button>
                    ))}
                    
                    {/* Custom categories */}
                    {allCategories.some(cat => cat.isCustom) && (
                      <>
                        <div className="col-span-2 text-xs font-semibold text-muted-foreground px-2 py-1 border-b mt-2">
                          Custom Categories
                        </div>
                        {allCategories.filter(cat => cat.isCustom).map((categoryItem) => (
                          <button
                            key={categoryItem.name}
                            type="button"
                            onClick={() => {
                              haptics.tap()
                              setManualCategory(categoryItem.name)
                              setShowCategorySelector(false)
                            }}
                            className={cn(
                              "flex items-center gap-2 p-2 rounded-md text-left text-sm transition-colors hover:bg-muted",
                              manualCategory === categoryItem.name && "bg-muted ring-1 ring-primary"
                            )}
                          >
                            <div 
                              className="p-1.5 rounded-full w-6 h-6 flex items-center justify-center"
                              style={{ backgroundColor: categoryItem.color }}
                            >
                              <span className="text-white text-xs font-bold">
                                {categoryItem.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-xs font-medium">{categoryItem.name}</span>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}

                {/* Reset Category */}
                {manualCategory && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setManualCategory(null)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Use AI suggestion
                  </Button>
                )}
              </div>
            </div>

            {/* Resisted Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Resisted</p>
                <p className="text-xs text-muted-foreground">
                  Did you resist this temptation?
                </p>
              </div>
              <Switch
                checked={resisted}
                onCheckedChange={(checked) => {
                  haptics.tap()
                  setResisted(checked)
                }}
                className="data-[state=checked]:bg-green-500"
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className={cn(
                "w-full font-medium py-3 text-white transition-colors",
                resisted 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-red-500 hover:bg-red-600"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Submit'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}