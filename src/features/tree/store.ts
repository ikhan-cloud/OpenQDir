import { create } from 'zustand'

export interface TreeStore {
  expandedPaths: string[]
  loadedPaths: string[]
  childrenMap: Record<string, string[]>
  loadingPaths: string[]
  selectedPath: string | null
  expandNode: (path: string) => void
  collapseNode: (path: string) => void
  toggleNode: (path: string) => void
  expandToPath: (path: string) => void
  setNodeChildren: (path: string, children: string[]) => void
  addLoading: (path: string) => void
  removeLoading: (path: string) => void
  setSelectedPath: (path: string | null) => void
}

export const useTreeStore = create<TreeStore>((set, get) => ({
  expandedPaths: [],
  loadedPaths: [],
  childrenMap: {},
  loadingPaths: [],
  selectedPath: null,

  expandNode: (path: string) =>
    set((state) => {
      if (state.expandedPaths.includes(path)) return state
      return { expandedPaths: [...state.expandedPaths, path] }
    }),

  collapseNode: (path: string) =>
    set((state) => ({
      expandedPaths: state.expandedPaths.filter((p) => p !== path),
    })),

  toggleNode: (path: string) => {
    const { expandedPaths } = get()
    if (expandedPaths.includes(path)) {
      get().collapseNode(path)
    } else {
      get().expandNode(path)
    }
  },

  expandToPath: (path: string) => {
    if (!path) return
    const segments = path.split('/').filter(Boolean)
    const ancestors: string[] = []
    for (let i = 0; i < segments.length; i++) {
      ancestors.push('/' + segments.slice(0, i + 1).join('/'))
    }

    set((state) => {
      const newExpanded = [...state.expandedPaths]
      for (const ancestor of ancestors) {
        if (!newExpanded.includes(ancestor)) {
          newExpanded.push(ancestor)
        }
      }
      return { expandedPaths: newExpanded, selectedPath: path }
    })
  },

  setNodeChildren: (path: string, children: string[]) =>
    set((state) => ({
      childrenMap: { ...state.childrenMap, [path]: children },
      loadedPaths: state.loadedPaths.includes(path)
        ? state.loadedPaths
        : [...state.loadedPaths, path],
    })),

  addLoading: (path: string) =>
    set((state) => {
      if (state.loadingPaths.includes(path)) return state
      return { loadingPaths: [...state.loadingPaths, path] }
    }),

  removeLoading: (path: string) =>
    set((state) => ({
      loadingPaths: state.loadingPaths.filter((p) => p !== path),
    })),

  setSelectedPath: (path: string | null) => set({ selectedPath: path }),
}))
