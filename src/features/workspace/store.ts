import { create } from 'zustand'

import { settingsService } from '@/services'

export type LayoutMode = 'single' | 'horizontal' | 'vertical' | 'grid'

export interface TabState {
  id: string
  name: string
  currentPath: string
}

export interface PaneState {
  id: string
  tabs: TabState[]
  activeTabId: string
}

export interface WorkspaceStore {
  panes: PaneState[]
  activePaneId: string
  layout: LayoutMode
  paneSizes: Record<string, number>
  minPaneSize: number
  initPanes: (ids: string[]) => void
  setActivePane: (id: string) => void
  setPanePath: (id: string, path: string) => void
  setLayout: (layout: LayoutMode) => void
  setPaneSize: (id: string, size: number) => void
  setPaneSizes: (sizes: Record<string, number>) => void
  getActiveTab: (paneId: string) => TabState | undefined
}

const DEFAULT_TAB_ID = 'tab1'

function createDefaultTab(): TabState {
  return { id: DEFAULT_TAB_ID, name: 'Tab 1', currentPath: '' }
}

function createDefaultPane(id: string): PaneState {
  return {
    id,
    tabs: [createDefaultTab()],
    activeTabId: DEFAULT_TAB_ID,
  }
}

function getPaneIdsForLayout(layout: LayoutMode): string[] {
  switch (layout) {
    case 'single':
      return ['main']
    case 'horizontal':
      return ['main', 'pane2']
    case 'vertical':
      return ['main', 'pane2']
    case 'grid':
      return ['main', 'pane2', 'pane3', 'pane4']
  }
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  panes: [],
  activePaneId: '',
  layout: 'single',
  paneSizes: settingsService.get<Record<string, number>>('paneSizes', {}),
  minPaneSize: 200,

  initPanes: (ids) =>
    set({
      panes: ids.map((id) => createDefaultPane(id)),
      activePaneId: ids[0] ?? '',
    }),

  setActivePane: (id) => set({ activePaneId: id }),

  setPanePath: (id, path) =>
    set((state) => ({
      panes: state.panes.map((p) =>
        p.id === id
          ? {
              ...p,
              tabs: p.tabs.map((t) =>
                t.id === p.activeTabId ? { ...t, currentPath: path } : t,
              ),
            }
          : p,
      ),
    })),

  setLayout: (layout) =>
    set((state) => {
      const newIds = getPaneIdsForLayout(layout)

      const existing = new Map(state.panes.map((p) => [p.id, p]))

      const cacheKey = '__paneStateCache'
      const cachedRaw = settingsService.get<Record<string, PaneState>>(cacheKey, {})
      const paneStateCache = new Map(Object.entries(cachedRaw))

      const merged = newIds.map((id) => {
        const live = existing.get(id)
        if (live) return live
        const cached = paneStateCache.get(id)
        if (cached) return { ...cached }
        return createDefaultPane(id)
      })

      const stale = state.panes.filter((p) => !newIds.includes(p.id))
      const updatedCache = { ...cachedRaw }
      for (const p of stale) {
        updatedCache[p.id] = { id: p.id, tabs: p.tabs, activeTabId: p.activeTabId }
      }
      settingsService.set(cacheKey, updatedCache)

      const activePaneId = existing.has(state.activePaneId)
        ? state.activePaneId
        : (merged[0]?.id ?? '')

      return { layout, panes: merged, activePaneId }
    }),

  setPaneSize: (id, size) =>
    set((state) => {
      const next = { ...state.paneSizes, [id]: size }
      settingsService.set('paneSizes', next)
      return { paneSizes: next }
    }),

  setPaneSizes: (sizes) => {
    settingsService.set('paneSizes', sizes)
    set({ paneSizes: sizes })
  },

  getActiveTab: (paneId) => {
    const pane = get().panes.find((p) => p.id === paneId)
    if (!pane) return undefined
    return pane.tabs.find((t) => t.id === pane.activeTabId)
  },
}))
