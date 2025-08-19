'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Moon, Sun, Bell, Trash2, Download, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { BottomNav } from '@/components/bottom-nav'
import { AppSettings } from '@/lib/types'
import db, { initializeDB } from '@/lib/storage'

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'system',
    notifications: true,
    currency: '$'
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        await initializeDB()
        const savedSettings = await db.getSettings()
        if (savedSettings) {
          setSettings(savedSettings)
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleSettingChange = async (key: keyof AppSettings, value: any) => {
    const updatedSettings = { ...settings, [key]: value }
    setSettings(updatedSettings)
    await db.updateSettings(updatedSettings)
  }

  const handleExportData = async () => {
    try {
      const temptations = await db.getTemptations()
      const dataToExport = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        temptations,
        settings
      }

      const dataStr = JSON.stringify(dataToExport, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `skipwise-export-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export data:', error)
    }
  }

  const handleClearAllData = async () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      try {
        await db.clearAllData()
        location.reload()
      } catch (error) {
        console.error('Failed to clear data:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b z-40">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* App Preferences */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">App Preferences</h2>
          
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Theme Setting */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-muted-foreground">Choose your app appearance</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={settings.theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSettingChange('theme', 'light')}
                  >
                    <Sun size={16} />
                  </Button>
                  <Button
                    variant={settings.theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSettingChange('theme', 'dark')}
                  >
                    <Moon size={16} />
                  </Button>
                  <Button
                    variant={settings.theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSettingChange('theme', 'system')}
                  >
                    Auto
                  </Button>
                </div>
              </div>

              {/* Notifications Setting */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-muted-foreground">Get reminded to track temptations</p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                />
              </div>

              {/* Currency Setting */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Currency</p>
                  <p className="text-sm text-muted-foreground">Display currency symbol</p>
                </div>
                <div className="flex gap-2">
                  {['$', '€', '£', '¥'].map(currency => (
                    <Button
                      key={currency}
                      variant={settings.currency === currency ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSettingChange('currency', currency)}
                    >
                      {currency}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Management */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Data Management</h2>
          
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Export Data</p>
                  <p className="text-sm text-muted-foreground">Download your data as JSON</p>
                </div>
                <Button variant="outline" onClick={handleExportData}>
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Clear All Data</p>
                  <p className="text-sm text-muted-foreground">Delete all temptations and progress</p>
                </div>
                <Button variant="destructive" onClick={handleClearAllData}>
                  <Trash2 size={16} className="mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* About */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">About</h2>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">SkipWise</h3>
                  <p className="text-muted-foreground">Version 1.0.0</p>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Track your spending temptations and build financial discipline through 
                  smart resistance tracking and AI-powered insights.
                </p>

                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground">
                    Your data is stored locally on your device and never shared.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Notice */}
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-green-500/20">
                <Bell className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                  Privacy First
                </h3>
                <p className="text-sm text-green-800 dark:text-green-200">
                  All your data stays on your device. We don't collect, store, or share any personal information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}