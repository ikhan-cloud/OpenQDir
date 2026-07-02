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
}

export interface ExplorerStore {
  panes: Record<string, PaneExplorerState>
  registerPane: (paneId: string) => void
  unregisterPane: (paneId: string) => void
  setEntries: (paneId: string, entries: FileEntry[]) => void
  setLoading: (paneId: string, loading: boolean) => void
  setError: (paneId: string, error: string | null) => void
  setSortMode: (paneId: string, mode: SortMode) => void
  setSortDirection: (paneId: string, direction: SortDirection) => void
  setViewMode: (paneId: string, mode: ViewMode) => void
  selectItem: (paneId: string, path: string) => void
  setActiveItem: (paneId: string, path: string | null) => void
  clearSelection: (paneId: string) => void
  moveSelectionUp: (paneId: string, sortedPaths: string[]) => void
  moveSelectionDown: (paneId: string, sortedPaths: string[]) => void
  moveSelectionHome: (paneId: string, sortedPaths: string[]) => void
  moveSelectionEnd: (paneId: string, sortedPaths: string[]) => void
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
}

export const useExplorerStore = create<ExplorerStore>((set, get) => ({
  panes: {},

  registerPane: (paneId) =>
    set((state) => {
      if (state.panes[paneId]) return state
      return {
        panes: { ...state.panes, [paneId]: { ...defaultPaneExplorer } },
      }
    }),

  unregisterPane: (paneId) =>
    set((state) => {
      const { [paneId]: _, ...rest } = state.panes
      return { panes: rest as Record<string, PaneExplorerState> }
    }),

  setEntries: (paneId, entries) =>
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane) return state
      return {
        panes: { ...state.panes, [paneId]: { ...pane, entries, error: null } },
      }
    }),

  setLoading: (paneId, loading) =>
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane) return state
      return {
        panes: { ...state.panes, [paneId]: { ...pane, loading } },
      }
    }),

  setError: (paneId, error) =>
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: { ...pane, error, entries: [], loading: false },
        },
      }
    }),

  setSortMode: (paneId, sortMode) =>
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane) return state
      return {
        panes: { ...state.panes, [paneId]: { ...pane, sortMode } },
      }
    }),

  setSortDirection: (paneId, sortDirection) =>
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane) return state
      return {
        panes: { ...state.panes, [paneId]: { ...pane, sortDirection } },
      }
    }),

  setViewMode: (paneId, viewMode) =>
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane) return state
      return {
        panes: { ...state.panes, [paneId]: { ...pane, viewMode } },
      }
    }),

  selectItem: (paneId, path) =>
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: { ...pane, selectedItems: [path], activeItem: path, lastSelectedItem: path },
        },
      }
    }),

  setActiveItem: (paneId, path) =>
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...pane,
            activeItem: path,
            selectedItems: path ? [path] : [],
            lastSelectedItem: path,
          },
        },
      }
    }),

  clearSelection: (paneId) =>
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: { ...pane, selectedItems: [], activeItem: null, lastSelectedItem: null },
        },
      }
    }),

  moveSelectionUp: (paneId, sortedPaths) => {
    const pane = get().panes[paneId]
    if (!pane) return
    const currentIndex = pane.activeItem ? sortedPaths.indexOf(pane.activeItem) : -1
    const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0
    const nextPath = sortedPaths[nextIndex]
    if (!nextPath) return
    set((state) => ({
      panes: {
        ...state.panes,
        [paneId]: {
          ...state.panes[paneId]!,
          selectedItems: [nextPath],
          activeItem: nextPath,
          lastSelectedItem: nextPath,
        },
      },
    }))
  },

  moveSelectionDown: (paneId, sortedPaths) => {
    const pane = get().panes[paneId]
    if (!pane) return
    const currentIndex = pane.activeItem ? sortedPaths.indexOf(pane.activeItem) : -1
    const nextIndex =
      currentIndex < sortedPaths.length - 1 ? currentIndex + 1 : sortedPaths.length - 1
    const nextPath = sortedPaths[nextIndex]
    if (!nextPath) return
    set((state) => ({
      panes: {
        ...state.panes,
        [paneId]: {
          ...state.panes[paneId]!,
          selectedItems: [nextPath],
          activeItem: nextPath,
          lastSelectedItem: nextPath,
        },
      },
    }))
  },

  moveSelectionHome: (paneId, sortedPaths) => {
    const first = sortedPaths[0]
    if (!first) return
    set((state) => ({
      panes: {
        ...state.panes,
        [paneId]: {
          ...state.panes[paneId]!,
          selectedItems: [first],
          activeItem: first,
          lastSelectedItem: first,
        },
      },
    }))
  },

  moveSelectionEnd: (paneId, sortedPaths) => {
    const last = sortedPaths[sortedPaths.length - 1]
    if (!last) return
    set((state) => ({
      panes: {
        ...state.panes,
        [paneId]: {
          ...state.panes[paneId]!,
          selectedItems: [last],
          activeItem: last,
          lastSelectedItem: last,
        },
      },
    }))
  },
}))
