import { create } from 'zustand'

import { normalize, parent, isRoot } from '@/lib/pathUtils'

export interface NavigationStore {
  currentPath: string
  history: string[]
  historyIndex: number
  canGoBack: boolean
  canGoForward: boolean
  navigate: (path: string) => void
  goBack: () => void
  goForward: () => void
  goUp: () => void
  refresh: () => void
}

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  currentPath: '',
  history: [''],
  historyIndex: 0,
  canGoBack: false,
  canGoForward: false,

  navigate: (path: string) => {
    const normalized = normalize(path)
    const { history, historyIndex } = get()

    const truncated = history.slice(0, historyIndex + 1)
    truncated.push(normalized)

    set({
      currentPath: normalized,
      history: truncated,
      historyIndex: truncated.length - 1,
      canGoBack: truncated.length > 1,
      canGoForward: false,
    })
  },

  goBack: () => {
    const { history, historyIndex } = get()
    if (historyIndex <= 0) return

    const newIndex = historyIndex - 1
    set({
      currentPath: history[newIndex],
      historyIndex: newIndex,
      canGoBack: newIndex > 0,
      canGoForward: true,
    })
  },

  goForward: () => {
    const { history, historyIndex } = get()
    if (historyIndex >= history.length - 1) return

    const newIndex = historyIndex + 1
    set({
      currentPath: history[newIndex],
      historyIndex: newIndex,
      canGoBack: true,
      canGoForward: newIndex < history.length - 1,
    })
  },

  goUp: () => {
    const { currentPath } = get()
    if (!currentPath) return
    if (isRoot(currentPath)) return

    const parentPath = parent(currentPath)
    get().navigate(parentPath)
  },

  refresh: () => {
    const { currentPath } = get()
    set({ currentPath: `${currentPath}` })
  },
}))
