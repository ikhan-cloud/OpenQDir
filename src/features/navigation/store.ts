import { create } from 'zustand'

import { normalize, parent, isRoot } from '@/lib/pathUtils'

export interface PaneNavState {
  currentPath: string
  history: string[]
  historyIndex: number
}

export interface NavigationStore {
  panes: Record<string, PaneNavState>
  registerPane: (paneId: string) => void
  unregisterPane: (paneId: string) => void
  navigate: (paneId: string, path: string) => void
  goBack: (paneId: string) => void
  goForward: (paneId: string) => void
  goUp: (paneId: string) => void
  refresh: (paneId: string) => void
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
        panes: { ...state.panes, [paneId]: { ...defaultPaneNav } },
      }
    }),

  unregisterPane: (paneId) =>
    set((state) => {
      const { [paneId]: _, ...rest } = state.panes
      return { panes: rest as Record<string, PaneNavState> }
    }),

  navigate: (paneId, path) => {
    const normalized = normalize(path)
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane) return state
      const truncated = pane.history.slice(0, pane.historyIndex + 1)
      truncated.push(normalized)
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            currentPath: normalized,
            history: truncated,
            historyIndex: truncated.length - 1,
          },
        },
      }
    })
  },

  goBack: (paneId) => {
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane || pane.historyIndex <= 0) return state
      const newIndex = pane.historyIndex - 1
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...pane,
            currentPath: pane.history[newIndex],
            historyIndex: newIndex,
          },
        },
      }
    })
  },

  goForward: (paneId) => {
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane || pane.historyIndex >= pane.history.length - 1) return state
      const newIndex = pane.historyIndex + 1
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...pane,
            currentPath: pane.history[newIndex],
            historyIndex: newIndex,
          },
        },
      }
    })
  },

  goUp: (paneId) => {
    const { currentPath } = get().panes[paneId] ?? { currentPath: '' }
    if (!currentPath) return
    if (isRoot(currentPath)) return
    const parentPath = parent(currentPath)
    get().navigate(paneId, parentPath)
  },

  refresh: (paneId) =>
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: { ...pane, currentPath: `${pane.currentPath}` },
        },
      }
    }),
}))
