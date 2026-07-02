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
