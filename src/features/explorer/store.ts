import { create } from 'zustand'
import type { FileEntry } from '@/types'

export type SortMode = 'name' | 'type' | 'size' | 'modified'
export type SortDirection = 'asc' | 'desc'
export type ViewMode = 'list'

export interface ExplorerStore {
  entries: FileEntry[]
  loading: boolean
  error: string | null
  sortMode: SortMode
  sortDirection: SortDirection
  viewMode: ViewMode
  selectedItems: string[]
  activeItem: string | null
  lastSelectedItem: string | null
  setEntries: (entries: FileEntry[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSortMode: (mode: SortMode) => void
  setSortDirection: (direction: SortDirection) => void
  setViewMode: (mode: ViewMode) => void
  selectItem: (path: string) => void
  setActiveItem: (path: string | null) => void
  clearSelection: () => void
  moveSelectionUp: (sortedPaths: string[]) => void
  moveSelectionDown: (sortedPaths: string[]) => void
  moveSelectionHome: (sortedPaths: string[]) => void
  moveSelectionEnd: (sortedPaths: string[]) => void
}

export const useExplorerStore = create<ExplorerStore>((set, get) => ({
  entries: [],
  loading: false,
  error: null,
  sortMode: 'name',
  sortDirection: 'asc',
  viewMode: 'list',
  selectedItems: [],
  activeItem: null,
  lastSelectedItem: null,

  setEntries: (entries) => set({ entries, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, entries: [], loading: false }),
  setSortMode: (sortMode) => set({ sortMode }),
  setSortDirection: (sortDirection) => set({ sortDirection }),
  setViewMode: (viewMode) => set({ viewMode }),

  selectItem: (path: string) =>
    set({ selectedItems: [path], activeItem: path, lastSelectedItem: path }),

  setActiveItem: (path: string | null) =>
    set({ activeItem: path, selectedItems: path ? [path] : [], lastSelectedItem: path }),

  clearSelection: () =>
    set({ selectedItems: [], activeItem: null, lastSelectedItem: null }),

  moveSelectionUp: (sortedPaths: string[]) => {
    const { activeItem } = get()
    const currentIndex = activeItem ? sortedPaths.indexOf(activeItem) : -1
    const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0
    const nextPath = sortedPaths[nextIndex]
    if (nextPath) {
      set({ selectedItems: [nextPath], activeItem: nextPath, lastSelectedItem: nextPath })
    }
  },

  moveSelectionDown: (sortedPaths: string[]) => {
    const { activeItem } = get()
    const currentIndex = activeItem ? sortedPaths.indexOf(activeItem) : -1
    const nextIndex = currentIndex < sortedPaths.length - 1 ? currentIndex + 1 : sortedPaths.length - 1
    const nextPath = sortedPaths[nextIndex]
    if (nextPath) {
      set({ selectedItems: [nextPath], activeItem: nextPath, lastSelectedItem: nextPath })
    }
  },

  moveSelectionHome: (sortedPaths: string[]) => {
    const first = sortedPaths[0]
    if (first) {
      set({ selectedItems: [first], activeItem: first, lastSelectedItem: first })
    }
  },

  moveSelectionEnd: (sortedPaths: string[]) => {
    const last = sortedPaths[sortedPaths.length - 1]
    if (last) {
      set({ selectedItems: [last], activeItem: last, lastSelectedItem: last })
    }
  },
}))
