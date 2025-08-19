'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { Temptation, TemptationCategory } from '@/lib/types'
import { categorizeTemptation } from '@/lib/ai-categorization'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || !description.trim()) return

    setIsSubmitting(true)
    
    try {
      const temptation: Temptation = {
        id: crypto.randomUUID(),
        amount: parseFloat(amount),
        description: description.trim(),
        resisted,
        category: categorizeTemptation(description),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await db.addTemptation(temptation)
      onSubmit(temptation)
      
      // Reset form
      setAmount('')
      setDescription('')
      setResisted(false)
      onClose()
    } catch (error) {
      console.error('Failed to save temptation:', error)
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
                  $
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
                onChange={(e) => setDescription(e.target.value)}
                className="bg-muted/30 min-h-20 resize-none"
                required
              />
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
                onCheckedChange={setResisted}
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