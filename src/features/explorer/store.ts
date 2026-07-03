import { create } from 'zustand'
import type { FileEntry } from '@/types'

export type SortMode = 'name' | 'type' | 'size' | 'modified'
export type SortDirection = 'asc' | 'desc'
export type ViewMode = 'list'

export interface PaneExplorerState {
  entries: FileEntry[]
  loading: boolean
  error: string | null
  sortMode: SortMode
  sortDirection: SortDirection
  viewMode: ViewMode
  selectedItems: string[]
  activeItem: string | null
  lastSelectedItem: string | null
  filterQuery: string
}

export interface ExplorerStore {
  panes: Record<string, Record<string, PaneExplorerState>>
  registerPane: (paneId: string) => void
  unregisterPane: (paneId: string) => void
  registerTab: (paneId: string, tabId: string) => void
  unregisterTab: (paneId: string, tabId: string) => void
  setEntries: (paneId: string, tabId: string, entries: FileEntry[]) => void
  setLoading: (paneId: string, tabId: string, loading: boolean) => void
  setError: (paneId: string, tabId: string, error: string | null) => void
  setSortMode: (paneId: string, tabId: string, mode: SortMode) => void
  setSortDirection: (paneId: string, tabId: string, direction: SortDirection) => void
  setViewMode: (paneId: string, tabId: string, mode: ViewMode) => void
  setFilterQuery: (paneId: string, tabId: string, query: string) => void
  selectItem: (paneId: string, tabId: string, path: string) => void
  setActiveItem: (paneId: string, tabId: string, path: string | null) => void
  clearSelection: (paneId: string, tabId: string) => void
  moveSelectionUp: (paneId: string, tabId: string, sortedPaths: string[]) => void
  moveSelectionDown: (paneId: string, tabId: string, sortedPaths: string[]) => void
  moveSelectionHome: (paneId: string, tabId: string, sortedPaths: string[]) => void
  moveSelectionEnd: (paneId: string, tabId: string, sortedPaths: string[]) => void
}

const defaultPaneExplorer: PaneExplorerState = {
  entries: [],
  loading: false,
  error: null,
  sortMode: 'name',
  sortDirection: 'asc',
  viewMode: 'list',
  selectedItems: [],
  activeItem: null,
  lastSelectedItem: null,
  filterQuery: '',
}

