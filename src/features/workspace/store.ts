import { create } from 'zustand'

import { useNavigationStore } from '@/features/navigation'
import { useExplorerStore } from '@/features/explorer'
import { useTreeStore } from '@/features/tree'
import { settingsService } from '@/services'

export type LayoutMode = 'single' | 'horizontal' | 'vertical' | 'grid'

export interface TabState {
  id: string
  name: string
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
  setLayout: (layout: LayoutMode) => void
  setPaneSize: (id: string, size: number) => void
  setPaneSizes: (sizes: Record<string, number>) => void
  getActiveTab: (paneId: string) => TabState | undefined
  createTab: (paneId: string) => void
  closeTab: (paneId: string, tabId: string) => void
  setActiveTab: (paneId: string, tabId: string) => void
}

/* ─── Session persistence ─── */

interface WorkspaceSession {
  layout: LayoutMode
  activePaneId: string
  panes: Array<{
    id: string
    activeTabId: string
    tabs: Array<{
      id: string
      name: string
    }>
  }>
}

const SESSION_KEY = '__workspaceSession'

function serializeSession(state: WorkspaceStore): WorkspaceSession {
  return {
    layout: state.layout,
    activePaneId: state.activePaneId,
    panes: state.panes.map((p) => ({
      id: p.id,
      activeTabId: p.activeTabId,
      tabs: p.tabs.map((t) => ({
        id: t.id,
        name: t.name,
      })),
    })),
  }
}

function persist(state: WorkspaceStore) {
  settingsService.set(SESSION_KEY, serializeSession(state))
}

/* ─── Defaults ─── */

const DEFAULT_TAB_ID = 'tab1'

let _tabCounter = 1

function generateTabId(): string {
  _tabCounter++
  return 'tab' + _tabCounter
}

function registerInSubStores(paneId: string, tabId: string) {
  useNavigationStore.getState().registerTab(paneId, tabId)
  useExplorerStore.getState().registerTab(paneId, tabId)
  useTreeStore.getState().registerTab(paneId, tabId)
}

function unregisterFromSubStores(paneId: string, tabId: string) {
  useNavigationStore.getState().unregisterTab(paneId, tabId)
  useExplorerStore.getState().unregisterTab(paneId, tabId)
  useTreeStore.getState().unregisterTab(paneId, tabId)
}

function createDefaultTab(): TabState {
  return { id: DEFAULT_TAB_ID, name: 'Tab 1' }
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

/* ─── Load saved session ─── */

const savedSession = settingsService.get<WorkspaceSession | null>(SESSION_KEY, null)

function buildInitialPanes(): PaneState[] {
  if (!savedSession) return []
  return savedSession.panes.map((p) => ({
    id: p.id,
    activeTabId: p.activeTabId,
    tabs: p.tabs.map((t) => ({
      id: t.id,
      name: t.name,
    })),
  }))
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  panes: buildInitialPanes(),
  activePaneId: savedSession?.activePaneId ?? '',
  layout: savedSession?.layout ?? 'single',
  paneSizes: settingsService.get<Record<string, number>>('paneSizes', {}),
  minPaneSize: 200,

  initPanes: (ids) => {
    const panes = ids.map((id) => createDefaultPane(id))
    const activePaneId = ids[0] ?? ''
    set({ panes, activePaneId })
    persist(get())
  },

  setActivePane: (id) => {
    set({ activePaneId: id })
    persist(get())
  },

  setLayout: (layout) => {
    const state = get()
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

    set({ layout, panes: merged, activePaneId })
    persist(get())
  },

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

  createTab: (paneId) => {
    const state = get()
    const pane = state.panes.find((p) => p.id === paneId)
    if (!pane) return

    const newTabId = generateTabId()
    const newTab: TabState = {
      id: newTabId,
      name: `Tab ${pane.tabs.length + 1}`,
    }

    registerInSubStores(paneId, newTabId)

    set({
      panes: state.panes.map((p) =>
        p.id === paneId
          ? { ...p, tabs: [...p.tabs, newTab], activeTabId: newTabId }
          : p,
      ),
      activePaneId: paneId,
    })
    persist(get())
  },

  closeTab: (paneId, tabId) => {
    const state = get()
    const pane = state.panes.find((p) => p.id === paneId)
    if (!pane || pane.tabs.length <= 1) return

    const tabIndex = pane.tabs.findIndex((t) => t.id === tabId)
    if (tabIndex === -1) return

    const nextIndex = tabIndex > 0 ? tabIndex - 1 : 0
    const nextTabId = pane.tabs[nextIndex]!.id

    unregisterFromSubStores(paneId, tabId)

    set({
      panes: state.panes.map((p) =>
        p.id === paneId
          ? {
              ...p,
              tabs: p.tabs.filter((t) => t.id !== tabId),
              activeTabId: nextTabId,
            }
          : p,
      ),
      activePaneId: paneId,
    })
    persist(get())
  },

  setActiveTab: (paneId, tabId) => {
    set((state) => ({
      panes: state.panes.map((p) =>
        p.id === paneId ? { ...p, activeTabId: tabId } : p,
      ),
      activePaneId: paneId,
    }))
    persist(get())
  },
}))
