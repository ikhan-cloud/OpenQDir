import { commandRegistry } from './commandRegistry'

class GlobalShortcutManagerService {
  private shortcuts = new Map<string, string[]>()

  register(shortcut: string, commandId: string): void {
    const existing = this.shortcuts.get(shortcut) ?? []
    if (!existing.includes(commandId)) {
      existing.push(commandId)
    }
    this.shortcuts.set(shortcut, existing)
  }

  unregister(shortcut: string, commandId: string): void {
    const existing = this.shortcuts.get(shortcut)
    if (!existing) return
    const filtered = existing.filter((id) => id !== commandId)
    if (filtered.length === 0) {
      this.shortcuts.delete(shortcut)
    } else {
      this.shortcuts.set(shortcut, filtered)
    }
  }

  getCommandIds(shortcut: string): string[] {
    return this.shortcuts.get(shortcut) ?? []
  }

  execute(shortcut: string): void {
    const ids = this.getCommandIds(shortcut)
    for (const id of ids) {
      commandRegistry.execute(id)
    }
  }

  getAll(): Array<{ shortcut: string; commandIds: string[] }> {
    return Array.from(this.shortcuts.entries()).map(([shortcut, commandIds]) => ({
      shortcut,
      commandIds,
    }))
  }

  clear(): void {
    this.shortcuts.clear()
  }
}

export const globalShortcutManager = new GlobalShortcutManagerService()
