import { create } from 'zustand'

interface CommandPaletteState {
  open: boolean
  toggle: () => void
  close: () => void
  openPalette: () => void
}

export const useCommandPalette = create<CommandPaletteState>((set) => ({
  open: false,
  toggle: () => set((state) => ({ open: !state.open })),
  close: () => set({ open: false }),
  openPalette: () => set({ open: true }),
}))

interface LoadingState {
  loading: boolean
  loadingMessage: string | undefined
  showLoading: (message?: string) => void
  hideLoading: () => void
}

export const useLoadingStore = create<LoadingState>((set) => ({
  loading: false,
  loadingMessage: undefined,
  showLoading: (message?: string) => set({ loading: true, loadingMessage: message }),
  hideLoading: () => set({ loading: false, loadingMessage: undefined }),
}))
