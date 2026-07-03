import { create } from 'zustand'

import { normalize, parent, isRoot } from '@/lib/pathUtils'

export interface PaneNavState {
  currentPath: string
  history: string[]
  historyIndex: number
}

export interface NavigationStore {
  panes: Record<string, Record<string, PaneNavState>>
  registerPane: (paneId: string) => void
  unregisterPane: (paneId: string) => void
  registerTab: (paneId: string, tabId: string, initialPath?: string) => void
  unregisterTab: (paneId: string, tabId: string) => void
  navigate: (paneId: string, tabId: string, path: string) => void
  goBack: (paneId: string, tabId: string) => void
  goForward: (paneId: string, tabId: string) => void
  goUp: (paneId: string, tabId: string) => void
  refresh: (paneId: string, tabId: string) => void
}

const defaultPaneNav: PaneNavState = {
  currentPath: '',
  history: [''],
  historyIndex: 0,
}

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  panes: {},

  registerPane: (paneId) =>
    set((state) => {
      if (state.panes[paneId]) return state
      return {
        panes: { ...state.panes, [paneId]: {} },
      }
    }),

  unregisterPane: (paneId) =>
    set((state) => {
      const { [paneId]: _, ...rest } = state.panes
      return { panes: rest }
    }),

  registerTab: (paneId, tabId, initialPath) =>
    set((state) => {
      const paneTabs = state.panes[paneId]
      if (!paneTabs) return state
      if (paneTabs[tabId]) return state
      const init = initialPath
        ? { currentPath: initialPath, history: [initialPath], historyIndex: 0 }
        : { ...defaultPaneNav }
      return {
        panes: {
          ...state.panes,
          [paneId]: { ...paneTabs, [tabId]: init },
        },
      }
    }),

  unregisterTab: (paneId, tabId) =>
    set((state) => {
      const paneTabs = state.panes[paneId]
      if (!paneTabs) return state
      const { [tabId]: _, ...rest } = paneTabs
      return {
        panes: { ...state.panes, [paneId]: rest },
      }
    }),

  navigate: (paneId, tabId, path) => {
    const normalized = normalize(path)
    set((state) => {
      const paneTabs = state.panes[paneId]
      if (!paneTabs) return state
      const tab = paneTabs[tabId]
      if (!tab) return state
      const truncated = tab.history.slice(0, tab.historyIndex + 1)
      truncated.push(normalized)
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...paneTabs,
            [tabId]: {
              currentPath: normalized,
              history: truncated,
              historyIndex: truncated.length - 1,
            },
          },
        },
      }
    })
  },

  goBack: (paneId, tabId) => {
    set((state) => {
      const paneTabs = state.panes[paneId]
      if (!paneTabs) return state
      const tab = paneTabs[tabId]
      if (!tab || tab.historyIndex <= 0) return state
      const newIndex = tab.historyIndex - 1
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...paneTabs,
            [tabId]: {
              ...tab,
              currentPath: tab.history[newIndex],
              historyIndex: newIndex,
            },
          },
        },
      }
    })
  },

  goForward: (paneId, tabId) => {
    set((state) => {
      const paneTabs = state.panes[paneId]
      if (!paneTabs) return state
      const tab = paneTabs[tabId]
      if (!tab || tab.historyIndex >= tab.history.length - 1) return state
      const newIndex = tab.historyIndex + 1
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...paneTabs,
            [tabId]: {
              ...tab,
              currentPath: tab.history[newIndex],
              historyIndex: newIndex,
            },
          },
        },
      }
    })
  },

  goUp: (paneId, tabId) => {
    const paneTabs = get().panes[paneId]
    if (!paneTabs) return
    const tab = paneTabs[tabId]
    if (!tab) return
    const { currentPath } = tab
    if (!currentPath) return
    if (isRoot(currentPath)) return
    const parentPath = parent(currentPath)
    get().navigate(paneId, tabId, parentPath)
  },

  refresh: (paneId, tabId) =>
    set((state) => {
      const paneTabs = state.panes[paneId]
      if (!paneTabs) return state
      const tab = paneTabs[tabId]
      if (!tab) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...paneTabs,
            [tabId]: { ...tab, currentPath: `${tab.currentPath}` },
          },
        },
      }
    }),
}))
