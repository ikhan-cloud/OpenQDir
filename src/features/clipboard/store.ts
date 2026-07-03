import { create } from 'zustand'

export type ClipboardType = 'copy' | 'cut' | null

export interface ClipboardState {
  type: ClipboardType
  paths: string[]
}

export interface ClipboardActions {
  copy: (paths: string[]) => void
  cut: (paths: string[]) => void
  clear: () => void
}

export type ClipboardStore = ClipboardState & ClipboardActions

export const useClipboardStore = create<ClipboardStore>((set) => ({
  type: null,
  paths: [],

  copy: (paths) => set({ type: 'copy', paths }),

  cut: (paths) => set({ type: 'cut', paths }),

  clear: () => set({ type: null, paths: [] }),
}))
