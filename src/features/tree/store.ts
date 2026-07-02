import { create } from 'zustand'

export interface PaneTreeState {
  expandedPaths: string[]
  loadedPaths: string[]
  childrenMap: Record<string, string[]>
  loadingPaths: string[]
  selectedPath: string | null
}

export interface TreeStore {
  panes: Record<string, PaneTreeState>
  registerPane: (paneId: string) => void
  unregisterPane: (paneId: string) => void
  expandNode: (paneId: string, path: string) => void
  collapseNode: (paneId: string, path: string) => void
  toggleNode: (paneId: string, path: string) => void
  expandToPath: (paneId: string, path: string) => void
  setNodeChildren: (paneId: string, path: string, children: string[]) => void
  addLoading: (paneId: string, path: string) => void
  removeLoading: (paneId: string, path: string) => void
  setSelectedPath: (paneId: string, path: string | null) => void
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
        panes: { ...state.panes, [paneId]: { ...defaultPaneTree } },
      }
    }),

  unregisterPane: (paneId) =>
    set((state) => {
      const { [paneId]: _, ...rest } = state.panes
      return { panes: rest as Record<string, PaneTreeState> }
    }),

  expandNode: (paneId, path) =>
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane) return state
      if (pane.expandedPaths.includes(path)) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: { ...pane, expandedPaths: [...pane.expandedPaths, path] },
        },
      }
    }),

  collapseNode: (paneId, path) =>
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...pane,
            expandedPaths: pane.expandedPaths.filter((p) => p !== path),
          },
        },
      }
    }),

  toggleNode: (paneId, path) => {
    const { expandedPaths } = get().panes[paneId] ?? { expandedPaths: [] }
    if (expandedPaths.includes(path)) {
      get().collapseNode(paneId, path)
    } else {
      get().expandNode(paneId, path)
    }
  },

  expandToPath: (paneId, path) => {
    if (!path) return
    const segments = path.split('/').filter(Boolean)
    const ancestors: string[] = []
    for (let i = 0; i < segments.length; i++) {
      ancestors.push('/' + segments.slice(0, i + 1).join('/'))
    }

    set((state) => {
      const pane = state.panes[paneId]
      if (!pane) return state
      const newExpanded = [...pane.expandedPaths]
      for (const ancestor of ancestors) {
        if (!newExpanded.includes(ancestor)) {
          newExpanded.push(ancestor)
        }
      }
      return {
        panes: {
          ...state.panes,
          [paneId]: { ...pane, expandedPaths: newExpanded, selectedPath: path },
        },
      }
    })
  },

  setNodeChildren: (paneId, path, children) =>
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...pane,
            childrenMap: { ...pane.childrenMap, [path]: children },
            loadedPaths: pane.loadedPaths.includes(path)
              ? pane.loadedPaths
              : [...pane.loadedPaths, path],
          },
        },
      }
    }),

  addLoading: (paneId, path) =>
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane) return state
      if (pane.loadingPaths.includes(path)) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: { ...pane, loadingPaths: [...pane.loadingPaths, path] },
        },
      }
    }),

  removeLoading: (paneId, path) =>
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...pane,
            loadingPaths: pane.loadingPaths.filter((p) => p !== path),
          },
        },
      }
    }),

  setSelectedPath: (paneId, path) =>
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane) return state
      return {
        panes: {
          ...state.panes,
          [paneId]: { ...pane, selectedPath: path },
        },
      }
    }),
}))
