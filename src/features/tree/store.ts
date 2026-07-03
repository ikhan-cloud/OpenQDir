import { create } from 'zustand'

export interface PaneTreeState {
  expandedPaths: string[]
  loadedPaths: string[]
  childrenMap: Record<string, string[]>
  loadingPaths: string[]
  selectedPath: string | null
}

export interface TreeStore {
  panes: Record<string, Record<string, PaneTreeState>>
  registerPane: (paneId: string) => void
  unregisterPane: (paneId: string) => void
  registerTab: (paneId: string, tabId: string) => void
  unregisterTab: (paneId: string, tabId: string) => void
  expandNode: (paneId: string, tabId: string, path: string) => void
  collapseNode: (paneId: string, tabId: string, path: string) => void
  toggleNode: (paneId: string, tabId: string, path: string) => void
  expandToPath: (paneId: string, tabId: string, path: string) => void
  setNodeChildren: (paneId: string, tabId: string, path: string, children: string[]) => void
  addLoading: (paneId: string, tabId: string, path: string) => void
  removeLoading: (paneId: string, tabId: string, path: string) => void
  setSelectedPath: (paneId: string, tabId: string, path: string | null) => void
  refreshNode: (paneId: string, tabId: string, path: string) => void
}

const defaultPaneTree: PaneTreeState = {
  expandedPaths: [],
  loadedPaths: [],
  childrenMap: {},
  loadingPaths: [],
  selectedPath: null,
}

export const useTreeStore = create<TreeStore>((set, get) => ({
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
          [paneId]: { ...paneTabs, [tabId]: { ...defaultPaneTree } },
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

  expandNode: (paneId, tabId, path) =>
    set((state) => {
      const tab = state.panes[paneId]?.[tabId]
      if (!tab) return state
      if (tab.expandedPaths.includes(path)) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...state.panes[paneId],
            [tabId]: { ...tab, expandedPaths: [...tab.expandedPaths, path] },
          },
        },
      }
    }),

  collapseNode: (paneId, tabId, path) =>
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
              expandedPaths: tab.expandedPaths.filter((p) => p !== path),
            },
          },
        },
      }
    }),

  toggleNode: (paneId, tabId, path) => {
    const tab = get().panes[paneId]?.[tabId]
    if (!tab) return
    if (tab.expandedPaths.includes(path)) {
      get().collapseNode(paneId, tabId, path)
    } else {
      get().expandNode(paneId, tabId, path)
    }
  },

  expandToPath: (paneId, tabId, path) => {
    if (!path) return
    const segments = path.split('/').filter(Boolean)
    const ancestors: string[] = []
    for (let i = 0; i < segments.length; i++) {
      ancestors.push('/' + segments.slice(0, i + 1).join('/'))
    }

    set((state) => {
      const tab = state.panes[paneId]?.[tabId]
      if (!tab) return state
      const newExpanded = [...tab.expandedPaths]
      for (const ancestor of ancestors) {
        if (!newExpanded.includes(ancestor)) {
          newExpanded.push(ancestor)
        }
      }
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...state.panes[paneId],
            [tabId]: { ...tab, expandedPaths: newExpanded, selectedPath: path },
          },
        },
      }
    })
  },

  setNodeChildren: (paneId, tabId, path, children) =>
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
              childrenMap: { ...tab.childrenMap, [path]: children },
              loadedPaths: tab.loadedPaths.includes(path)
                ? tab.loadedPaths
                : [...tab.loadedPaths, path],
            },
          },
        },
      }
    }),

  addLoading: (paneId, tabId, path) =>
    set((state) => {
      const tab = state.panes[paneId]?.[tabId]
      if (!tab) return state
      if (tab.loadingPaths.includes(path)) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...state.panes[paneId],
            [tabId]: { ...tab, loadingPaths: [...tab.loadingPaths, path] },
          },
        },
      }
    }),

  removeLoading: (paneId, tabId, path) =>
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
              loadingPaths: tab.loadingPaths.filter((p) => p !== path),
            },
          },
        },
      }
    }),

  setSelectedPath: (paneId, tabId, path) =>
    set((state) => {
      const tab = state.panes[paneId]?.[tabId]
      if (!tab) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...state.panes[paneId],
            [tabId]: { ...tab, selectedPath: path },
          },
        },
      }
    }),

  refreshNode: (paneId, tabId, path) =>
    set((state) => {
      const tab = state.panes[paneId]?.[tabId]
      if (!tab) return state
      const { [path]: _, ...rest } = tab.childrenMap
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...state.panes[paneId],
            [tabId]: {
              ...tab,
              childrenMap: rest,
              loadedPaths: tab.loadedPaths.filter((p) => p !== path),
            },
          },
        },
      }
    }),
}))
