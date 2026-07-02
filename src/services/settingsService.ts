const STORAGE_PREFIX = 'openqdir'

class SettingsService {
  private prefix: string

  constructor(prefix: string = STORAGE_PREFIX) {
    this.prefix = prefix
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`
  }

  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(this.getKey(key))
      if (item === null) return defaultValue
      return JSON.parse(item) as T
    } catch {
      return defaultValue
    }
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(this.getKey(key), JSON.stringify(value))
  }

  remove(key: string): void {
    localStorage.removeItem(this.getKey(key))
  }

  clear(): void {
    const prefix = `${this.prefix}:`
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith(prefix)) {
        keys.push(k)
      }
    }
    keys.forEach((k) => localStorage.removeItem(k))
  }

  has(key: string): boolean {
    return localStorage.getItem(this.getKey(key)) !== null
  }
}

export const settingsService = new SettingsService()
