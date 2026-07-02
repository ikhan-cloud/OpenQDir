import { create } from 'zustand'

export type LayoutMode = 'single' | 'horizontal' | 'vertical' | 'grid'

export interface PaneState {
  id: string
  currentPath: string
}

export interface WorkspaceStore {
  panes: PaneState[]
  activePaneId: string
  layout: LayoutMode
  initPanes: (ids: string[]) => void
  setActivePane: (id: string) => void
  setPanePath: (id: string, path: string) => void
  setLayout: (layout: LayoutMode) => void
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  panes: [],
  activePaneId: '',
  layout: 'single',

  initPanes: (ids) =>
    set({
      panes: ids.map((id) => ({ id, currentPath: '' })),
      activePaneId: ids[0] ?? '',
    }),

  setActivePane: (id) => set({ activePaneId: id }),

  setPanePath: (id, path) =>
    set((state) => ({
      panes: state.panes.map((p) => (p.id === id ? { ...p, currentPath: path } : p)),
    })),

  setLayout: (layout) => set({ layout }),
}))
