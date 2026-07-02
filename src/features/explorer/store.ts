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
  selectedPath: string | null
  setEntries: (entries: FileEntry[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSortMode: (mode: SortMode) => void
  setSortDirection: (direction: SortDirection) => void
  setViewMode: (mode: ViewMode) => void
  setSelectedPath: (path: string | null) => void
  clearSelection: () => void
}

export const useExplorerStore = create<ExplorerStore>((set) => ({
  entries: [],
  loading: false,
  error: null,
  sortMode: 'name',
  sortDirection: 'asc',
  viewMode: 'list',
  selectedPath: null,
  setEntries: (entries) => set({ entries, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, entries: [], loading: false }),
  setSortMode: (sortMode) => set({ sortMode }),
  setSortDirection: (sortDirection) => set({ sortDirection }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedPath: (selectedPath) => set({ selectedPath }),
  clearSelection: () => set({ selectedPath: null }),
}))
