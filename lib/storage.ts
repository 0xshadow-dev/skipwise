import { Temptation, UserProgress, CategoryStats, AIInsight, AppSettings } from './types'

const DB_NAME = 'skipwise-db'
const DB_VERSION = 1
const STORES = {
  TEMPTATIONS: 'temptations',
  PROGRESS: 'progress',
  INSIGHTS: 'insights',
  SETTINGS: 'settings'
}

class SkipWiseDB {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains(STORES.TEMPTATIONS)) {
          const temptationStore = db.createObjectStore(STORES.TEMPTATIONS, { keyPath: 'id' })
          temptationStore.createIndex('createdAt', 'createdAt', { unique: false })
          temptationStore.createIndex('category', 'category', { unique: false })
          temptationStore.createIndex('resisted', 'resisted', { unique: false })
        }

        if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
          db.createObjectStore(STORES.PROGRESS, { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains(STORES.INSIGHTS)) {
          const insightStore = db.createObjectStore(STORES.INSIGHTS, { keyPath: 'id' })
          insightStore.createIndex('createdAt', 'createdAt', { unique: false })
        }

        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' })
        }
      }
    })
  }

  private getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized')
    const transaction = this.db.transaction(storeName, mode)
    return transaction.objectStore(storeName)
  }

  async addTemptation(temptation: Temptation): Promise<void> {
    const store = this.getStore(STORES.TEMPTATIONS, 'readwrite')
    await this.promisifyRequest(store.add(temptation))
  }

  async getTemptations(): Promise<Temptation[]> {
    const store = this.getStore(STORES.TEMPTATIONS)
    const index = store.index('createdAt')
    const request = index.openCursor(null, 'prev')
    
    return new Promise((resolve) => {
      const results: Temptation[] = []
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          results.push(cursor.value)
          cursor.continue()
        } else {
          resolve(results)
        }
      }
    })
  }

  async getTemptationsByFilter(filter: {
    category?: string
    resisted?: boolean
    limit?: number
  }): Promise<Temptation[]> {
    const store = this.getStore(STORES.TEMPTATIONS)
    const temptations = await this.getTemptations()
    
    let filtered = temptations
    
    if (filter.category) {
      filtered = filtered.filter(t => t.category === filter.category)
    }
    
    if (filter.resisted !== undefined) {
      filtered = filtered.filter(t => t.resisted === filter.resisted)
    }
    
    if (filter.limit) {
      filtered = filtered.slice(0, filter.limit)
    }
    
    return filtered
  }

  async updateTemptation(id: string, updates: Partial<Temptation>): Promise<void> {
    const store = this.getStore(STORES.TEMPTATIONS, 'readwrite')
    const temptation = await this.promisifyRequest(store.get(id))
    if (temptation) {
      const updated = { ...temptation, ...updates, updatedAt: new Date() }
      await this.promisifyRequest(store.put(updated))
    }
  }

  async deleteTemptation(id: string): Promise<void> {
    const store = this.getStore(STORES.TEMPTATIONS, 'readwrite')
    await this.promisifyRequest(store.delete(id))
  }

  async getUserProgress(): Promise<UserProgress | null> {
    const store = this.getStore(STORES.PROGRESS)
    const progress = await this.promisifyRequest(store.get('current'))
    return progress || null
  }

  async updateUserProgress(progress: UserProgress): Promise<void> {
    const store = this.getStore(STORES.PROGRESS, 'readwrite')
    await this.promisifyRequest(store.put({ ...progress, id: 'current' }))
  }

  async getInsights(): Promise<AIInsight[]> {
    const store = this.getStore(STORES.INSIGHTS)
    const index = store.index('createdAt')
    const request = index.openCursor(null, 'prev')
    
    return new Promise((resolve) => {
      const results: AIInsight[] = []
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          results.push(cursor.value)
          cursor.continue()
        } else {
          resolve(results)
        }
      }
    })
  }

  async addInsight(insight: AIInsight): Promise<void> {
    const store = this.getStore(STORES.INSIGHTS, 'readwrite')
    await this.promisifyRequest(store.add(insight))
  }

  async getSettings(): Promise<AppSettings | null> {
    const store = this.getStore(STORES.SETTINGS)
    const settings = await this.promisifyRequest(store.get('app'))
    return settings?.value || null
  }

  async updateSettings(settings: AppSettings): Promise<void> {
    const store = this.getStore(STORES.SETTINGS, 'readwrite')
    await this.promisifyRequest(store.put({ key: 'app', value: settings }))
  }

  async clearAllData(): Promise<void> {
    const stores = Object.values(STORES)
    for (const storeName of stores) {
      const store = this.getStore(storeName, 'readwrite')
      await this.promisifyRequest(store.clear())
    }
  }

  private promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
}

export const db = new SkipWiseDB()

export async function initializeDB(): Promise<void> {
  await db.init()
}

export default db