export const useExplorerStore = create<ExplorerStore>((set, get) => ({
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

  registerTab: (paneId, tabId) =>
    set((state) => {
      const paneTabs = state.panes[paneId]
      if (!paneTabs) return state
      if (paneTabs[tabId]) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: { ...paneTabs, [tabId]: { ...defaultPaneExplorer } },
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

  setEntries: (paneId, tabId, entries) =>
    set((state) => {
      const tab = state.panes[paneId]?.[tabId]
      if (!tab) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...state.panes[paneId],
            [tabId]: { ...tab, entries, error: null },
          },
        },
      }
    }),

  setLoading: (paneId, tabId, loading) =>
    set((state) => {
      const tab = state.panes[paneId]?.[tabId]
      if (!tab) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...state.panes[paneId],
            [tabId]: { ...tab, loading },
          },
        },
      }
    }),

  setError: (paneId, tabId, error) =>
    set((state) => {
      const tab = state.panes[paneId]?.[tabId]
      if (!tab) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...state.panes[paneId],
            [tabId]: { ...tab, error, entries: [], loading: false },
          },
        },
      }
    }),

  setSortMode: (paneId, tabId, sortMode) =>
    set((state) => {
      const tab = state.panes[paneId]?.[tabId]
      if (!tab) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...state.panes[paneId],
            [tabId]: { ...tab, sortMode },
          },
        },
      }
    }),

  setSortDirection: (paneId, tabId, sortDirection) =>
    set((state) => {
      const tab = state.panes[paneId]?.[tabId]
      if (!tab) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...state.panes[paneId],
            [tabId]: { ...tab, sortDirection },
          },
        },
      }
    }),

  setViewMode: (paneId, tabId, viewMode) =>
    set((state) => {
      const tab = state.panes[paneId]?.[tabId]
      if (!tab) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...state.panes[paneId],
            [tabId]: { ...tab, viewMode },
          },
        },
      }
    }),

  setFilterQuery: (paneId, tabId, filterQuery) =>
    set((state) => {
      const tab = state.panes[paneId]?.[tabId]
      if (!tab) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...state.panes[paneId],
            [tabId]: { ...tab, filterQuery },
          },
        },
      }
    }),

  selectItem: (paneId, tabId, path) =>
    set((state) => {
      const tab = state.panes[paneId]?.[tabId]
      if (!tab) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...state.panes[paneId],
            [tabId]: { ...tab, selectedItems: [path], activeItem: path, lastSelectedItem: path },
          },
        },
      }
    }),

  setActiveItem: (paneId, tabId, path) =>
    set((state) => {
      const tab = state.panes[paneId]?.[tabId]
      if (!tab) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...state.panes[paneId],
            [tabId]: {
              ...tab,
              activeItem: path,
              selectedItems: path ? [path] : [],
              lastSelectedItem: path,
            },
          },
        },
      }
    }),

  clearSelection: (paneId, tabId) =>
    set((state) => {
      const tab = state.panes[paneId]?.[tabId]
      if (!tab) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...state.panes[paneId],
            [tabId]: { ...tab, selectedItems: [], activeItem: null, lastSelectedItem: null },
          },
        },
      }
    }),

  moveSelectionUp: (paneId, tabId, sortedPaths) => {
    const tab = get().panes[paneId]?.[tabId]
    if (!tab) return
    const currentIndex = tab.activeItem ? sortedPaths.indexOf(tab.activeItem) : -1
    const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0
    const nextPath = sortedPaths[nextIndex]
    if (!nextPath) return
    set((state) => ({
      panes: {
        ...state.panes,
        [paneId]: {
          ...state.panes[paneId],
          [tabId]: {
            ...state.panes[paneId]![tabId]!,
            selectedItems: [nextPath],
            activeItem: nextPath,
            lastSelectedItem: nextPath,
          },
        },
      },
    }))
  },

  moveSelectionDown: (paneId, tabId, sortedPaths) => {
    const tab = get().panes[paneId]?.[tabId]
    if (!tab) return
    const currentIndex = tab.activeItem ? sortedPaths.indexOf(tab.activeItem) : -1
    const nextIndex =
      currentIndex < sortedPaths.length - 1 ? currentIndex + 1 : sortedPaths.length - 1
    const nextPath = sortedPaths[nextIndex]
    if (!nextPath) return
    set((state) => ({
      panes: {
        ...state.panes,
        [paneId]: {
          ...state.panes[paneId],
          [tabId]: {
            ...state.panes[paneId]![tabId]!,
            selectedItems: [nextPath],
            activeItem: nextPath,
            lastSelectedItem: nextPath,
          },
        },
      },
    }))
  },

  moveSelectionHome: (paneId, tabId, sortedPaths) => {
    const first = sortedPaths[0]
    if (!first) return
    set((state) => ({
      panes: {
        ...state.panes,
        [paneId]: {
          ...state.panes[paneId],
          [tabId]: {
            ...state.panes[paneId]![tabId]!,
            selectedItems: [first],
            activeItem: first,
            lastSelectedItem: first,
          },
        },
      },
    }))
  },

  moveSelectionEnd: (paneId, tabId, sortedPaths) => {
    const last = sortedPaths[sortedPaths.length - 1]
    if (!last) return
    set((state) => ({
      panes: {
        ...state.panes,
        [paneId]: {
          ...state.panes[paneId],
          [tabId]: {
            ...state.panes[paneId]![tabId]!,
            selectedItems: [last],
            activeItem: last,
            lastSelectedItem: last,
          },
        },
      },
    }))
  },
}))
